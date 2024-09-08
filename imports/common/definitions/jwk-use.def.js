/*
 * /imports/common/definitions/jwk-use.def.js
 *
 * See:
 *  - https://datatracker.ietf.org/doc/html/rfc7517#section-4.2 JSON Web Key Usage
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const JwkUse = {
    C: [
        {
            // signature
            id: 'sig',
            label: 'definitions.jwk_use.sig_label'
        },
        {
            // encryption
            id: 'enc',
            label: 'definitions.jwk_use.enc_label'
        }
    ],

    /**
     * @param {String} id a usage identifier
     * @returns {Object} the usage definition, or null
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
     * @param {Object} def a JwkUse definition as returned by JwkUse.Knowns()
     * @returns {String} the usage identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of managed JWK usages
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a JwkUse definition as returned by JwkUse.Knowns()
     * @returns {String} the label to be attached to the JWK usage
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
