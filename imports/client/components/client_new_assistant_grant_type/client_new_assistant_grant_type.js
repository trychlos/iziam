/*
 * /imports/client/components/client_new_assistant_grant_type/client_new_assistant_grant_type.js
 *
 * Grant types are selectable by nature of grant type:
 * - one for the access token
 * - maybe one for the refresh token
 * - maybe several for the token formaters
 * 
 * Grant types are only selectables when at least one provider has been chosen.
 * In other words, this pane is only enabled when there is at least one selected provider.
 *
 * Parms:
* - parentAPP: the assistant APP whole object
*/

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { GrantNature } from '/imports/common/definitions/grant-nature.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_new_assistant_grant_type.html';

Template.client_new_assistant_grant_type.onCreated( function(){
    const self = this;

    self.APP = {
        selectables: new ReactiveVar( {} )
    };

    // set the selectables list
    self.autorun(() => {
        const selectables = GrantType.Selectables( Template.currentData().parentAPP.assistantStatus.get( 'selectedProviders' ));
        self.APP.selectables.set( selectables );
    });
});

Template.client_new_assistant_grant_type.onRendered( function(){
    const self = this;

    // tracks the selected providers to enable/disable this pane
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'selectedProviders' );
        self.$( '.c-client-new-assistant-grant-type' ).trigger( 'assistant-do-enable-tab', { name: 'grant',  enabled: selected && selected.length > 0 });
    });

    // set a default grant type if one is defined for this client profile
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'grant' ){
        }
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    // the grant natures which have a mandatory nature must be set
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'grant' ){
            const array = dataDict.get( 'grantTypes' ) || [];
            self.$( '.c-client-new-assistant-grant-type' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: GrantType.isValidSelection( self.APP.selectables.get(), array )});
        }
    });
});

Template.client_new_assistant_grant_type.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( nature, it ){
        const id = GrantType.id( it );
        return ( this.parentAPP.assistantStatus.get( 'grantTypes' ) || [] ).includes( id ) ? 'checked' : '';
    },

    // description
    itDescription( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return selectables[nature] ? GrantType.description( selectables[nature].types[it] ) : null;
    },

    // whether this input element is a checkbox or a radio button ?
    itInputType( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return selectables[nature] ? ( GrantNature.acceptSeveral( selectables[nature].def ) ? 'checkbox' : 'radio' ) : null;
    },

    // label
    itLabel( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return selectables[nature] ? GrantType.label( selectables[nature].types[it] ) : '';
    },

    // whether this item is selected ?
    itSelected( it ){
        const id = GrantType.id( it );
        return ( this.parentAPP.assistantStatus.get( 'grantTypes' ) || [] ).includes( id ) ? 'selected' : null;
    },

    // selectable list for one grant nature
    itemsList( nature ){
        const selectables = Template.instance().APP.selectables.get();
        return nature && selectables[nature] ? Object.keys( selectables[nature].types ) : [];
    },

    // a label for the grant nature
    natureHeader( nature ){
        const selectables = Template.instance().APP.selectables.get();
        const natureDef = nature && selectables[nature] ? selectables[nature].def : null;
        return natureDef ? GrantNature.label( natureDef ) : '';
    },

    // list of available natures
    naturesList(){
        return Object.keys( Template.instance().APP.selectables.get());
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP
        };
    }
});

Template.client_new_assistant_grant_type.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-grant-type'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-grant-type'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
    },
    // handle the pane input
    'input input.js-check'( event, instance ){
        let array = [];
        instance.$( '.chooser input:checked' ).each( function(){
            array.push( instance.$( this ).prop( 'id' ));
        });
        this.parentAPP.assistantStatus.set( 'grantTypes', array );
    },
    // on Next, non-reactively feed the record
    'assistant-action-next .c-client-new-assistant-grant-type'( event, instance ){
        const record = this.parentAPP.entity.get().DYN.records[0].get();
        const grantTypes = this.parentAPP.assistantStatus.get( 'grantTypes' ) || [];
        record.grantTypes = grantTypes;
    }
});
