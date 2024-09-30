/*
 * /imports/common/definitions/how-count.def.js
 *
 * Whether we want exactly / at least or at most something
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const HowCount = {
    // the available response types
    C: [
        {
            id: 'exactly',
            label: 'definitions.how_count.exactly_label'
        },
        {
            id: 'least',
            label: 'definitions.how_count.least_label'
        },
        {
            id: 'most',
            label: 'definitions.how_count.most_label'
        }
    ],

    /**
     * @param {String} id a HowCount identifier
     * @returns {Object} the corresponding HowCount definition
     */
    byId( id ){
        let found = null;
        this.C.every(( o ) => {
            if( o.id === id ){
                found = o;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Object} def the definition as returned by HowCount.Knowns()
     * @returns {String} the identifier associated to this HowCount
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the supported HowCount's
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def the definition as returned by HowCount.Knowns()
     * @returns {String} the label associated to this HowCount
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
