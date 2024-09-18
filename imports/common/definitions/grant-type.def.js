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
 * 
 * The relation between authorization grant flow (aka grant_type) and the allowed response_type's is defined by OpenID
 * see https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantNature } from '/imports/common/definitions/grant-nature.def.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';

import { Providers } from '/imports/common/tables/providers/index.js';

export const GrantType = {
    C: [
        {
            // OAuth 2.0/2.1 authorization code
            id: 'authorization_code',
            label: 'definitions.grant_type.authcode_label',
            description: 'definitions.grant_type.authcode_description',
            image: '/images/grant-type.svg',
            nature: 'access',
            haveRedirects: true,
            useAuthorizationEndpoint: true,
            useTokenEndpoint: true,
            response_types: [
                'code',
                'code id_token',
                'code id_token token',
                'code token'
            ]
        },
        {
            // client credentials
            // https://connect2id.com/products/server/docs/guides/client-registration#example-client-credentials-grant
            // The client credentials grant is intended for clients that act on their own behalf (the client is also the resource owner),
            // as opposed to the general OAuth case where the client acts on behalf of an end-user. This grant type is often used in
            // microservice and B2B service scenarios.
            id: 'client_credentials',
            label: 'definitions.grant_type.client_label',
            description: 'definitions.grant_type.client_description',
            image: '/images/grant-type.svg',
            nature: 'access',
            useTokenEndpoint: true
        },
        {
            // hybrid authorization flow for OpenID Connect
            id: 'hybrid',
            label: 'definitions.grant_type.hybrid_label',
            description: 'definitions.grant_type.hybrid_description',
            image: '/images/grant-type.svg',
            nature: 'access'
        },
        {
            // implicit grant - oauth 2.0 ONLY
            // deprecated as of OAuth 2.1
            id: 'implicit',
            label: 'definitions.grant_type.implicit_label',
            description: 'definitions.grant_type.implicit_description',
            image: '/images/grant-type.svg',
            nature: 'access',
            haveRedirects: true,
            useAuthorizationEndpoint: true,
            deprecated: true,
            response_types: [
                'code id_token',
                'code id_token token',
                'code token',
                'id_token',
                'id_token token'
            ]
        },
        {
            // resource owner password credentials
            // deprecated as of OAuth 2.1
            id: 'password',
            label: 'definitions.grant_type.password_label',
            description: 'definitions.grant_type.password_description',
            image: '/images/grant-type.svg',
            nature: 'access',
            useTokenEndpoint: true,
            deprecated: true
        },
        {
            // The refresh token grant type defined in OAuth 2.0, Section 6
            id: 'refresh_token',
            label: 'definitions.grant_type.reftoken_label',
            description: 'definitions.grant_type.reftoken_description',
            image: '/images/grant-type.svg',
            nature: 'refresh'
        },
        {
            // device code [RFC8628]
            id: 'urn:ietf:params:oauth:grant-type:device_code',
            label: 'definitions.grant_type.device_label',
            description: 'definitions.grant_type.device_description',
            image: '/images/grant-type.svg',
            nature: 'access'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

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
        if( !found && !GrantType.warnedById[id] ){
            console.warn( 'grant type not found', id );
            GrantType.warnedById[id] = true;
        }
        return found;
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
     * @param {String} id a GrantType identifier
     * @returns {Boolean} whether this item may be selected, defaulting to true
     */
    enabledById( id ){
        const def = GrantType.byId( id );
        if( def ){
            return GrantType.enabled( def );
        } else {
            console.warn( 'unknown grant type', id );
            return false;
        }
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
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {Boolean} whether this grant type is deprecated, defaulting to false
     */
    isDeprecated( def ){
        return def.deprecated === true;
    },

    /**
     * @param {Object} selectables an object which describe the selectable grant types:
     *  - keyed whith grant nature id
     *  - value being an object with
     *    > def: the GrantNature definition
     *    > types: an object keyed by available grant types, where data is the GrantType definition
     * @param {Array} array an array of the currently selected grant type identifiers
     * @returns {Boolean} whether the selected grant types are valid for a client
     *  This is an intrinsic validation, which doesn't take care of other client parameters.
     *  Just make sure that this configuration may work.
     *  + make sure the grant types which have a mandatory nature are set
     */
    isValidSelection( selectables, array ){
        let valid = true;
        // examine each selectable nature to see if its constraints are fullfilled
        Object.keys( selectables || {} ).every(( nature ) => {
            // if mandatory, check that there is at least one - else, do not care
            if( GrantNature.isMandatory( selectables[nature].def )){
                let hasOne = false;
                array.every(( it ) => {
                    const def = GrantType.byId( it );
                    if( def ){
                        const grantNature = GrantType.nature( def );
                        if( grantNature ){
                            if( grantNature === nature ){
                                hasOne = true;
                            }
                        } else {
                            console.warn( 'GrantType has no nature', it );
                        }
                    } else {
                        console.warn( 'unable to find a GrantType definition for', it );
                    }
                    return !hasOne;
                });
                if( !hasOne ){
                    valid = false;
                }
            }
            // refresh token must be associated to an authorization code
            if( valid && nature === 'refresh' ){
                valid &&= ( array.includes( 'authorization_code' ));
            }
            // stops as soon as we have found an error
            return valid === true;
        });
        //console.debug( 'selectables', selectables, 'array', array, 'valid', valid );
        return valid;
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
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {String} the nature of the grant type
     */
    nature( def ){
        return def.nature;
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {Array<String>} the expected response_types allowed in this authorization grant flow, defaulting to null
     */
    responseTypes( def ){
        return def.response_types || null;
    },

    /**
     * @summary Given the selected providers, and the grant types each of these providers manage, provider a list of selectable grant types ordered by grant nature
     * @param {Array<String>} providers the array of selected providers
     * @returns {Object} a hash of grant types per nature, as an object keyed per grant nature, where data is an object with following keys
     *  - def: the GrantNature definition
     *  - types: an object keyed by available grant types, where data is the GrantType definition
     */
    Selectables( providers ){
        const selectablePush = function( result, id ){
            const typeDef = GrantType.byId( id );
            if( typeDef ){
                const nature = GrantType.nature( typeDef );
                const natureDef = GrantNature.byId( nature );
                if( natureDef ){
                    if( !result[nature] ){
                        result[nature] = {
                            def: natureDef,
                            types: {}
                        };
                    }
                    if( !result[nature].types[id] ){
                        result[nature].types[id] = typeDef;
                    }
                } else {
                    console.warn( 'unknown grant nature', nature )
                }
            } else {
                console.warn( 'unknown grant type', id );
            }
        };
        //console.debug( 'providers', providers );
        // have the grant types per provider
        let hash = {};
        ( providers || [] ).forEach(( it ) => {
            const provider = Providers.byId( it );
            if( provider && provider instanceof IGrantType ){
                const grants = provider.grant_types();
                hash[it] = {
                    provider: provider,
                    grants: grants
                };
            }
        });
        //console.debug( 'hash', hash );
        // consolidate all possible grant types into a single list
        let result = {};
        Object.keys( hash ).forEach(( providerId ) => {
            hash[providerId].grants.forEach(( it ) => {
                // if an array, then one of the grant types must be provided by another provider: choose this one if it is not disabled
                if( _.isArray( it )){
                    let found = false;
                    it.every(( gt ) => {
                        if( GrantType.enabledById( gt )){
                            Object.keys( hash ).every(( pid ) => {
                                if( pid !== providerId ){
                                    if( hash[pid].grants.includes( gt )){
                                        selectablePush( result, gt );
                                        found = true;
                                    }
                                }
                                return !found;
                            });
                        }
                        return !found;
                    });
                } else {
                    if( GrantType.enabledById( it )){
                        selectablePush( result, it );
                    }
                }
            });
        });
        return result;
    },

    /**
     * @param {Object} def a GrantType definition as returned by GrantType.Knowns()
     * @returns {Boolean} whether this grant type makes use of redirection URIs, defaulting to false
     */
    useRedirects( def ){
        return def.haveRedirects === true;
    },

    /**
     * @param {Array<String>} grantTypes a list of grant types
     * @returns {Boolean} whether at least one grant type makes use of redirection URIs, defaulting to false
     */
    wantRedirects( grantTypes ){
        let wantRedirects = false;
        grantTypes.every(( it ) => {
            const def = GrantType.byId( it );
            if( def ){
                if( GrantType.useRedirects( def )){
                    wantRedirects = true;
                }
            }
            return !wantRedirects;
        });
        return wantRedirects;
    },
};
