/*
 * /imports/client/components/organization_mandatory_pane/organization_mandatory_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_mandatory_pane.html';

Template.organization_mandatory_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            label: {
                js: '.js-label'
            },
            baseUrl: {
                js: '.js-baseurl'
            }
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null )
    };

    // track the entity content
    self.autorun(() => {
        const dc = Template.currentData();
        console.debug( 'record', dc.entity.get().DYN.records[dc.index].get());
    });
});

Template.organization_mandatory_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: record
            }));
        }
    });
});

Template.organization_mandatory_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // for label
    itFor( label ){
        return 'organization_mandatory_'+label+'_'+this.index;
    },
});
