/*
 * /import/common/collections/organizations/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Tracker } from 'meteor/tracker';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';
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
     * @returns {String} the full base URL for the organization, including issuer host name
     */
    fullBaseUrl( organization ){
        const issuer = Organizations.fn.issuer( organization );
        return issuer && organization.record.baseUrl ? issuer + organization.record.baseUrl : null;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Boolean} whether the organization wants at least one email address
     */
    haveAtLeastOneEmailAddress( organization ){
        const minhow = organization.record.identitiesEmailAddressesMinHow;
        const mincount = organization.record.identitiesEmailAddressesMinCount;
        return (( minhow === 'exactly' || minhow === 'least' ) && parseInt( mincount ) > 0 );
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Boolean} whether the organization wants at least one username
     */
    haveAtLeastOneUsername( organization ){
        const minhow = organization.record.identitiesUsernamesMinHow;
        const mincount = organization.record.identitiesUsernamesMinCount;
        return (( minhow === 'exactly' || minhow === 'least' ) && parseInt( mincount ) > 0 );
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Boolean} whether the identity has at least one identifier
     */
    haveIdentityIdentifier( organization ){
        let haveEmail = true;
        let emailAsId = false;
        let minhow = organization.record.identitiesEmailAddressesMinHow;
        let mincount = organization.record.identitiesEmailAddressesMinCount;
        if( !minhow || minhow === 'nospec' || mincount === 0 ){
            haveEmail = false;
        } else {
            emailAsId = organization.record.identitiesEmailAddressesIdentifier;
        }
        let haveUsername = true;
        let usernameAsId = false;
        minhow = organization.record.identitiesUsernamesMinHow;
        mincount = organization.record.identitiesUsernamesMinCount;
        if( !minhow || minhow === 'nospec' || mincount === 0 ){
            haveUsername = false;
        } else {
            usernameAsId = organization.record.identitiesUsernamesIdentifier;
        }
        return emailAsId || usernameAsId;
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
     * @returns {Integer} the max count of email addresses allowed by the organization
     *  or -1 if not relevant (must not be checked)
     */
    maxEmailAddressesCount( organization ){
        const maxhow = organization.record.identitiesEmailAddressesMaxHow;
        const maxcount = organization.record.identitiesEmailAddressesMaxCount;
        return ( maxhow === 'most' ) && parseInt( maxcount ) > 0 ? parseInt( maxcount ) : -1;
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
     * @summary The Authorization Server is expected to be able to advertise its configuration
     *  Supported values mainly depend of the providers selected at the organization level.
     * @param {Object} organization an { entity, record } organization object
     * @returns {Array<String>} the supported auth methods
     */
    supportedAuthMethods( organization ){
        let supported = [];
        AuthMethod.Knowns().forEach(( it ) => {
            supported.push( AuthMethod.id( it ));
        });
        return supported;
    },

    /**
     * @summary The Authorization Server is expected to be able to advertise its configuration
     *  Supported values mainly depend of the providers selected at the organization level.
     * @param {Object} organization an { entity, record } organization object
     * @returns {Array<String>} the supported grant types
     */
    supportedGrantTypes( organization ){
        const providers = Organizations.fn.selectedProviders( organization );
        let supported = [];
        Object.keys( providers ).forEach(( it ) => {
            const p = providers[it].provider;
            if( p instanceof IGrantType ){
                supported = supported.concat( p.grant_types());
            }
        });
        return [ ...new Set( supported )];
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
