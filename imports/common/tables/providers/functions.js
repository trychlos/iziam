/*
 * /import/common/tables/providers/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';

import { Providers } from './index.js';

Providers._p = [];

/**
 * @locus Anywhere
 * @returns {Array<izProvider>} the registered providers
 */
Providers.allProviders = function(){
    return Providers._p;
};

/**
 * @locus Anywhere
 * @param {String} id the Provider IIdent identifier
 * @returns {izProvider} the found izProvider
 */
Providers.byId = function( id ){
    let found = null;
    Providers.allProviders().every(( p ) => {
        if( p instanceof IIdent && p.identId() === id ){
            found = p;
        }
        return found === null;
    });
    if( !found ){
        console.warn( 'unable to get a provider instance for', id );
    }
    return found;
};

/**
 * @locus Anywhere
 * @summary Compute and returns a list of providers which are able to provides the listed features
 * @param {Array<String>} feats an array of features identifiers
 * @returns {Object} the providers definitions as an object:
 *  - indexed by provider identifier
 *  - whose values are object with following keys:
 *    > def: the izProvider instance
 */
Providers.byFeatures = function( feats ){
    assert( _.isArray( feats ), 'expects feats be an array, got '+feats );
    let result = {};
    feats.forEach(( it ) => {
        // list the providers which provide the 'it' feature
        const sorted = Providers.forFeature( it );
        const first = sorted[0];
        result[first.identId()] = first;
    });
    return result;
};

/**
 * @locus Anywhere
 * @summary Compute and returns a list of providers which use the grant types
 * @param {Array<String>} grants an array of grant types
 * @returns {Object} the providers definitions as an object:
 *  - indexed by provider identifier
 *  - whose values are object with following keys:
 *    > def: the izProvider instance
 */
Providers.byGrantTypes = function( grants ){
    assert( _.isArray( grants ), 'expects grants be an array, got '+grants );
    let result = {};
    grants.forEach(( it ) => {
        // list the providers which provide the 'it' feature
        const sorted = Providers.forGrantType( it );
        const first = sorted[0];
        result[first.identId()] = first;
    });
    return result;
};

/**
 * @locus Anywhere
 * @summary Compute and returns the list of features provided by a list of provider id's
 * @param {Array<String>} ids an array of izProvider IIdent identifiers
 * @returns {Array<String>} the provided IFeatured's
 */
Providers.featuresByIds = function( ids ){
    ids = _.isArray( ids ) ? ids : [ids];
    let features = [];
    ids.forEach(( id ) => {
        const p = Providers.byId( id );
        if( p && p instanceof IFeatured ){
            features = features.concat( p.features());
        }
    });
    return features;
};

/**
 * @locus Anywhere
 * @summary Filter and complete the provided list of identified with:
 *  - adding non-user-selectable providers which default to be selected (so that we can see the mandatory providers)
 *  - removing non-user-selectable providers which default to be non selected (because thety have been obsoleted)
 * @param {Array} selected an array of provider identifiers
 * @returns {Array} the list of the identifiers of the non-user-selectable providers which default to be selected
 */
Providers.filterDefaultSelectedNonUserSelectable = function( selected ){
    this.allProviders().forEach(( p ) => {
        assert( p && p instanceof izProvider, 'expects an instance of izProvider, got '+p );
        assert( p && p instanceof IIdent, 'expects an instance of IIdent, got '+p );
        if( !p.userSelectable()){
            const pId = p.identId();
            if( p.defaultSelected()){
                selected.push( pId );
            } else {
                selected = selected.filter( id => id !== pId );
            }
        }
    });
    return selected;
};

/**
 * @locus Anywhere
 * @summary Compute and returns a list of providers which provide the listed feature
 * @param {String} feat a feature identifier
 * @returns {Array<izProvider>} the providers which provide this feature, sorted in alpha descending order
 */
Providers.forFeature = function( feat ){
    let found = [];
    Providers.allProviders().forEach(( p ) => {
        if( p instanceof IFeatured ){
            const pFeatures = p.features();
            if( pFeatures.includes( feat )){
                found.push( p );
            }
        }
    });
    const sorted = found.sort(( a, b ) => { return -1*( a.identId().localeCompare( b.identId(), { usage: 'search' })); });
    return sorted;
};

/**
 * @locus Anywhere
 * @summary Compute and returns a list of providers which use the specified grant type
 * @param {String} grant a grant type
 * @returns {Array<izProvider>} the providers which use this grant type, sorted in alpha descending order
 */
Providers.forGrantType = function( grant ){
    let found = [];
    Providers.allProviders().forEach(( p ) => {
        if( p instanceof IGrantType ){
            const pGrants = p.grant_types();
            if( pGrants.includes( grant )){
                found.push( p );
            }
        }
    });
    const sorted = found.sort(( a, b ) => { return -1*( a.identId().localeCompare( b.identId(), { usage: 'search' })); });
    return sorted;
};

    /**
     * @summary Explore all selected providers to get their claims
     * @locus Server
     * @param {Object} ctx
     * @param {String} token access token
     * @param {String} use 'id_token' or 'userinfo'
     * @param {String} scope space-separated list of requested scopes
     * @param {Object} claims the part of the claims authorization parameter for either "id_token" or "userinfo" (depends on the "use" param)
     * @param {Array<String} rejected rejected claim names that were rejected by the end-user, you might want to skip loading some claims
     *  from external resources or through db projection
     * @param {Object} oidc our own OIDC object which holds Client/Resource/Identity servers
     * @param {Object} identity the identity object as found by the IdentityServer
     * @returns {Promise} which eventually will resolve to a claims object
     */
        /*
Providers.getClaims = async function( ctx, token, use, scope, claims, rejected, oidc, identity ){
    if( Meteor.isServer ){
        let claimsResult = {};
        let promises = [];
        ( oidc.atDate.selectedProviders || [] ).every(( id ) => {
            const p = Meteor.APP.Providers.byId( id );
            if( p && p instanceof IResource ){
                promises.push( p.getClaims( ctx, token, use, scope, claims, rejected, oidc, identity ));
            }
            return true;
        });
        return Promise.allSettled( promises ).then(( results ) => {
            results.forEach(( res ) => {
                if( res.value && _.isObject( res.value )){
                    _.merge( claimsResult, res.value );
                }
            });
            return claimsResult;
        });
    }
};
            */

/**
 * @locus Anywhere
 * @param {String} type the searched type (e.g. IIdent)
 * @returns {Array<izProvider>} the list of providers which implement this type, which may be empty
 */
Providers.getInstancesOf = function( type ){
    let res = [];
    this.allProviders().forEach(( p ) => {
        if( p instanceof type ){
            res.push( p );
        }
    });
    return res;
};

/**
 * @locus Anywhere
 * @param {Array<String>} ids an array of izProvider IIdent identifiers
 * @param {String} feature
 * @returns {Boolean} whether one of the providers of the list provides the desired feature
 */
Providers.hasFeature = function( ids, feature ){
    assert( ids && _.isArray( ids ), 'expects ids be an array' );
    assert( feature, 'expects feature be a string' );
    const features = Providers.featuresByIds( ids );
    return features.includes( feature );
};

/**
 * @locus Anywhere
 * @param {izProvider} provider
 */
Providers.register = function( provider ){
    assert( provider && provider instanceof izProvider, 'expects an izProvider instance, got '+provider );
    Providers._p.push( provider );
};
