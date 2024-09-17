/*
 * /import/common/tables/keygrips/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import * as jose from 'jose';

import { Keygrips } from './index.js';

Keygrips.fn = {

    /**
     * @summary extract the keygrips secrets needed by the AuthServer
     * @param {Object} organization an { entity, record } organization object
     * @returns {Array<Secrets>}
     */
    authKeys( organization ){
        let result = [];
        ( organization.record.keygrips || [] ).forEach(( it ) => {
            ( it.keylist || [] ).forEach(( key ) => {
                result.push( key.secret );
            });
        });
        return result;
    },

    /**
     * @summary Returns the Keygrips set for the entity/record organization
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the organization Keygrips set, at least an empty array
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        Keygrips.fn._list.dep.depend();
        return o.caller.record.keygrips || [];
    },
    add( o, keygrip ){
        o.caller.record.keygrips.push( keygrip );
        Keygrips.fn._selected_providers.dep.changed();
    },
    remove( o, keygripId ){
        o.caller.record.keygrips = o.caller.record.keygrips.filter( it => it.id !== keygripId );
        Keygrips.fn._list.dep.changed();
    }
};
