/*
 * pwix:tenants-manager/src/client/components/organization_config_pane/organization_config_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_config_pane.html';

Template.organization_config_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            wantsOAuth21: {
                js: '.js-oauth21'
            },
            wantsPkce: {
                js: '.js-pkce'
            }
        },
        // the Checker instance
        checker: new ReactiveVar( null )
    };

    // setup some default values in the organization record (must be same than those defined in fieldset)
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        let record = entity.DYN.records[dataContext.index].get();
        if( !Object.keys( record ).includes( 'wantsOAuth21' )){
            record.wantsOAuth21 = true;
        }
        if( !Object.keys( record ).includes( 'wantsPkce' )){
            record.wantsPkce = true;
        }
    });
});

Template.organization_config_pane.onRendered( function(){
    const self = this;
    const dataContext = Template.currentData();

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get(),
                checkStatusShow: Forms.C.CheckStatus.NONE
            }));
        }
    });
});

Template.organization_config_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
