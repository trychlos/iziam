/*
 * /imports/client/components/identities_count_badge/identities_count_badge.js
 *
 * A small badge attached to the 'Identities' nav which displays the identities count.
 * 
 * Data context:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - item: a ReactiveVar which contains the Organization entity with its DYN sub-object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './identities_count_badge.html';

Template.identities_count_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the count
    count(){
        const saved = TenantsManager.list.byEntity( this.item.get()._id );
        //console.debug( 'saved', saved, saved.DYN.identitiesCount );
        return saved ? saved.DYN.identitiesCount : '(?)';
    }
});
