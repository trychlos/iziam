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
        //  identity name is set as DYN.label by the publication function
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
