/*
 * /imports/client/components/gender_select/gender_select.js
 *
 * Select an identity gender.
 * 
 * Parms:
 * - selected: the current gender
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { Gender } from '/imports/common/definitions/gender.def.js';

import './gender_select.html';

Template.gender_select.helpers({
    // whether we have a currently selected client type ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // return the list of known client types
    itemsList(){
        return Gender.Knowns();
    },

    // return the client type identifier
    itId( it ){
        return Gender.id( it );
    },

    // return the client type label
    itLabel( it ){
        return Gender.label( it );
    },

    // whether the current client type is selected
    itSelected( it ){
        return ( this.selected === Gender.id( it )) ? 'selected' : '';
    }
});

Template.gender_select.events({
    'change .c-gender-select'( event, instance ){
        instance.$( '.c-gender-select' ).trigger( 'gender-select', {
            type: instance.$( '.c-gender-select select option:selected' ).val()
        });
    }
});
