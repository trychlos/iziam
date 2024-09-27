/*
 * /imports/client/components/locale_select/locale_select.js
 *
 * Select a locale.
 * 
 * Parms:
 * - selected: the current locale
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { Locale } from '/imports/common/definitions/locale.def.js';

import './locale_select.html';

Template.locale_select.helpers({
    // whether we have a currently selected client type ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // return the list of known client types
    itemsList(){
        return Locale.Knowns();
    },

    // return the client type identifier
    itId( it ){
        return it;
    },

    // return the client type label
    itLabel( it ){
        return it;
    },

    // whether the current client type is selected
    itSelected( it ){
        return ( this.selected === it ) ? 'selected' : '';
    }
});

Template.locale_select.events({
    'change .c-locale-select'( event, instance ){
        instance.$( '.c-locale-select' ).trigger( 'locale-select', {
            type: instance.$( '.c-locale-select select option:selected' ).val()
        });
    }
});
