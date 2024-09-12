/*
 * /imports/client/components/client_profile_select/client_profile_select.js
 *
 * Select the client nature.
 * 
 * Parms:
 * - selected: the current client profile
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';

import './client_profile_select.html';

Template.client_profile_select.helpers({
    // whether we have a currently selected client nature ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // return the list of known client natures
    itemsList(){
        return ClientProfile.Knowns();
    },

    // return the client nature identifier
    itId( it ){
        return ClientProfile.id( it );
    },

    // return the client nature label
    itLabel( it ){
        return ClientProfile.label( it );
    },

    // whether the current client nature is selected
    itSelected( it ){
        return ( this.selected === ClientProfile.id( it )) ? 'selected' : '';
    }
});

Template.client_profile_select.events({
    'change .c-client-profile-select'( event, instance ){
        instance.$( '.c-client-profile-select' ).trigger( 'client-profile-select', {
            nature: instance.$( '.c-client-profile-select select option:selected' ).val()
        });
    }
});
