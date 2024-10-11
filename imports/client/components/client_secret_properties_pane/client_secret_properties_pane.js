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

import '/imports/client/components/secret_encoding_select/secret_encoding_select.js';

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
                    'secrets.$.startingAt': {
                        js: '.js-starting',
                        formTo( $node, item ){
                            $node.val( item.startingAt );
                        }
                    },
                    'secrets.$.endingAt': {
                        js: '.js-ending',
                        formTo( $node, item ){
                            $node.val( item.endingAt );
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

    // parms for the ending DateInput
    parmsEndingDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'clients.secrets.edit.ending_ph' ),
            withHelp: true
        };
    },

    // parms for the HMAC Encoding selection
    //  default is hex - not modifiable
    parmsSecretEncodingSelect(){
        return {
            ...this,
            selected: this.item.get().encoding || null,
            disabled: true
        }
    },

    // parms for the starting DateInput
    parmsStartingDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'clients.secrets.edit.starting_ph' ),
            withHelp: true
        };
    },

    // whether the size is disabled ?
    sizeDisabled(){
        return this.isNew.get() ? '' : 'disabled';
    }
});
