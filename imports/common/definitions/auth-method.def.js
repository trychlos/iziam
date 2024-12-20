/*
 * /imports/common/definitions/auth-method.def.js
 *
 * See:
 *  - https://connect2id.com/products/server/docs/guides/oauth-client-authentication#supported-methods
 *  - https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/
 *  - https://datatracker.ietf.org/doc/html/rfc7591#section-2 Client Metadata
 * and for JWT:
 *  - https://www.rfc-editor.org/rfc/rfc7523.html JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants
 *  - https://developer.okta.com/docs/guides/build-self-signed-jwt/js/main/ Build a JWT for Client Authentication
 *  - https://backstage.forgerock.com/docs/am/7/oauth2-guide/client-auth-jwt.html Authenticating Clients Using JWT Profiles
 *
 * When registering a confidential client, one must specify how the client authenticate against the token endpoint. Below the available options.
 * Public clients do not authenticate themselves.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

export const AuthMethod = {
    C: [
        {
            // no secret
            //  this is the "auth method" for public clients (i.e.: no auth method at all)
            //  https://connect2id.com/products/server/docs/guides/client-registration#public-clients
            //  must then use a PKCE grant type
            id: 'none',
            short: 'definitions.auth_method.none_short',
            label: 'definitions.auth_method.none_label',
            description: 'definitions.auth_method.none_desc',
            needsSecret: false
        },
        {
            // a client shared secret (aka a password!) generated by the server at registration time
            //  the length of the secret is defined by the organization
            //  stored hash is SHA-256
            //  the client must use Basic authentification
            id: 'client_secret_basic',
            short: 'definitions.auth_method.shared_short',
            label: 'definitions.auth_method.shared_label',
            description: 'definitions.auth_method.shared_desc'
        },
        {
            // a client shared secret (aka a password!) generated by the server at registration time
            //  the length of the secret is defined by the organization
            //  stored hash is SHA-256
            //  the client must use POST authentification
            id: 'client_secret_post',
            short: 'definitions.auth_method.post_short',
            label: 'definitions.auth_method.post_label',
            description: 'definitions.auth_method.post_desc'
        },
        {
            // Private Key JWT Client Authentication
            id: 'private_key_jwt',
            short: 'definitions.auth_method.private_jwt_short',
            label: 'definitions.auth_method.private_jwt_label',
            description: 'definitions.auth_method.private_jwt_desc',
            needsSecret: false
        },
        {
            // Shared secret JWT Client Authentication
            id: 'client_secret_jwt',
            short: 'definitions.auth_method.secret_jwt_short',
            label: 'definitions.auth_method.secret_jwt_label',
            description: 'definitions.auth_method.secret_jwt_desc'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

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
        if( !found && !AuthMethod.warnedById[id] ){
            console.warn( 'auth method not found', id );
            AuthMethod.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @summary When the client credentials requires some data to be provided by the client, then check here if this is ok:
     *  - if ok: update accordingly the result object
     *  - else: push error message in res.errs
     * @param {Object} def a AuthMethod.Defs object
     * @param {String} type the client type
     * @param {String} registration the client registration mode
     * @param {Object} args the request arguments
     * @param {Object} res the result object
     */
    checkProvidedCredentials( def, type, registration, args, res ){
        console.debug( 'TODO' );
    },

    /**
     * @param {Object} def a AuthMethod definition as returned by AuthMethod.Knowns()
     * @returns {String} the description to be attached to the client credential type
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def a AuthMethod definition as returned by AuthMethod.Knowns()
     * @returns {String} the client type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of managed client credential types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a AuthMethod definition as returned by AuthMethod.Knowns()
     * @returns {String} the label to be attached to the client credential type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {String} id the auth method
     * @returns {String} the label attached to this auth method, or null
     */
    labelFromAuthMethod( id ){
        let label = null;
        let def = AuthMethod.byId( id );
        if( def ){
            label = AuthMethod.label( def );
        }
        return label;
    },

    /**
     * @param {Object} def a AuthMethod definition as returned by AuthMethod.Knowns()
     * @returns {Boolean} whether this authentification method needs a (shared) secret, defaulting to true
     */
    needsSecret( def ){
        return _.isBoolean( def.needsSecret ) ? def.needsSecret : true;
    },

    /**
     * @param {Object} def a AuthMethod definition as returned by AuthMethod.Knowns()
     * @returns {Boolean} whether this type of credentials request data to be provided by the client
     */
    providedByClient( def ){
        return Boolean( def.clientProvided );
    },

    /**
     * @param {Object} def a AuthMethod definition as returned by AuthMethod.Knowns()
     * @returns {String} the short label to be attached to the client credential type
     */
    short( def ){
        return pwixI18n.label( I18N, def.short );
    }
};
