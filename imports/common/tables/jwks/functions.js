/*
 * /import/common/tables/jwks/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import * as jose from 'jose';

import { DateJs } from 'meteor/pwix:date';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';

import { Jwks } from './index.js';

Jwks.fn = {
    /**
     * @summary extract the active JSON Web Keys
     * @param {Object} container an { entity, record } organization/client object
     * @returns {Array<JWK>}
     */
    activeKeys( container ){
        let result = [];
        ( container.record.jwks || [] ).forEach(( jwk ) => {
            let active = true;
            if( active && jwk.startingAt ){
                active = Boolean( DateJs.compare( jwk.startingAt, Date.now()) <= 0 );
            }
            if( active && jwk.endingAt ){
                active = Boolean( DateJs.compare( jwk.endingAt, Date.now()) >= 0 );
            }
            if( active ){
                result.push( jwk );
            }
        });
        //console.debug( 'activeKeys', result );
        return result;
    },

    /**
     * @summary extract the JSON Web Keys needed by the AuthServer to sign/encrypt the emitted JWT
     * @param {Object} container an { entity, record } organization/client object
     * @returns {Object} with a 'keys' array of JWK's containing only private parts
     */
    authKeys( container ){
        let result = { keys: [] };
        Jwks.fn.activeKeys( container ).forEach(( jwk ) => {
            let it = { ...jwk };
            delete it.secret;
            delete it.pair;
            if( jwk.secret ){
                _.merge( it, jwk.secret );
            }
            if( jwk.pair ){
                _.merge( it, jwk.pair.private.jwk );
            }
            result.keys.push( it );
        });
        //console.debug( 'authKeys', result );
        return result;
    },

    /**
     * @locus Client
     * @summary Generate the symmetric secret / asymmetric keys pair when creating a new JWK
     * @param {Object<JWK>} item the just defined JWK item
     * @returns {Object<JWK>} this same item
     *  NB: jose works a lot better when running inside of a Web Crypto API runtime, i.e. client-side
     */
    async generateKeys( item ){
        if( Meteor.isClient ){
            const def = JwaAlg.byId( item.alg );
            let promises = [];
            if( def ){
                if( JwaAlg.isSymmetric( def )){
                    item.symmetric = true;
                    promises.push( jose.generateSecret( item.alg, { extractable: true }).then( async ( res ) => {
                        item.secret = {
                            key: { algorithm: res.algorithm },
                            jwk: await jose.exportJWK( res ),
                            key_opes: res.usages
                        };
                        if( item.kid ){
                            item.secret.jwk.kid = item.kid;
                        }
                        item.createdAt = new Date();
                        item.createdBy = Meteor.userId();
                        return item;
                    }));
                } else {
                    item.symmetric = false;
                    promises.push( jose.generateKeyPair( item.alg, { extractable: true }).then( async ( res ) => {
                        item.pair = {
                            key: { algorithm: res.privateKey.algorithm },
                            private: {
                                jwk: await jose.exportJWK( res.privateKey ),
                                pkcs8: await jose.exportPKCS8( res.privateKey ),
                                key_opes: res.privateKey.usages
                            },
                            public: {
                                jwk: await jose.exportJWK( res.publicKey ),
                                spki: await jose.exportSPKI( res.publicKey ),
                                key_opes: res.publicKey.usages
                            }
                        };
                        if( item.kid ){
                            item.pair.private.jwk.kid = item.kid;
                            item.pair.public.jwk.kid = item.kid;
                        }
                        item.createdAt = new Date();
                        item.createdBy = Meteor.userId();
                        return item;
                    }));
                }
            } else {
                console.warn( 'unknwon algorith', item.alg );
            }
            await Promise.allSettled( promises );
        } else {
            console.warn( 'unable to generate keys on server side at the moment' );
        }
        return item;
    },

    /**
     * @param {Array} array a JWKS (json web key set)
     * @returns {String} the concatenation of the labels of the existing jwks
     *  Each JWK is advertised as kid|label|id + use + kty
     */
    joinedLabels( array ){
        let res = [];
        ( array || [] ).forEach(( it ) => {
            res.push(( it.kid || it.label || it._id ) + '-' + it.use + '-' + it.kty );
        });
        return res.join( ', ' );
    },

    /**
     * @summary Returns the JWKS for the entity/record organization/client
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization/client
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        Jwks.fn._list.dep.depend();
        return o.caller.record.jwks || [];
    },
    add( o, jwk ){
        o.caller.record.jwks.push( jwk );
        Jwks.fn._list.dep.changed();
    },
    remove( o, jwkId ){
        o.caller.record.jwks = o.caller.record.jwks.filter( it => it._id !== jwkId );
        Jwks.fn._list.dep.changed();
    }
};
