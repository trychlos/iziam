/*
 * /imports/client/components/group_properties_pane/group_properties_pane.js
 *
 * Group properties pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the group object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - organization: the full organization entity with its DYN sub-object
 * - targetDatabase: whether the new group is to be storfed in the database, defaulting to true
 * - groupsRv: when targetDatabase is false, a ReactiveVar which contains the groups where the group item is to be pushed if new, or changed
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Groups } from '/imports/common/collections/groups/index.js';

import './group_properties_pane.html';

Template.group_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            label: {
                js: '.js-label'
            }
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null )
    };
});

Template.group_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            const item = Template.currentData().item.get();
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'group_properties_pane',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, Groups.fieldSet.get()),
                data: {
                    item: Template.currentData().item,
                    organization: Template.currentData().organization,
                    targetDatabase: Template.currentData().targetDatabase,
                    groupsRv: Template.currentData().groupsRv
                },
                setForm: item
            }));
        }
    });
});

Template.group_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
});

Template.group_properties_pane.events({
    // ask for clear the panel
    'iz-clear-panel .c-group-properties-panel'( event, instance ){
        instance.APP.checker.get().clearPanel();
    },
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-group-properties-panel'( event, instance, enabled ){
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
    }
});
