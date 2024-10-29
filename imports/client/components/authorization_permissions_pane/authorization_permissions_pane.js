/*
 * /imports/client/components/authorization_permissions_pane/authorization_permissions_pane.js
 *
 * Manage the permissions of an authorization.
 *
 * Parms:
 * - entity: the current organization entity with its DYN sub-object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the currently edited authorization
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/authorization_permission_row/authorization_permission_row.js';

import './authorization_permissions_pane.html';

Template.authorization_permissions_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // current count of permissions
        count: new ReactiveVar( 0 ),
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // add an empty item to the permissions array
        addOne( dataContext ){
            const item = dataContext.item.get();
            item.permissions = item.permissions || [];
            item.permissions.push({
                _id: Random.id()
            });
            dataContext.item.set( item );
        }
    };

    // keep the count of rows up to date
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.count.set(( item.permissions || [] ).length );
    });
});

Template.authorization_permissions_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'authorization_permissions_pane',
                parent: parentChecker
            }));
        }
    });
});

Template.authorization_permissions_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // contact permissions list
    itemsList(){
        return this.item.get().permissions || [];
    },

    // passes the same data context, just replacing the parent checker by our own
    parmsPermissionRow( it ){
        const parms = { ...this };
        parms.checker = Template.instance().APP.checker;
        parms.it = it;
        return parms;
    },

    // whether the plus button is enabled
    plusDisabled(){
        const checker = Template.instance().APP.checker.get();
        const valid = checker ? checker.iStatusableValidity() : false;
        return valid ? '' : 'disabled';
    }
});

Template.authorization_permissions_pane.events({
    'click .c-authorization-permissions-pane .js-plus'( event, instance ){
        instance.APP.addOne( this );
    }
});
