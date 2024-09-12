/*
 * /imports/client/components/client_type_select/client_type_select.js
 *
 * Select the client nature.
 * 
 * Parms:
 * - selected: the current client profile
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientType } from '/imports/common/definitions/client-type.def.js';

import './client_type_select.html';

Template.client_type_select.helpers({
    // whether we have a currently selected client nature ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // return the list of known client natures
    itemsList(){
        return ClientType.Knowns();
    },

    // return the client nature identifier
    itId( it ){
        return ClientType.id( it );
    },

    // return the client nature label
    itLabel( it ){
        return ClientType.label( it );
    },

    // whether the current client nature is selected
    itSelected( it ){
        return ( this.selected === ClientType.id( it )) ? 'selected' : '';
    }
});

Template.client_type_select.events({
    'change .c-client-type-select'( event, instance ){
        instance.$( '.c-client-type-select' ).trigger( 'client-type-select', {
            nature: instance.$( '.c-client-type-select select option:selected' ).val()
        });
    }
});
