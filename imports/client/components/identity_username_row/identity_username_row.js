/*
 * /imports/client/components/identity_username_row/identity_username_row.js
 *
 * Manage an username adress, maybe empty but have at least an id.
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 * - it: the username row to be managed here
 * - usernamesCount: a ReactiveVar which counts the usernames
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import './identity_username_row.html';

Template.identity_username_row.onCreated( function(){
    const self = this;

    self.APP = {
        // the fields
        fields: {
            'usernames.$.label': {
                js: '.js-label',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.label );
                }
            },
            'usernames.$.username': {
                js: '.js-username',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.username );
                }
            },
            'usernames.$.preferred': {
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

        // remove the username item
        removeById( id ){
            const item = Template.currentData().item.get();
            let usernames = item.usernames || [];
            let found = -1;
            for( let i=0 ; i<usernames.length ; ++i ){
                if( usernames[i]._id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                usernames.splice( found, 1 );
                Template.currentData().item.set( item );
                self.APP.checker.get().removeMe();
            } else {
                console.warn( id, 'not found' );
                const trs = $( '.c-identity-usernames-pane tr.c-identity-username-row' );
                $.each( trs, function( index, object ){
                    console.debug( index, $( object ).data( 'item-id' ));
                });
            }
        }
    };
});

Template.identity_username_row.onRendered( function(){
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

Template.identity_username_row.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // rule: doesn't remove last identifier
    minusEnabled( it ){
        const haveUseableUsername = this.amInstance?.get().opts().haveUsername() !== AccountsHub.C.Identifier.NONE && this.item.get().username;
        return ( haveUseableUsername || this.usernamesCount.get() > 1 ) ? '' : 'disabled';
    },

    // have a title per button
    minusTitle( it ){
        return pwixI18n.label( I18N, 'identities.usernames.remove_title', it.username );
    },

    // provide params to FormsStatusIndicator template
    //  we are using here the CheckStatus value of the Checker itself
    parmsCheckStatus(){
        return {
            statusRv: Template.instance().APP.checker.get()?.iStatusableStatusRv() || null
        };
    },

    // disable the preferred checkbox if another row is already checked
    preferredDisabled( item ){
        const usernames = this.item.get().usernames || [];
        let alreadyChecked = false;
        usernames.every(( it ) => {
            if( it._id !== item._id && it.preferred ){
                alreadyChecked = true;
            }
            return !alreadyChecked;
        });
        return alreadyChecked ? 'disabled': '';
    }
});

Template.identity_username_row.events({
    'click .c-identity-username-row .js-minus'( event, instance ){
        instance.APP.removeById( this.it._id );
    }
});

Template.identity_username_row.onDestroyed( function(){
    //console.debug( 'onDestroyed', Template.currentData().it.id );
});
