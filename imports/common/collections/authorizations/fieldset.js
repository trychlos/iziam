/*
 * /imports/common/collections/authorizations/fieldset.js
 */

import _ from 'lodash';
import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Timestampable } from 'meteor/pwix:collection-timestampable';
import { Tracker } from 'meteor/tracker';

import { AuthObject } from '/imports/common/definitions/auth-object.def.js';
import { AuthSubject } from '/imports/common/definitions/auth-subject.def.js';

import { Authorizations } from './index.js';

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
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.label_th' ),
            dt_render( data, type, rowData ){
                return rowData.label || '<span class="computed-label">'+rowData.DYN.computed_label+'</span>';
            },
            form_check: Authorizations.checks.label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // subject, either an identities group or a clients (m-to-m) group
        //  subject_type is 'I' or 'C'
        {
            name: 'subject_type',
            type: String,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.subject_type_th' ),
            dt_render( data, type, rowData ){
                const def = AuthSubject.byId( rowData.subject_type );
                return def ? AuthSubject.label( def ) : null;
            },
            form_check: Authorizations.checks.subject_type,
            form_type: Forms.FieldType.C.MANDATORY
        },
        {
            name: 'subject_id',
            type: String,
            dt_visible: false,
            form_check: Authorizations.checks.subject_id
        },
        {
            name: 'subject_label',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.subject_label_th' ),
            dt_render( data, type, rowData ){
                return rowData.DYN.subject_label;
            },
            form_check: Authorizations.checks.subject_label,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // object, either a client (only if subject is an identities group) or a resource (both)
        //  object_type is either 'C' or 'R'
        {
            name: 'object_type',
            type: String,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.object_type_th' ),
            dt_render( data, type, rowData ){
                const def = AuthObject.byId( rowData.object_type );
                return def ? AuthObject.label( def ) : null;
            },
            form_check: Authorizations.checks.object_type,
            form_type: Forms.FieldType.C.MANDATORY
        },
        {
            name: 'object_id',
            type: String,
            dt_visible: false,
            form_check: Authorizations.checks.object_id,
            form_type: Forms.FieldType.C.MANDATORY
        },
        {
            name: 'object_label',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.object_label_th' ),
            dt_render( data, type, rowData ){
                return rowData.DYN.object_label;
            },
            form_check: Authorizations.checks.object_label
        },
        // an optional free list of permissions, or access levels, or...?
        {
            name: 'permissions',
            type: Array,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.permissions_th' ),
            dt_render( data, type, rowData ){
                return rowData.DYN.permissions.join( ', ' );
            },
        },
        {
            name: 'permissions.$',
            type: Object
        },
        {
            name: 'permissions.$._id',
            type: String,
            dt_visible: false
        },
        {
            name: 'permissions.$.label',
            type: String,
            dt_visible: false,
            form_check: Authorizations.checks.permission_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // start and end of authorization validity
        {
            name: 'startingAt',
            type: Date,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.starting_on_th' ),
            dt_render( data, type, rowData ){
                return rowData.startingAt ? strftime( '%Y-%m-%d', rowData.startingAt ) : null;
            },
            form_check: Authorizations.checks.startingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'endingAt',
            type: Date,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.ending_on_th' ),
            dt_render( data, type, rowData ){
                return rowData.endingAt ? strftime( '%Y-%m-%d', rowData.endingAt ) : null;
            },
            form_check: Authorizations.checks.endingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        Notes.fieldDef(),
        Timestampable.fieldDef(),
        {
            name: 'lastUpdatedAt',
            schema: false,
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.created_at_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.updatedAt || rowData.createdAt );
            }
        },
        {
            name: 'lastUpdatedBy',
            schema: false,
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.created_by_th' ),
            dt_template: Meteor.isClient && Template.ahPreferredLabel,
            dt_templateContext( rowData ){
                return {
                    ahUserId: rowData.updatedAt ? rowData.updatedBy : rowData.createdBy
                };
            }
        },
        // Have access to DYN data from the tabular display
        {
            name: 'DYN',
            schema: false,
            dt_visible: false
        }
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    Authorizations.fieldSet.set( fieldset );
});
