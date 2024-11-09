/*
 * /imports/client/components/identity_groups_pane/identity_groups_pane.js
 *
 * Identity groups pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { IdentityGroupType } from '/imports/common/definitions/identity-group-type.def.js';

import '/imports/client/components/groups_tree_select/groups_tree_select.js';

import './identity_groups_pane.html';

Template.identity_groups_pane.onCreated( function(){
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
        self.APP.groups.set( self.APP.organization.get().DYN.identities_groups.get());
    });

    // protect new identity
    self.autorun(() => {
        const item = Template.currentData().item.get();
        item.DYN = item.DYN || {};
        item.DYN.memberOf = item.DYN.memberOf || { all: [], direct: [] };
    });
});

Template.identity_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for groups_tree_select
    parmsTreeSelect(){
        return {
            groupsRv: Template.instance().APP.groups,
            groupsDef: IdentityGroupType,
            editable: false,
            withIdentities: false,
            memberOf: this.item.get().DYN.memberOf
        };
    }
});

Template.identity_groups_pane.events({
    'groups-selected .c-identity-groups-pane'( event, instance, data ){
        this.item.get().DYN.memberOf = data.memberOf;
    }
});
