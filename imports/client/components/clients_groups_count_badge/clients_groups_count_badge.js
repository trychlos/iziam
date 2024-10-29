/*
 * /imports/client/components/clients_groups_count_badge/clients_groups_count_badge.js
 *
 * A small badge attached to the 'Clients Groups' nav which displays the groups count.
 * 
 * Data context:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - item: a ReactiveVar which contains the Organization entity with its DYN sub-object
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './clients_groups_count_badge.html';

Template.clients_groups_count_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the count
    count(){
        const saved = TenantsManager.list.byEntity( this.item.get()._id );
        //console.debug( 'saved', saved, saved.DYN.clientsGroupsCount );
        return saved ? saved.DYN.clientsGroupsCount : '(?)';
    }
});