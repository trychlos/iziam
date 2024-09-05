/*
 * /imports/common/definitions/client-profile.def.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const ClientProfile = {
    C: [
        {
            id: 'm-to-m',
            label: 'definitions.client_profile.m2m_label',
            description: 'definitions.client_profile.m2m_description',
            image: '/images/profile-computer.svg',
            client_type: 'confidential',
            features: [
                'oauth2'
            ],
            //haveUsers: false,
            grant_type: 'client_credentials'
        },
        {
            id: 'public',
            label: 'definitions.client_profile.public_label',
            description: 'definitions.client_profile.public_description',
            image: '/images/profile-public.svg',
            client_type: 'public',
            features: [
                'oauth2',
                'openid'
            ],
            //haveAllowedApis: false,
            grant_type: 'authorization_code'
        },
        {
            id: 'confidential',
            label: 'definitions.client_profile.confidential_label',
            description: 'definitions.client_profile.confidential_description',
            image: '/images/profile-confidential.svg',
            client_type: 'confidential',
            features: [
                'oauth2'
            ],
            //haveAllowedApis: false,
            grant_type: 'client_credentials'
        },
        {
            id: 'generic',
            label: 'definitions.client_profile.generic_label',
            description: 'definitions.client_profile.generic_description',
            image: '/images/profile-generic.svg',
            client_type: 'public',
            features: [
                'oauth2'
            ],
            //haveAllowedApis: false,
            auth_methods: [
                'none',
                'secret_basic',
                'secret_post',
                'private_key_jwt',
                'client_secret_jwt'
            ],
            grant_type: 'authorization_code'
        }
    ],

    /**
     * @param {String} id a client profile identifier
     * @returns {Object} the client profile definition, or null
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
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {Array<String>} the default authentification methods
     *  The proposed authentication methods of a client mainly depend of the client type and the selected providers
     *  though this can be superseded here at the client profile level.
     *  We return null if we accept to rely of computed values
     */
    defaultAuthMethods( def ){
        return def.auth_methods || null;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the ClientType type, defaulting to 'public'
     */
    defaultClientType( def ){
        return def.client_type || 'public';
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {Array} the list of suggested features
     */
    defaultFeatures( def ){
        return def.features;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the preferred grant type
     */
    defaultGrantType( def ){
        return def.grant_type;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {Boolean} whether this profile of client can be authorized to consume resources, defaulting to true
     */
    defaultHaveAllowedApis( def ){
        return _.isBoolean( def.haveAllowedApis ) ? def.haveAllowedApis : true;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {Boolean} whether this profile of client interacts with users, defaulting to true
     */
    defaultHaveUsers( def ){
        return _.isBoolean( def.haveUsers ) ? def.haveUsers : true;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the description to be attached to the client profile
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the client profile identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the image to be attached to the client profile
     */
    image( def ){
        return def.image;
    },

    /**
     * @returns {Array} the list of known client types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the label to be attached to the client profile
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },
};
