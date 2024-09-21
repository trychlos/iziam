/*
 * /import/common/tables/client_secrets/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { ClientSecrets } from './index.js';

ClientSecrets.fn = {
    /**
     * @summary Generate the a secret and a hash for a keygrip
     * @param {Object<Keygrip>} item the current keygrip item
     * @returns {Object} a { secret, hash } object
     */
    async generateSecret( item ){
        return Meteor.isClient ? await Meteor.callAsync( 'client_generate_secret', item ) : await ClientSecrets.s.generateSecret( item );
    },

    /**
     * @summary Returns the secrets for the entity/record client
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the organization secret, at least an empty array
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        ClientSecrets.fn._list.dep.depend();
        return o.caller.record.secrets || [];
    },
    add( o, secret ){
        o.caller.record.secrets.push( secret );
        ClientSecrets.fn._selected_providers.dep.changed();
    },
    remove( o, secretId ){
        o.caller.record.secrets = o.caller.record.secrets.filter( it => it.id !== secretId );
        ClientSecrets.fn._list.dep.changed();
    }
};
