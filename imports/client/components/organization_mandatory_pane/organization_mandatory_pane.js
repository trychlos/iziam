/*
 * /imports/client/components/organization_mandatory_pane/organization_mandatory_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

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

    // advertize the assistant of the status of this panel
    self.autorun(() => {
        const checker = self.APP.checker.get();
        if( checker ){
            const status = checker.status();
            const validity = checker.validity();
            self.$( '.c-client-properties-panel' ).trigger( 'iz-checker', { status: status, validity: validity });
        }
    });
});

Template.organization_mandatory_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});