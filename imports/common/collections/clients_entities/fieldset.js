/*
 * /imports/common/collections/clients_entities/fieldset.js
 *
 * The clients registered with an organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Field } from 'meteor/pwix:field';
import { Forms } from 'meteor/pwix:forms';
import { Notes } from 'meteor/pwix:notes';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { ClientsEntities } from './index.js';

const _defaultFieldDef = function(){
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
            form_type: Forms.FieldType.C.NONE
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
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    ClientsEntities.fieldSet.set( fieldset );
});
