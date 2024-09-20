/*
 * /imports/common/collections/clients/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';
import { Providers } from '/imports/common/tables/providers/index.js';

import { Clients } from './index.js';

Clients.fn = {
    /**
     * @param {<Client>} client 
     * @return {Promise} which eventually resolves to the result object with following keys:
     *  - client: the relevant client
     *  - errs: an array of CoreApp.TypedMessage
     *  This must be enough to say if the client is able to participate to a working OAuth / OpenID REST API.
     */
    async check( client ){
        const checkResult = {
            client: client,
            errs: []
        };
        const edited = Clients.find({ entity: client.entity }).fetch();
        const itemrv = new ReactiveVar( client );
        let promises = [];
        promises.push( Clients.check_authMethod( client.token_endpoint_auth_method, { item: itemrv }, { update: false }));
        promises.push( Clients.check_clientId( client.clientId, { item: itemrv }, { update: false }));
        promises.push( Clients.check_clientSecrets( client.clientSecrets, { item: itemrv }, { update: false }));
        promises.push( Clients.check_effectEnd( client.effectEnd, { item: itemrv, edited: edited }, { update: false }));
        promises.push( Clients.check_effectStart( client.effectStart, { item: itemrv, edited: edited }, { update: false }));
        promises.push( Clients.check_endpoints( client.endpoints ));
        promises.push( Clients.check_grantTypes( client.grant_types, { item: itemrv }, { update: false }));
        promises.push( Clients.check_label( client.label, { item: itemrv }, { update: false }));
        promises.push( Clients.check_responseTypes( client.responseTypes, { item: itemrv }, { update: false }));
        promises.push( Clients.check_type( client.type, { item: itemrv }, { update: false }));
        return Promise.allSettled( promises )
            .then(( results ) => {
                results.forEach(( res ) => {
                    if( res.value ){
                        checkResult.errs.push( res.value );
                    }
                });
                return checkResult;
            });
    },

    /**
     * @summary As of 2024-09-12, the client no more chooses its providers
     *  Instead it is up to the authorization server to find the ad-hoc provider giving the desired grant_type
     *  This design decision is hard-coded here so that all UI code is still there, though inactive
     */
    hasSelectedProviders(){
        return false;
    },

    /**
     * @summary Compute and returns the list of selected providers for the entity/record client
     *  Computed selected providers are:
     *  - providers explictely selected by the organization manager for each client (read from the clients_records collection)
     *  - plus maybe non-selectable provider(s) which default to be selected
     *  - minus non-selected pprovider(s) which default to be unselected (maybe because they are obsolete)
     *  - minus providers whose prerequisites are not satisfied by the above list
     * @param {Object} organization the attached organization as an object with following keys:
     * - entity
     * - record
     * @param {Object} client the to-be-considered client as an object with following keys:
     * - entity
     * - record
     * @returns {Object} the selected providers as a hash whose keys are the provider IIdent identifier and the value:
     * - provider: the izProvider instance
     * - features: an array of the provided IFeatured's
     */
    selectedProviders( organization, client ){
        let selectedIds = client.record.selectedProviders || [];
        // add providers non-selectable by the user, which default to be selected
        selectedIds = Providers.filterDefaultSelectedNonUserSelectable( selectedIds );
        if( Organizations.fn.wantsPkce( organization )){
            selectedIds.push( 'org.trychlos.iziam.provider.pkce.0' );
        }
        // build a hash by id with provider and features
        //  features are not recorded in the collection as they can change from a version to another
        let result = {};
        let allFeatures = [];
        selectedIds.forEach(( id ) => {
            const p = Providers.byId( id );
            // can be null if the provider is no more part of the code
            if( p ){
                result[id] = { provider: p };
                const features = p instanceof IFeatured ? p.features() : [];
                result[id].features = features;
                allFeatures = allFeatures.concat( features );
            } else {
                console.log( 'provider not found', id );
            }
        });
        // check the requisite features, adding the missing providers
        let selected = [];
        Object.keys( result ).forEach(( id ) => {
            const p = result[id].provider;
            let found = true;
            if( p instanceof IRequires ){
                const requires = p.requires();
                requires.every(( reqId ) => {
                    if( !allFeatures.includes( reqId )){
                        const providingsReq = Providers.forFeature( reqId );
                        if( providingsReq.length ){
                            result[providingsReq[0].identId()] = providingsReq[0];
                        } else {
                            console.log( 'prerequisite not found', 'provider='+id, 'requires='+reqId );
                            found = false;
                        }
                    }
                    return found;
                });
            }
            if( !found ){
                delete result[id];
            }
        });
        // update the record with this current result
        client.record.selectedProviders = Object.keys( result );
        return result;
    },

    /**
     * @summary Compute and returns the list of selected providers for the entity/record client
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } client
     * - parent: an { entity, record } organization
     * @returns {Object} the selectedProviders() result
     *  A reactive data source
     */
    _selected_providers: {
        dep: new Tracker.Dependency()
    },
    selectedProvidersGet( o ){
        const selected = Clients.fn.selectedProviders( o.parent, o.caller );
        Clients.fn._selected_providers.dep.depend();
        return selected;
    },
    selectedProvidersAdd( o, providerId ){
        o.caller.record.selectedProviders.push( providerId );
        Clients.fn._selected_providers.dep.changed();
    },
    selectedProvidersRemove( o, providerId ){
        o.caller.record.selectedProviders = o.caller.record.selectedProviders.filter( id => id !== providerId );
        Clients.fn._selected_providers.dep.changed();
    },

    /**
     * @param {<Client>} client 
     * @return {Boolean} whether the client has a client_credentials grant type
     *  NOTE: ony returns true if not only the client wants 'client_credentials' grant type, but it also has (at least) a secret
     */
    wantsClientCredentials( client ){
        let wants = false;
        if( client.clientSecrets && client.clientSecrets.length > 0 ){
            client.grant_types.every(( type ) => {
                if( type === 'client_credentials' ){
                    wants = true;
                }
                return wants === false;
            });
        }
        return wants;
    },
};
