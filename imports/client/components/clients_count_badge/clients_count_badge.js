/*
 * /imports/client/components/clients_count_badge/clients_count_badge.js
 *
 * A small badge attached to the 'Clients' nav which displays the clients count.
 * 
 * Data context:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - item: a ReactiveVar which contains the Organization entity with its DYN sub-object
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './clients_count_badge.html';

Template.clients_count_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the count
    count(){
        return this.item.get().DYN.clientsCount;
    }
});
