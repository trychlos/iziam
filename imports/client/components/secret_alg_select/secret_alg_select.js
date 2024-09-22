/*
 * /imports/client/components/secret_alg_select/secret_alg_select.js
 *
 * Select an HMAC Algorithm.
 * 
 * Parms:
 * - selected: the currently selected algorithm
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - secret-alg-selected: the new selected algorithm
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { SecretAlg } from '/imports/common/definitions/secret-alg.def.js';

import './secret_alg_select.html';

Template.secret_alg_select.helpers({
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
        return SecretAlg.id( it );
    },

    // return the item label
    itLabel( it ){
        return SecretAlg.label( it );
    },

    // return the list of known items
    itemsList(){
        return SecretAlg.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === SecretAlg.id( it )) ? 'selected' : '';
    }
});

Template.secret_alg_select.events({
    'change .c-secret-alg-select'( event, instance ){
        instance.$( '.c-secret-alg-select' ).trigger( 'secret-alg-selected', { selected: instance.$(  '.c-secret-alg-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-secret-alg-select'( event, instance ){
        instance.$( '.c-secret-alg-select select' ).prop( 'selectedIndex', 0 );
    }
});
