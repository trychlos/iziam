/*
 * /imports/client/components/client_new_assistant_done/client_new_assistant_done.js
 *
 * On the 'done' pane, we do the work and display the result.
 * Here:
 *  - the client identifier
 *  - the client secret if grant type has client credentials with shared secret or authentification method is jwt with shared secret
 *
 * Parms:
 * - organization: a ReactiveVar which contains the current organization at date
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientNature } from '/imports/common/definitions/client-nature.def.js';

import './client_new_assistant_done.html';

Template.client_new_assistant_done.onCreated( function(){
    const self = this;

    self.APP = {
        clientId: new ReactiveVar( null ),
        clientSecret: new ReactiveVar( null ),
        clientHash: new ReactiveVar( null ),
        error: new ReactiveVar( null )
    };
});

Template.client_new_assistant_done.onRendered( function(){
    const self = this;

    // create the client all results are in ReactiveVar's
    self.autorun(() => {
        const dataContext = Template.currentData();
        const dataDict = dataContext.parentAPP.dataParts;
        const natureDef = dataDict.get( 'natureDefinition' );
        if( dataDict.get( 'activePane' ) === 'done' ){
            console.debug( 'dataContext', dataContext );
            const item = {
                organization: dataContext.organization.get().entity,
                name: dataDict.get( 'name' ),
                nature: dataDict.get( 'natureId' ),
                type: ClientNature.defaultType( natureDef ),
                registration: 'pre',
                description: dataDict.get( 'description' ) || null,
                grantTypes: dataDict.get( 'grantTypes' ),
                authMethod: dataDict.get( 'authMethod' ),
                contacts: dataDict.get( 'contacts' ),
                endpoints: dataDict.get( 'endpoints' ),
                softwareId: dataDict.get( 'softwareId' ) || null,
                softwareVersion: dataDict.get( 'softwareVersion' ) || null,
            };
            $( 'body' ).css( 'cursor', 'progress' );
            Meteor.call( 'client.upsert', [ item ], ( err, res ) => {
                if( err ){
                    self.APP.error.set( err );
                } else {
                    self.APP.clientId.set( res.records[0].clientId );
                }
                $( 'body' ).css( 'cursor', 'default' );
                dataDict.set( 'close', true );
            });
        }
    });
});

Template.client_new_assistant_done.helpers({
    // client result
    clientId(){
        return Template.instance().APP.clientId.get();
    },

    // client result
    error(){
        return Template.instance().APP.error.get().message;
    },

    // client result
    haveError(){
        return Boolean( Template.instance().APP.error.get());
    },

    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    },

    // success
    sub_success(){
        return pwixI18n.label( I18N, 'clients.new_assistant.subsuccess_label' );
    },

    // success
    success(){
        return pwixI18n.label( I18N, 'clients.new_assistant.success_label' );
    }
});

Template.client_new_assistant_done.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
    },
});
