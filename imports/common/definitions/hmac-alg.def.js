/*
 * /imports/common/classes/hmac-alg.def.js
 *
 * HMAC (hash-based message authentication code) Algorithm
 * 
 * See: https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options
 * The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform.
 * Examples are 'sha256', 'sha512', etc. On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const HmacAlg = {
    C: [
        // not supported by NodeJS 20.x ?
        //{
        //    id: 'BLAKE2B512',
        //    label: 'definitions.hmac_alg.blake2b512_label'
        //},
        //{
        //    id: 'BLAKE2S256',
        //    label: 'definitions.hmac_alg.blake2s256_label'
        //},
        //{
        //    id: 'MD5SHA1',
        //    label: 'definitions.hmac_alg.md5sha1_label'
        //},
        {
            id: 'RMD160',
            label: 'definitions.hmac_alg.rmd160_label'
        },
        //{
        //    id: 'SHAKE-256',
        //    label: 'definitions.hmac_alg.shake256_label'
        //},
        //{
        //    id: 'SHA2-224',
        //    label: 'definitions.hmac_alg.sha2224_label'
        //},
        //{
        //    id: 'SHA2-256',
        //    label: 'definitions.hmac_alg.sha2256_label'
        //},
        //{
        //    id: 'SHA2-256/192',
        //    label: 'definitions.hmac_alg.sha2256192_label'
        //},
        //{
        //    id: 'SHA2-384',
        //    label: 'definitions.hmac_alg.sha2384_label'
        //},
        {
            id: 'SHA256',
            label: 'definitions.hmac_alg.sha256_label'
        },
        {
            id: 'SHA384',
            label: 'definitions.hmac_alg.sha384_label'
        },
        {
            id: 'SHA512',
            label: 'definitions.hmac_alg.sha512_label'
        },
        //{
        //    id: 'SHA2-512',
        //    label: 'definitions.hmac_alg.sha2512_label'
        //},
        //{
        //    id: 'SHA2-512/224',
        //    label: 'definitions.hmac_alg.sha2512224_label'
        //},
        //{
        //    id: 'SHA2-512/256',
        //    label: 'definitions.hmac_alg.sha2512256_label'
        //},
        //{
        //    id: 'SHA3224',
        //    label: 'definitions.hmac_alg.sha3224_label'
        //},
        //{
        //    id: 'SHA3256',
        //    label: 'definitions.hmac_alg.sha3256_label'
        //},
        //{
        //    id: 'SHA3384',
        //    label: 'definitions.hmac_alg.sha3384_label'
        //},
        //{
        //    id: 'SHA3512',
        //    label: 'definitions.hmac_alg.sha3512_label'
        //},
        //{
        //    id: 'SHAKE-128',
        //    label: 'definitions.hmac_alg.shake128_label'
        //},
        //{
        //    id: 'SM3',
        //    label: 'definitions.hmac_alg.sm3_label'
        //},
        //{
        //    id: 'SSL3-MD5',
        //    label: 'definitions.hmac_alg.ssl3md5_label'
        //},
        //{
        //    id: 'SSL3-SHA1',
        //    label: 'definitions.hmac_alg.ssl3sha1_label'
        //}
    ],

    /**
     * @param {String} id an algorithm identifier
     * @returns {Object} the HmacAlg definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Object} def a HmacAlg definition as returned by HmacAlg.Knowns()
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
     * @param {Object} def a HmacAlg definition as returned by HmacAlg.Knowns()
     * @returns {String} the label to be attached to the JWK algorithm
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
