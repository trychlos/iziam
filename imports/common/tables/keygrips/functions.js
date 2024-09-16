/*
 * /import/common/tables/keygrips/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import * as jose from 'jose';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';

import { Keygrips } from './index.js';

Keygrips.fn = {
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
     * @summary Returns the Keygrips set for the entity/record organization
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the organization Keygrips set, at least an empty array
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        Keygrips.fn._list.dep.depend();
        return o.caller.record.keygrips || [];
    },
    add( o, keygrip ){
        o.caller.record.keygrips.push( keygrip );
        Keygrips.fn._selected_providers.dep.changed();
    },
    remove( o, keygripId ){
        o.caller.record.keygrips = o.caller.record.keygrips.filter( it => it.id !== keygripId );
        Keygrips.fn._list.dep.changed();
    }
};
