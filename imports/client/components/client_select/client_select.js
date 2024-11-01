/*
 * /imports/client/components/client_select/client_select.js
 *
 * Select a client.
 * 
 * Parms:
 * - list: the selectable clients
 * - selected: the currently selected type
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - client-selected: the new selected client
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './client_select.html';

Template.client_select.helpers({
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
        return it._id;
    },

    // return the item label
    itLabel( it ){
        return it.DYN.closest.label;
    },

    // return the list of known items
    itemsList(){
        return this.list;
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === it._id ) ? 'selected' : '';
    }
});

Template.client_select.events({
    'change .c-client-select'( event, instance ){
        instance.$( '.c-client-select' ).trigger( 'client-selected', { selected: instance.$(  '.c-client-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-client-select'( event, instance ){
        instance.$( '.c-client-select select' ).prop( 'selectedIndex', 0 );
    }
});
