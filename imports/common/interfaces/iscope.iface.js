/*
 * /imports/common/interfaces/iscope.iface.js
 *
 * Let a provider define a scope.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IScope = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - iscope: an array of the managed scopes as Scope objects
     * @returns {IScope}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.iscope ){
            this.#priv = {
                iscope: o.iscope
            };
        }

        return this;
    }

    /**
     * @returns {Array<Scope>} the list of the managed scopes
     */
    scopes(){
        return this.#priv?.iscope || [];
    }
});
