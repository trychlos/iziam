/*
 * /imports/client/components/operational_panel/operational_panel.js
 *
 * A panel which displays the result of the organization/client operatonal checks.
 * 
 * Parms:
 * - organization: an { entity, record } object if the entity is a client
 * - entity: the currently edited organization/client identifier
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './operational_panel.html';

Template.operational_panel.onCreated( function(){
    const self = this;

    self.APP = {
        entity: new ReactiveVar( null ),
    };

    // get the entity
    self.autorun(() => {
        const entity = Template.currentData().entity;
        const organization = Template.currentData().organization;
        if( organization ){
            // handle the client case
        } else {
            const org = Meteor.APP.Organizations.byEntity( entity );
            if( org ){
                self.APP.entity.set( org );
            }
        }
    });
});

Template.operational_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the class to be attached to the message
    itClass( it ){
        return it.iTypedMessageLevel();
    },

    // the message label
    itLabel( it ){
        return it.iTypedMessageMessage();
    },

    // the list of message
    itemsList(){
        const entity = Template.instance().APP.entity.get();
        //console.debug( 'entity', entity );
        //console.debug( entity && entity.operational ? entity.operational.results || [] : null );
        return entity && entity.DYN && entity.DYN.operational ? entity.DYN.operational.results || [] : null;
    }
});
