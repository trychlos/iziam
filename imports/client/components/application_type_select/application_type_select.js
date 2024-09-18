/*
 * /imports/client/components/application_type_select/application_type_select.js
 *
 * Select an application type (an OpenID optional parameter).
 * 
 * Parms:
 * - selected: the currently selected type
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - application-type-selected: the new selected type
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ApplicationType } from '/imports/common/definitions/application-type.def.js';

import './application_type_select.html';

Template.application_type_select.helpers({
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
        return ApplicationType.id( it );
    },

    // return the item label
    itLabel( it ){
        return ApplicationType.label( it );
    },

    // return the list of known items
    itemsList(){
        return ApplicationType.Knowns();
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === ApplicationType.id( it )) ? 'selected' : '';
    }
});

Template.application_type_select.events({
    'change .c-application-type-select'( event, instance ){
        instance.$( '.c-application-type-select' ).trigger( 'application-type-selected', { selected: instance.$(  '.c-application-type-select select option:selected' ).val() });
    },

    // we are asked to clear the selection
    'iz-clear .c-application-type-select'( event, instance ){
        instance.$( '.c-application-type-select select' ).prop( 'selectedIndex', 0 );
    }
});
