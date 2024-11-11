/*
 * /imports/common/definitions/common-algs.def.js
 *
 * Define here common signing and encryption algs, and encryption encoding values.
 * These are the corresponding supported values advertised by our OID provders.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

export const CommonAlgs = {
    C: [
        {
            id: 'authorization_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'authorization_encryption_alg',
            values: [
                'A256KW',
                'ECDH-ES',
                'RSA-OAEP'
            ]
        },
        {
            id: 'authorization_encryption_enc',
            values: [
                'A128CBC-HS256',
                'A256CBC-HS512',
                'A256GCM'
            ]
        },
        {
            id: 'id_token_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'id_token_encryption_alg',
            values: [
                'A128KW',
                'A256KW',
                'ECDH-ES',
                'RSA1_5',
                'RSA-OAEP'
            ]
        },
        {
            id: 'id_token_encryption_enc',
            values: [
                'A128CBC-HS256',
                'A256CBC-HS512',
                'A256GCM'
            ]
        },
        {
            id: 'introspection_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'introspection_encryption_alg',
            values: [
                'A256KW',
                'ECDH-ES',
                'RSA-OAEP'
            ]
        },
        {
            id: 'introspection_encryption_enc',
            values: [
                'A128CBC-HS256',
                'A256CBC-HS512',
                'A256GCM'
            ]
        },
        {
            id: 'pushed_authorization_request_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'request_object_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'request_object_encryption_alg',
            values: [
                'A128KW',
                'ECDH-ES',
                'RSA-OAEP' 
            ]
        },
        {
            id: 'request_object_encryption_enc',
            values: [
                'A128CBC-HS256',
                'A256CBC-HS512',
                'A256GCM'
            ]
        },
        {
            id: 'token_endpoint_auth_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'userinfo_signing_alg',
            values: [
                'ES256',
                'HS256',
                'RS256',
                'EdDSA'
            ]
        },
        {
            id: 'userinfo_encryption_alg',
            values: [
                'A256KW',
                'ECDH-ES',
                'RSA-OAEP'
            ]
        },
        {
            id: 'userinfo_encryption_enc',
            values: [
                'A128CBC-HS256',
                'A128GCM',
                'A256GCM'
            ]
        }
    ],

    warnedById: {},

    /**
     * @returns {Array} the supported values
     */
    authorizationSigningAlgValues(){
        return this.values( 'authorization_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    authorizationEncryptionAlgValues(){
        return this.values( 'authorization_encryption_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    authorizationEncryptionEncValues(){
        return this.values( 'authorization_encryption_enc' );
    },

    /**
     * @param {String} id a client type identifier
     * @returns {Object} the client credentials type definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !this.warnedById[id] ){
            console.warn( 'application type not found', id );
            CommonAlgs.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def a CommonAlgs definition as returned by CommonAlgs.Knowns()
     * @returns {String} the client type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the supported values
     */
    idTokenSigningAlgValues(){
        return this.values( 'id_token_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    idTokenEncryptionAlgValues(){
        return this.values( 'id_token_encryption_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    idTokenEncryptionEncValues(){
        return this.values( 'id_token_encryption_enc' );
    },

    /**
     * @returns {Array} the supported values
     */
    introspectionSigningAlgValues(){
        return this.values( 'introspection_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    introspectionEncryptionAlgValues(){
        return this.values( 'introspection_encryption_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    introspectionEncryptionEncValues(){
        return this.values( 'introspection_encryption_enc' );
    },

    /**
     * @returns {Array} the list of managed client credential types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @returns {Array} the supported values
     */
    pushedAuthorizationRequestSigningAlgValues(){
        return this.values( 'pushed_authorization_request_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    requestObjectSigningAlgValues(){
        return this.values( 'request_object_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    requestObjectEncryptionAlgValues(){
        return this.values( 'request_object_encryption_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    requestObjectEncryptionEncValues(){
        return this.values( 'request_object_encryption_enc' );
    },

    /**
     * @returns {Array} the supported values
     */
    tokenEndpointAuthSigningAlgValues(){
        return this.values( 'token_endpoint_auth_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    userinfoSigningAlgValues(){
        return this.values( 'userinfo_signing_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    userinfoEncryptionAlgValues(){
        return this.values( 'userinfo_encryption_alg' );
    },

    /**
     * @returns {Array} the supported values
     */
    userinfoEncryptionEncValues(){
        return this.values( 'userinfo_encryption_enc' );
    },

    /**
     * @param {String} id the parameter identifier
     * @returns {Array} the supported values
     */
    values( id ){
        const def = this.byId( id );
        return def ? def.values : [];
    }
};
