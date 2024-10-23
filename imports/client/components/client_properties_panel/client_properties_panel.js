/*
 * /imports/client/components/client_properties_panel/client_properties_panel.js
 *
 * Client properties pane.
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the currently edited Client record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - organization: the Organization as an entity with its DYN.records array
 * - enableChecks: whether the checks should be enabled at startup, defaulting to true
 * - withEnabled: whether we want an enabled checkbox, defaulting to false
 * - withProfile: whether we want a profile selection (only in edit_dialog, not in new_assistant), defaulting to false
 * - withClientType: whether we want a client type selection (only in edit_dialog, not in new_assistant), defaulting to false
 * - withApplicationType: whether we want an application type selection (only in edit_dialog, not in new_assistant), defaulting to false
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import './client_properties_panel.html';

Template.client_properties_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            label: {
                js: '.js-label'
            },
            description: {
                js: '.js-description'
            },
            logo_uri: {
                js: '.js-logo'
            },
            client_uri: {
                js: '.js-home'
            },
            tos_uri: {
                js: '.js-tos'
            },
            policy_uri: {
                js: '.js-privacy'
            },
            software_id: {
                js: '.js-softid'
            },
            software_version: {
                js: '.js-softver'
            },
            author: {
                js: '.js-author'
            }
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null )
    };

    // update the Panel fields for edit_dialog
    self.autorun(() => {
        if( Template.currentData().withApplicationType === true ){
            self.APP.fields.application_type = { js: '.js-application-type' };
        }
    });
    self.autorun(() => {
        if( Template.currentData().withEnabled === true ){
            self.APP.fields.enabled = {
                js: '.js-enabled',
                form_type: Forms.FieldType.C.TRANSPARENT
            };
        }
    });
    self.autorun(() => {
        if( Template.currentData().withProfile === true ){
            self.APP.fields.profile = { js: '.js-profile' };
        }
    });
    self.autorun(() => {
        if( Template.currentData().withClientType === true ){
            self.APP.fields.client_type = { js: '.js-client-type' };
        }
    });
});

Template.client_properties_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            const record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'client_properties_panel',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, ClientsRecords.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: record,
                enabled: enabled
            }));
        }
    });

    // advertize the assistant of the status of this panel
    self.autorun(() => {
        const checker = self.APP.checker.get();
        if( checker ){
            const status = checker.status();
            const validity = checker.validity();
            self.$( '.c-client-properties-panel' ).trigger( 'iz-checker', { status: status, validity: validity });
        }
    });
});

Template.client_properties_panel.helpers({
    // whether the client is enabled ?
    enabledChecked(){
        return this.entity.get().DYN.records[this.index].get().enabled ? 'checked' : '';
    },

    // whether enabling the client is disabled ?
    enabledDisabled(){
        return '';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for application type select
    parmsApplicationTypeSelect(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().application_type
        };
    },

    // parms for client type select
    parmsClientTypeSelect(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().client_type
        };
    },

    // parms for ImageIncluder
    parmsImage(){
        return {
            imageUrl: this.entity.get().DYN.records[this.index].get().logo_uri,
            imageWidth: '9em',
            imageHeight: '9em'  // 4 rows -> 4x2.5em -> 10em
        };
    },

    // parms for profile select
    parmsProfileSelect(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().profile
        };
    },

    // whether we want an application type selection here (only in edit_dialog, not in new_assistant)
    withApplicationType(){
        return this.withApplicationType === true;
    },

    // whether we want an enabled checkbox (only in edit_dialog, not in new_assistant)
    withEnabled(){
        return this.withEnabled === true;
    },

    // whether we want a profile selection here (only in edit_dialog, not in new_assistant)
    withProfile(){
        return this.withProfile === true;
    },

    // whether we want a client type selection here (only in edit_dialog, not in new_assistant)
    withClientType(){
        return this.withClientType === true;
    }
});

Template.client_properties_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-client-properties-panel'( event, instance ){
        instance.APP.checker.get().clearPanel();
    },
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-client-properties-panel'( event, instance, enabled ){
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
    }
});
