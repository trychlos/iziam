/*
 * /imports/client/components/auth_object_select/auth_object_select.js
 *
 * Select an Authorization Object Type.
 * 
 * Parms:
 * - list: the selectable items list, defaulting to AuthObject.Knowns()
 * - selected: the currently selected type
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - auth-object-selected: the new selected algorithm
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthObject } from '/imports/common/definitions/auth-object.def.js';

import './auth_object_select.html';

Template.auth_object_select.helpers({
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
        return AuthObject.id( it );
    },

    // return the item label
    itLabel( it ){
        return AuthObject.label( it );
    },

    // return the list of known items
    itemsList(){
        return this.list || AuthObject.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === AuthObject.id( it )) ? 'selected' : '';
    }
});

Template.auth_object_select.events({
    'change .c-auth-object-select'( event, instance ){
        instance.$( '.c-auth-object-select' ).trigger( 'auth-object-selected', { selected: instance.$(  '.c-auth-object-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-auth-object-select'( event, instance ){
        instance.$( '.c-auth-object-select select' ).prop( 'selectedIndex', 0 );
    }
});
