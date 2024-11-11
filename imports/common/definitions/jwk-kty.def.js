/*
 * /imports/common/definitions/jwk-kty.def.js
 *
 * See:
 *  - https://datatracker.ietf.org/doc/html/rfc7517 JSON Web Key (JWK)
 *  - https://datatracker.ietf.org/doc/html/rfc7518 JSON Web Algorithms (JWA)
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';

export const JwkKty = {
    C: [
        {
            id: 'EC',
            label: 'definitions.jwk_kty.ec_label',
            alg: {
                enc: [
                    'ECDH-ES',
                    'ECDH-ES+A128KW',
                    'ECDH-ES+A192KW',
                    'ECDH-ES+A256KW'
                ],
                sig:  [
                    'ES256',
                    'ES384',
                    'ES512',
                    //'EdDSA' not defined in JwaAlg
                ]
            }
        },
        {
            id: 'RSA',
            label: 'definitions.jwk_kty.rsa_label',
            alg: {
                enc: [
                    'RSA-OAEP',
                    'RSA-OAEP-256',
                    'RSA-OAEP-384',
                    'RSA-OAEP-512'
                ],
                sig: [
                    'RS256',
                    'RS384',
                    'RS512',
                    'PS256',
                    'PS384',
                    'PS512'
                ]
            }
        },
        {
            id: 'OKP',
            label: 'definitions.jwk_kty.okp_label',
            alg: {
                enc: [
                    'X25519',
                    'X448'
                ],
                sig: [
                    'Ed25519',
                    'Ed448'
                ]
            }
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {Object} def a JwkKty definition as returned by JwkKty.Knowns()
     * @param {String} use the JWK use identifier
     * @returns {Array<String>} the list of known algorithms to be used in this situation, or []
     */
    availableAlgorithms( def, use ){
        let algs = def.alg ? def.alg[use] || [] : [];
        if( algs && algs.length ){
            let array = algs;
            algs = array.length ? [] : null;
            array.forEach(( id ) => {
                const def = JwaAlg.byId( id );
                if( def && JwaAlg.isAvailable( def )){
                    algs.push( id );
                }
            })
        }
        // a non-empty array or null
        return algs;
    },

    /**
     * @param {String} id an algorithm identifier
     * @returns {Object} the JwkKty definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !JwkKty.warnedById[id] ){
            console.warn( 'JWK type not found', id );
            JwkKty.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def a JwkKty definition as returned by JwkKty.Knowns()
     * @returns {String} the algorithm identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of managed JWK algorithms
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a JwkKty definition as returned by JwkKty.Knowns()
     * @returns {String} the label to be attached to the JWK algorithm
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
