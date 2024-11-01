/*
 * /imports/client/components/identity_password_pane/identity_password_pane.js
 *
 * Let the manager set or reset the identity password.
 * Rule: the field type is mandatory if the item has not yet any password
 * Else, the password may be left empty, or be rightly set.
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Validity } from 'meteor/pwix:validity';

import { Identities } from '/imports/common/collections/identities/index.js';

import './identity_password_pane.html';

Template.identity_password_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            'password.UI.clear1': {
                js: '.js-clear1'
            },
            'password.UI.clear2': {
                js: '.js-clear2'
            }
        },
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // the complexity scores
        score: [
            { k:AccountsHub.C.Password.VERYWEAK,   css: { backgroundColor: '#ff0000' }}, // red
            { k:AccountsHub.C.Password.WEAK,       css: { backgroundColor: '#cc3300' }},
            { k:AccountsHub.C.Password.MEDIUM,     css: { backgroundColor: '#669900' }},
            { k:AccountsHub.C.Password.STRONG,     css: { backgroundColor: '#33cc00' }},
            { k:AccountsHub.C.Password.VERYSTRONG, css: { backgroundColor: '#00ff00' }}, // green
        ]
    };

    // make the password fields mandatory when the password has never been set
    self.autorun(() => {
        const item = Template.currentData().item.get();
        if( !item.password?.hashed ){
            Object.values( self.APP.fields ).forEach(( it ) => {
                it.form_type = Forms.FieldType.C.MANDATORY;
            });
        }
    });
});

Template.identity_password_pane.onRendered( function(){
    const self = this;
    //console.debug( this );

    // the parent Checker comes from AccountsEditPanel from AccountsManager
    // install a cross check function
    self.autorun(() => {
        const amInstance = Template.currentData().amInstance?.get();
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, amInstance.fieldSet()),
                data: {
                    amInstance: amInstance,
                    item: itemRv,
                    organization: Validity.getEntityRecord( Template.currentData().organization )
                },
                crossCheckFn: Identities.checks.crossPasswords
            }));
        }
    });

    // take advantage of the checks to display the strength bar
    self.autorun(() => {
        const check = Template.currentData().item.get().password?.UI?.check;
        const acWidth = 5;
        if( check ){
            self.$( '.ac-strength-bar' ).css( self.APP.score[check.zxcvbn.score].css );
            let width = check.canonical.length ? 1+parseInt( check.zxcvbn.score ) : 0;
            self.$( '.ac-strength-bar' ).css({ width: width+'em' });
            width = acWidth-width;
            self.$( '.ac-strength-other' ).css({ width: width+'em' });
        } else {
            self.$( '.ac-strength-other' ).css({ width: acWidth+'em' });
        }
    });
});

Template.identity_password_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // Password forms should have (optionally hidden) username fields for accessibility: (More info: https://goo.gl/9p2vKq) <form>​…​</form>​
    async identity_login(){
        return await Identities.fn.identifier( this.organization, this.item.get());
    }
});

Template.identity_password_pane.events({
    // toggle the display of the clear password
    'click .ac-eye'( event, instance ){
        const $field = instance.$( event.currentTarget ).closest( '.js-password' ).find( 'input' );
        if( $field.length ){
            const current = $field.attr( 'type' );
            if( current === 'password' ){
                $field.attr( 'type', 'text' );
                $( event.currentTarget ).addClass( 'fa-regular fa-eye' ); 
                $( event.currentTarget ).removeClass( 'fa-eye-slash' ); 
            } else {
                $field.attr( 'type', 'password' );
                $( event.currentTarget ).addClass( 'fa-regular fa-eye-slash' ); 
                $( event.currentTarget ).removeClass( 'fa-eye' ); 
            }
        }
    }
});
