/*
 * /imports/common/definitions/grant-type.def.js
 *
 * See https://datatracker.ietf.org/doc/html/rfc6749#section-1.3 Authorization Grant
 * 
 * - The authorization code is obtained by using an authorization server as an intermediary between the client and resource owner.  Instead of
 *   requesting authorization directly from the resource owner, the client directs the resource owner to an authorization server (via its
 *   user-agent as defined in [RFC2616]), which in turn directs the resource owner back to the client with the authorization code.
 * 
 * - The implicit grant is a simplified authorization code flow optimized for clients implemented in a browser using a scripting language such
 *   as JavaScript.  In the implicit flow, instead of issuing the client an authorization code, the client is issued an access token directly
 *   (as the result of the resource owner authorization).  The grant type is implicit, as no intermediate credentials (such as an authorization
 *   code) are issued (and later used to obtain an access token).
 * 
 * - The resource owner password credentials (i.e., username and password) can be used directly as an authorization grant to obtain an access
 *   token.  The credentials should only be used when there is a high degree of trust between the resource owner and the client (e.g., the
 *   client is part of the device operating system or a highly privileged application), and when other authorization grant types are not
 *   available (such as an authorization code).
 * 
 * - The client credentials (or other forms of client authentication) can be used as an authorization grant when the authorization scope is
 *   limited to the protected resources under the control of the client, or to protected resources previously arranged with the authorization
 *   server.
 * 
 * - See https://datatracker.ietf.org/doc/html/rfc7591#section-2 Client Metadata
 * 
 *  Implicit Grant Flow and Resource Owner Password Grant Flow are deprecated, should not be used any more, is not implemented here.
 *  Though Implicit Grant Flow is said deprecated, OpenID Connect RFC says that OpenID Provider must implement it. It is kept as a reference,
 *  though disabling it for new clients.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const GrantType = {
    C: [
        {
            // authorization code
            id: 'auth_code',
            label: 'definitions.grant_type.authcode_label',
            description: 'definitions.grant_type.authcode_description',
            image: '/images/grant-type.svg'
        },
        {
            // implicit grant
            id: 'implicit',
            label: 'definitions.grant_type.implicit_label',
            description: 'definitions.grant_type.implicit_description',
            image: '/images/grant-type.svg',
            enabled: false
        },
        {
            // client credentials
            id: 'client_creds',
            label: 'definitions.grant_type.client_label',
            description: 'definitions.grant_type.client_description',
            image: '/images/grant-type.svg',
            authMethod: 'secret_basic'
        },
        {
            // device code
            id: 'device_code',
            label: 'definitions.grant_type.device_label',
            description: 'definitions.grant_type.device_description',
            image: '/images/grant-type.svg'
        },
        {
            // The refresh token grant type defined in OAuth 2.0, Section 6
            id: 'refresh_token',
            label: 'definitions.grant_type.reftoken_label',
            description: 'definitions.grant_type.reftoken_description',
            image: '/images/grant-type.svg'
        },
        {
            // The JWT Bearer Token Grant Type defined in OAuth JWT Bearer Token Profiles [RFC7523]
            id: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            label: 'definitions.grant_type.jwt_label',
            description: 'definitions.grant_type.jwt_description',
            image: '/images/grant-type.svg'
        },
        /*
        {
            // The SAML 2.0 Bearer Assertion Grant defined in OAuth SAML 2 Bearer Token Profiles [RFC7522] - not implemented
            id: 'urn:ietf:params:oauth:grant-type:saml2-bearer',
            label: 'definitions.grant_type.saml_label'
        }*/
    ],

    /**
     * @param {String} id a grant type identifier
     * @returns {Object} the grant type definition, or null
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
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {String} the default authentification method, defaulting to 'none'
     */
    defaultAuthMethod( def ){
        return def.authMethod || 'none';
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {String} the description to be attached to the grant type
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {Boolean} whether this item may be selected, defaulting to true
     */
    enabled( def ){
        return _.isBoolean( def.enabled ) ? def.enabled : true;
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {String} the grant type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {String} the URL of an image attached to the grant type
     */
    image( def ){
        return def.image;
    },

    /**
     * @param {Array} array an array of grant type identifiers
     * @returns {Boolean} whether the selected grant types are valid for a client
     *  This is an intrinsic validation, which doesn't take care of other client parameters.
     *  Just make sure that this configuration may work.
     */
    isValidSelection( array ){
        // must have at least one
        if( !array.length ){
            return false;
        }
        // refresh token must be associated to an authorization code
        if( array.includes( 'refresh_token' )){
            return array.includes( 'auth_code' );
        }
        // other combinations are ok
        return true;
    },

    /**
     * @param {Array} array an array of grant type identifiers
     * @returns {String} the concatenation of the labels of the provided grant types
     */
    joinedLabels( array ){
        let res = [];
        ( array || [] ).every(( it ) => {
            const def = this.byId( it );
            def && res.push( this.label( def ));
            return true;
        });
        return res.join( ', ' );
    },

    /**
     * @returns {Array} the list of known grant types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {String} the label to be attached to the grant type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @returns {Array} the array of selectables (non-deprecated) grant types
     */
    Selectables(){
        let array = [];
        this.C.every(( it ) => {
            it.enabled === false || array.push( it );
            return true;
        });
        return array;
    }
};
