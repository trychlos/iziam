/*
 * /imports/client/components/auth_subject_select/auth_subject_select.js
 *
 * Select a Authorization Subject Type.
 * 
 * Parms:
 * - selected: the currently selected subject type
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - auth-subject-selected: the new selected subject type
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthSubject } from '/imports/common/definitions/auth-subject.def.js';

import './auth_subject_select.html';

Template.auth_subject_select.helpers({
    // whether we have a currently selected item ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether the component should be disabled
    isDisabled(){
        return this.disabled === true ? 'disabled' : '';
    },

    // return the item identifier
    itId( it ){
        return AuthSubject.id( it );
    },

    // return the item label
    itLabel( it ){
        return AuthSubject.label( it );
    },

    // return the list of known items
    itemsList(){
        return this.list || AuthSubject.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === AuthSubject.id( it )) ? 'selected' : '';
    }
});

Template.auth_subject_select.events({
    'change .c-auth-subject-select'( event, instance ){
        instance.$( '.c-auth-subject-select' ).trigger( 'auth-subject-selected', { selected: instance.$(  '.c-auth-subject-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-jwa-alg-select'( event, instance ){
        instance.$( '.c-auth-subject-select select' ).prop( 'selectedIndex', 0 );
    }
});
