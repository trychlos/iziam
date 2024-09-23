/*
 * /import/common/collections/organizations/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Tracker } from 'meteor/tracker';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { Providers } from '/imports/common/tables/providers/index.js';

import { Organizations } from './index.js';

Organizations.fn = {

    /**
     * @summary Returns a list of the organization selected providers which match a specified type
     * @param {Organizations} organization as an { entity, record } object
     * @param {Object} type the instance type to be filtered
     * @returns {Object} the selected providers as a hash whose keys are the provider IIdent identifier and the value:
     * - provider: the izProvider instance
     * - features: an array of the provided IFeatured's
     */
    byType( organization, type ){
        let filtered = {};
        const providers = Organizations.fn.selectedProviders( organization );
        for( let ident in providers ){
            if( providers[ident].provider instanceof type ){
                filtered[ident] = providers[ident];
            }
        }
        return filtered;
    },

    /**
     * @summary Returns a list of the organization selected providers which match a specified type, sorted by their prerequisites and their versions
     *  which means than we will have, for example openid 1.0 -> oauth 2.1 -> oauth 2.0
     *  so the first is the preferred (because the more advanced) and the last is the less preferred (because the oldest)
     * @param {Organizations} organization as an { entity, record } object
     * @param {Object} type the instance type to be filtered
     * @returns {Array<izProvider>} the filtered/sorted providers
     */
    byTypeSorted( organization, type ){
        const filtered = Organizations.fn.byType( organization, type );
        // compare two providers by their id
        const cmpFn = function( a, b ){
            let res = 0;
            //console.debug( a, b );
            // have them the same requires ?
            // if yes, compte their ident by string
            if( _.isEqual( filtered[a].requires, filtered[b].requires )){
                //console.debug( 'localeCompare' );
                res = a.localeCompare( b );
            } else {
                // are a.requires satisfied by b.features ?
                // only relevant if one satisfies all the requisites of the other
                const unsatisfied_a = filtered[a].requires.filter( value  => !filtered[b].features.includes( value ));
                //console.debug( 'unsatisfied_a', unsatisfied_a );
                res = unsatisfied_a.length ? res : +1;
                if( res === 0 ){
                    // are b.requires satisfied by a.features ?
                    const unsatisfied_b = filtered[b].requires.filter( value  => !filtered[a].features.includes( value ));
                    //console.debug( 'unsatisfied_b', unsatisfied_b );
                    res = unsatisfied_b.length ? -1 : res;
                }
                if( res === 0 ){
                    res = a.localeCompare( b );
                }                
            }
            //console.debug( 'res', res );
            return -1 * res;
        };
        const sorted = Object.keys( filtered ).toSorted( cmpFn );
        let result = [];
        sorted.map( it => result.push( filtered[it].provider ));
        return result;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the list of configured endpoints
     */
    endpoints( organization ){
        let result = {};
        const fullBaseUrl = Organizations.fn.fullBaseUrl( organization );
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                result[name] = fullBaseUrl+foo;
            }
        };
        set( 'authorization_endpoint' );
        set( 'introspection_endpoint' );
        set( 'jwks_uri' );
        set( 'revocation_endpoint' );
        set( 'registration_endpoint' );
        set( 'token_endpoint' );
        set( 'userinfo_endpoint' );
        return result;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {String} the full base URL for the organization, including issuer host name
     */
    fullBaseUrl( organization ){
        const issuer = Organizations.fn.issuer( organization );
        return issuer && organization.record.baseUrl ? issuer + organization.record.baseUrl : null;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {String} the issuer for the organization
     */
    issuer( organization ){
        return organization.record.issuer || Meteor.settings.public[Meteor.APP.name].environment.issuer || null;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the public metadata document as for [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414)
     */
    metadata( organization ){
        let data = {
            // always set because we have a default value in settings
            issuer: Organizations.fn.fullBaseUrl( organization )
        };
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                data[name] = foo;
            }
        };
        _.merge( data, Organizations.fn.endpoints( organization ));
        set( 'op_policy_uri', { fromName: 'pdmpUrl' });
        set( 'op_tos_uri', { fromName: 'gtuUrl' });
        // scopes_supported
        // response_types_supported
        // response_modes_supported
        // grant_types_supported
        // token_endpoint_auth_methods_supported
        // token_endpoint_auth_signing_alg_values_supported
        // service_documentation
        // ui_locales_supported
        // revocation_endpoint_auth_methods_supported
        // revocation_endpoint_auth_signing_alg_values_supported
        // introspection_endpoint_auth_methods_supported
        // introspection_endpoint_auth_signing_alg_values_supported
        // code_challenge_methods_supported
        return data;
    },

    /**
     * @summary Compute and returns the list of selected providers for the entity/record organization
     *  Computed selected providers are:
     *  - providers explicitely selected by the organization manager to be allowed to the clients (read from the organization records)
     *  - minus providers which are no more registered
     * @param {Object} organization the to-be-considered organization as an object with following keys:
     * - entity
     * - record
     * @returns {Object} the selected providers as a hash whose keys are the provider IIdent identifier and the value:
     * - provider: the izProvider instance
     * - features: an array of the (sorted) provider IFeatured's
     * - requires: an array of the (sorted) provider IRequires's
     */
    selectedProviders( organization ){
        //console.debug( 'organization', organization );
        let selectedIds = organization.record.selectedProviders || [];
        // add providers non-selectable by the user, which default to be selected
        selectedIds = Providers.filterDefaultSelectedNonUserSelectable( selectedIds );
        // build a hash by id with provider and features
        //  features are not recorded in the collection as they can change from a version to another
        let result = {};
        selectedIds.forEach(( id ) => {
            const p = Providers.byId( id );
            // can be null if the provider is no more part of the code
            if( p ){
                result[id] = { provider: p };
                const features = p instanceof IFeatured ? p.features() : [];
                result[id].features = features.toSorted();
                const requires = p instanceof IRequires ? p.requires() : [];
                result[id].requires = requires.toSorted();
            } else {
                console.log( 'provider not found', id );
            }
        });
        // update the record with this current result
        organization.record.selectedProviders = Object.keys( result );
        return result;
    },

    /**
     * @summary Compute and returns the list of selected providers for the entity/record client
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the selectedProviders() result
     *  A reactive data source
     */
    _selected_providers: {
        dep: new Tracker.Dependency()
    },
    selectedProvidersGet( o ){
        const selected = Organizations.fn.selectedProviders( o.caller );
        Organizations.fn._selected_providers.dep.depend();
        return selected;
    },
    selectedProvidersAdd( o, providerId ){
        o.caller.record.selectedProviders.push( providerId );
        Organizations.fn._selected_providers.dep.changed();
    },
    selectedProvidersRemove( o, providerId ){
        o.caller.record.selectedProviders = o.caller.record.selectedProviders.filter( id => id !== providerId );
        Organizations.fn._selected_providers.dep.changed();
    },

    /**
     * @summary Acts as the Providers.all() function for the client
     * @param {Object} args the 'args' part of the providers_list data context
     * - caller
     * - parent
     * @returns {Array<izProvider>} the selected providers
     */
    selectedProviderInstances( args ){
        let res = [];
        const providers = Organizations.fn.selectedProviders( args.parent );
        Object.keys( providers ).forEach(( it ) => {
            res.push( providers[it].provider );
        });
        return res;
    },

    /**
     * @locus Anywhere
     * @param {Object} organization the organization, as an object { entity, record }
     * @returns {Boolean} whether this organization wants all clients make use of PKCE
     */
    wantsPkce( organization ){
        return organization.record.wantsPkce !== false;
    }
};
