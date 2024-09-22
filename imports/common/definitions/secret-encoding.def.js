/*
 * /imports/common/definitions/secret-encoding.def.js
 *
 * A simplfied copy of hmac-encoding just to manage clients secrets.
 * We only keep text-only encodings.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const SecretEncoding = {
    C: [
        {
            id: 'base64',
            label: 'definitions.secret_encoding.base64_label'
        },
        {
            id: 'hex',
            label: 'definitions.secret_encoding.hex_label'
        }
    ],

    /**
     * @param {String} id an algorithm identifier
     * @returns {Object} the HmacEncoding definition, or null
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
     * @param {Object} def a HmacEncoding definition as returned by HmacEncoding.Knowns()
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
     * @param {Object} def a HmacEncoding definition as returned by HmacEncoding.Knowns()
     * @returns {String} the label to be attached to the JWK algorithm
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
