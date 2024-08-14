/*
 * /imports/client/components/client_new_assistant_contacts/client_new_assistant_contacts.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import validator from 'email-validator';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/jquery/jqw-table/jqw-table.js';

import './client_new_assistant_contacts.html';

Template.client_new_assistant_contacts.onCreated( function(){
    const self = this;

    self.APP = {
        label: new ReactiveVar( null ),
        addEnabled: new ReactiveVar( false ),
        clearEnabled: new ReactiveVar( false ),

        clear(){
            self.$( '.js-label' ).val( '' );
            self.APP.label.set( null );
        }
    };
});

Template.client_new_assistant_contacts.onRendered( function(){
    const self = this;

    self.$( 'table.input-table' ).jqwTable();
    self.$( 'table.js-table' ).jqwTable();

    // relabel jqwTable headers when language changes
    //  argument is not used, but triggers the autorun when language changes
    self.autorun(() => {
        self.$( 'table.js-table' ).jqwTable( 'relabel', pwixI18n.language());
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    //  must have at least one redirect URL unless we are a machine-to-machine client where we must not have any
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'contacts' ){
            const contacts = dataDict.get( 'contacts' ) || [];
            dataDict.set( 'next', contacts.length > 0 );
        }
    });

    // track the input field to enable/disable Add button
    //  the new contact must be set and not already registered
    self.autorun(() => {
        const label = self.APP.label.get();
        const contacts = Template.currentData().parentAPP.assistantStatus.get( 'contacts' ) || [];
        self.APP.addEnabled.set( Boolean( label && label.length && validator.validate( label ) && !contacts.includes( label )));
        self.APP.clearEnabled.set( Boolean( label && label.length ));
    });
});

Template.client_new_assistant_contacts.helpers({
    // whether to enable Add button ?
    addDisabled(){
        return Template.instance().APP.addEnabled.get() ? '' : 'disabled';
    },

    // whether to enable Clear button ?
    clearDisabled(){
        return Template.instance().APP.clearEnabled.get() ? '' : 'disabled';
    },

    // whether we have contacts ?
    haveItems(){
        return ( this.parentAPP.assistantStatus.get( 'contacts' ) || [] ).length > 0;
    },

    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // contact identifier: sane than the contact itself
    itId( it ){
        return it;
    },

    // a contact email address
    itLabel( it ){
        return it;
    },

    // items list
    itemsList(){
        return ( this.parentAPP.assistantStatus.get( 'contacts' ) || [] );
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    }
});

Template.client_new_assistant_contacts.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-contacts'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.assistantStatus.set( 'prev', false );
        this.parentAPP.assistantStatus.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-contacts'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.assistantStatus.set( 'prev', true );
    },
    // get the fields values (at least the name must be set asap to be able to enable the Next button)
    'click .js-clear'( event, instance, data ){
        instance.APP.clear();
    },
    'click .js-add'( event, instance, data ){
        const label = instance.APP.label.get();
        const array = this.parentAPP.assistantStatus.get( 'contacts' ) || [];
        array.push( label );
        this.parentAPP.assistantStatus.set( 'contacts', array );
        instance.APP.clear();
    },
    'click .js-minus'( event, instance, data ){
        const label = instance.$( event.currentTarget ).closest( 'tr' ).data( 'item-id' );
        const array = this.parentAPP.assistantStatus.get( 'contacts' ) || [];
        let idx = -1;
        for( let i=0 ; i<array.length ; ++i ){
            if( array[i] === label ){
                idx = i;
                break;
            }
        }
        if( idx >= 0 ){
            array.splice( idx, 1 );
            this.parentAPP.assistantStatus.set( 'contacts', array );
        }
    },
    'input .js-label'( event, instance, data ){
        instance.APP.label.set( instance.$( '.js-label' ).val());
    }
});
