/*
 * /imports/common/definitions/jwk-use.def.js
 *
 * See:
 *  - https://datatracker.ietf.org/doc/html/rfc7517#section-4.2 JSON Web Key Usage
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

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

    // only warn once when byId() doesn't find the item
    warnedById: {},

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
        if( !found && !JwkUse.warnedById[id] ){
            console.warn( 'JWK use not found', id );
            JwkUse.warnedById[id] = true;
        }
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
