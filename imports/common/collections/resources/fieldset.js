/*
 * /imports/common/collections/resources/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Timestampable } from 'meteor/pwix:collection-timestampable';
import { Tracker } from 'meteor/tracker';

import { Resources } from './index.js';

const _defaultFieldDef = function(){
    let columns = [
        // the organization entity
        {
            name: 'organization',
            type: String
        },
        // an optional label
        {
            name: 'label',
            type: String,
            optional: true,
            form_check: Resources.checks.label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the resource name
        //  must be unique
        //  should be considered immutable
        {
            name: 'name',
            type: String,
            form_check: Resources.checks.name,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // start and end of resource validity
        {
            name: 'startingAt',
            type: Date,
            optional: true,
            form_check: Resources.checks.startingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'endingAt',
            type: Date,
            optional: true,
            form_check: Resources.checks.endingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        Notes.fieldDef(),
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    Resources.fieldSet.set( fieldset );
});
