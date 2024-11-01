/*
 * /imports/common/definitions/secret-alg.def.js
 *
 * A simplfied copy of hmac-alg just to manage clients secrets.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

export const SecretAlg = {
    C: [
        {
            id: 'RMD160',
            label: 'definitions.secret_alg.rmd160_label'
        },
        {
            id: 'SHA256',
            label: 'definitions.secret_alg.sha256_label'
        },
        {
            id: 'SHA384',
            label: 'definitions.secret_alg.sha384_label'
        },
        {
            id: 'SHA512',
            label: 'definitions.secret_alg.sha512_label'
        }
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
