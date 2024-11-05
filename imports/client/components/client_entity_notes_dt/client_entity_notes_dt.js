/*
 * pwix:tenants-manager/src/client/components/client_entity_notes_dt/client_entity_notes_dt.js
 *
 * This template is used to display the notes indicator of the client entity.
 * 
 * Data context:
 * - item: the tabular item, i.e. a modified closest record with an 'entity_notes' fake field provided by the tabular publication
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';

import './client_entity_notes_dt.html';

Template.client_entity_notes_dt.onCreated( function(){
    const self = this;

    self.APP = {
        entity: new ReactiveVar( null )
    };

    // get the entity
    self.autorun(() => {
        const item = Template.currentData().item;
        if( item ){
            Meteor.callAsync( 'clients_entities_getBy', item.organization, { _id: item.entity }).then(( res ) => { res.length && self.APP.entity.set( res[0] ); });
        }
    });
});

Template.client_entity_notes_dt.helpers({
    // the tenant entity notes indicator
    parmsNotes(){
        return {
            item: Template.instance().APP.entity.get(),
            field: ClientsEntities.fieldSet.get().byName( 'notes' )
        };
    }
});
