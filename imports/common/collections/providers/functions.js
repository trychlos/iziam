/*
 * /import/common/collections/providers/functions.js
 */

const assert = require( 'assert' ).strict;

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

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
