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
            let foo = organization.record[name];
            if( foo ){
                if( opts.url === true ){
                    foo = Organizations.fn.fullBaseUrl( organization )+foo;
                }
                data[name] = foo;
            }
        };
        let foo = organization.record.authorization_endpoint;
        set( 'authorization_endpoint', { url: true });
        set( 'token_endpoint', { url: true });
        set( 'registration_endpoint', { url: true });
        set( 'jwks_uri', { url: true });
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
     * - features: an array of the provided IFeatured's
     */
    selectedProviders( organization ){
        //console.debug( 'organization', organization );
        let selectedIds = organization.record.selectedProviders || [];
        // add providers non-selectable by the user, which default to be selected
        selectedIds = Providers.filterDefaultSelectedNonUserSelectable( selectedIds );
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
