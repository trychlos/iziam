/*
 * /imports/common/collections/clients_groups/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { Timestampable } from 'meteor/pwix:collection-timestampable';
import { Tracker } from 'meteor/tracker';

import { ClientsGroups } from './index.js';

const _defaultFieldDef = function(){
    let columns = [
        // the organization entity
        {
            name: 'organization',
            type: String
        },
        // the item type, either a 'G' group or a 'C' for client
        {
            name: 'type',
            type: String,
            defaultValue: 'G'
        },
        // the group displayed name, mandatory, should be unique, only set for groups
        //  client name is set as DYN.label by the publication function
        {
            name: 'label',
            type: String,
            optional: true,
            form_check: ClientsGroups.checks.label,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // the parent identifier, necessarily a group if set
        {
            name: 'parent',
            type: String,
            optional: true
        },
        // the client entity identifier, only if a client
        //  needed as a client may be attached to several groups, so the client idenfier cannot be used as the record identifier
        {
            name: 'client',
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
    ClientsGroups.fieldSet.set( fieldset );
});
