/*
 * /import/common/tables/jwks/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import * as jose from 'jose';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';

import { Jwks } from './index.js';

Jwks.fn = {
    /**
     * @summary Generate the symmetric secret / asymmetric keys pair when creating a new JWK
     * @param {Object<JWK>} item the just defined JWK item
     * @returns {Object<JWK>} this same item
     */
    async generateKeys( item ){
        const def = JwaAlg.byId( item.alg );
        let promises = [];
        if( def ){
            if( JwaAlg.isSymmetric( def )){
                item.symmetric = true;
                promises.push( jose.generateSecret( item.alg, { extractable: true }).then( async ( res ) => {
                    //console.debug( 'res', res );
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
                    //console.debug( 'res', res );
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
        return item;
    },

    /**
     * @summary Returns the JWKS for the entity/record organization
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the organization JWKS, at least an empty array
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
        Jwks.fn._selected_providers.dep.changed();
    },
    remove( o, jwkId ){
        o.caller.record.jwks = o.caller.record.jwks.filter( it => it.id !== jwkId );
        Jwks.fn._list.dep.changed();
    }
};
