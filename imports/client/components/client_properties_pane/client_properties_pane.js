/*
 * /imports/client/components/client_properties_pane/client_properties_pane.js
 *
 * Client properties pane.
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - enableChecks: whether the checks should be enabled at startup, defaulting to true
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import './client_properties_pane.html';

Template.client_properties_pane.onCreated( function(){
    const self = this;
    console.debug( this );

    self.APP = {
        fields: {
            label: {
                js: '.js-label'
            },
            description: {
                js: '.js-description'
            },
            softwareId: {
                js: '.js-softid'
            },
            softwareVersion: {
                js: '.js-softver'
            },
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null ),
    };
});

Template.client_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            let enabled = true;
            if( Object.keys( Template.currentData()).includes( 'enableChecks' )){
                enabled = Template.currentData().enableChecks;
            }
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'client_properties_pane',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, ClientsRecords.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get(),
                enabled: enabled
            }));
        }
    });
});

Template.client_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.client_properties_pane.events({
    // ask for clear the panel
    'iz-clear-panel .c-client-properties-pane'( event, instance ){
        instance.APP.checker.get().clear();
    },
    // ask for enabling the checker
    'iz-enable-checks .c-client-properties-pane'( event, instance, enabled ){
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
    }
});
