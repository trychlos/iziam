/*
 * /imports/common/interfaces/iident.iface.js
 *
 * Give an identify to a class (e.g. a provider).
 * The identity must be passed as an object to the constructor.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IIdent = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - iident: {
     *      > id: a machine identifier (mandatory)
     *      > label: an optional short human-readable label, defaulting to id
     *      > description: an optional description
     *      > origin: an optional short human-readable label of the origin
     *  }
     * @returns {IIdent}
     * @throws {Error} if id is not set
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.iident ){
            this.#priv = o.iident;
            if( !this.#priv.id ){
                throw new Error( 'identifier is not set' );
            }
        }

        return this;
    }

    /**
     * @returns {String} the description
     */
    identDescription(){
        return this.#priv.description;
    }

    /**
     * @returns {String} the identifier
     */
    identId(){
        return this.#priv.id;
    }

    /**
     * @returns {String} the label
     */
    identLabel(){
        return this.#priv.label || this.#priv.id;
    }

    /**
     * @returns {String} the origin
     */
    identOrigin(){
        return this.#priv.origin;
    }
});
