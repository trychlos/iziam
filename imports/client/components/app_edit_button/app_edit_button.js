/*
 * /imports/client/components/app_edit_button/app_edit_button.js
 *
 *  Display a edition button when the user is allowed to edit the current page in an editable environment.
 * 
 *  This is a toggle button, which may be:
 *  - not visible at all (user not connected or not allowed)
 *  - off: user is allowed but didn't have chosen to edit, editor is in STANDARD mode
 *  - on: user is allowed and want edit, editor is in PREVIEW mode
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './app_edit_button.html';

Template.app_edit_button.onRendered( function(){
    const self = this;

    // hide or show the button
    self.autorun(() => {
        if( Meteor.APP.runContext.editAllowed()){
            self.$( '.c-edit-button' ).show();
        } else {
            self.$( '.c-edit-button' ).hide();
        }
    });
});

Template.app_edit_button.helpers({
    toggleParms(){
        return {
            labelLeft: pwixI18n.label( I18N, 'header.switch_label' ),
            title: pwixI18n.label( I18N, 'header.switch_title' ),
            name: 'editionButton',
            state: Meteor.APP.runContext.editionAsked()
        }
    },
    // remind that helpers are first triggered before full initialization
    wantSwitch(){
        const currentPage = Meteor.APP.runContext.page();
        const settings = Meteor.settings.public[Meteor.APP.name].environment;
        const wantSwitch = currentPage && settings ? currentPage.get( 'wantEditionSwitch' ) && settings.wantEditionSwitch === true : false;
        //console.debug( 'wantSwitch', wantSwitch );
        return wantSwitch;
    }
});

Template.app_edit_button.events({
    'ts-state .c-app-edit-button'( event, instance, data ){
        Meteor.APP.runContext.editionAsked( data.state );
    }
});
