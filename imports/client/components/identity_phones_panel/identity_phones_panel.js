/*
 * /imports/client/components/identity_phones_panel/identity_phones_panel.js
 *
 * Identity phones panel.
 * 
 * Parms:
 * - item: a Reactive Var which contains the edited item (contains at least an 'organization' field)
 * - entityChecker: the EntityChecker attached to the dialog
 */

import _ from 'lodash';

import { CoreApp } from 'meteor/pwix:core-app';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/jquery/jqw-table/jqw-table.js';

import { Identities } from '/imports/collections/identities/identities.js';

import './identity_phones_panel.html';

Template.identity_phones_panel.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            phones: {
                children: {
                    number: {
                        js: '.js-number',
                        type: 'SAVE'
                    },
                    label: {
                        js: '.js-label'
                    },
                    verified: {
                        js: '.js-verified'
                    },
                    preferred: {
                        js: '.js-preferred'
                    }
                }
            }
        },
        // the CoreApp.FormChecker instance
        form: new ReactiveVar( null ),

        // remove the phone item
        removeById( id ){
            const item = Template.currentData().item.get();
            let phones = item.phones;
            let found = -1;
            for( let i=0 ; i<phones.length ; ++i ){
                if( phones[i].id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                phones.splice( found, 1 );
                Template.currentData().item.set( item );
                self.$( '.c-identity-phones-panel' ).trigger( 'panel-clear', {
                    emitter: 'phones'+id
                });
            } else {
                console.warn( id, 'not found' );
            }
        },

        // trigger 'panel-data' event
        sendPanelData( id, valid ){
            if( _.isBoolean( valid )){
                self.$( '.c-identity-phones-panel' ).trigger( 'panel-data', {
                    emitter: 'phones'+id,
                    ok: valid
                });
            }
        }
    };

    // setup the edited phones
    self.autorun(() => {
        let phones = Template.currentData().item.get().phones;
        if( !phones ){
            Template.currentData().item.get().phones = [];
        }
    });
});

Template.identity_phones_panel.onRendered( function(){
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
        Template.currentData().item.get().phones.every(( it ) => {
            const $parent = self.$( '.c-identity-phones-panel tr[data-item-id="'+it.id+'"]' );
            form.setForm( it, { $parent: $parent });
            form.check({ id: it.id, $parent: $parent, update: false })
                .then(( valid ) => { self.APP.sendPanelData( it.id, valid ); });
            return true;
        });
    });
});

Template.identity_phones_panel.helpers({
    // delete the phone address
    deleteTitle( it ){
        return pwixI18n.label( I18N, 'identities.panel.phone_delete', it.address );
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

    // list phone addresses
    itemsList(){
        return this.item.get().phones;
    }
});

Template.identity_phones_panel.events({
    'click .c-identity-phones-panel .js-plus'( event, instance ){
        const item = this.item.get();
        let phones = item.phones || [];
        const id = Random.id();
        const preferred = phones.length === 0;
        phones.push({
            id: id,
            preferred: preferred
        });
        item.phones = phones;
        this.item.set( item );
        // setup the new row
        CoreApp.DOM.waitFor( '.c-identity-phones-panel tr[data-item-id="'+id+'"]' )
            .then(( elt ) => { return instance.APP.form.get().setupDom({ id: id, $parent: instance.$( elt ) }); })
            .then(( valid ) => { instance.APP.sendPanelData( id, valid ); });
    },

    'click .c-identity-phones-panel .js-delete'( event, instance ){
        this.entityChecker.errorClear();
        const id = instance.$( event.currentTarget ).closest( 'tr' ).data( 'item-id' );
        instance.APP.removeById( id );
    },

    // input checks
    'input .c-identity-phones-panel'( event, instance ){
        const dataContext = this;
        if( !Object.keys( event.originalEvent ).includes( 'FormChecker' ) || event.originalEvent['FormChecker'].handled !== true ){
            const $parent = instance.$( event.target ).closest( 'tr' );
            const id = $parent.data( 'item-id' );
            instance.APP.form.get().inputHandler( event, { id: id, $parent: $parent })
                .then(( valid ) => { instance.APP.sendPanelData( id, valid ); });
        }
    },

    // ask for clear the panel
    'iz-clear-panel .c-identity-phones-panel'( event, instance ){
        instance.APP.form.get().clear();
    }
});
