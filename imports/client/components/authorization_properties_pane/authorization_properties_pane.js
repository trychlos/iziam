/*
 * /imports/client/components/authorization_properties_pane/authorization_properties_pane.js
 *
 * Manage a authorization, maybe empty but have at least an _id.
 *
 * Parms:
 * - entity: the Organization entity object with its DYN sub-object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the authorization item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';

import { AuthObject } from '/imports/common/definitions/auth-object.def.js';
import { AuthSubject } from '/imports/common/definitions/auth-subject.def.js';

import '/imports/client/components/auth_object_select/auth_object_select.js';
import '/imports/client/components/auth_subject_select/auth_subject_select.js';
import '/imports/client/components/client_select/client_select.js';
import '/imports/client/components/clients_group_select/clients_group_select.js';
import '/imports/client/components/identities_group_select/identities_group_select.js';
import '/imports/client/components/resource_select/resource_select.js';

import './authorization_properties_pane.html';

Template.authorization_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // the fields in this panel
        fields: {
            'label': {
                js: '.js-label'
            },
            'subject_type': {
                js: '.js-subject-type'
            },
            'subject_label': {
                js: '.js-subject-label'
            },
            'object_type': {
                js: '.js-object-type'
            },
            'object_id': {
                js: '.js-object-id'
            },
            'startingAt': {
                js: '.js-starting'
            },
            'endingAt': {
                js: '.js-ending'
            }
        },
        // the subject type definition
        subject_type: new ReactiveVar( null ),
        prev_subject_type: undefined,
        prev_object_type: undefined,
        // address the *saved* organization entity
        organization: new ReactiveVar( [] )
    };

    self.autorun(() => {
        const item = Template.currentData().entity;
        self.APP.organization.set( TenantsManager.list.byEntity( item._id ));
    });

    // reset subject_id on subject_type changes
    self.autorun(() => {
        const item = Template.currentData().item.get();
        const type = item?.subject_type;
        if( self.APP.prev_subject_type !== undefined ){
            if( type !== self.APP.prev_subject_type ){
                item.subject_id = null;
                item.subject_label = null;
                item.DYN.subject_label = null;
            }
        }
        self.APP.prev_subject_type = type;
    });

    // reset object_id on object_type changes
    self.autorun(() => {
        const item = Template.currentData().item.get();
        const type = item?.object_type;
        if( self.APP.prev_object_type !== undefined ){
            if( type !== self.APP.prev_object_type ){
                item.object_id = null;
                item.object_label = null;
                item.DYN.object_label = null;
            }
        }
        self.APP.prev_object_type = type;
    });

    // track subject type definition
    self.autorun(() => {
        //console.debug( 'subject_type', self.APP.subject_type.get());
    });
});

Template.authorization_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    // NB: cannot use Forms.FormField defaults as the schema name addresses the full Organization record
    //  while this panel only addresses a single JWK
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'authorization_properties_pane',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, Authorizations.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    item: itemRv
                },
                setForm: itemRv.get(),
                crossCheckFn: Authorizations.checks.crossCheckProperties
            }));
        }
    });
});

Template.authorization_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the label placeholder
    labelPlaceholder(){
        return this.item.get().computed_label || pwixI18n.label( I18N, 'authorizations.edit.label_ph' );
    },

    // whether the object type is a client ?
    objectClient(){
        return this.item.get().object_type === 'C';
    },

    // whether the object type is neither a client nor a resource ?
    objectNone(){
        const type = this.item.get().object_type;
        return type !== 'C' && type !== 'R';
    },

    // whether the object type is a resource ?
    objectResource(){
        return this.item.get().object_type === 'R';
    },

    // parms for the AuthObject type selection box
    // the selectable list depends of the subject type
    parmsAuthObject(){
        const def = Template.instance().APP.subject_type.get();
        const allowed = def ? AuthSubject.allowedObjects( def ) : undefined;
        return {
            list: AuthObject.allowedDefinitions( allowed ),
            selected: this.item.get().object_type
        };
    },

    // parms for the AuthSubject type selection box
    parmsAuthSubject(){
        return {
            selected: this.item.get().subject_type
        };
    },

    // parms for the client selection box
    parmsClientSelect(){
        return {
            ...this,
            list: Template.instance().APP.organization.get().DYN.clients.get(),
            selected: this.item.get().object_id
        };
    },

    // parms for the clientsGroups selection box
    parmsClientsGroupSelect(){
        return {
            organization: this.entity,
            groups: Template.instance().APP.organization.get().DYN.clients_groups.get(),
            selected: this.item.get().subject_id
        };
    },

    // parms for the DateInput
    parmsEndDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'authorizations.edit.ending_ph' ),
            withHelp: true
        };
    },

    // parms for the identitiesGroups selection box
    parmsIdentitiesGroupSelect(){
        return {
            organization: this.entity,
            groups: Template.instance().APP.organization.get().DYN.identities_groups.get(),
            selected: this.item.get().subject_id
        };
    },

    // parms for the resource selection box
    parmsResourceSelect(){
        return {
            ...this,
            list: Template.instance().APP.organization.get().DYN.resources.get(),
            selected: this.item.get().object_id
        };
    },

    // parms for the DateInput
    parmsStartDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'authorizations.edit.starting_ph' ),
            withHelp: true
        };
    },

    // whether the authorization subject is clients groups ?
    subjectClients(){
        return this.item.get().subject_type === 'C';
    },

    // whether the authorization subject is identities groups ?
    subjectIdentities(){
        return this.item.get().subject_type === 'I';
    },

    // have a disabled input field while no subject type is selected
    subjectNone(){
        const type = this.item.get().subject_type;
        return type !== 'I' && type !== 'C';
    }
});

Template.authorization_properties_pane.events({
    'auth-subject-selected .c-authorization-properties-pane'( event, instance, data ){
        instance.APP.subject_type.set( AuthSubject.byId( data.selected ));
    },

    'client-selected .c-authorization-properties-pane'( event, instance, data ){
        const item = this.item.get();
        item.DYN.object_label = data.label || null;
    },

    'clients-group-selected .c-authorization-properties-pane'( event, instance, data ){
        if( data.selected ){
            const item = this.item.get();
            item.subject_id = data.selected._id;
            item.subject_label = data.selected.label;
            item.DYN.subject_label = data.selected.label;
            const checker = instance.APP.checker.get();
            if( checker ){
                checker.setForm( item );
                checker.check({ update: false });
            }
        }
    },

    'identities-group-selected .c-authorization-properties-pane'( event, instance, data ){
        if( data.selected ){
            const item = this.item.get();
            item.subject_id = data.selected._id;
            item.subject_label = data.selected.label;
            item.DYN.subject_label = data.selected.label;
            const checker = instance.APP.checker.get();
            if( checker ){
                checker.setForm( item );
                checker.check({ update: false });
            }
        }
    },

    'resource-selected .c-authorization-properties-pane'( event, instance, data ){
        const item = this.item.get();
        item.DYN.object_label = data.label || null;
    }
});
