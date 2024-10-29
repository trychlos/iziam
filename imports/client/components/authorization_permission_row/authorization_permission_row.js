/*
 * /imports/client/components/authorization_permission_row/authorization_permission_row.js
 *
 * Manage a contact email address, maybe empty but have at least an id.
 *
 * Parms:
 * - entity: the current organization entity with its DYN sub-object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the currently edited authorization
 * - it: the contact item to be managed here
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';

import './authorization_permission_row.html';

Template.authorization_permission_row.onCreated( function(){
    const self = this;

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // reactively remove the item
        removeById( id ){
            const itemRv = Template.currentData().item;
            let item = itemRv.get();
            let rows = item.permissions || [];
            let found = -1;
            for( let i=0 ; i<rows.length ; ++i ){
                if( rows[i]._id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                rows.splice( found, 1 );
                itemRv.set( item );
                self.APP.checker.get().removeMe();
            } else {
                console.warn( id, 'not found', item );
                const trs = $( '.c-authorization-permissions-pane tr.c-authorization-permission-row' );
                $.each( trs, function( index, object ){
                    console.debug( index, $( object ).data( 'item-id' ));
                });
            }
        }
    };
});

Template.authorization_permission_row.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel({
                    'permissions.$.label': {
                        js: '.js-permission',
                        formFrom( $node ){
                            return $node.val();
                        },
                        formTo( $node, item ){
                            $node.val( item.label );
                        }
                    }
                }, Authorizations.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    item: Template.currentData().item
                },
                id: Template.currentData().it._id,
                setForm: Template.currentData().it
            }));
        }
    });
});

Template.authorization_permission_row.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // note: weird things happen when inserting/deleting rows, unless we delete only last row
    // but we accept to remove all contact urls (which will disable the client by the fact)
    minusEnabled(){
        return '';
    }
});

Template.authorization_permission_row.events({
    'click .c-authorization-permission-row .js-minus'( event, instance ){
        const id = this.it._id;
        instance.APP.removeById( id );
    },
});

Template.authorization_permission_row.onDestroyed( function(){
    //console.debug( 'onDestroyed', Template.currentData().it.id );
});
