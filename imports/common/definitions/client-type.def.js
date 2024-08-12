/*
 * /imports/common/definitions/client-type.def.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

//import { AuthRFC } from '/imports/common/definitions/auth-rfc.def.js';

export const ClientType = {
    C: [
        {
            id: 'confidential',
            short: 'definitions.client_type.confidential_short',
            label: 'definitions.client_type.confidential_label',
            text: {
                'org.trychlos.iziam.provider.oauth20.0': 'definitions.client_type.confidential_text_oauth20',
                'org.trychlos.iziam.provider.oauth21.11': 'definitions.client_type.confidential_text_oauth21'
            },
            summary: 'definitions.client_type.confidential_summary'
            //preferred_auth: AuthRFC.C.OAUTH
        },
        {
            id: 'public',
            short: 'definitions.client_type.public_short',
            label: 'definitions.client_type.public_label',
            text: {
                'org.trychlos.iziam.provider.oauth20.0': 'definitions.client_type.public_text_oauth20',
                'org.trychlos.iziam.provider.oauth21.11': 'definitions.client_type.public_text_oauth21'
            },
            summary: 'definitions.client_type.public_summary'
            //preferred_auth: AuthRFC.C.OPENID
        }
    ],

    /**
     * @param {String} id a client type identifier
     * @returns {Object} the client type definition, or null
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
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {String} the client type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of known client types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {String} the label to be attached to the client type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {String} a AuthRFC identifier of the preferred protocol
     */
    preferredAuth( def ){
        return def.preferred_auth;
    },

    /**
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {String} a short label to be attached to the client type
     */
    short( def ){
        return pwixI18n.label( I18N, def.short );
    }
};