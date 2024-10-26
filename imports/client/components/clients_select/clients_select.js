/*
 * /imports/client/components/clients_select/clients_select.js
 *
 * Select zero to n clients.
 * 
 * Parms:
 * - organization: the Organization as an entity with its DYN.records array
 * - clients: an array of all clients items
 * - selected: the currently selected clients group items
 * - disabled: whether this component should be disabled, defaulting to false
 * - selectOptions: additional configuration options for multiple-select component
 * 
 * Events:
 * - clients-selected: the new selected clients items, re-triggered each time the selection changes, with data:
 *   > selected: an array of selected clients ids
 *   > items: an array of selected clients groups items
 */

import _ from 'lodash';
import 'multiple-select';
import 'multiple-select/dist/multiple-select.min.css';

import { pwixI18n } from 'meteor/pwix:i18n';
import { UIU } from 'meteor/pwix:ui-utils';

import './clients_select.html';

Template.clients_select.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        $select: null,
        selectedIds: new ReactiveVar( [] ),

        // send the selection on each selection change
        // selected: an array of selected clients ids
        // items: an array of selected clients
        triggerSelected( event, selected, dc ){
            let items = [];
            selected.forEach(( it ) => {
                let found = false;
                dc.clients.every(( identity ) => {
                    if( identity._id === it ){
                        found = true;
                        items.push( identity );
                    }
                    return !found;
                });
            });
            self.APP.$select.trigger( event, { selected: selected, items: items });
        }
    };

    // convert the selected identites as group items to an array of clients ids
    self.autorun(() => {
        let ids = [];
        const selected = Template.currentData().selected;
        selected.forEach(( it ) => {
            if( it.type === 'I' ){
                ids.push( it.identity );
            } else {
                console.warn( 'unexpected group item type', it );
            }
        });
        self.APP.selectedIds.set( ids );
    })
});

Template.clients_select.onRendered( function(){
    const self = this;

    self.APP.$select = self.$( '.c-clients-select select' );

    // have the data context
    let dc;
    self.autorun(() => {
        dc = Template.currentData();
    });

    // prepare the multipleSelect configuration
    let conf = {
        selectAll: false,
        filter: true,
        classes: 'form-control',
        maxHeight: 540,
        placeholder: pwixI18n.label( I18N, 'clients.select.select_text' ),
        onClick( data ){
            self.APP.triggerSelected( 'clients-selected', self.APP.$select.multipleSelect( 'getSelects' ), dc );
        }
    };
    if( Template.currentData().selectOptions ){
        _.merge( conf, Template.currentData().options );
    }

    // make sure that we have something before init the multipleSelect widget
    self.autorun(() => {
        UIU.DOM.waitFor( '.c-clients-select select.multiple-select' ).then(() => {
            self.APP.$select.multipleSelect( conf );
        }).then(() => {
            self.APP.$select.multipleSelect( 'open' );
        });
    });
});

Template.clients_select.helpers({
    // whether the component should be disabled
    isDisabled(){
        return this.disabled === true ? 'disabled' : '';
    },

    // return the item identifier
    itId( it ){
        return it._id;
    },

    // return the item label
    itLabel( it ){
        return it.DYN.label;
    },

    // return the list of known clients
    itemsList(){
        return this.clients;
    },

    // whether the current item is selected
    itSelected( it ){
        return Template.instance().APP.selectedIds.get().includes( it._id ) ? 'selected' : '';
    }
});
