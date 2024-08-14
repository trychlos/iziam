/*
 * pwix:tenants-manager/src/client/components/organization_providers_pane/organization_providers_pane.js
 *
 * Display all the selected providers and their features.
 * Let the user select/unselect the items.
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Organizations } from '/imports/common/collections/organizations/index.js';
import { Providers } from '/imports/common/collections/providers/index.js';

import './organization_providers_pane.html';

Template.organization_providers_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        tabular: null
    };

    // get the data context and instanciate the organization tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        const record = entity.DYN.records[dataContext.index].get();
        self.APP.tabular = Providers.tabular({ entity: entity, record: record }, Organizations.fn.selectedProviders, false );
    });
});

Template.organization_providers_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.organization_providers_pane.events({
    // data context is { enabled, fieldDef, item }
    'click .tabular-checkbox input'( event, instance ){
        const checked = instance.$( event.currentTarget ).prop( 'checked' );
        const record = this.organization.record;
        record.selectedProviders = record.selectedProviders || [];
        if( checked ){
            record.selectedProviders.push( this.item.id );
        } else {
            record.selectedProviders = record.selectedProviders.filter( id => id !== this.item.id );
        }
        //console.debug( 'record.selectedProviders', record.selectedProviders );
    }
});
