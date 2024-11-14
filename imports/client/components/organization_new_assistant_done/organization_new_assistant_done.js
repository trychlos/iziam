/*
 * /imports/client/components/organization_new_assistant_done/organization_new_assistant_done.js
 *
 * On the 'done' pane, we do the work and display the result.
 * Here:
 *  - the client identifier
 *  ((- the client secret if grant type has client credentials with shared secret or authentification method is jwt with shared secret))
 *
 * Parms:
 * - organization: a ReactiveVar which contains the current organization at date
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './organization_new_assistant_done.html';

Template.organization_new_assistant_done.onCreated( function(){
    const self = this;

    self.APP = {
        error: new ReactiveVar( null ),

        // end of the creation
        creationEnd(){
            $( 'body' ).css( 'cursor', 'default' );
            self.$( '.c-organization-new-assistant-done' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: true });
        }
    };
});

Template.organization_new_assistant_done.onRendered( function(){
    const self = this;

    // create the client all results are in ReactiveVar's
    self.autorun(() => {
        const dataContext = Template.currentData();
        const dataDict = dataContext.parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'done' ){
            //console.debug( 'dataContext', dataContext );
            $( 'body' ).css( 'cursor', 'progress' );
            Meteor.callAsync( 'pwix_tenants_manager_tenants_upsert', dataContext.parentAPP.entity.get())
                .then(( res ) => {
                    //console.debug( 'res', res );
                    //console.debug( 'entity', dataContext.parentAPP.entity.get());
                    self.APP.creationEnd();
                })
                .catch(( err ) => {
                    self.APP.error.set( err );
                    self.APP.creationEnd();
                });
        }
    });

    // track the error to the console
    self.autorun(() => {
        //console.debug( 'error', self.APP.error.get());
    });
});

Template.organization_new_assistant_done.helpers({
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
        return pwixI18n.label( I18N, 'organizations.new_assistant.subsuccess_label' );
    },

    // success
    success(){
        return pwixI18n.label( I18N, 'organizations.new_assistant.success_label' );
    }
});

Template.organization_new_assistant_done.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-organization-new-assistant-properties'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-organization-new-assistant-properties'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
});
