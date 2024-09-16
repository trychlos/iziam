/*
 * /imports/common/classes/hmac-encoding.def.js
 *
 * HMAC (hash-based message authentication code) Encoding
 * 
 * See: https://nodejs.org/api/crypto.html#hmacdigestencoding
 *      https://nodejs.org/api/buffer.html#buffers-and-character-encodings
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const HmacEncoding = {
    C: [
        {
            id: 'utf8',
            label: 'definitions.hmac_encoding.utf8_label',
            binary: true
        },
        {
            id: 'utf16le',
            label: 'definitions.hmac_encoding.utf16le_label',
            binary: true
        },
        {
            id: 'latin1',
            label: 'definitions.hmac_encoding.latin1_label',
            binary: true
        },
        {
            id: 'base64',
            label: 'definitions.hmac_encoding.base64_label'
        },
        // unknown from nodejs v20.x
        //{
        //    id: 'base64url',
        //    label: 'definitions.hmac_encoding.base64url_label'
        //},
        {
            id: 'hex',
            label: 'definitions.hmac_encoding.hex_label'
        },
        // legacy
        //{
        //    id: 'ascii',
        //    label: 'definitions.hmac_encoding.ascii_label'
        //},
        //{
        //    id: 'binary',
        //    label: 'definitions.hmac_encoding.binary_label'
        //},
        //{
        //    id: 'ucs2',
        //    label: 'definitions.hmac_encoding.ucs2_label'
        //}
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
     * @param {Object} def a HmacEncoding definition as returned by HmacEncoding.Knowns()
     * @returns {Boolean} whether the hash has a binary form (cannot be visualized), defaulting to false
     */
    isBinary( def ){
        return def.binary === true;
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
