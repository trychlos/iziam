/*
 * /imports/client/components/client_groups_pane/client_groups_pane.js
 *
 * Client groups pane.
 * Let the clients manager select the groups this client is member of.
 * Note that groups are attached at the client entity level, NOT to the client record.
 * 
 * Parms:
 * - entity: a ReactiveVar which holds the client entity to edit (may be empty, but not null), with its DYN sub-object
 * - checker: a ReactiveVar which holds the parent Checker
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientGroupType } from '/imports/common/definitions/client-group-type.def.js';

import '/imports/client/components/groups_tree_select/groups_tree_select.js';

import './client_groups_pane.html';

Template.client_groups_pane.onCreated( function(){
    const self = this;
    
    self.APP = {
        // address the *saved* organization entity
        organization: new ReactiveVar( [] ),
        // the groups
        groups: new ReactiveVar( [] )
    };

    // address the organization entity
    self.autorun(() => {
        const item = Template.currentData().organization;
        self.APP.organization.set( TenantsManager.list.byEntity( item._id ));
    });

    // address the groups
    self.autorun(() => {
        self.APP.groups.set( self.APP.organization.get().DYN.clients_groups.get());
    });
});

Template.client_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for groups_tree_select
    parmsTreeSelect(){
        return {
            groupsRv: Template.instance().APP.groups,
            groupsDef: ClientGroupType,
            editable: false,
            withClients: false,
            memberOf: this.entity.get().DYN.memberOf
        };
    }
});

Template.client_groups_pane.events({
    'groups-selected .c-client-groups-pane'( event, instance, data ){
        this.entity.get().DYN.memberOf = data.memberOf;
    }
});
