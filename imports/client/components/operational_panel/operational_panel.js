/*
 * /imports/client/components/operational_panel/operational_panel.js
 *
 * A panel which displays the result of the organization/client operatonal checks.
 * 
 * Parms:
 * - organization: an { entity, record } object if the entity is a client
 * - entityId: the currently edited organization/client identifier
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { TM } from 'meteor/pwix:typed-message';

import './operational_panel.html';

Template.operational_panel.onCreated( function(){
    const self = this;

    self.APP = {
        entity: new ReactiveVar( null ),
    };

    // get the entity
    self.autorun(() => {
        const entityId = Template.currentData().entityId;
        const organization = Template.currentData().organization;
        if( organization ){
            const org = TenantsManager.list.byEntity( organization.entity._id );
            if( org ){
                const entity = org.DYN.clients.byId( entityId );
                self.APP.entity.set( entity );
            }
        } else {
            const org = TenantsManager.list.byEntity( entityId );
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
        return entity && entity.DYN && entity.DYN.operational ? entity.DYN.operational.results || [] : null;
    }
});
