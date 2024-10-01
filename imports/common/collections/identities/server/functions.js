/*
 * /imports/common/collections/identities/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';

//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Identities } from '../index.js';

Identities.s = {
    // return the collection for the identities of the organization
    // organization: the full organization entity object, with its DYN sub-object
    collection( organization ){
        const instanceName = Identities.instanceName( organization._id );
        const amInstance = instanceName ? AccountsHub.instances[instanceName] : null;
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got'+amInstance );
        }
        return amInstance ? amInstance.collection() : null;
    },

    // returns the queried items
    getBy( query ){
        let res = Identities.find( query ).fetch();
        return res;
    },

    // returns {Promises} which eventually resolves to all identities for an organization
    listAllAsync( organization ){
        return Identities.find({ organization: organization }).fetchAsync();
    },

    // delete an identity
    removeById( id, userId ){
        let res = Identities.remove({ _id: id });
        Memberships.s.removeByIdentity( id );
        return res;
    },

    // try to find an identiy with a username of an email address
    tryWith( id ){
        let res = Identities.find({ $or: [{ 'emails.address': id }, { 'usernames.username': id }]}).fetch();
        return res;
    },

    // @returns {Object} the upsert result
    async upsert( item, args, userId ){
        //console.debug( 'Identities.s.upsert', item, args );
        const collection = Identities.s.collection( args.organization );
        let res = false;
        if( collection ){
            // save the DYN sub-object to restore it later, but not be written in dbms
            const DYN = item.DYN;
            delete item.DYN;
            //Meteor.APP.Helpers.removeUnsetValues( item );
            // do not write rows without value, nor empty arrays
            if( !item.addresses?.length ){
                delete item.addresses;
            }
            if( !item.emails?.length ){
                delete item.emails;
            }
            if( !item.phones?.length ){
                delete item.phones;
            }
            if( !item.usernames?.length ){
                delete item.usernames;
            }
            res = await collection.upsertAsync({ _id: item._id }, { $set: item });
            // get the newly inserted id
            if( res.insertedId ){
                item._id = res.insertedId;
            }
            //if( res.numberAffected ){
            //    Memberships.s.upsertByIdent( item.organization, item._id, groups, userId );
            //}
            item.DYN = DYN;
        }
        console.debug( 'Identities.s.upsert', res );
        return res;
    }
};
