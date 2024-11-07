/*
 * /imports/client/components/resource_select/resource_select.js
 *
 * Select a clients group.
 * 
 * Parms:
 * - list: the list of selectable resources
 * - selected: the currently selected resource
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - resource-selected: the new selected clients group
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './resource_select.html';

Template.resource_select.helpers({
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
        return it._id;
    },

    // return the item label
    itLabel( it ){
        return it.name;
    },

    // return the list of known items
    itemsList(){
        return this.list;
    },

    // whether the current item is selected
    itSelected( it ){
        return ( this.selected === it._id ) ? 'selected' : '';
    }
});

Template.resource_select.events({
    'change .c-resource-select'( event, instance ){
        let found = null;
        const selectedId = instance.$( '.c-resource-select select option:selected' ).val();
        this.list.every(( it ) => {
            if( it._id === selectedId ){
                found = it;
            }
            return !found;
        });
        instance.$( '.c-resource-select' ).trigger( 'resource-selected', { selected: selectedId, label: found ? found.name : '' });
    },

    // we are asked to clear the selection
    'iz-clear .c-resource-select'( event, instance ){
        instance.$( '.c-resource-select select' ).prop( 'selectedIndex', 0 );
    }
});
