/*
 * /imports/client/components/secret_encoding_select/secret_encoding_select.js
 *
 * Select an HMAC Algorithm for a client secret.
 * 
 * Parms:
 * - selected: the currently selected encoding
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - secret-encoding-selected: the new selected algorithm
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { SecretEncoding } from '/imports/common/definitions/secret-encoding.def.js';

import './secret_encoding_select.html';

Template.secret_encoding_select.helpers({
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
        return SecretEncoding.id( it );
    },

    // return the item label
    itLabel( it ){
        return SecretEncoding.label( it );
    },

    // return the list of known items
    itemsList(){
        return SecretEncoding.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === SecretEncoding.id( it )) ? 'selected' : '';
    }
});

Template.secret_encoding_select.events({
    'change .c-secret-encoding-select'( event, instance ){
        instance.$( '.c-secret-encoding-select' ).trigger( 'secret-encoding-selected', { selected: instance.$(  '.c-secret-encoding-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-secret-encoding-select'( event, instance ){
        instance.$( '.c-secret-encoding-select select' ).prop( 'selectedIndex', 0 );
    }
});
