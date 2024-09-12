/*
 * /imports/common/definitions/token-extension.def.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantNature } from '/imports/common/definitions/grant-nature.def.js';

import { ITokenExtension } from '/imports/common/interfaces/itokenextension.iface.js';

import { Providers } from '/imports/common/tables/providers/index.js';

export const TokenExtension = {
    C: [
        {
            // The JWT Bearer Token Grant Type defined in OAuth JWT Bearer Token Profiles [RFC7523]
            //  using JWT as Authorization Grants
            id: 'urn:ietf:params:oauth:token-extension:jwt-bearer',
            label: 'definitions.token_extension.jwt_bearer_label',
            description: 'definitions.token_extension.jwt_bearer_description',
            image: '/images/token-extension.svg'
        },
        {
            // JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens [RFC9068]
            id: 'jwt_profile',
            label: 'definitions.token_extension.jwt_profile_label',
            description: 'definitions.token_extension.jwt_profile_description',
            image: '/images/token-extension.svg'
        },
        /*
        {
            // The SAML 2.0 Bearer Assertion Grant defined in OAuth SAML 2 Bearer Token Profiles [RFC7522] - not implemented
            id: 'urn:ietf:params:oauth:token-extension:saml2-bearer',
            label: 'definitions.token_extension.saml_label'
        }*/
       {
            id: 'pkce',
            label: 'definitions.token_extension.pkce_label',
            description: 'definitions.token_extension.pkce_description',
            image: '/images/token-extension.svg'
       }
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
     * @param {Object} def a TokenExtension definition as returned by TokenExtension.Knowns()
     * @returns {String} the description to be attached to the grant type
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def a TokenExtension definition as returned by TokenExtension.Knowns()
     * @returns {String} the grant type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @param {Object} def a TokenExtension definition as returned by TokenExtension.Knowns()
     * @returns {String} the URL of an image attached to the grant type
     */
    image( def ){
        return def.image;
    },

    /**
     * @param {Object} selectables an object which describe the selectable grant types:
     *  - keyed whith grant nature id
     *  - value being an object with
     *    > def: the GrantNature definition
     *    > types: an object keyed by available grant types, where data is the TokenExtension definition
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
                    const def = TokenExtension.byId( it );
                    if( def ){
                        const grantNature = TokenExtension.nature( def );
                        if( grantNature ){
                            if( grantNature === nature ){
                                hasOne = true;
                            }
                        } else {
                            console.warn( 'TokenExtension has no nature', it );
                        }
                    } else {
                        console.warn( 'unable to find a TokenExtension definition for', it );
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
        return res.length ? res.join( ', ' ) : pwixI18n.label( I18N, 'definitions.token_extension.none' );
    },

    /**
     * @returns {Array} the list of known grant types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a TokenExtension definition as returned by TokenExtension.Knowns()
     * @returns {String} the label to be attached to the grant type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {Array<String>} providers the array of selected providers
     * @returns {Array<Object>} the list of managed token extensions definitions
     */
    Selectables( providers ){
        let result = [];
        ( providers || [] ).forEach(( pId ) => {
            const provider = Providers.byId( pId );
            if( provider && provider instanceof ITokenExtension ){
                const extensions = provider.token_extensions();
                extensions.forEach(( extId ) => {
                    const def = TokenExtension.byId( extId );
                    if( def ){
                        result.push( def );
                    }
                });
            }
        });
        return result;
    }
};
