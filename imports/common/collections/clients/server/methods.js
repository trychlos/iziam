/*
 * /imports/collections/clients/server/methods.js
 */

import { Clients } from '../index.js';

Meteor.methods({

    // empty the collection before importing
    'client.empty'(){
        return Clients.remove({});
    },

    // list clients allowed to a user
    'client.getAllowed'( userId ){
        let ret = [];
        Meteor.roleAssignment.find( Clients.query.allowedByUser( userId )).fetch().every(( role ) => {
            Clients.find({ entity: role.scope }).fetch().every(( org ) => {
                ret.push( org );
                return true;
            });
            return true;
        });
        return ret;
    },

    // retrieve all queried records for the client
    //  always returns an array, may be empty
    'client.getBy'( query ){
        return Clients.s.getBy( query );
    },

    // import an element from a JSON file
    'client.import'( elt ){
        return Clients.insert( elt );
    },

    // delete an item from the database
    'client.removeByEntity'( id ){
        let res = Clients.remove({ entity: id });
        console.log( 'entClient.removeByEntity', res );
        return res;
    },

    // update the selected providers
    'client.updateProviders'( item ){
        return Clients.s.updateProviders( item, this.userId );
    },

    // update the published scopes
    'client.updateScopes'( item ){
        return Clients.s.updateScopes( item, this.userId );
    },

    // update an client record
    //  the set object is to be built based on the passed FormChecker fields
    'client.updateByFields'( item, fields ){
        return Clients.s.updateByFields( item, fields, this.userId );
    },

    // insert/update an client in the database
    //  itemsArray here is an array of item records
    'client.upsert'( itemsArray ){
        return Clients.s.upsert( itemsArray, this.userId );
    }
});
