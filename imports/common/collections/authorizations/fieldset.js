/*
 * /imports/common/collections/authorizations/fieldset.js
 */

import _ from 'lodash';
import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Timestampable } from 'meteor/pwix:collection-timestampable';
import { Tracker } from 'meteor/tracker';

import { AuthObject } from '/imports/common/definitions/auth-object.def.js';

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
            },
            form_check: Authorizations.checks.label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // subject, either an identities group or a clients (m-to-m) group
        //  subject_type is 'G' or 'C'
        {
            name: 'subject_type',
            type: String
        },
        {
            name: 'subject_id',
            type: String
        },
        // the group we are talking of
        {
            name: 'group',
            type: String,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.group_th' ),
            dt_render( data, type, rowData ){
                const organization = TenantsManager.list.byEntity( rowData.organization );
                const group = organization ? organization.DYN.groups.byId( rowData.group ) : null;
                return group ? group.label : null;
            },
            form_check: Authorizations.checks.group,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // object, either a client or a resource
        {
            name: 'object_type',
            type: String
        },
        {
            name: 'object_id',
            type: String
        },
        // an optional free list of permissions, or access levels, or...?
        {
            name: 'permissions',
            type: Array,
            optional: true
        },
        {
            name: 'permissions.$',
            type: Object
        },
        {
            name: 'permissions.$.name',
            type: String
        },
        // the type of authorized targets, eiher clients or resources
        {
            name: 'type',
            type: String,
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.type_th' ),
            dt_render( data, type, rowData ){
                const def = AuthObject.byId( rowData.type );
                return def ? AuthObject.label( def ) : null;
            },
            form_check: Authorizations.checks.type,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // an optional level of access
        {
            name: 'level',
            type: String,
            optional: true,
            dt_visible: false
        },
        // the list of authorized targets
        {
            name: 'targets',
            type: Array,
            optional: true
        },
        {
            name: 'targets.$',
            type: Object
        },
        {
            name: 'targets.$._id',          // internal identifier of this row for the UI
            type: String,
            dt_visible: false
        },
        {
            name: 'targets.$.target_id',    // either the resource._id or the client.entity._id (not the clientId)
            type: String,
            dt_visible: false,
            form_check: Authorizations.checks.target,
        },
        {
            name: 'targets_label',
            schema: false,
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'authorizations.tabular.targets_th' )
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
            name: 'lastUpdateddAt',
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
        }
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    Authorizations.fieldSet.set( fieldset );
});
