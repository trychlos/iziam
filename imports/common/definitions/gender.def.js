/*
 * /imports/common/definitions/gender.def.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const Gender = {
    C: [
        {
            id: 'NO',
            label: 'definitions.gender.none_label'
        },
        {
            id: 'MA',
            label: 'definitions.gender.male_label'
        },
        {
            id: 'FE',
            label: 'definitions.gender.female_label'
        },
        {
            id: 'OT',
            label: 'definitions.gender.other_label'
        },
    ],

    /**
     * @param {String} id a gender identifier
     * @returns {Object} the gender definition, or null
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
     * @param {Object} def a Gender definition as returned by Gender.Knowns()
     * @returns {String} the gender identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of known genders
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a Gender definition as returned by Gender.Knowns()
     * @returns {String} the label to be attached to the client type
     *  same than short at the moment
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
