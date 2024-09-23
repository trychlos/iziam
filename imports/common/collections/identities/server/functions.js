/*
 * /imports/common/collections/identities/server/functions.js
 */

import _ from 'lodash';

//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Identities } from '../index.js';

Identities.s = {
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
    upsert( item, groups=[], userId ){
        console.debug( 'Identities.s.upsert', item, groups );
        // save the DYN sub-object to restore it later, but not be written in dbms
        const DYN = item.DYN;
        delete item.DYN;
        Meteor.APP.Helpers.removeUnsetValues( item );
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
        const res = Identities.upsert({ _id: item._id }, { $set: item });
        // get the newly inserted id
        if( res.insertedId ){
            item._id = res.insertedId;
        }
        if( res.numberAffected ){
            Memberships.s.upsertByIdent( item.organization, item._id, groups, userId );
        }
        item.DYN = DYN;
        console.debug( 'Identities.upsert', res );
        return res;
    }
};
