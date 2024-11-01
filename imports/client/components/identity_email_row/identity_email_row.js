/*
 * /imports/client/components/identity_email_row/identity_email_row.js
 *
 * Manage an email adress, maybe empty but have at least an id.
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 * - it: the emails row to be managed here
 * - emailsCount: a ReactiveVar which counts the email addresses
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import './identity_email_row.html';

Template.identity_email_row.onCreated( function(){
    const self = this;

    self.APP = {
        // the fields
        fields: {
            'emails.$.label': {
                js: '.js-label',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.label );
                }
            },
            'emails.$.address': {
                js: '.js-address',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.address );
                }
            },
            'emails.$.verified': {
                js: '.js-verified',
                formFrom( $node ){
                    return $node.prop( 'checked' );
                },
                formTo( $node, item ){
                    $node.prop( 'checked', item.verified );
                }
            },
            'emails.$.preferred': {
                js: '.js-preferred',
                formFrom( $node ){
                    return $node.prop( 'checked' );
                },
                formTo( $node, item ){
                    $node.prop( 'checked', item.preferred );
                }
            }
        },
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // remove the email item
        removeById( id ){
            const item = Template.currentData().item.get();
            let emails = item.emails || [];
            let found = -1;
            for( let i=0 ; i<emails.length ; ++i ){
                if( emails[i].id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                emails.splice( found, 1 );
                Template.currentData().item.set( item );
                self.APP.checker.get().removeMe();
            } else {
                console.warn( id, 'not found' );
                const trs = $( '.c-identity-emails-pane tr.c-identity-email-row' );
                $.each( trs, function( index, object ){
                    console.debug( index, $( object ).data( 'item-id' ));
                });
            }
        }
    };
});

Template.identity_email_row.onRendered( function(){
    const self = this;
    let itemRv = null;

    // get the item reactive var
    self.autorun(() => {
        itemRv = Template.currentData().item;
    });

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const amInstance = Template.currentData().amInstance.get();
        const parentChecker = Template.currentData().checker.get();
        const checker = self.APP.checker.get();
        if( amInstance && parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, amInstance.fieldSet()),
                data: {
                    item: itemRv,
                    amInstance: amInstance,
                    organization: Template.currentData().organization
                },
                id: Template.currentData().it._id,
                fieldStatusShow: Forms.C.ShowStatus.NONE,
                setForm: Template.currentData().it
            }));
        }
    });
});

Template.identity_email_row.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // rule: doesn't remove last connection way, i.e. keep at least one username or one email address
    minusEnabled( it ){
        const haveUseableUsername = this.amInstance?.get().opts().haveUsername() !== AccountsHub.C.Identifier.NONE && this.item.get().username;
        return ( haveUseableUsername || this.emailsCount.get() > 1 ) ? '' : 'disabled';
    },

    // have a title per button
    minusTitle( it ){
        return pwixI18n.label( I18N, 'identities.emails.remove_title', it.address );
    },

    // provide params to FormsStatusIndicator template
    //  we are using here the CheckStatus value of the Checker itself
    parmsCheckStatus(){
        return {
            statusRv: Template.instance().APP.checker.get()?.iStatusableStatusRv() || null
        };
    }
});

Template.identity_email_row.events({
    'click .c-identity-email-row .js-minus'( event, instance ){
        instance.APP.removeById( this.it._id );
    },
});

Template.identity_email_row.onDestroyed( function(){
    //console.debug( 'onDestroyed', Template.currentData().it.id );
});
