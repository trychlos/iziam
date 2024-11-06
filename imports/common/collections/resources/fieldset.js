/*
 * /imports/common/collections/resources/fieldset.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { Forms } from 'meteor/pwix:forms';
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
            type: String,
            dt_visible: false
        },
        // an optional label
        {
            name: 'label',
            type: String,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'resources.tabular.label_th' ),
            form_check: Resources.checks.label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the resource name
        //  must be unique
        //  should be considered immutable
        {
            name: 'name',
            type: String,
            dt_title: pwixI18n.label( I18N, 'resources.tabular.name_th' ),
            form_check: Resources.checks.name,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // start and end of resource validity
        {
            name: 'startingAt',
            type: Date,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'resources.tabular.starting_on_th' ),
            dt_render( data, type, rowData ){
                return rowData.startingAt ? strftime( '%Y-%m-%d', rowData.startingAt ) : null;
            },
            form_check: Resources.checks.startingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'endingAt',
            type: Date,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'resources.tabular.ending_on_th' ),
            dt_render( data, type, rowData ){
                return rowData.endingAt ? strftime( '%Y-%m-%d', rowData.endingAt ) : null;
            },
            form_check: Resources.checks.endingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        Notes.fieldDef(),
        Timestampable.fieldDef(),
        {
            name: 'lastUpdatedAt',
            schema: false,
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'resources.tabular.created_at_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.updatedAt || rowData.createdAt );
            }
        },
        {
            name: 'lastUpdatedBy',
            schema: false,
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'resources.tabular.created_by_th' ),
            dt_template: Meteor.isClient && Template.ahPreferredLabel,
            dt_templateContext( rowData ){
                return {
                    ahUserId: rowData.updatedAt ? rowData.updatedBy : rowData.createdBy
                };
            }
        }
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    Resources.fieldSet.set( fieldset );
});
