/*
 * /imports/client/components/client_operational_badge/client_operational_badge.js
 *
 * This component is used to display the operational status of the client in the tabular display.
 * 
 * Data context:
 * - item: the item as provided to the tabular display (i.e. a modified closest record)
 *      with DYN { analyze, entity, records }
 * - table: the Tabular.Table instance
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './client_operational_badge.html';

Template.client_operational_badge.onCreated( function(){
    const self = this;

    self.APP = {
        status: new ReactiveVar( Forms.FieldStatus.C.UNCOMPLETE )
    };

    // update the status when something changes
    self.autorun(() => {
        //console.debug( 'currentData', Template.currentData());
    });
});

Template.client_operational_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the status
    parmsStatus(){
        const organization = Meteor.APP.Organizations.byId( this.item.DYN.entity.organization );
        const clientId = this.item.DYN.entity._id;
        //console.debug( 'organization', organization );
        //console.debug( 'this', this );
        //console.debug( 'organization.DYN.clients?.byId( this.item.entity._id )', organization.DYN.clients?.byId( this.item.entity._id ));
        const rv = organization && clientId ? organization.DYN.clients?.byId( clientId )?.DYN.operational?.status : null;
        return {
            statusRv: rv,
            title: pwixI18n.label( I18N, 'clients.tabular.operational_title' )
        };
    }
});
