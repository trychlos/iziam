/*
 * /imports/client/components/client_new_assistant_jwt/client_new_assistant_jwt.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import validator from 'email-validator';

import { pwixI18n } from 'meteor/pwix:i18n';

import { JwtPrivate } from '/imports/common/definitions/jwt-private.def.js';

import './client_new_assistant_jwt.html';

Template.client_new_assistant_jwt.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    //  must be set if authentification method uses private jwt
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'jwt' ){
            const method = dataDict.get( 'token_endpoint_auth_method' );
            const origin = dataDict.get( 'jwtOrigin' );
            const source = dataDict.get( 'jwtSource' );
            dataDict.set( 'next', method !== 'private_jwt' || ( origin && origin.length && source && source.length ));
        }
    });
});

Template.client_new_assistant_jwt.helpers({
    // whether we use an input field or a textarea
    haveInput(){
        const origin = this.parentAPP.assistantStatus.get( 'jwtOrigin' );
        return origin === 'uri';
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
    }
});

Template.client_new_assistant_jwt.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-jwt'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.assistantStatus.set( 'prev', false );
        this.parentAPP.assistantStatus.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-jwt'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.assistantStatus.set( 'prev', true );
    },
    // get the fields values (at least the name must be set asap to be able to enable the Next button)
    'input .js-data'( event, instance, data ){
        this.parentAPP.assistantStatus.set( 'jwtSource', instance.$( '.js-data' ).val());
    }
});
