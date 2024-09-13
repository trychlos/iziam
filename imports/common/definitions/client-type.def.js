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
            description: 'definitions.client_type.confidential_description',
            //preferred_auth: AuthRFC.C.OAUTH
            auth_methods: [
                'secret_basic',
                'secret_post',
                'private_key_jwt',
                'client_secret_jwt'
            ],
        },
        {
            id: 'public',
            short: 'definitions.client_type.public_short',
            label: 'definitions.client_type.public_label',
            text: {
                'org.trychlos.iziam.provider.oauth20.0': 'definitions.client_type.public_text_oauth20',
                'org.trychlos.iziam.provider.oauth21.11': 'definitions.client_type.public_text_oauth21'
            },
            description: 'definitions.client_type.public_description',
            //preferred_auth: AuthRFC.C.OPENID
            auth_methods: [
                'none'
            ],
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
        if( !found ){
            console.warn( 'client type not found', id );
        }
        return found;
    },

    /**
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {Array<String>} the default authentification methods
     *  The proposed authentication methods of a client mainly depend of the client type and the selected providers
     *  though this can be superseded here at the client profile level.
     */
    defaultAuthMethods( def ){
        return def.auth_methods || null;
    },

    /**
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {String} the description to be attached to the client type
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
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
    /*
    preferredAuth( def ){
        return def.preferred_auth;
    },
    */

    /**
     * @param {Object} def a ClientType definition as returned by ClientType.Knowns()
     * @returns {String} a short label to be attached to the client type
     */
    short( def ){
        return pwixI18n.label( I18N, def.short );
    }
};
