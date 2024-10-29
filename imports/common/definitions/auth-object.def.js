/*
 * /imports/common/definitions/auth-object.def.js
 *
 * Whether the authorization item is about a resource or a client
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const AuthObject = {
   C: [
        {
            id: 'C',
            label: 'definitions.auth_object.client_label'
        },
        {
            id: 'R',
            label: 'definitions.auth_object.resource_label'
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @summary Let the Known() result be replaced depending of the allowed objects
     * @param {Array<String>} allowed the list of allowed auth object ids
     * @returns {Array<Object>} the list of corresponding definitions
     */
    allowedDefinitions( allowed ){
        let res = [];
        ( allowed || [] ).forEach(( it ) => {
            const def = AuthObject.byId( it );
            if( def ){
                res.push( def );
            }
        });
        if( !res.length ){
            res = AuthObject.Knowns();
        }
        return res;
    },

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
            console.warn( 'auth object type not found', id );
            AuthObject.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def the definition as returned by AuthObject.Knowns()
     * @returns {String} the identifier associated to this authorization type
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the supported authorization types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def the definition as returned by AuthObject.Knowns()
     * @returns {String} the label associated to this authorization type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
