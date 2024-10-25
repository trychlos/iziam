/*
 * /imports/common/collections/identities_groups/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { Timestampable } from 'meteor/pwix:collection-timestampable';
import { Tracker } from 'meteor/tracker';

import { IdentitiesGroups } from './index.js';

const _defaultFieldDef = function(){
    let columns = [
        // the organization entity
        {
            name: 'organization',
            type: String
        },
        // the item type, either a 'G' group or a 'I' for identity
        {
            name: 'type',
            type: String,
            defaultValue: 'G'
        },
        // the group displayed name, mandatory, should be unique, only set for groups
        //  identity name is set as DYN.label by the publication function
        {
            name: 'label',
            type: String,
            optional: true,
            form_check: IdentitiesGroups.checks.label,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // the parent identifier, necessarily a group if set
        {
            name: 'parent',
            type: String,
            optional: true
        },
        // the identity identifier, only if an identity
        //  as the group identifier is same than the record identifier
        //  needed as an identity may be attached to several groups, so the identity idenfier cannot be used as the record identifier
        {
            name: 'identity',
            type: String,
            optional: true
        },
        Notes.fieldDef(),
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    IdentitiesGroups.fieldSet.set( fieldset );
});
