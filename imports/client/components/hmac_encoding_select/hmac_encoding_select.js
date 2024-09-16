/*
 * /imports/client/components/hmac_encoding_select/hmac_encoding_select.js
 *
 * Select an HMAC Algorithm.
 * 
 * Parms:
 * - selected: the currently selected encoding
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - hmac-encoding-selected: the new selected algorithm
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { HmacEncoding } from '/imports/common/definitions/hmac-encoding.def.js';

import './hmac_encoding_select.html';

Template.hmac_encoding_select.helpers({
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
        return HmacEncoding.id( it );
    },

    // return the item label
    itLabel( it ){
        return HmacEncoding.label( it );
    },

    // return the list of known items
    itemsList(){
        return HmacEncoding.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === HmacEncoding.id( it )) ? 'selected' : '';
    }
});

Template.hmac_encoding_select.events({
    'change .c-hmac-encoding-select'( event, instance ){
        instance.$( '.c-hmac-encoding-select' ).trigger( 'hmac-encoding-selected', { selected: instance.$(  '.c-hmac-encoding-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-hmac-encoding-select'( event, instance ){
        instance.$( '.c-hmac-encoding-select select' ).prop( 'selectedIndex', 0 );
    }
});
