/*
 * /imports/client/components/jwk_use_select/jwk_use_select.js
 *
 * Select a JSON Web Key usage.
 * 
 * Parms:
 * - selected: the currently selected usage
 * - disabled: whether the component should be disabled
 * 
 * Events:
 * - jwk-use-selected: the new selected usage
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { JwkUse } from '/imports/common/definitions/jwk-use.def.js';

import './jwk_use_select.html';

Template.jwk_use_select.helpers({
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
        return JwkUse.id( it );
    },

    // return the item label
    itLabel( it ){
        return JwkUse.label( it );
    },

    // return the list of known items
    itemsList(){
        return JwkUse.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === JwkUse.id( it )) ? 'selected' : '';
    }
});

Template.jwk_use_select.events({
    'change .c-jwk-use-select'( event, instance ){
        instance.$( '.c-jwk-use-select' ).trigger( 'jwk-use-selected', { selected: instance.$(  '.c-jwk-use-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-jwk-use-select'( event, instance ){
        instance.$( '.c-jwk-use-select select' ).prop( 'selectedIndex', 0 );
    }
});
