/*
 * /imports/client/components/zoneinfo_select/zoneinfo_select.js
 *
 * Select a zoneinfo.
 * 
 * Parms:
 * - selected: the current zoneinfo
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { Zoneinfo } from '/imports/common/definitions/zoneinfo.def.js';

import './zoneinfo_select.html';

Template.zoneinfo_select.helpers({
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
        return Zoneinfo.Knowns();
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

Template.zoneinfo_select.events({
    'change .c-zoneinfo-select'( event, instance ){
        instance.$( '.c-zoneinfo-select' ).trigger( 'zoneinfo-select', {
            type: instance.$( '.c-zoneinfo-select select option:selected' ).val()
        });
    }
});
