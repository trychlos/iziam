/*
 * /imports/client/components/keygrip_secret_properties_pane/keygrip_secret_properties_pane.js
 *
 * Manage a keygrip secret, maybe empty but have at least an _id.
 *
 * Parms:
 * - container: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the keygrip secret item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 * - keygripRv: a ReactiveVar which contains the current keygrip item
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { HmacEncoding } from '/imports/common/definitions/hmac-encoding.def.js';

import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import '/imports/client/components/hmac_alg_select/hmac_alg_select.js';
import '/imports/client/components/hmac_encoding_select/hmac_encoding_select.js';
import '/imports/client/components/keygrip_secret_new_button/keygrip_secret_new_button.js';
import '/imports/client/components/keygrip_secrets_list/keygrip_secrets_list.js';

import './keygrip_secret_properties_pane.html';

Template.keygrip_secret_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            'keygrips.$.keylist.$.label': {
                js: '.js-label',
                formTo( $node, item ){
                    $node.val( item.label );
                }
            },
            'keygrips.$.keylist.$.startingAt': {
                js: '.js-starting'
            },
            'keygrips.$.keylist.$.endingAt': {
                js: '.js-ending'
            }
        },
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // the generated { secret, hash }
        result: new ReactiveVar( null )
    };
});

Template.keygrip_secret_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    // NB: cannot use Forms.FormField defaults as the schema name addresses the full Organization record
    //  while this panel only addresses a single keygrip item
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, TenantsManager.Records.fieldSet.get()),
                data: {
                    container: Template.currentData().container,
                    item: itemRv,
                    keygripRv: Template.currentData().keygripRv
                },
                setForm: itemRv.get(),
                crossCheckFn: Keygrips.checks.crossCheckSecretProperties
            }));
        }
    });
});

Template.keygrip_secret_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether we can display the hash as text
    isText(){
        const def = HmacEncoding.byId( this.keygripRv.get().encoding );
        const text = def ? HmacEncoding.isBinary( def ) === false : false;
        //console.debug( 'def', def, HmacEncoding.isBinary( def ), 'text', text );
        return text;
    },

    // parms for the DateInput
    parmsEndingDate(){
        return {
            id: 'keygrip-secret-ending',
            value: this.item.get().endingAt,
            placeholder: pwixI18n.label( I18N, 'keygrips.edit.ending_ph' ),
            withHelp: true
        };
    },

    // parms for the DateInput
    parmsStartingDate(){
        return {
            id: 'keygrip-secret-starting',
            value: this.item.get().startingAt,
            placeholder: pwixI18n.label( I18N, 'keygrips.edit.starting_ph' ),
            withHelp: true
        };
    }
});
