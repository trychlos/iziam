/*
 * /imports/common/init/providers.js
 */

import _ from 'lodash';

import { IIdent } from '/imports/common/interfaces/iident.iface.js';

//import { OpenIDProvider } from '/imports/common/providers/openid-provider.class.js';

Meteor.APP.Providers = {
    _p: [],

    allProviders(){
        return this.p;
    },

    // returns the identified izProvider
    byId( id ){
        let found = null;
        this._p.every(( p ) => {
            if( p instanceof IIdent && p.identId() === id ){
                found = p;
            }
            return found === null;
        });
        return found;
    },

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
    async getClaims( ctx, token, use, scope, claims, rejected, oidc, identity ){
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
    },

    getInstancesOf( type ){
        let res = [];
        this._p.forEach(( p ) => {
            if( p instanceof type ){
                res.push( p );
            }
        });
        return res;
    }
};

//Meteor.APP.Providers._p.push( new IdentityProvider());
//Meteor.APP.Providers._p.push( new LooseDynRegistrar());
//Meteor.APP.Providers._p.push( new OpenIDProvider());
//Meteor.APP.Providers._p.push( new UserResourceProvider());
