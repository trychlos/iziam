/*
 * /imports/common/interfaces/isearchable-label.iface.js
 *
 * Some registrars are searchable by label because at least one of their label is unique.
 * They may implement this interface to make the code clearer.
 * 
 * Notably authorization subjects (clients groups and identities groups) and objects (clients and resources) are searchable by their label.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const ISearchableLabel = DeclareMixin(( superclass ) => class extends superclass {

    // private data

    /**
     * @returns {ISearchableLabel}
     */
    constructor(){
        super( ...arguments );
        return this;
    }

    /**
     * Getter
     * @param {String} label the object label
     * @returns {Object} the found object, or null
     *  A reactive data source
     */
    byLabel( label ){
        let found = null;
        this.get().every(( it ) => {
            if( this.label( it ) === label ){
                found = it;
            }
            return !found;
        });
        return found;
    }

    /**
     * @param {String} str the group label or the group id
     * @returns {Object} the found group, with its DYN object, or null
     */
    byLabelOrId( str ){
        return this.byId( str ) || this.byLabel( str );
    }
});
