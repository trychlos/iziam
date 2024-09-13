/*
 * /imports/common/definitions/jwa-alg.def.js
 *
 * See:
 *  - https://datatracker.ietf.org/doc/html/rfc7518 JSON Web Algorithms (JWA)
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const JwaAlg = {
    C: [
        {
            id: 'A128GCM',
            label: 'definitions.jwa_alg.a128gcm_label',
            symmetric: true
        },
        {
            id: 'A192GCM',
            label: 'definitions.jwa_alg.a192gcm_label',
            symmetric: true
        },
        {
            id: 'A256GCM',
            label: 'definitions.jwa_alg.a256gcm_label',
            symmetric: true
        },
        {
            id: 'A128CBC-HS256',
            label: 'definitions.jwa_alg.a128cbc_hs256_label',
            symmetric: true
        },
        {
            id: 'A192CBC-HS384',
            label: 'definitions.jwa_alg.a192cbc_hs384_label',
            symmetric: true
        },
        {
            id: 'A256CBC-HS512',
            label: 'definitions.jwa_alg.a256cbc_hs512_label',
            symmetric: true
        },
        {
            id: 'ECDH-ES',
            label: 'definitions.jwa_alg.ecdh_es_label'
        },
        {
            id: 'ECDH-ES+A128KW',
            label: 'definitions.jwa_alg.ecdh_128kw_label'
        },
        {
            id: 'ECDH-ES+A192KW',
            label: 'definitions.jwa_alg.ecdh_192kw_label'
        },
        {
            id: 'ECDH-ES+A256KW',
            label: 'definitions.jwa_alg.ecdh_256kw_label'
        },
        {
            id: 'ES256',
            label: 'definitions.jwa_alg.es256_label'
        },
        {
            id: 'ES384',
            label: 'definitions.jwa_alg.es384_label'
        },
        {
            id: 'ES512',
            label: 'definitions.jwa_alg.es512_label'
        },
        {
            id: 'HS256',
            label: 'definitions.jwa_alg.hs256_label',
            symmetric: true
        },
        {
            id: 'HS384',
            label: 'definitions.jwa_alg.hs384_label',
            symmetric: true
        },
        {
            id: 'HS512',
            label: 'definitions.jwa_alg.hs512_label',
            symmetric: true
        },
        {
            id: 'PS256',
            label: 'definitions.jwa_alg.ps256_label'
        },
        {
            id: 'PS384',
            label: 'definitions.jwa_alg.ps384_label'
        },
        {
            id: 'PS512',
            label: 'definitions.jwa_alg.ps512_label'
        },
        {
            id: 'RS256',
            label: 'definitions.jwa_alg.rs256_label'
        },
        {
            id: 'RS384',
            label: 'definitions.jwa_alg.rs384_label'
        },
        {
            id: 'RS512',
            label: 'definitions.jwa_alg.rs512_label'
        },
        {
            id: 'RSA-OAEP',
            label: 'definitions.jwa_alg.rsa_oaep_label'
        },
        {
            id: 'RSA-OAEP-256',
            label: 'definitions.jwa_alg.rsa_oaep256_label'
        },
        {
            id: 'RSA-OAEP-384',
            label: 'definitions.jwa_alg.rsa_oaep384_label'
        },
        {
            id: 'RSA-OAEP-512',
            label: 'definitions.jwa_alg.rsa_oaep512_label'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {String} id an algorithm identifier
     * @returns {Object} the JwaAlg definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !JwaAlg.warnedById[id] ){
            console.warn( 'JWK algorithm not found', id );
            JwaAlg.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Array<String>} ids an array of algorithm identifiers
     * @returns {Array<Object>} the corresponding array of JwaAlg definitions
     */
    byIds( ids ){
        let founds = [];
        ids.forEach(( id ) => {
            const def = JwaAlg.byId( id );
            if( def ){
                founds.push( def );
            }
        });
        return founds;
    },

    /**
     * @param {Object} def a JwaAlg definition as returned by JwaAlg.Knowns()
     * @returns {String} the algorithm identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @param {Object} def a JwaAlg definition as returned by JwaAlg.Knowns()
     * @returns {Boolean} whether the algorithm is available is current Jose library, defaulting to true
     */
    isAvailable( def ){
        return def.available !== false;
    },

    /**
     * @param {Object} def a JwaAlg definition as returned by JwaAlg.Knowns()
     * @returns {Boolean} whether the algorithm is a symmetric one, defaulting to false
     */
    isSymmetric( def ){
        return def.symmetric === true;
    },

    /**
     * @returns {Array} the list of managed JWK algorithms
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a JwaAlg definition as returned by JwaAlg.Knowns()
     * @returns {String} the label to be attached to the JWK algorithm
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
