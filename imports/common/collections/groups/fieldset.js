/*
 * /imports/common/collections/groups/fieldset.js
 */
import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';

import { Groups } from './index.js';

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
        //  identity name is set as DYN.name by the publication function
        {
            name: 'label',
            type: String,
            optional: true,
            form_check: Groups.checks.label,
            form_type: Forms.FieldType.C.MANDATORY,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.client_name' )
        },
        // the parent identifier, necessarily a group if set
        {
            name: 'parent',
            type: String,
            optional: true
        },
        /*
        // the children of this group
        {
            name: 'children',
            type: Array,
            optional: true
        },
        {
            name: 'children.$',
            type: Object
        },
        // the group type of this child, either a group or an identity
        {
            name: 'children.$.type',
            type: String
        },
        // the identifier of this child
        {
            name: 'children.$.id',
            type: String
        },
        */
        Notes.fieldDef(),
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    Groups.fieldSet.set( fieldset );
});
