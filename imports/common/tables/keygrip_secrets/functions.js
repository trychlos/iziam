/*
 * /import/common/tables/keygrip_secrets/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { KeygripSecrets } from './index.js';

KeygripSecrets.fn = {
    /**
     * @summary Generate the a secret and a hash for a keygrip
     * @param {Object<Keygrip>} item the current keygrip item
     * @param {Object} key the current key to be updated
     * @returns {Object} a { secret, hash } object
     */
    async generateSecret( item, key ){
        return Meteor.isClient ? await Meteor.callAsync( 'keygrip_generate_secret', item, key ) : await KeygripSecrets.s.generateSecret( item, key );
    },

    /**
     * @summary Returns the Keygrip list for the entity/record organization
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an keygrip item
     * @returns {Object} the keygrip keylist, at least an empty array
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        KeygripSecrets.fn._list.dep.depend();
        return o.caller.keylist || [];
    },
    add( o, key ){
        o.caller.keylist.push( key );
        KeygripSecrets.fn._selected_providers.dep.changed();
    },
    remove( o, keyId ){
        o.caller.keylist = o.caller.keylist.filter( it => it._id !== keyId );
        KeygripSecrets.fn._list.dep.changed();
    }
};
