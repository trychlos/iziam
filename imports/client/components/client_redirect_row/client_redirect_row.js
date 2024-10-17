/*
 * /imports/client/components/client_redirect_row/client_redirect_row.js
 *
 * Manage a redirect URL, maybe empty but have at least an id.
 *
 * Parms:
 * - entity: the currently edited entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: a ReactiveVar which holds the parent Checker
 * - it: the redirect item to be managed here
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import './client_redirect_row.html';

Template.client_redirect_row.onCreated( function(){
    const self = this;

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // reactively remove the item
        removeById( id ){
            const recordRv = Template.currentData().entity.get().DYN.records[Template.currentData().index];
            let item = recordRv.get();
            let rows = item.redirect_uris || [];
            let found = -1;
            for( let i=0 ; i<rows.length ; ++i ){
                if( rows[i]._id === id ){
                    found = i;
                    break;
                }
            }
            if( found !== -1 ){
                rows.splice( found, 1 );
                recordRv.set( item );
                self.APP.checker.get().removeMe();
            } else {
                console.warn( id, 'not found', item );
                const trs = $( '.c-client-redirects-panel tr.c-client-redirect-row' );
                $.each( trs, function( index, object ){
                    console.debug( index, $( object ).data( 'item-id' ));
                });
            }
        }
    };
});

Template.client_redirect_row.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel({
                    'redirect_uris.$.uri': {
                        js: '.js-url',
                        formFrom( $node ){
                            return $node.val();
                        },
                        formTo( $node, item ){
                            $node.val( item.uri );
                        }
                    }
                }, ClientsRecords.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                id: Template.currentData().it._id,
                setForm: Template.currentData().it
            }));
        }
    });
});

Template.client_redirect_row.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // we accept to remove all redirect urls (which will disable the client by the fact)
    minusEnabled(){
        return '';
    }
});

Template.client_redirect_row.events({
    'click .c-client-redirect-row .js-minus'( event, instance ){
        const id = this.it._id;
        instance.APP.removeById( id );
    },
});

Template.client_redirect_row.onDestroyed( function(){
    //console.debug( 'onDestroyed', Template.currentData().it.id );
});
