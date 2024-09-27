/*
 * /imports/client/components/identity_usernames_panel/identity_usernames_panel.js
 *
 * Identity usernames panel.
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

import './identity_usernames_panel.html';

Template.identity_usernames_panel.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            usernames: {
                children: {
                    username: {
                        js: '.js-username',
                        type: 'SAVE'
                    },
                    label: {
                        js: '.js-label'
                    },
                    preferred: {
                        js: '.js-preferred'
                    }
                }
            }
        },
        // the CoreApp.FormChecker instance
        form: new ReactiveVar( null ),

        // remove the email item
        removeById( id ){
            const item = Template.currentData().item.get();
            let usernames = item.usernames;
            let found = -1;
            for( let i=0 ; i<usernames.length ; ++i ){
                if( usernames[i].id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                usernames.splice( found, 1 );
                Template.currentData().item.set( item );
                self.$( '.c-identity-usernames-panel' ).trigger( 'panel-clear', {
                    emitter: 'usernames'+id
                });
            } else {
                console.warn( id, 'not found' );
            }
        },

        // trigger 'panel-data' event
        sendPanelData( id, valid ){
            if( _.isBoolean( valid )){
                self.$( '.c-identity-usernames-panel' ).trigger( 'panel-data', {
                    emitter: 'usernames'+id,
                    ok: valid
                });
            }
        }
    };

    // setup the edited usernames
    self.autorun(() => {
        let usernames = Template.currentData().item.get().usernames;
        if( !usernames ){
            Template.currentData().item.get().usernames = [];
        }
    });
});

Template.identity_usernames_panel.onRendered( function(){
    const self = this;

    self.$( 'table.js-table' ).jqwTable();

    // relabel jqwTable headers when language changes
    //  argument is not used, but triggers the autorun when language changes
    self.autorun(() => {
        self.$( 'table.js-table' ).jqwTable( 'relabel', pwixI18n.language());
    });

    // initialize the FormChecker for this panel as soon as we get an EntityChecker
    self.autorun(() => {
        const entityChecker = Template.currentData().entityChecker.get(); 
        if( entityChecker ){
            self.APP.form.set( new CoreApp.FormChecker( self, self.APP.fields, {
                checks: Identities,
                entityChecker: entityChecker,
                inputOkCheckAll: false
            }));
        }
    });

    // set data inside of an autorun so that it is reactive to datacontext changes
    // initialize the display (check indicators) - let the error messages be displayed here: there should be none (though may be warnings)
    self.autorun(() => {
        const form = self.APP.form.get();
        if( form ){
            const dataContext = Template.currentData();
            dataContext.item.get().usernames.every(( it ) => {
                const $parent = self.$( '.c-identity-usernames-panel tr[data-item-id="'+it.id+'"]' );
                form.setData( dataContext.item )
                    .setForm( it, { $parent: $parent })
                    .check({ id: it.id, $parent: $parent, update: false }).then(( valid ) => { self.APP.sendPanelData( it.id, valid ); });
                return true;
            });
        }
    });
});

Template.identity_usernames_panel.helpers({
    // delete the email address
    deleteTitle( it ){
        return pwixI18n.label( I18N, 'identities.panel.username_delete', it.address );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether the mail is preferred
    isPreferred( it ){
        return it.preferred ? 'checked' : '';
    },

    // list email addresses
    itemsList(){
        return this.item.get().usernames;
    }
});

Template.identity_usernames_panel.events({
    'click .c-identity-usernames-panel .js-plus'( event, instance ){
        const item = this.item.get();
        let usernames = item.usernames || [];
        const id = Random.id();
        const preferred = usernames.length === 0;
        usernames.push({
            id: id,
            preferred: preferred
        });
        item.usernames = usernames;
        this.item.set( item );
        // setup the new row
        CoreApp.DOM.waitFor( '.c-identity-usernames-panel tr[data-item-id="'+id+'"]' )
            .then(( elt ) => { return instance.APP.form.get().setupDom({ id: id, $parent: instance.$( elt ) }); })
            .then(( valid ) => { instance.APP.sendPanelData( id, valid ); });
    },

    'click .c-identity-usernames-panel .js-delete'( event, instance ){
        this.entityChecker.errorClear();
        const id = instance.$( event.currentTarget ).closest( 'tr' ).data( 'item-id' );
        instance.APP.removeById( id );
    },

    // input checks
    'input .c-identity-usernames-panel'( event, instance ){
        const dataContext = this;
        if( !Object.keys( event.originalEvent ).includes( 'FormChecker' ) || event.originalEvent['FormChecker'].handled !== true ){
            const $parent = instance.$( event.target ).closest( 'tr' );
            const id = $parent.data( 'item-id' );
            instance.APP.form.get().inputHandler( event, { id: id, $parent: $parent })
                .then(( valid ) => { instance.APP.sendPanelData( id, valid ); });
        }
    },

    // ask for clear the panel
    'iz-clear-panel .c-identity-usernames-panel'( event, instance ){
        instance.APP.form.get().clear();
    }
});
