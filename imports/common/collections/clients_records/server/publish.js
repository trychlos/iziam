/*
 * /imports/common/collections/clients_records/server/publish.js
 */

import { ClientsRecords } from '../index.js';

// returns the list of known clients for a given organization (of for all organizations if unset)
Meteor.publish( 'clients.listAll', function( organization ){
    const query = organization ? { organization: organization } : {};
    const self = this;
    const collection_name = 'clients';

    // find ORG_SCOPED_MANAGER roles
    const f_transform = function( item ){
        item.DYN = {
        };
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = Clients.find( query ).observe({
        added: function( item ){
            self.added( collection_name, item._id, f_transform( item ));
        },
        changed: function( newItem, oldItem ){
            self.changed( collection_name, newItem._id, f_transform( newItem ));
        },
        removed: function( oldItem ){
            self.removed( collection_name, oldItem._id, oldItem );
        }
    });

    self.onStop( function(){
        observer.stop();
    });

    self.ready();
});
