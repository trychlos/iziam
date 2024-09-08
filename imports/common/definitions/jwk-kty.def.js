/*
 * /imports/common/definitions/jwk-kty.def.js
 *
 * See:
 *  - https://datatracker.ietf.org/doc/html/rfc7517 JSON Web Key (JWK)
 *  - https://datatracker.ietf.org/doc/html/rfc7518 JSON Web Algorithms (JWA)
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const JwkKty = {
    C: [
        {
            id: 'EC',
            label: 'definitions.jwk_kty.ec_label'
        },
        {
            id: 'RSA',
            label: 'definitions.jwk_kty.rsa_label'
        },
        {
            id: 'oct',
            label: 'definitions.jwk_kty.oct_label'
        }
    ],

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
