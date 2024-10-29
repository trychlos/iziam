/*
 * /imports/common/definitions/identity-auth-mode.def.js
 *
 * Whether the client wants the identities be authenticated.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const IdentityAuthMode = {
    C: [
        {
            // no authentication wanted
            id: 'none',
            short: 'definitions.identity_auth_mode.none_short',
            label: 'definitions.identity_auth_mode.none_label',
            description: 'definitions.identity_auth_mode.none_desc'
        },
        {
            // authentication is required
            //  the exact used method will depend of the providers selected by the organization
            id: 'auth',
            short: 'definitions.identity_auth_mode.auth_short',
            label: 'definitions.identity_auth_mode.auth_label',
            description: 'definitions.identity_auth_mode.auth_desc'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {String} id an identity auth mode identifier
     * @returns {Object} the identity auth mode definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !IdentityAuthMode.warnedById[id] ){
            console.warn( 'auth method not found', id );
            IdentityAuthMode.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def an IdentityAuthMode definition as returned by IdentityAuthMode.Knowns()
     * @returns {String} the description to be attached to the identity auth mode 
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def an IdentityAuthMode definition as returned by IdentityAuthMode.Knowns()
     * @returns {String} the identity auth mode identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of managed identity auth modes
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def an IdentityAuthMode definition as returned by IdentityAuthMode.Knowns()
     * @returns {String} the label to be attached to the identity auth mode
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {Object} def an IdentityAuthMode definition as returned by IdentityAuthMode.Knowns()
     * @returns {String} the short label to be attached to the identity auth mode
     */
    short( def ){
        return pwixI18n.label( I18N, def.short );
    }
};
