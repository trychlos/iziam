/*
 * /imports/common/definitions/group-type.def.js
 *
 * Whether the group item is a group or an identity.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const GroupType = {
   C: [
        {
            id: 'G',
            label: 'definitions.group_type.group_label',
            icon: 'type-group fa-solid fa-people-group'
        },
        {
            id: 'I',
            label: 'definitions.group_type.identity_label',
            icon: 'type-identity fa-solid fa-user'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {String} id a group type identifier
     * @returns {Object} the corresponding group type definition
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
            console.warn( 'group type not found', id );
            GroupType.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def the definition as returned by GroupType.Knowns()
     * @returns {String} the icon name associated to this group type
     */
    icon( def ){
        return def.icon;
    },

    /**
     * @param {Object} def the definition as returned by GroupType.Knowns()
     * @returns {String} the identifier associated to this group type
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the supported group types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def the definition as returned by GroupType.Knowns()
     * @returns {String} the label associated to this group type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
