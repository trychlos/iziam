/*
 * /import/common/tables/client_secrets/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';

import { ClientSecrets } from './index.js';

ClientSecrets.fn = {
    /**
     * @summary Generate a client secret
     * @param {Object<Secret>} item the current secret item
     * @param {String} userId the user identifier (server-side only)
     * @returns {Object} a { hex } object
     */
    async generateSecret( item, userId ){
        return Meteor.isClient ? await Meteor.callAsync( 'client_generate_secret', item ) : await ClientSecrets.s.generateSecret( item, userId );
    },

    /**
     * @summary Find the first secret which applies at date
     * @param {Array<Secrets>} array the secrets array
     * @returns {Object<Secret>} the found secret, or null
     */
    atDate( array ){
        let found = null;
        const now = new Date();
        for( let i=0 ; i<array.length ; ++i ){
            const secret = array[i];
            if( DateJs.compare( secret.startingAt, now ) <= 0 && DateJs.compare( secret.endingAt, now, { start: false }) >= 0 ){
                found = secret;
                break;
            }
        }
        return found;
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
        o.caller.record.secrets = o.caller.record.secrets.filter( it => it._id !== secretId );
        ClientSecrets.fn._list.dep.changed();
    }
};
