/*
 * /imports/client/components/identity_addresses_panel/identity_addresses_panel.js
 *
 * Identity addresses panel.
 * 
 * Parms:
 * - organization: the relevant organization
 * - item: a Reactive Var which contains the edited item
 * - entityChecker: the EntityChecker which manages the dialog
 */

import _ from 'lodash';

import { CoreApp } from 'meteor/pwix:core-app';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/jquery/jqw-table/jqw-table.js';

import { Identities } from '/imports/collections/identities/identities.js';

import './identity_addresses_panel.html';

Template.identity_addresses_panel.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            addresses: {
                children: {
                    label: {
                        js: '.js-label'
                    },
                    address1: {
                        js: '.js-line1',
                        type: 'SAVE'
                    },
                    address2: {
                        js: '.js-line2'
                    },
                    address3: {
                        js: '.js-line3'
                    },
                    preferred: {
                        js: '.js-preferred'
                    }
                }
            }
        },
        // the CoreApp.FormChecker instance
        form: new ReactiveVar( null ),

        // remove the address item
        removeById( id ){
            const item = Template.currentData().item.get();
            let addresses = item.addresses;
            let found = -1;
            for( let i=0 ; i<addresses.length ; ++i ){
                if( addresses[i].id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                addresses.splice( found, 1 );
                Template.currentData().item.set( item );
                self.$( '.c-identity-addresses-panel' ).trigger( 'panel-clear', {
                    emitter: 'addresses'+id
                });
            } else {
                console.warn( id, 'not found' );
            }
        },

        // trigger 'panel-data' event
        sendPanelData( id, valid ){
            if( _.isBoolean( valid )){
                self.$( '.c-identity-addresses-panel' ).trigger( 'panel-data', {
                    emitter: 'addresses'+id,
                    ok: valid
                });
            }
        }
    };

    // setup the edited addresses
    self.autorun(() => {
        let addresses = Template.currentData().item.get().addresses;
        if( !addresses ){
            Template.currentData().item.get().addresses = [];
        }
    });
});

Template.identity_addresses_panel.onRendered( function(){
    const self = this;

    self.$( 'table.js-table' ).jqwTable();

    // relabel jqwTable headers when language changes
    //  argument is not used, but triggers the autorun when language changes
    self.autorun(() => {
        self.$( 'table.js-table' ).jqwTable( 'relabel', pwixI18n.language());
    });

    // initialize the FormChecker for this panel inside of an autorun because entityChecker may be late
    self.autorun(() => {
        self.APP.form.set( new CoreApp.FormChecker({
            instance: self,
            checksObj: Identities,
            fields: self.APP.fields,
            data: {
                item: Template.currentData().item
            },
            entityChecker: Template.currentData().entityChecker,
            input_ok_check_all: false
        }));
    });

    //  and setup the display (check indicators) - let the error messages be displayed here: there should be none (though may be warnings)
    self.autorun(() => {
        const form = self.APP.form.get();
        Template.currentData().item.get().addresses.every(( it ) => {
            const $parent = self.$( '.c-identity-addresses-panel tr[data-item-id="'+it.id+'"]' );
            form.setForm( it, { $parent: $parent });
            form.check({ id: it.id, $parent: $parent, update: false })
                .then(( valid ) => { self.APP.sendPanelData( it.id, valid ); });
            return true;
        });
    });
});

Template.identity_addresses_panel.helpers({
    // delete the address address
    deleteTitle( it ){
        return pwixI18n.label( I18N, 'identities.panel.address_delete', it.address );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether the mail is verified
    isVerified( it ){
        return it.verified ? 'checked' : '';
    },

    // whether the mail is preferred
    isPreferred( it ){
        return it.preferred ? 'checked' : '';
    },

    // list address addresses
    itemsList(){
        return this.item.get().addresses;
    }
});

Template.identity_addresses_panel.events({
    'click .c-identity-addresses-panel .js-plus'( event, instance ){
        const item = this.item.get();
        let addresses = item.addresses || [];
        const id = Random.id();
        const preferred = addresses.length === 0;
        addresses.push({
            id: id,
            preferred: preferred
        });
        item.addresses = addresses;
        this.item.set( item );
        // setup the new row
        CoreApp.DOM.waitFor( '.c-identity-addresses-panel tr[data-item-id="'+id+'"]' )
            .then(( elt ) => { return instance.APP.form.get().setupDom({ id: id, $parent: instance.$( elt ) }); })
            .then(( valid ) => { instance.APP.sendPanelData( id, valid ); });
    },

    'click .c-identity-addresses-panel .js-delete'( event, instance ){
        this.entityChecker.errorClear();
        const id = instance.$( event.currentTarget ).closest( 'tr' ).data( 'item-id' );
        instance.APP.removeById( id );
    },

    // input checks
    'input .c-identity-addresses-panel'( event, instance ){
        const dataContext = this;
        if( !Object.keys( event.originalEvent ).includes( 'FormChecker' ) || event.originalEvent['FormChecker'].handled !== true ){
            const $parent = instance.$( event.target ).closest( 'tr' );
            const id = $parent.data( 'item-id' );
            instance.APP.form.get().inputHandler( event, { id: id, $parent: $parent })
                .then(( valid ) => { instance.APP.sendPanelData( id, valid ); });
        }
    },

    // ask for clear the panel
    'iz-clear-panel .c-identity-addresses-panel'( event, instance ){
        instance.APP.form.get().clear();
    }
});
