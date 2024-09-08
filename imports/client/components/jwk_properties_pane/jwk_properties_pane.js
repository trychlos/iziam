/*
 * /imports/client/components/jwk_properties_pane/jwk_properties_pane.js
 *
 * Manage a contact email address, maybe empty but have at least an id.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import '/imports/client/components/jwk_kty_select/jwk_kty_select.js';
import '/imports/client/components/jwk_use_select/jwk_use_select.js';

import './jwk_properties_pane.html';

Template.jwk_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null )
    };
});

Template.jwk_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel({
                    'jwks.$.label': {
                        js: '.js-label'
                    },
                    'jwks.$.use': {
                        js: '.js-use',
                        inputSelector: '.js-use select.js-jwk-use'
                    },
                    'jwks.$.kty': {
                        js: '.js-kty',
                        inputSelector: '.js-kty select.js-jwk-kty'
                    }
                }, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                id: itemRv.get().id,
                setForm: itemRv.get()
            }));
        }
    });
});

Template.jwk_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for key type (crypto family) selection
    parmsJwkKtySelect(){
        return {
            ...this,
            selected: this.item.kty || null
        };
    },

    // parms for use selection
    parmsJwkUseSelect(){
        return {
            ...this,
            selected: this.item.use || null
        };
    }
});
