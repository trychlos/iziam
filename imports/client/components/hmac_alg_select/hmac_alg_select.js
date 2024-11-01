/*
 * /imports/client/components/hmac_alg_select/hmac_alg_select.js
 *
 * Select an HMAC Algorithm.
 * 
 * Parms:
 * - selected: the currently selected algorithm
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - hmac-alg-selected: the new selected algorithm
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { HmacAlg } from '/imports/common/definitions/hmac-alg.def.js';

import './hmac_alg_select.html';

Template.hmac_alg_select.helpers({
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
        return HmacAlg.id( it );
    },

    // return the item label
    itLabel( it ){
        return HmacAlg.label( it );
    },

    // return the list of known items
    itemsList(){
        return HmacAlg.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === HmacAlg.id( it )) ? 'selected' : '';
    }
});

Template.hmac_alg_select.events({
    'change .c-hmac-alg-select'( event, instance ){
        instance.$( '.c-hmac-alg-select' ).trigger( 'hmac-alg-selected', { selected: instance.$(  '.c-hmac-alg-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-hmac-alg-select'( event, instance ){
        instance.$( '.c-hmac-alg-select select' ).prop( 'selectedIndex', 0 );
    }
});
