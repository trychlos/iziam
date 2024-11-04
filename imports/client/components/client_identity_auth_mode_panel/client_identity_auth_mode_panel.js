/*
 * /imports/client/components/client_identity_auth_mode_panel/client_identity_auth_mode_panel.js
 *
 * Client identity authentication mode selection panel.
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
 * - isAssistant: whether we are running inside of the new client assistant, defaulting to false
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { IdentityAuthMode } from '/imports/common/definitions/identity-auth-mode.def.js';

import './client_identity_auth_mode_panel.html';

Template.client_identity_auth_mode_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the list of allowed auth modes definitions (all at the moment)
        selectables: new ReactiveVar( [] ),
        fields: {
            identity_auth_mode: {
                js: '.js-check',
                form_type: Forms.FieldType.C.NONE,
                form_status: Forms.C.ShowStatus.NONE,
            }
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null ),

        // returns true if the definition is the current selection
        isSelected( dataContext, def ){
            const id = IdentityAuthMode.id( def );
            const records = dataContext.entity.get().DYN.records;
            const record = dataContext.index >= records.length ? null : records[dataContext.index].get();
            const selected = record ? ( record.identity_auth_mode === id ) : false;
            //console.debug( 'record', record.effectStart, record.effectEnd, record.identity_access_mode, 'selected', selected );
            return selected;
        }
    };

    // build the selectables auth methods list
    self.autorun(() => {
        self.APP.selectables.set( IdentityAuthMode.Knowns());
    });

    // make sure we have a default value
    self.autorun(() => {
        const recordRv = Template.currentData().entity.get().DYN.records[Template.currentData().index];
        let record = recordRv.get();
        if( !record.identity_auth_mode ){
            record.identity_auth_mode = 'auth';
            recordRv.set( record);
        }
    });
});

Template.client_identity_auth_mode_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            const record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, ClientsRecords.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                enabled: enabled
            }));
        }
    });
});

Template.client_identity_auth_mode_panel.helpers({
    // the preamble text
    content_text(){
        return pwixI18n.label( I18N, 'clients.edit.identities_auth_preamble' );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        return Template.instance().APP.isSelected( this, it ) ? 'checked' : '';
    },

    // description
    itDescription( it ){
        return IdentityAuthMode.description( it );
    },

    // for label
    itFor( it ){
        return 'identity_auth_'+this.index+'_'+IdentityAuthMode.id( it );
    },

    // label
    itLabel( it ){
        return IdentityAuthMode.label( it );
    },

    // have a different name for each validity record
    itName( it ){
        return 'auth_mode_'+this.index;
    },

    // whether this item is selected ?
    itSelected( it ){
        return Template.instance().APP.isSelected( this, it ) ? 'selected' : '';
    },

    // the item's value
    itValue( it ){
        return IdentityAuthMode.id( it );
    },

    // items list: a list of allowed auth methods definitions
    itemsList(){
        return Template.instance().APP.selectables.get();
    }
});

Template.client_identity_auth_mode_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-client-identity-auth-mode-panel'( event, instance ){
    }
});
