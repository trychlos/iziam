/*
 * /import/common/collections/providers/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';

import { Providers } from './index.js';

Providers._p = [];

/**
 * @locus Anywhere
 * @returns {Array} the registered providers
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
        //console.debug( 'searched', id, 'examining', p, 'id', p.identId());
        if( p instanceof IIdent && p.identId() === id ){
            found = p;
        }
        return found === null;
    });
    return found;
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
Providers.getClaims = async function( ctx, token, use, scope, claims, rejected, oidc, identity ){
    if( Meteor.isServer ){
        let claimsResult = {};
        let promises = [];
        /*
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
            */
    }
};

/**
 * @locus Anywhere
 * @param {String} type the searched type (e.g. IIdent)
 * @returns {Array} the list of providers which implement this type, which may be empty
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
 * @param {izProvider} provider
 */
Providers.register = function( provider ){
    assert( provider && provider instanceof izProvider, 'expects an izProvider instance, got '+provider );
    Providers._p.push( provider );
};
