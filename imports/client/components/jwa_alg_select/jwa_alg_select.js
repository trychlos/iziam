/*
 * /imports/client/components/jwa_alg_select/jwa_alg_select.js
 *
 * Select a JSON Web Algorithm.
 * 
 * Parms:
 * - list: an array of selectable algorithm definitions, defaulting to all knowns algorithms (which is most probably not what you want)
 * - selected: the currently selected algorithm
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - jwa-alg-selected: the new selected algorithm
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';

import './jwa_alg_select.html';

Template.jwa_alg_select.helpers({
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
        return JwaAlg.id( it );
    },

    // return the item label
    itLabel( it ){
        return JwaAlg.label( it );
    },

    // return the list of known items
    itemsList(){
        return this.list || JwaAlg.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === JwaAlg.id( it )) ? 'selected' : '';
    }
});

Template.jwa_alg_select.events({
    'change .c-jwa-alg-select'( event, instance ){
        instance.$( '.c-jwa-alg-select' ).trigger( 'jwa-alg-selected', { selected: instance.$(  '.c-jwa-alg-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-jwa-alg-select'( event, instance ){
        instance.$( '.c-jwa-alg-select select' ).prop( 'selectedIndex', 0 );
    }
});
