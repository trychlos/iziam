/*
 * /imports/common/collections/identities/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';

import { Groups } from '/imports/common/collections/groups/index.js';

import { Identities } from '../index.js';

Identities.s = {

    // extend the AccountsManager All publication
    async allExtend( item, userId ){
        item.DYN.memberOf = await Identities.s.memberOf( item, userId );
    },

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
    async getBy( organizationId, query, userId ){
        const instanceName = Identities.instanceName( organizationId );
        return await AccountsManager.s.getBy( instanceName, query, userId );
    },

    // returns the full list of groups this identity is member of
    // if set, an identity is necessarily inside of a group
    //  maybe this group is itself inside of another group and so on
    async memberOf( item, userId ){
        let list = {};
        const parentsFn = async function( parentId ){
            if( parentId ){
                list[parentId] = true;
                console.debug( 'pushing', item._id, parentId );
                const written = await Groups.s.getBy({ type: 'G', _id: parentId }, userId );
                for( const it of written ){
                    await parentsFn( it.parent );
                };
            }
            return true;
        };
        const written = await Groups.s.getBy({ type: 'I', _id: item._id }, userId );
        for( const it of written ){
            await parentsFn( it.parent );
        };
        return Object.keys( list );
    },

    // extend the AccountsManager tabular publish function
    // provide a tabular_name, preferred email and username
    // tabular_name: a tabular column to display a full name *without* modifying the record
    async tabularExtend( item, userId ){
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
