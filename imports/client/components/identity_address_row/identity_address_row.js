/*
 * /imports/client/components/identity_address_row/identity_address_row.js
 *
 * Manage an address adress, maybe empty but have at least an id.
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 * - it: the addresses row to be managed here
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import { Identities } from '/imports/common/collections/identities/index.js';

import './identity_address_row.html';

Template.identity_address_row.onCreated( function(){
    const self = this;

    self.APP = {
        // the fields
        fields: {
            'addresses.$.label': {
                js: '.js-label',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.label );
                }
            },
            'addresses.$.line1': {
                js: '.js-line1',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.line1 );
                }
            },
            'addresses.$.line2': {
                js: '.js-line2',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.line2 );
                }
            },
            'addresses.$.line3': {
                js: '.js-line3',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.line3 );
                }
            },
            'addresses.$.preferred': {
                js: '.js-preferred',
                formFrom( $node ){
                    return $node.prop( 'checked' );
                },
                formTo( $node, item ){
                    $node.prop( 'checked', item.preferred );
                }
            },
            'addresses.$.postalCode': {
                js: '.js-postal',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.postalCode );
                }
            },
            'addresses.$.locality': {
                js: '.js-locality',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.locality );
                }
            },
            'addresses.$.region': {
                js: '.js-region',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.region );
                }
            },
            'addresses.$.country': {
                js: '.js-country',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.country );
                }
            },
            'addresses.$.poNumber': {
                js: '.js-ponumber',
                formFrom( $node ){
                    return $node.val();
                },
                formTo( $node, item ){
                    $node.val( item.poNumber );
                }
            }
        },
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // remove the address item
        removeById( id ){
            const item = Template.currentData().item.get();
            let addresses = item.addresses || [];
            let found = -1;
            for( let i=0 ; i<addresses.length ; ++i ){
                if( addresses[i]._id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                addresses.splice( found, 1 );
                Template.currentData().item.set( item );
                self.APP.checker.get().removeMe();
            } else {
                console.warn( id, 'not found' );
                const trs = $( '.c-identity-addresses-pane tr.c-identity-address-row' );
                $.each( trs, function( index, object ){
                    console.debug( index, $( object ).data( 'item-id' ));
                });
            }
        }
    };
});

Template.identity_address_row.onRendered( function(){
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
                name: 'identity_address_row',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, amInstance.fieldSet()),
                data: {
                    item: itemRv,
                    amInstance: amInstance,
                    organization: Template.currentData().organization
                },
                id: Template.currentData().it._id,
                fieldStatusShow: Forms.C.ShowStatus.NONE,
                setForm: Template.currentData().it,
                crossCheckFn: Identities.checks.crossAddress
            }));
        }
    });
});

Template.identity_address_row.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    minusEnabled( it ){
        return '';
    },

    // have a title per button
    minusTitle( it ){
        return pwixI18n.label( I18N, 'identities.addresses.remove_title', Identities.fn.address( it ));
    },

    // provide params to FormsStatusIndicator template
    //  we are using here the CheckStatus value of the Checker itself
    parmsCheckStatus(){
        return {
            statusRv: Template.instance().APP.checker.get()?.iStatusableStatusRv() || null
        };
    }
});

Template.identity_address_row.events({
    'click .c-identity-address-row .js-minus'( event, instance ){
        instance.APP.removeById( this.it._id );
    },
});

Template.identity_address_row.onDestroyed( function(){
    //console.debug( 'onDestroyed', Template.currentData().it.id );
});
