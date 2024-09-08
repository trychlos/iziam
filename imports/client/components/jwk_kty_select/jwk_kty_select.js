/*
 * /imports/client/components/jwk_kty_select/jwk_kty_select.js
 *
 * Select a JSON Web Key key type, which identifies the cryptographic algorith family to be used with this key.
 * 
 * Parms:
 * - selected: the currently selected algorithm
 * 
 * Events:
 * - jwk-kty-selected: the new selected algorithm
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { JwkKty } from '/imports/common/definitions/jwk-kty.def.js';

import './jwk_kty_select.html';

Template.jwk_kty_select.helpers({
    // whether we have a currently selected item ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // return the item identifier
    itId( it ){
        return JwkKty.id( it );
    },

    // return the item label
    itLabel( it ){
        return JwkKty.label( it );
    },

    // return the list of known items
    itemsList(){
        return JwkKty.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === JwkKty.id( it )) ? 'selected' : '';
    }
});

Template.jwk_kty_select.events({
    'change .c-jwk-kty-select'( event, instance ){
        instance.$( '.c-jwk-kty-select' ).trigger( 'jwk-kty-selected', { selected: instance.$(  '.c-jwk-kty-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-jwk-kty-select'( event, instance ){
        instance.$( '.c-jwk-kty-select select' ).prop( 'selectedIndex', 0 );
    }
});
