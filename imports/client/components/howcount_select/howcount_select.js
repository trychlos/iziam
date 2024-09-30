/*
 * /imports/client/components/howcount_select/howcount_select.js
 *
 * Select a How to Count.
 * 
 * Parms:
 * - selected: the current howcount
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { HowCount } from '/imports/common/definitions/how-count.def.js';

import './howcount_select.html';

Template.howcount_select.helpers({
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
        return HowCount.Knowns();
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
