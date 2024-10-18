/*
 * /imports/client/components/identity_phone_row/identity_phone_row.js
 *
 * Manage an phone adress, maybe empty but have at least an id.
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 * - it: the phones row to be managed here
 */

import _ from 'lodash';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import './identity_phone_row.html';

Template.identity_phone_row.onCreated( function(){
    const self = this;

    self.APP = {
        // the fields
        fields: {
            'phones.$.label': {
                js: '.js-label',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.label );
                }
            },
            'phones.$.number': {
                js: '.js-number',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.number );
                }
            },
            'phones.$.verified': {
                js: '.js-verified',
                formFrom( $node ){
                    return $node.prop( 'checked' );
                },
                formTo( $node, item ){
                    $node.prop( 'checked', item.verified );
                }
            },
            'phones.$.preferred': {
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

        // remove the phone item
        removeById( id ){
            const item = Template.currentData().item.get();
            let phones = item.phones || [];
            let found = -1;
            for( let i=0 ; i<phones.length ; ++i ){
                if( phones[i]._id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                phones.splice( found, 1 );
                Template.currentData().item.set( item );
                self.APP.checker.get().removeMe();
            } else {
                console.warn( id, 'not found' );
                const trs = $( '.c-identity-phones-pane tr.c-identity-phone-row' );
                $.each( trs, function( index, object ){
                    console.debug( index, $( object ).data( 'item-id' ));
                });
            }
        }
    };
});

Template.identity_phone_row.onRendered( function(){
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

Template.identity_phone_row.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // rule: doesn't remove last connection way, i.e. keep at least one username or one phone address
    minusEnabled( it ){
        return '';
    },

    // have a title per button
    minusTitle( it ){
        return pwixI18n.label( I18N, 'identities.phones.remove_title', it.address );
    },

    // provide params to FormsStatusIndicator template
    //  we are using here the CheckStatus value of the Checker itself
    parmsCheckStatus(){
        return {
            statusRv: Template.instance().APP.checker.get()?.iStatusableStatusRv() || null
        };
    }
});

Template.identity_phone_row.events({
    'click .c-identity-phone-row .js-minus'( event, instance ){
        instance.APP.removeById( this.it._id );
    },
});

Template.identity_phone_row.onDestroyed( function(){
    //console.debug( 'onDestroyed', Template.currentData().it.id );
});
