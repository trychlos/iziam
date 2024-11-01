/*
 * /imports/common/definitions/auth-subject.def.js
 *
 * Whether the authorization item is about a resource or a client
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

export const AuthSubject = {
   C: [
        {
            id: 'C',
            label: 'definitions.auth_subject.clients_label',
            allowedObjects: [
                'R'
            ]
        },
        {
            id: 'I',
            label: 'definitions.auth_subject.identities_label',
            allowedObjects: [
                'C',
                'R'
            ]
        }
    ],

    // only warn once when byId() doesn't find the item
    warnedById: {},

    /**
     * @param {Object} def the definition as returned by AuthSubject.Knowns()
     * @returns {Array<String>} the array of allowed object identifiers
     */
    allowedObjects( def ){
        return def.allowedObjects || [];
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
            console.warn( 'auth subject type not found', id );
            AuthSubject.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def the definition as returned by AuthSubject.Knowns()
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
     * @param {Object} def the definition as returned by AuthSubject.Knowns()
     * @returns {String} the label associated to this authorization type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
