/*
 * /imports/common/definitions/identity-access-mode.def.js
 *
 * Whether and how a new identity can access an application client.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const IdentityAccessMode = {
    C: [
        {
            // all new identities can access the client
            id: 'all',
            short: 'definitions.identity_access_mode.all_short',
            label: 'definitions.identity_access_mode.all_label',
            description: 'definitions.identity_access_mode.all_desc'
        },
        {
            // all authorized identities can access the client
            id: 'authorized',
            short: 'definitions.identity_access_mode.authorized_short',
            label: 'definitions.identity_access_mode.authorized_label',
            description: 'definitions.identity_access_mode.authorized_desc'
        },
        {
            // only authorized + pre-registered client accounts can access the client
            id: 'auth_pre',
            short: 'definitions.identity_access_mode.auth_pre_short',
            label: 'definitions.identity_access_mode.auth_pre_label',
            description: 'definitions.identity_access_mode.auth_pre_desc'
        },
        {
            // it is enough to be pre-registered in the client for an identity access the client
            id: 'pre',
            short: 'definitions.identity_access_mode.pre_short',
            label: 'definitions.identity_access_mode.pre_label',
            description: 'definitions.identity_access_mode.pre_desc'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {String} id an identity access mode identifier
     * @returns {Object} the identity access mode definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !IdentityAccessMode.warnedById[id] ){
            console.warn( 'auth method not found', id );
            IdentityAccessMode.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def an IdentityAccessMode definition as returned by IdentityAccessMode.Knowns()
     * @returns {String} the description to be attached to the identity access mode
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def an IdentityAccessMode definition as returned by IdentityAccessMode.Knowns()
     * @returns {String} the identity access mode identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of managed identity access modes
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def an IdentityAccessMode definition as returned by IdentityAccessMode.Knowns()
     * @returns {String} the label to be attached to the identity access mode
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {Object} def an IdentityAccessMode definition as returned by IdentityAccessMode.Knowns()
     * @returns {String} the short label to be attached to the identity access mode
     */
    short( def ){
        return pwixI18n.label( I18N, def.short );
    }
};
