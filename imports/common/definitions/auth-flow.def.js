/*
 * /imports/common/definitions/auth-flow.def.js
 * 
 * We consider there is a one-to-one relation between the defined Authorization Grant Flows and the below grant types with an 'access' nature.
 * But this definition let us separate the relative labels.
 * 
 * Use cases:
 * - client tabular display: get a authorization flow (short) label from the list of the grant types chosen by the client.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

export const AuthFlow = {
    C: [
        {
            id: 'authorization_code',
            label: 'definitions.auth_flow.auth_label'
        },
        {
            id: 'client_credentials',
            label: 'definitions.auth_flow.client_label'
        },
        {
            id: 'hybrid',
            label: 'definitions.auth_flow.hybrid_label'
        },
        {
            id: 'implicit',
            label: 'definitions.auth_flow.implicit_label'
        },
        {
            id: 'password',
            label: 'definitions.auth_flow.password_label'
        },
        {
            id: 'device_code',
            label: 'definitions.auth_flow.device_label'
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
        if( !found && !AuthFlow.warnedById[id] ){
            console.warn( 'grant type not found', id );
            AuthFlow.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def a AuthFlow definition as returned by AuthFlow.Knowns()
     * @returns {String} the description to be attached to the grant type
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def a AuthFlow definition as returned by AuthFlow.Knowns()
     * @returns {String} the grant type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of known grant types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a AuthFlow definition as returned by AuthFlow.Knowns()
     * @returns {String} the label to be attached to the grant type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {Array<GrantType} array a list of grant types
     * @returns {String} the label attached to auth flow of the access grant type (if any), or null
     */
    labelFromGrantTypes( array ){
        let label = null;
        let found = false;
        array.every(( it ) => {
            const grantDef = GrantType.byId( it );
            if( grantDef ){
                const nature = GrantType.nature( grantDef );
                if( nature === 'access' ){
                    found = true;
                    const auth = GrantType.authFlow( grantDef );
                    if( auth ){
                        const authDef = AuthFlow.byId( auth );
                        if( authDef ){
                            label = AuthFlow.label( authDef );
                        }
                    }
                }
            }
            return !found;
        });
        return label;
    }
};
