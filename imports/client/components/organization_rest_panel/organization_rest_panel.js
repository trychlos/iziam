/*
 * /imports/client/components/organization_rest_panel/organization_rest_panel.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 * - enableChecks: when inside of an assistant, defaulting to true
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_rest_panel.html';

Template.organization_rest_panel.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            baseUrl: {
                js: '.js-baseurl'
            }
        },
        // the Checker instance
        checker: new ReactiveVar( null ),

        // advertise of the checker status
        advertise( checker ){
            const status = checker.status();
            const validity = checker.validity();
            self.$( '.c-organization-rest-panel' ).trigger( 'iz-checker', { status: status, validity: validity });
        }
    };
});

Template.organization_rest_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get(),
                enabled: enabled
            }));
        }
    });

    // advertise the assistant of the status of this panel
    self.autorun(() => {
        const checker = self.APP.checker.get();
        if( checker ){
            self.APP.advertise( checker );
        }
    });
});

Template.organization_rest_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // for label
    itFor( label ){
        return 'organization_config_rest_'+label+'_'+this.index;
    },
});

Template.organization_rest_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-organization-rest-panel'( event, instance ){
        instance.APP.checker.get().clear();
    },
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-organization-rest-panel'( event, instance, enabled ){
        const checker = instance.APP.checker.get();
        if( checker ){
            checker.enabled( enabled );
            if( enabled ){
                checker.check({ update: false }).then(() => { instance.APP.advertise( checker ); });
            }
        }
        return false;
    }
});
