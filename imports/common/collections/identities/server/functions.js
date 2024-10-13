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
    // organizationId: the organization identifier
    collection( organizationId ){
        const instanceName = Identities.instanceName( organizationId );
        const amInstance = instanceName ? AccountsHub.instances[instanceName] : null;
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got'+amInstance );
        }
        return amInstance ? amInstance.collection() : null;
    },

    // returns the queried items
    async getBy( organizationId, query ){
        const collection = Identities.s.collection( organizationId );
        let res = await collection.find( query ).fetchAsync();
        return res;
    },

    // returns {Promises} which eventually resolves to all identities for an organization
    //listAllAsync( organization ){
    //    return Identities.find({ organization: organization }).fetchAsync();
    //},

    // extend the AccountsManager tabular publish function
    // provide a tabular_name, preferred email and username
    // tabular_name: a tabular column to display a full name *without* modifying the record
    async tabularExtend( item ){
        item.tabular_name = item.name;
        if( !item.name ){
            item.tabular_name = Identities.fn.name( item );
        }
        const email = Identities.fn.emailPreferred( item );
        if( email ){
            item.preferredEmailAddress = email.address;
            item.preferredEmailVerified = email.verified;
        }
        const username = Identities.fn.usernamePreferred( item );
        if( username ){
            item.preferredUsername = email.username;
        }
        return true;
    },

    // try to find an identiy with a username or an email address
    tryWith( id ){
        let res = Identities.find({ $or: [{ 'emails.address': id }, { 'usernames.username': id }]}).fetch();
        return res;
    },

    // @returns {Object} the upsert result
    async upsert( item, args, userId ){
        //console.debug( 'Identities.s.upsert', item, args );
        const collection = Identities.s.collection( args.organization._id );
        let res = false;
        if( collection ){
            // save the DYN sub-object to restore it later, but not be written in dbms
            const DYN = item.DYN;
            delete item.DYN;
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
            AccountsManager.s.eventEmitter.emit( 'update', { amInstance: Identities.instanceName( args.organization._id ), item: item });
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
