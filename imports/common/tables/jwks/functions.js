/*
 * /import/common/tables/jwks/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Jwks } from './index.js';

Jwks.fn = {
    /**
     * @summary Returns the JWKS for the entity/record organization
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the organization JWKS, at least an empty array
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        Jwks.fn._list.dep.depend();
        return o.caller.record.jwks || [];
    },
    add( o, jwk ){
        o.caller.record.jwks.push( jwk );
        Jwks.fn._selected_providers.dep.changed();
    },
    remove( o, jwkId ){
        o.caller.record.jwks = o.caller.record.jwks.filter( it => it.id !== jwkId );
        Jwks.fn._list.dep.changed();
    }
};
