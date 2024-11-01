/*
 * /imports/client/components/howcount_select/howcount_select.js
 *
 * Select a How to Count.
 * 
 * Parms:
 * - selected: the current howcount
 * - disabled: whether the select box mus tbe disabled, defaulting to false
 * - isMax: whether to dsiplay a list for selecting a max count, defaulting to false
 * 
 * When selecting a minimum count, we want either an 'exactly' or an 'at least' options.
 * Wehn selecting a max count, (if min count is not exactly), then we do not want 'at least', but rather 'at most'
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { pwixI18n } from 'meteor/pwix:i18n';

import { HowCount } from '/imports/common/definitions/how-count.def.js';

import './howcount_select.html';

Template.howcount_select.helpers({
    // whether we have a currently selected howcount ?
    disabled(){
        return this.disabled === true ? 'disabled' : '';
    },

    // whether we have a currently selected howcount ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // return the list of known client types
    itemsList(){
        return HowCount.KnownsFor( this.isMax === true );
    },

    // return the client type identifier
    itId( it ){
        return HowCount.id( it );
    },

    // return the client type label
    itLabel( it ){
        return HowCount.label( it );
    },

    // whether the current client type is selected
    itSelected( it ){
        return ( this.selected === it ) ? 'selected' : '';
    }
});

Template.howcount_select.events({
    'change .c-howcount-select'( event, instance ){
        instance.$( '.c-howcount-select' ).trigger( 'howcount-select', {
            type: instance.$( '.c-howcount-select select option:selected' ).val()
        });
    }
});
