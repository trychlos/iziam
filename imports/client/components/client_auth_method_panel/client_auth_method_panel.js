/*
 * /imports/client/components/client_auth_method_panel/client_auth_method_panel.js
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
 * - selectables: the list of selectables auth methods
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';

import './client_auth_method_panel.html';

Template.client_auth_method_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            label: {
                js: '.js-check'
            }
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null ),
        // the list of allowed auth methods definitions
        selectables: new ReactiveVar( [] ),

        // returns true if the definition is the current selection
        isSelected( def ){
            const id = AuthMethod.id( def );
            const entity = Template.currentData().entity.get();
            const index = Template.currentData().index;
            const record = entity.DYN.records[index].get();
            return record.authMethod === id;
        }
    };

    // build the list of auth methods definitions from the provided list of allowed identifiers
    self.autorun(() => {
        let selectables = [];
        Template.currentData().selectables.forEach(( it ) => {
            const def = AuthMethod.byId( it );
            if( def ){
                selectables.push( def );
            } else {
                console.warn( 'auth method not found', it );
            }
        });
        self.APP.selectables.set( selectables );
    });
});

Template.client_auth_method_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'client_auth_method_panel',
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

Template.client_auth_method_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        return Template.instance().APP.isSelected( it ) ? 'checked' : '';
    },

    // description
    itDescription( it ){
        return AuthMethod.description( it );
    },

    // identifier
    itId( it ){
        return AuthMethod.id( it );
    },

    // label
    itLabel( it ){
        return AuthMethod.label( it );
    },

    // whether this item is selected ?
    itSelected( it ){
        return Template.instance().APP.isSelected( it ) ? 'selected' : '';
    },

    // items list: a list of allowed auth methods identifiers
    itemsList(){
        return Template.instance().APP.selectables.get();
    }
});

Template.client_auth_method_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-client-auth-method-panel'( event, instance ){
        instance.APP.checker.get().clear();
    },
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-client-auth-method-panel'( event, instance, enabled ){
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
    },
    // auth method selection
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        const entity = this.entity.get();
        const index = this.index;
        const record = entity.DYN.records[index].get();
        record.authMethod = id;
        // advertize the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-auth-method-panel' ).trigger( 'iz-auth-method', { authMethod: id });
    }
});
