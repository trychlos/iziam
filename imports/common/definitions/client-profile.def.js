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
            //grantTypes: [
            //    'client_creds'
            //],
            //haveEndpoints: false,
            //haveUsers: false,
            allowedAuthMethods: [
                'secret_basic',
                'secret_post',
                'private_jwt',
                'secret_jwt'
            ],
            clientType: 'confidential',
            features: [
                'oauth2'
            ],
            preferredGrantType: 'client_credentials'
        },
        {
            id: 'public',
            label: 'definitions.client_profile.public_label',
            description: 'definitions.client_profile.public_description',
            image: '/images/profile-public.svg',
            //grantTypes: [
            //    'auth_code',
            //    'refresh_token'
            //],
            //haveAllowedApis: false,
            allowedAuthMethods: [
                'none'
            ],
            clientType: 'public',
            features: [
                'oauth2',
                'openid'
            ],
            preferredGrantType: 'auth_code_21'
        },
        {
            id: 'confidential',
            label: 'definitions.client_profile.confidential_label',
            description: 'definitions.client_profile.confidential_description',
            image: '/images/profile-confidential.svg',
            //grantTypes: [
            //    'auth_code',
            //    'refresh_token',
            //    'client_creds'
            //],
            //haveAllowedApis: false,
            allowedAuthMethods: [
                'secret_basic',
                'secret_post',
                'private_jwt',
                'secret_jwt'
            ],
            clientType: 'confidential',
            features: [
                'oauth2'
            ],
            preferredGrantType: 'client_credentials'
        },
        {
            id: 'generic',
            label: 'definitions.client_profile.generic_label',
            description: 'definitions.client_profile.generic_description',
            image: '/images/profile-generic.svg',
            //grantTypes: [
            //    'auth_code',
            //    'client_creds'
            //],
            //haveAllowedApis: false,
            allowedAuthMethods: [
                'none',
                'secret_basic',
                'secret_post',
                'private_jwt',
                'secret_jwt'
            ],
            clientType: 'public',
            features: [
                'oauth2'
            ],
            preferredGrantType: 'auth_code_21'
        }
    ],

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {Array<String>} the allowed authentification methods, defaulting to 'none'
     */
    allowedAuthMethods( def ){
        return def.allowedAuthMethods || [ 'none' ];
    },

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
     * @returns {String} the ClientType type, defaulting to 'public'
     */
    defaultClientType( def ){
        return def.clientType || 'public';
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
     * @returns {Boolean} whether this profile of client can be authorized to consume resources, defaulting to true
     */
    defaultHaveAllowedApis( def ){
        return _.isBoolean( def.haveAllowedApis ) ? def.haveAllowedApis : true;
    },

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {Boolean} whether this profile of client needs to set allowed callback URLs, defaulting to true
     */
    defaultHaveEndpoints( def ){
        return _.isBoolean( def.haveEndpoints ) ? def.haveEndpoints : true;
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

    /**
     * @param {Object} def a ClientProfile definition as returned by ClientProfile.Knowns()
     * @returns {String} the preferred grant type
     */
    preferredGrantType( def ){
        return def.preferredGrantType;
    }
};
