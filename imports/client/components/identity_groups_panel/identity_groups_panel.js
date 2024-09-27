/*
 * /imports/client/components/identity_groups_panel/identity_groups_panel.js
 *
 * Identity groups panel.
 * 
 * Parms:
 * - item: a Reactive Var which contains the edited item (contains at least an 'organization' field)
 * - entityChecker: the EntityChecker attached to the dialog
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/jquery/jqw-table/jqw-table.js';

import './identity_groups_panel.html';

Template.identity_groups_panel.onCreated( function(){
    const self = this;

    self.APP = {
        sendPanelData( membership ){
            self.$( '.c-identity-groups-panel' ).trigger( 'panel-data', {
                emitter: 'groups',
                ok: true,
                data: membership
            });
        }
    };
});

Template.identity_groups_panel.onRendered( function(){
    const self = this;

    self.$( 'table.js-table' ).jqwTable();

    // relabel jqwTable headers when language changes
    //  argument is not used, but triggers the autorun when language changes
    self.autorun(() => {
        self.$( 'table.js-table' ).jqwTable( 'relabel', pwixI18n.language());
    });

    // send ASAP current data
    const membership = Template.currentData().item.get().DYN.membership.map( doc => doc.o._id );
    self.APP.sendPanelData( membership );
});

Template.identity_groups_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for group selection
    parmsGroups(){
        return {
            organization: this.item.organization,
            options: {
                isOpen: true,
                keepOpen: true
            },
            selected: this.item.get().DYN.membership.map( o => o._id )
        }
    }
});

Template.identity_groups_panel.events({
    // group selection
    'groups-selected .c-identity-groups-panel'( event, instance, data ){
        instance.APP.sendPanelData( data.selected );
    },

    // ask for clear the panel
    'iz-clear-panel .c-identity-groups-panel'( event, instance ){
        instance.APP.form.get().clear();
    }
});
