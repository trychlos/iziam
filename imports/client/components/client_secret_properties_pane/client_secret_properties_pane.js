/*
 * /imports/client/components/client_secret_properties_pane/client_secret_properties_pane.js
 *
 * Manage a client secret, maybe empty but have at least an id.
 * One cannot modify a secret: once created, only label and expiration date can be updated.
 *
 * Parms:
 * - container: an { entity, record } client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the keygrip item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';

import '/imports/client/components/hmac_alg_select/hmac_alg_select.js';
import '/imports/client/components/hmac_encoding_select/hmac_encoding_select.js';

import './client_secret_properties_pane.html';

Template.client_secret_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null )
    };

    // setup the default values
    self.autorun(() => {
        let item = Template.currentData().item.get();
        let changed = false;
        if( !item.alg ){
            item.alg = Meteor.APP.C.secretDefAlg;
            changed = true;
        }
        if( !item.encoding ){
            item.encoding = Meteor.APP.C.secretDefEncoding;
            changed = true;
        }
        if( !item.size ){
            item.size = Meteor.APP.C.secretDefSize;
            changed = true;
        }
        if( changed ){
            Template.currentData().item.set( item );
        }
    });
});

Template.client_secret_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    // NB: cannot use Forms.FormField defaults as the schema name addresses the full Client record
    //  while this panel only addresses a single secret
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel({
                    'secrets.$.label': {
                        js: '.js-label',
                        formTo( $node, item ){
                            $node.val( item.label );
                        }
                    },
                    'secrets.$.alg': {
                        js: '.js-alg',
                        formTo( $node, item ){
                            $node.val( item.alg );
                        }
                    },
                    'secrets.$.encoding': {
                        js: '.js-encoding',
                        formTo( $node, item ){
                            $node.val( item.encoding );
                        }
                    },
                    'secrets.$.size': {
                        js: '.js-size',
                        formTo( $node, item ){
                            $node.val( item.size );
                        }
                    },
                    'secrets.$.expireAt': {
                        js: '.js-expire',
                        formTo( $node, item ){
                            $node.val( item.expireAt );
                        }
                    }
                }, ClientsRecords.fieldSet.get()),
                data: {
                    container: Template.currentData().container,
                    item: itemRv
                },
                setForm: itemRv.get()
            }));
        }
    });
});

Template.client_secret_properties_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the DateInput
    parmsDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'clients.secrets.edit.expire_ph' ),
            withHelp: true
        };
    },

    // parms for the HMAC Algorith selection
    parmsHmacAlgSelect(){
        return {
            ...this,
            selected: this.item.get().alg || null,
            disabled: !this.isNew.get()
        }
    },

    // parms for the HMAC Encoding selection
    parmsHmacEncodingSelect(){
        return {
            ...this,
            selected: this.item.get().encoding || null,
            disabled: !this.isNew.get()
        }
    },

    // whether the size is disabled ?
    sizeDisabled(){
        return this.isNew.get() ? '' : 'disabled';
    }
});
