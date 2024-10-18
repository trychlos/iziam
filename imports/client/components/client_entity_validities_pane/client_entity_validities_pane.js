/*
 * /imports/client/components/client_entity_validities_pane/client_entity_validities_pane.js
 *
 * Manages a ValidityTabbed tabbed pane, where each pane is a validity period.
 *
 * Parms:
 * - item: a ReactiveVar which holds the client entity to edit
 * - checker: the parent Checker
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './client_entity_validities_pane.html';

Template.client_entity_validities_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Checker instance
        checker: new ReactiveVar( null )
    };
});

Template.client_entity_validities_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                data: {
                    item: Template.currentData().item
                }
            }));
        }
    });
});

Template.client_entity_validities_pane.helpers({
    // manage the ValidityTabbed panel
    parmsValidities(){
        return {
            ...this,
            checker: Template.instance().APP.checker
        };
    }
});
