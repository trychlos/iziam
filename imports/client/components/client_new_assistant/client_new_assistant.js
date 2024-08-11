/*
 * /imports/client/components/client_new_assistant/client_new_assistant.js
 * 
 * Parms:
 * - organization: a ReactiveVar which contains the current organization at date
 */

import _ from 'lodash';

import { Assistant } from 'meteor/pwix:assistant';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveDict } from 'meteor/reactive-dict';

//import '/imports/client/components/client_new_assistant_auth_method/client_new_assistant_auth_method.js';
//import '/imports/client/components/client_new_assistant_contacts/client_new_assistant_contacts.js';
//import '/imports/client/components/client_new_assistant_current/client_new_assistant_current.js';
//import '/imports/client/components/client_new_assistant_done/client_new_assistant_done.js';
//import '/imports/client/components/client_new_assistant_endpoints/client_new_assistant_endpoints.js';
//import '/imports/client/components/client_new_assistant_grant_type/client_new_assistant_grant_type.js';
//import '/imports/client/components/client_new_assistant_jwt/client_new_assistant_jwt.js';
import '/imports/client/components/client_new_assistant_introduction/client_new_assistant_introduction.js';
//import '/imports/client/components/client_new_assistant_nature/client_new_assistant_nature.js';
//import '/imports/client/components/client_new_assistant_properties/client_new_assistant_properties.js';
//import '/imports/client/components/client_new_assistant_summary/client_new_assistant_summary.js';
//import '/imports/client/components/client_properties_panel/client_properties_panel.js';
//import '/imports/client/components/jwt_private_select/jwt_private_select.js';

import './client_new_assistant.html';

Template.client_new_assistant.onCreated( function(){
    const self = this;

    self.APP = {
        // the EntityChecker for the client (must be a ReactiveVar because used in template helpers)
        entityChecker: new ReactiveVar( null ),
        // the assistant name
        myName: 'client-new-assistant',
        // a data dictionary to manage the assistant status (activation and actions)
        dataParts: new ReactiveDict(),
        // the item to be built
        //  this is a ReactiveVar to be compliant with check_xxx() functions, but the reactivity is managed with dataParts
        item: new ReactiveVar( null ),

        // returns the list of pages
        pages(){
            return [
                {
                    name: 'introduction',
                    template: 'client_new_assistant_introduction',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.introduction_nav' )
                },
                {
                    name: 'nature',
                    template: 'client_new_assistant_nature',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.nature_nav' )
                },
                {
                    name: 'properties',
                    template: 'client_new_assistant_properties',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.properties_nav' )
                },
                {
                    name: 'grant',
                    template: 'client_new_assistant_grant_type',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.grant_nav' )
                },
                {
                    name: 'auth',
                    template: 'client_new_assistant_auth_method',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.auth_nav' )
                },
                {
                    name: 'jwt',
                    template: 'client_new_assistant_jwt',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.jwt_nav' ),
                    enabled: false
                },
                {
                    name: 'endpoints',
                    template: 'client_new_assistant_endpoints',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.endpoints_nav' )
                },
                {
                    name: 'contacts',
                    template: 'client_new_assistant_contacts',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.contacts_nav' )
                },
                {
                    name: 'summary',
                    template: 'client_new_assistant_summary',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.summary_nav' )
                },
                {
                    name: 'done',
                    template: 'client_new_assistant_done',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.done_nav' ),
                    done: true
                }
            ];
        },

        // return the array of the previous pages
        //  suitable to use when display the summary on top on each pane
        previousPanes(){
            let array = [];
            const activePane = self.APP.dataParts.get( 'activePane' );
            const pages = self.APP.pages();
            for( let i=0 ; i<pages.length ; ++i ){
                if( pages[i].name === activePane ){
                    break;
                }
                array.push( pages[i].name );
            }
            return array;
        }
    };

    // wait for assistant initialized itself
    self.APP.dataParts.set( 'activated', false );

    // track the data parts of the assistant
    self.autorun(() => {
        console.debug( 'dataParts', self.APP.dataParts.all());
    });
});

Template.client_new_assistant.onRendered( function(){
    const self = this;

    // set the assistant title
    //  the modal target will be taken by the assistant
    Modal.set({
        title: pwixI18n.label( I18N, 'clients.new_assistant.assistant_title' )
    });

    // enable/disable the action buttons
    // this is not delegable to the assistant_template as the application MUST keep the control of the buttons
    self.autorun(() => {
        self.$( '.ca-assistant-template' ).trigger( 'do-enable-action', { action: 'cancel', enabled: self.APP.dataParts.get( 'cancel' )});
    });
    self.autorun(() => {
        self.$( '.ca-assistant-template' ).trigger( 'do-enable-action', { action: 'close', enabled: self.APP.dataParts.get( 'close' )});
    });
    self.autorun(() => {
        self.$( '.ca-assistant-template' ).trigger( 'do-enable-action', { action: 'next', enabled: self.APP.dataParts.get( 'next' )});
    });
    self.autorun(() => {
        self.$( '.ca-assistant-template' ).trigger( 'do-enable-action', { action: 'prev', enabled: self.APP.dataParts.get( 'prev' )});
    });

    // allocate an EntityChecker for the dialog/page
    self.autorun(() => {
        self.APP.entityChecker.set( new CoreApp.EntityChecker( self, {
            $topmost: self.$( '.c-client-new-assistant' ),
            validityEvent: 'panel-data',
            okSetFn( valid ){
                self.$( '.ca-assistant-template' ).trigger( 'do-enable-action', { action: 'next', enabled: valid });
            }
        }));
    });
});

Template.client_new_assistant.helpers({
    // parms to assistant_template
    parmsAssistant(){
        const APP = Template.instance().APP;
        return {
            ...this,
            parentAPP: APP,
            name: APP.myName,
            pages(){
                return APP.pages()
            },
            onChange( prev, next ){
                const pages = APP.pages();
                if( pages[next].name === 'summary' ){
                    self.$( '.ca-assistant-template' ).trigger( 'do-label-action', {
                        action: 'next',
                        html: pwixI18n.label( I18N, 'assistant.confirm_btn' ),
                        title: pwixI18n.label( I18N, 'assistant.title_btn' )
                    });
                }
                if( pages[next].prev === 'summary' ){
                    self.$( '.ca-assistant-template' ).trigger( 'do-label-action', {
                        action: 'next',
                        html: pwixI18n.label( I18N, 'assistant.next_btn' ),
                        title: pwixI18n.label( I18N, 'assistant.next_btn' )
                    });
                }
                return true;
            },
            confirmOnClose: true
        }
    }
});

Template.client_new_assistant.events({
    // advertize of the assistant activation (panes shouldn't do anything before that)
    'assistant-activated .c-client-new-assistant'( event, instance, data ){
        if( data.name === instance.APP.myName ){
            instance.APP.dataParts.set( 'activated', true );
            console.debug( event.type, data );
        }
    },

    // track the currently shown pane
    'assistant-pane-to-hide .c-client-new-assistant'( event, instance, data ){
        instance.APP.dataParts.set( 'activePane', null );
    },
    'assistant-pane-shown .c-client-new-assistant'( event, instance, data ){
        instance.APP.dataParts.set( 'activePane', data.paneName );
    },

    // we are expected to be able to act on the action buttons on 'show' and 'shown' events
    'assistant-pane-to-hide .c-client-new-assistant, assistant-pane-hidden .c-client-new-assistant, assistant-pane-to-show .c-client-new-assistant, assistant-pane-shown .c-client-new-assistant'( event, instance, data ){
        console.debug( event.type, data );
    }
});
