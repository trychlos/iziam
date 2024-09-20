/*
 * /imports/client/components/client_new_assistant/client_new_assistant.js
 *
 * Reactivity management.
 * More or less each pane needs to be reactive about one or more elementary data.
 * If we are just reactive about the record, then the reactive functions will be triggered each time we update any thing in the record.
 * So we try to optimize the behavior as:
 * - UI updates non-reactively update the record (because this is the Forms.Checker behavior)
 * - embedded panel are expected to publish their changes to the assistant which keep track of the interesting things in the assistantStatus ReactiveDict.
 * 
 * Parms:
 * - organization: an { entity, record } object which provides the current closest Organization
 * - item: null
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/client_new_assistant_application_type/client_new_assistant_application_type.js';
import '/imports/client/components/client_new_assistant_auth_method/client_new_assistant_auth_method.js';
import '/imports/client/components/client_new_assistant_client_type/client_new_assistant_client_type.js';
import '/imports/client/components/client_new_assistant_contacts/client_new_assistant_contacts.js';
import '/imports/client/components/client_new_assistant_current/client_new_assistant_current.js';
import '/imports/client/components/client_new_assistant_done/client_new_assistant_done.js';
import '/imports/client/components/client_new_assistant_redirects/client_new_assistant_redirects.js';
import '/imports/client/components/client_new_assistant_grant_types/client_new_assistant_grant_types.js';
import '/imports/client/components/client_new_assistant_jwks/client_new_assistant_jwks.js';
//import '/imports/client/components/client_new_assistant_jwt/client_new_assistant_jwt.js';
import '/imports/client/components/client_new_assistant_introduction/client_new_assistant_introduction.js';
import '/imports/client/components/client_new_assistant_profile/client_new_assistant_profile.js';
import '/imports/client/components/client_new_assistant_properties/client_new_assistant_properties.js';
import '/imports/client/components/client_new_assistant_providers/client_new_assistant_providers.js';
import '/imports/client/components/client_new_assistant_summary/client_new_assistant_summary.js';
import '/imports/client/components/client_new_assistant_token_extensions/client_new_assistant_token_extensions.js';
//import '/imports/client/components/jwt_private_select/jwt_private_select.js';

import './client_new_assistant.html';
import { Clients } from '../../../common/collections/clients';

Template.client_new_assistant.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the global Checker for this modal
        checker: new ReactiveVar( null ),
        // the assistant name
        myName: 'client-new-assistant',
        // the client item to be built
        entity: new ReactiveVar( null ),
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // the Assistant PCK object
        assistantPck: null,
        // a data dictionary to manage the assistant status (activation and actions)
        assistantStatus: new ReactiveDict(),

        // returns the list of pages
        pages(){
            let pages = [
                {
                    name: 'introduction',
                    template: 'client_new_assistant_introduction',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.introduction_nav' ),
                    start: true
                },
                {
                    name: 'properties',
                    template: 'client_new_assistant_properties',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.properties_nav' )
                },
                {
                    name: 'profile',
                    template: 'client_new_assistant_profile',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.profile_nav' )
                },
                {
                    name: 'client',
                    template: 'client_new_assistant_client_type',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.client_nav' )
                },
                {
                    name: 'application',
                    template: 'client_new_assistant_application_type',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.application_nav' )
                }
            ];
            // false as of 2024-09-12
            if( Clients.fn.hasSelectedProviders()){
                pages.push({
                    name: 'providers',
                    template: 'client_new_assistant_providers',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.providers_nav' )
                });
            }
            pages = pages.concat([
                {
                    name: 'grant',
                    template: 'client_new_assistant_grant_types',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.grant_type_nav' )
                },
                {
                    name: 'auth',
                    template: 'client_new_assistant_auth_method',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.auth_method_nav' )
                },
                {
                    name: 'formaters',
                    template: 'client_new_assistant_token_extensions',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.token_extensions_nav' )
                },
                {
                    name: 'redirects',
                    template: 'client_new_assistant_redirects',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.redirects_nav' )
                },
                {
                    name: 'jwks',
                    template: 'client_new_assistant_jwks',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.jwks_nav' )
                },
                /*
                {
                    name: 'jwt',
                    template: 'client_new_assistant_jwt',
                    label: pwixI18n.label( I18N, 'clients.new_assistant.jwt_nav' ),
                    enabled: false
                },
                */
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
                    end: true
                }
            ]);
            return pages;
        },

        // return the array of the previous pages
        //  suitable to use when display the summary on top on each pane
        previousPanes(){
            let array = [];
            const activePane = self.APP.assistantStatus.get( 'activePane' );
            if( activePane ){
                const pages = self.APP.pages();
                for( let i=0 ; i<pages.length ; ++i ){
                    if( pages[i].name === activePane ){
                        break;
                    }
                    array.push( pages[i].name );
                }
            }
            return array;
        }
    };

    // wait for assistant initialized itself
    self.APP.assistantStatus.clear();
    self.APP.assistantStatus.set( 'activated', false );

    // build a suitable new client entity
    self.APP.entity.set({
        organization: Template.currentData().organization.entity._id,
        DYN: {
            records: [
                new ReactiveVar( {} )
            ]
        }
    });

    // track the status of the assistant
    self.autorun(() => {
        console.debug( 'assistantStatus', self.APP.assistantStatus.all());
    });

    // track the content of the entity
    self.autorun(() => {
        console.debug( 'clientEntity', self.APP.entity.get());
    });

    // track the content of the record
    self.autorun(() => {
        console.debug( 'clientRecord', self.APP.entity.get().DYN.records[0].get());
    });
});

Template.client_new_assistant.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-new-client-assistant' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal title
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                title: pwixI18n.label( I18N, 'clients.new_assistant.assistant_title' )
            });
        }
    });

    // allocate a Checker for this (topmost parent) template
    self.autorun(() => {
        self.APP.checker.set( new Forms.Checker( self, {
            name: 'client_new_assistant',
            okFn( valid ){
                //self.$( '.Assistant' ).trigger( 'assistant-do-action-set', { action: 'next', enabled: valid });
            }
        }));
    });

    // and clear the panels to prevent re-use of data of a previous session
    self.APP.checker.get().clearPanel({ propagateDown: true });
});

Template.client_new_assistant.helpers({
    // parms to assistant_template
    parmsAssistant(){
        const APP = Template.instance().APP;
        return {
            ...this,
            checker: APP.checker,
            parentAPP: APP,
            name: APP.myName,
            assistantPages(){
                return APP.pages()
            },
            assistantOnChange( prev, next ){
                const pages = APP.pages();
                if( pages[next].name === 'summary' ){
                    self.$( '.Assistant' ).trigger( 'assistant-do-action-set', {
                        action: 'next',
                        html: pwixI18n.label( I18N, 'assistant.confirm_btn' ),
                        title: pwixI18n.label( I18N, 'assistant.confirm_title' )
                    });
                }
                if( pages[next].prev === 'summary' ){
                    self.$( '.Assistant' ).trigger( 'assistant-do-action-set', {
                        action: 'next',
                        html: pwixI18n.label( I18N, 'assistant.next_btn' ),
                        title: pwixI18n.label( I18N, 'assistant.next_title' )
                    });
                }
                return true;
            },
            assistantConfirmOnClose: true,
            assistantWithParentChecker: true
        }
    }
});

Template.client_new_assistant.events({
    // advertize of the assistant activation (panes shouldn't do anything before that)
    'assistant-activated .c-client-new-assistant'( event, instance, data ){
        if( data.name === instance.APP.myName ){
            instance.APP.assistantStatus.set( 'activated', true );
            instance.APP.assistantPck = data.pck;
        }
    },
    // track the currently shown pane
    'assistant-pane-to-hide .c-client-new-assistant'( event, instance, data ){
        instance.APP.assistantStatus.set( 'activePane', null );
    },
    'assistant-pane-shown .c-client-new-assistant'( event, instance, data ){
        instance.APP.assistantStatus.set( 'activePane', data.paneName );
    },
    // we are expected to be able to act on the action buttons on 'show' and 'shown' events
    'assistant-pane-to-hide .c-client-new-assistant, assistant-pane-hidden .c-client-new-assistant, assistant-pane-to-show .c-client-new-assistant, assistant-pane-shown .c-client-new-assistant'( event, instance, data ){
        //console.debug( event.type, data );
    }
});
