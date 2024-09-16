/*
 * /import/common/tables/keygrip_secrets/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import * as jose from 'jose';
import { createHash, randomBytes } from 'crypto';

import { KeygripSecrets } from './index.js';

KeygripSecrets.fn = {
    /**
     * @summary Generate the a secret and a hash for a keygrip
     * @param {Object<Keygrip>} item the current keygrip item
     * @returns {Object} a { secret, hash } object
     */
    generateSecret( item ){
        const secret = randomBytes( item.size ).toString( 'base64' );
        const hash = createHash( item.alg ).update( secret ).digest( item.encoding );
        //console.debug( 'returning', secret, hash );
        return {
            secret: secret,
            hash: hash
        };
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
        o.caller.keylist = o.caller.keylist.filter( it => it.id !== keyId );
        KeygripSecrets.fn._list.dep.changed();
    }
};
