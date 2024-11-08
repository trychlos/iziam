/*
 * /imports/client/components/organization_clients_groups_pane/organization_clients_groups_pane.js
 *
 * Display the groups.
 * 
 * +- <this>
 *     |
 *     +- client_group_new_button
 *     |   |
 *     |   +-> trigger client_group_edit_dialog
 *     |
 *     +- clients_groups_tree_view
 *         |
 *         +- groups_tree
 *         |
 *         +- groups_buttons
 *         |
 *         +-> trigger clients_groups_edit_dialog
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { ClientGroupType } from '/imports/common/definitions/client-group-type.def.js';

import '/imports/client/components/groups_tree_view/groups_tree_view.js';

import './organization_clients_groups_pane.html';

Template.organization_clients_groups_pane.onCreated( function(){
    const self = this;

    self.APP = {
        // address the *saved* organization entity
        organization: new ReactiveVar( [] ),
        // the groups
        groups: new ReactiveVar( [] )
    };

    // address the organization entity
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.organization.set( TenantsManager.list.byEntity( item._id ));
    });

    // address the groups
    self.autorun(() => {
        self.APP.groups.set( self.APP.organization.get().DYN.clients_groups.get());
    });
});

Template.organization_clients_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for groups_tree_vew
    parmsTreeView(){
        return {
            item: this.item,
            checker: this.checker,
            groupsRv: Template.instance().APP.groups,
            groupsDef: ClientGroupType,
        };
    }
});
