/*
 * /imports/common/definitions/grant-nature.def.js
 *
 * This qualifies the GrantNature:
 * - either as an access token 
 * - or a refresh token
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const GrantNature = {
    C: [
        {
            // oauth authorization grant token
            id: 'access',
            label: 'definitions.grant_nature.access_label',
            mandatory: true,
            ui: 'radio'
        },
        {
            // oauth refresh token
            id: 'refresh',
            label: 'definitions.grant_nature.refresh_label',
            ui: 'checkbox'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {String} id a grant nature identifier
     * @returns {Object} the grant nature definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !GrantNature.warnedById[id] ){
            console.warn( 'grant nature not found', id );
            GrantNature.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def a GrantNature definition as returned by GrantNature.Knowns()
     * @returns {String} the grant nature identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @param {Object} def a GrantNature definition as returned by GrantNature.Knowns()
     * @returns {Boolean} whether this grant nature is mandatory (must be set)
     */
    isMandatory( def ){
        return def.mandatory === true;
    },

    /**
     * @returns {Array} the list of known grant types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a GrantNature definition as returned by GrantNature.Knowns()
     * @returns {String} the label to be attached to the grant nature
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    },

    /**
     * @param {Object} def a GrantNature definition as returned by GrantNature.Knowns()
     * @returns {String} the UI input type to be used
     */
    uiType( def ){
        return def.ui;
    }
};
