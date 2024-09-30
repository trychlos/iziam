/*
 * /imports/client/components/organization_operational_badge/organization_operational_badge.js
 *
 * This component is used to display the operational status of the organization in the tabular display.
 * 
 * Data context:
 * - item: the item as provided to the tabular display (i.e. a modified closest record)
 *      with DYN { analyze, entity, records }
 * - table: the Tabular.Table instance
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './organization_operational_badge.html';

Template.organization_operational_badge.onCreated( function(){
    const self = this;

    self.APP = {
        classes: new ReactiveVar( '' ),
    };
});

Template.organization_operational_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the status
    parmsStatus(){
        //console.debug( this );
        if( !this.item.entity ){
            console.warn( this );
        }
        return {
            statusRv: Meteor.APP.Organizations.byId( this.item.entity ).DYN.operational?.status,
            classes: Template.instance().APP.classes,
            title: pwixI18n.label( I18N, 'organizations.tabular.operational_title' )
        };
    }
});
