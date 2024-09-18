/*
 * /imports/collections/clients_entities/fieldset.js
 *
 * The clients registered with an organization.
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { ClientsEntities } from './index.js';

const _defaultFieldSet = function(){
    let columns = [
        // the organization entity
        // mandatory
        {
            name: 'organization',
            type: String
        },
        // the client identifier
        // mandatory
        {
            name: 'clientId',
            type: String,
            form_check: ClientsEntities.checks.clientId,
        },
        // common notes
        Notes.fieldDef(),
        // timestampable behaviour
        Timestampable.fieldDef(),
        // validity fieldset,
        Validity.entitiesFieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldSet();
    let fieldset = new Field.Set( columns );
    ClientsEntities.fieldSet.set( fieldset );
});
