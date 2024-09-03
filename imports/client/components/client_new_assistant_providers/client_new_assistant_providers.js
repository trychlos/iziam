/*
 * /imports/client/components/client_new_assistant_providers/client_new_assistant_providers.js
 *
 * We accept to define a new client even if no provider is selected, but try to provide a minimal default.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { Clients } from '/imports/common/collections/clients/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';
import { Providers } from '/imports/common/collections/providers/index.js';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';

import '/imports/client/components/client_providers_panel/client_providers_panel.js';

import './client_new_assistant_providers.html';

Template.client_new_assistant_providers.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // only compute default on first display of the pane
        firstShown: false,
        // arguments computed to call the Clients providers Get/Add methods
        callingArgs: null
    };

    // keep the current selection in the reactive datadict
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const parentAPP = Template.currentData().parentAPP;
        self.APP.callingArgs = {
            caller: {
                entity: parentAPP.entity.get(),
                record: parentAPP.entity.get().DYN.records[0].get()
            },
            parent: Template.currentData().organization
        };
        const selected = Clients.fn.selectedProvidersGet( self.APP.callingArgs );
        dataDict.set( 'selectedProviders', Object.keys( selected ));
    });
});

Template.client_new_assistant_providers.onRendered( function(){
    const self = this;

    // try to have a minimal default from client profile, client type and profile features
    // only computed the first time the pane is displayed, and only if there is no current selection
    // default with openid for public client
    // honors wantsPkce organization config
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'providers' && !self.APP.firstShown ){
            self.APP.firstShown = true;
            let selected = dataDict.get( 'selectedProviders' );
            if( !selected.length ){
                const profileDef = dataDict.get( 'profileDef' );
                const clientType = dataDict.get( 'client_type' );
                if( profileDef && clientType ){
                    let featuresHash = {};
                    ClientProfile.defaultFeatures( profileDef ).map(( it ) => { featuresHash[it] = true; });
                    if( clientType === 'public' ){
                        featuresHash.openid = true;
                    }
                    if( Organizations.fn.wantsPkce( Template.currentData().organization )){
                        featuresHash.pkce = true;
                    }
                    selected = Providers.byFeatures( Object.keys( featuresHash ));
                    Object.keys( selected ).forEach(( it ) => {
                        Clients.fn.selectedProvidersAdd( self.APP.callingArgs, it );
                    });
                }
            }
        }
    });
});

Template.client_new_assistant_providers.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP
        };
    },

    // parms for re-use the client_edit providers panel
    parmsProvidersPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            checker: this.parentAPP.checker,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_providers.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-providers'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    // we can continue even if we do not have any selected provider
    //  we will not have any grant type, nor auth method or anything, but we can have a client Id and edit it later
    'assistant-pane-shown .c-client-new-assistant-providers'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: true });
    },
    // on Next, non-reactively feed the record
    'assistant-action-next .c-client-new-assistant-providers'( event, instance ){
        const record = this.parentAPP.entity.get().DYN.records[0].get();
        record.selectedProviders = this.parentAPP.assistantStatus.get( 'selectedProviders' );
    }
});
