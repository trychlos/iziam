/*
 * /imports/common/definitions/response-type.def.js
 *
 * OAuth 2.0
 *  - https://datatracker.ietf.org/doc/html/rfc6749#section-4 Obtaining Authorization
 *  - https://datatracker.ietf.org/doc/html/rfc7591#section-2
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthentificationFlow } from '/imports/common/definitions/authentification-flow.def.js';

export const ResponseType = {
    // the available response types
    RT: [
        {
            // response_type to be configured for the client in its request for client credentials grant type
            id: 'none',
            label: 'definitions.response_type.none_label'
        },
        {
            // response_type to be provided by the client in its request for authorization code grant type
            //  https://datatracker.ietf.org/doc/html/rfc6749#section-4.1
            id: 'code',
            label: 'definitions.response_type.code_label'
        },
        {
            // response_type to be provided by the client in its request for implicit grant type
            //  https://datatracker.ietf.org/doc/html/rfc6749#section-4.2
            id: 'token',
            label: 'definitions.response_type.token_label'
        }
    ],

    // the authentification path is determined by the response_type found in the authorization request
    AP: [
        {
            rt: [
                'code'
            ],
            flow: AuthentificationFlow.C.AUTHCODE
        },
        {
            rt: [
                'id_token',
                'id_token token'
            ],
            flow: AuthentificationFlow.C.IMPLICIT
        },
        {
            rt: [
                'code id_token',
                'code token',
                'code id_token token'
            ],
            flow: AuthentificationFlow.C.HYBRID
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {String} id a response type identifier
     * @returns {Object} the corresponding response type definition
     */
    byId( id ){
        let found = null;
        this.RT.every(( o ) => {
            if( o.id === id ){
                found = o;
            }
            return found === null;
        });
        if( !found && !ResponseType.warnedById[id] ){
            console.warn( 'response type not found', id );
            ResponseType.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def the definition as returned by ResponseType.Knowns()
     * @returns {String} the identifier associated to this response type
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the supported response types
     */
    Knowns(){
        return this.RT;
    },

    /**
     * @param {Object} def the definition as returned by ResponseType.Knowns()
     * @returns {String} the label associated to this response type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
