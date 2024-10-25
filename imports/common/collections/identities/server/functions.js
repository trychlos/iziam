/*
 * /imports/common/collections/identities/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import crypto from 'crypto';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';

import { Groups } from '/imports/common/collections/groups/index.js';

import { IdentityAuthPasswordProvider } from '/imports/common/providers/identity-auth-password-provider.class.js';

import { Identities } from '../index.js';

Identities.s = {

    // extend the AccountsManager All publication
    async allExtend( instanceName, item, userId ){
        item.DYN.memberOf = await Identities.s.memberOf( Identities.scope( instanceName ), item, userId );
        item.DYN.label = await Identities.fn.bestLabel( item );
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

    // from an OAuth identity server, get an identity by its id, whatever means an 'id'
    // organization is an { entity, record } object
    // id is an email or a username ?
    // returns either a unique identity, or null
    async findById( organization, id ){
        let res = [];
        // try with the internal immutable identifier
        res = res.concat( await Identities.s.getBy( organization.entity._id, { _id: id }));
        // try with email addresses if allowed to
        if( organization.record.identitiesEmailAddressesIdentifier === true ){
            res = res.concat( await Identities.s.getBy( organization.entity._id, { 'emails.address': id }));
        }
        // try with usernames if allowed to
        if( organization.record.identitiesUsernamesIdentifier === true ){
            res = res.concat( await Identities.s.getBy( organization.entity._id, { 'usernames.username': id }));
        }
        return res.length === 1 ? res[0] : null;
    },

    // returns the queried items
    async getBy( organizationId, query, userId ){
        const instanceName = Identities.instanceName( organizationId );
        return await AccountsManager.s.getBy( instanceName, query, userId );
    },

    // returns the full list of groups this identity is member of
    // if set, an identity is necessarily inside of a group
    //  maybe this group is itself inside of another group and so on
    // returns an object { all: [], direct: [] }
    async memberOf( organizationId, item, userId ){
        let all = {};
        let direct = {};
        const parentsFn = async function( parentId, hash ){
            if( parentId ){
                hash[parentId] = true;
                all[parentId] = true;
                const written = await Groups.s.getBy( organizationId, { type: 'G', _id: parentId }, userId );
                for( const it of written ){
                    await parentsFn( it.parent, all );
                };
            }
        };
        const written = await Groups.s.getBy( organizationId, { type: 'I', identity: item._id }, userId );
        for( const it of written ){
            await parentsFn( it.parent, direct );
        };
        return { all: Object.keys( all ), direct: Object.keys( direct )};
    },

    // extend the AccountsManager tabular publish function
    // provide a tabular_name, preferred email and username
    // tabular_name: a tabular column to display a full name *without* modifying the record
    async tabularExtend( instanceName, item, userId ){
        item.tabular_name = await Identities.fn.bestLabel( item );
        const email = Identities.fn.emailPreferred( item );
        if( email ){
            item.preferredEmailAddress = email.address;
            item.preferredEmailVerified = email.verified;
        }
        const username = Identities.fn.usernamePreferred( item );
        if( username ){
            item.preferredUsername = username.username;
        }
        return true;
    },

    // try to find an identiy with a username or an email address
    tryWith( id ){
        let res = Identities.find({ $or: [{ 'emails.address': id }, { 'usernames.username': id }]}).fetch();
        return res;
    },

    // Identity update
    // this is an event handler after AccountsManager has already updated the accounts collection
    // args: an object with following keys:
    // - amInstance: the instance name
    // - item
    async onUpdate( args ){
        const amInstance = args.amInstance ? AccountsHub.instances[args.amInstance  ] : null;
        let res = false;
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got'+amInstance );
            const organizationId = Identities.scope( args.amInstance );
            res = await Groups.s.updateMemberships( organizationId, args.item._id, args.item.DYN.memberOf, args.userId );
        }
        console.debug( 'Identities.s.onUpdate', res );
        return res;
    },

    // @returns {Object} the upsert result
    // this is called both on create and update
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
            // manage the password - preserving the UI sub-object
            // note that this should depend of the selected providers and the identities configuration of the organization
            let UI = null;
            if( item.password ){
                UI = item.password.UI || null;
                delete item.password.UI;
                if( UI.clear1 ){
                    const salt = crypto.randomBytes( Meteor.APP.C.identitySaltSize );
                    const p = IdentityAuthPasswordProvider.parms();
                    const hashedPassword = crypto.pbkdf2Sync( UI.clear1, salt, p.iterations, p.keylen, p.digest );
                    item.password.hashed = hashedPassword.toString( 'hex' );
                    item.password.salt = salt.toString( 'hex' );
                }
            }
            console.debug( 'item', item );
            res = await collection.upsertAsync({ _id: item._id }, { $set: item });
            await Groups.s.updateMemberships( args.organization._id, item._id, DYN.memberOf, userId );
            // get the newly inserted id
            if( res.insertedId ){
                item._id = res.insertedId;
            }
            //if( res.numberAffected ){
            //    Memberships.s.upsertByIdent( item.organization, item._id, groups, userId );
            //}
            item.DYN = DYN;
            if( UI ){
                item.password.UI = UI;
            }
        }
        console.debug( 'Identities.s.upsert', res );
        return res;
    }
};

AccountsManager.s.eventEmitter.on( 'update', Identities.s.onUpdate );
