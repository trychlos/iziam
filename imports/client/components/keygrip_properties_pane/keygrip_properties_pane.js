/*
 * /imports/client/components/keygrip_properties_pane/keygrip_properties_pane.js
 *
 * Manage a keygrip, maybe empty but have at least an _id.
 *
 * Parms:
 * - container: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the keygrip item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { KeygripSecrets } from '/imports/common/tables/keygrip_secrets/index.js';

import '/imports/client/components/hmac_alg_select/hmac_alg_select.js';
import '/imports/client/components/hmac_encoding_select/hmac_encoding_select.js';
import '/imports/client/components/keygrip_secret_new_button/keygrip_secret_new_button.js';
import '/imports/client/components/keygrip_secrets_list/keygrip_secrets_list.js';

import './keygrip_properties_pane.html';

Template.keygrip_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // whether this panel can be updated
        updatable: new ReactiveVar( true )
    };

    // setup the default values
    self.autorun(() => {
        let item = Template.currentData().item.get();
        let changed = false;
        if( !item.alg ){
            item.alg = Meteor.APP.C.keygripDefAlg;
            changed = true;
        }
        if( !item.encoding ){
            item.encoding = Meteor.APP.C.keygripDefEncoding;
            changed = true;
        }
        if( !item.size ){
            item.size = Meteor.APP.C.keygripDefSize;
            changed = true;
        }
        if( changed ){
            Template.currentData().item.set( item );
        }
    });

    // is the panel updatable ?
    // we cannot change any more algorithm, encoding or size as soon as we have a first key
    self.autorun(() => {
        self.APP.updatable.set(( Template.currentData().item.get().keylist || [] ).length === 0 );
    });
});

Template.keygrip_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    // NB: cannotuse Forms.FormField defaults as the schema name addresses the full Organization record
    //  while this panel only addresses a single JWK
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel({
                    'keygrips.$.label': {
                        js: '.js-label',
                        formTo( $node, item ){
                            $node.val( item.label );
                        }
                    },
                    'keygrips.$.alg': {
                        js: '.js-alg',
                        formTo( $node, item ){
                            $node.val( item.alg );
                        }
                    },
                    'keygrips.$.encoding': {
                        js: '.js-encoding',
                        formTo( $node, item ){
                            $node.val( item.encoding );
                        }
                    },
                    'keygrips.$.size': {
                        js: '.js-size',
                        formTo( $node, item ){
                            $node.val( item.size );
                        }
                    }
                }, TenantsManager.Records.fieldSet.get()),
                data: {
                    container: Template.currentData().container,
                    item: itemRv
                },
                setForm: itemRv.get()
            }));
        }
    });
});

Template.keygrip_properties_pane.helpers({
    // whether to disable the size input
    disabledSize(){
        return Template.instance().APP.updatable.get() ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the HMAC Algorith selection
    parmsHmacAlgSelect(){
        return {
            ...this,
            selected: this.item.get().alg || null,
            disabled: !Template.instance().APP.updatable.get()
        }
    },

    // parms for the HMAC Encoding selection
    parmsHmacEncodingSelect(){
        return {
            ...this,
            selected: this.item.get().encoding || null,
            disabled: !Template.instance().APP.updatable.get()
        }
    },

    // parms for the keygrips_list
    // see the keygrips_list component for a description of the expected data context
    parmsKeygripSecretsList(){
        let parms = {
            ...this,
            keygripRv: this.item,
            listGetFn: KeygripSecrets.fn.get,
            listAddFn: KeygripSecrets.fn.add,
            listRemoveFn: KeygripSecrets.fn.remove,
            args: {
                caller: this.item.get(),
                parent: null
            }
        };
        return parms;
    }
});
