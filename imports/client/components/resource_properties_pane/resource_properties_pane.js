/*
 * /imports/client/components/resource_properties_pane/resource_properties_pane.js
 *
 * Manage a resource, maybe empty but have at least an _id.
 *
 * Parms:
 * - entity: the Organization entity object with its DYN sub-object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the resource item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Resources } from '/imports/common/collections/resources/index.js';

import './resource_properties_pane.html';

Template.resource_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // the fields in this panel
        fields: {
            'label': {
                js: '.js-label'
            },
            'name': {
                js: '.js-name'
            },
            'startingAt': {
                js: '.js-starting'
            },
            'endingAt': {
                js: '.js-ending'
            }
        }
    };
});

Template.resource_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    // NB: cannot use Forms.FormField defaults as the schema name addresses the full Organization record
    //  while this panel only addresses a single JWK
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'resource_properties_pane',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, Resources.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    item: itemRv
                },
                setForm: itemRv.get()
            }));
        }
    });
});

Template.resource_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the DateInput
    parmsEndDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'resources.edit.ending_ph' ),
            withHelp: true
        };
    },

    // parms for the DateInput
    parmsStartDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'resources.edit.starting_ph' ),
            withHelp: true
        };
    }
});

Template.resource_properties_pane.events({
    /*
    // generate the resource
    'click .js-generate'( event, instance ){
        instance.APP.generate( this.item );
    },
    */
    // reset the algorithm on any change on usage or crypto family
    'resource-use-selected .c-resource-properties-pane'( event, instance, data ){
        instance.APP.resetAlg( this.item.get());
    },
    'resource-kty-selected .c-resource-properties-pane'( event, instance, data ){
        instance.APP.resetAlg( this.item.get());
    }
});
