/*
 * /imports/client/components/resources_count_badge/resources_count_badge.js
 *
 * A small badge attached to the 'Clients' nav which displays the resources count.
 * 
 * Data context:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - item: a ReactiveVar which contains the Organization entity with its DYN sub-object
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './resources_count_badge.html';

Template.resources_count_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the count
    count(){
        const saved = TenantsManager.list.byEntity( this.item.get()._id );
        return saved ? saved.DYN.resourcesCount : '(?)';
    }
});