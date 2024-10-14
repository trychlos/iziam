/*
 * /imports/client/components/identities_select/identities_select.js
 *
 * Select zero to n identities.
 * 
 * Parms:
 * - organization: the Organization as an entity with its DYN.records array
 * - selected: the currently selected identities
 * - disabled: whether this component should be disabled, defaulting to false
 * - selectOptions: additional configuration options for multiple-select component
 * - selectTarget: an optional jQuery object to receive events
 * 
 * Events:
 * - identities-selected: the new selected identities items, re-triggered each time the selection changes
 * - identities-validated: if run inside a dialog, the new selected identities items, when the dialog is validated
 *   these two events hold a data as:
 *   > selected: an array of selected ids
 *   > items: an array of selected identities
 */

import _ from 'lodash';
import 'multiple-select';
import 'multiple-select/dist/multiple-select.min.css';

import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { UIU } from 'meteor/pwix:ui-utils';

import { Identities } from '/imports/common/collections/identities/index.js';

import './identities_select.html';

Template.identities_select.onCreated( function(){
    const self = this;

    self.APP = {
        isModal: new ReactiveVar( false ),
        $select: null,
        $target: new ReactiveVar( null ),
        identitiesRegistrar: new ReactiveVar( null ),
        identities: new ReactiveVar( {} ),

        // send the selection, either on each selection or on validation
        // selected: an array of selected ids
        triggerSelected( event, selected ){
            let items = [];
            const identities = self.APP.identities.get();
            console.debug( 'selected', selected );
            selected.forEach(( it ) => {
                items.push( identities[it] );
            });
            console.debug( 'items', items );
            self.APP.$select.trigger( event, { selected: selected, items: items });
            const target = self.APP.$target.get();
            if( target ){
                target.trigger( event, { selected: selected, items: items });
            }
        }
    };

    // get the identities registrar
    self.autorun(() => {
        const organization = TenantsManager.list.byEntity( Template.currentData().organization._id );
        if( organization ){
            self.APP.identitiesRegistrar.set( organization.DYN.identities );
        }
    });

    // get and sort the identities
    self.autorun(() => {
        const registrar = self.APP.identitiesRegistrar.get();
        if( registrar ){
            const identities = registrar.get().sort(( a, b ) => {
                if( !a.DYN.label ){
                    a.DYN.label = Identities.fn.label( a );
                }
                if( !b.DYN.label ){
                    b.DYN.label = Identities.fn.label( b );
                }
                return a.DYN.label > b.DYN.label ? 1 : ( a.DYN.label < b.DYN.label ? -1 : 0 );
            });
            const hash = {};
            identities.map(( it ) => {
                hash[it._id] = it;
            });
            self.APP.identities.set( hash );
        }
    });

    // get an additional target (if any)
    self.autorun(() => {
        self.APP.$target.set( Template.currentData().selectTarget );
    });
});

Template.identities_select.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-identities-select' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-identities-select' )
            });
        }
    });

    self.APP.$select = self.$( '.c-identities-select select' );

    // prepare the multipleSelect configuration
    let conf = {
        selectAll: false,
        filter: true,
        classes: 'form-control',
        maxHeight: 540,
        placeholder: pwixI18n.label( I18N, 'identities.select.select_text' ),
        onClick( data ){
            self.APP.triggerSelected( 'identities-selected', self.APP.$select.multipleSelect( 'getSelects' ));
        }
    };
    if( Template.currentData().selectOptions ){
        _.merge( conf, Template.currentData().options );
    }

    // make sure that we have something before init the multipleSelect widget
    self.autorun(() => {
        UIU.DOM.waitFor( '.c-identities-select select.multiple-select' ).then(() => {
            self.APP.$select.multipleSelect( conf );
        }).then(() => {
            self.APP.$select.multipleSelect( 'open' );
        });
    });
});

Template.identities_select.helpers({
    // whether we have a currently selected item ?
    hasCurrent(){
        return !_.isNil( this.selected );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

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

    // return the list of known identities
    itemsList(){
        return Object.values( Template.instance().APP.identities.get());
    },

    // whether the current item is selected
    itSelected( it ){
        //return ( this.selected === HmacAlg.id( it )) ? 'selected' : '';
    }
});

Template.identities_select.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-identities-select'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // just close
    'iz-submit .c-identities-select'( event, instance ){
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            }
        }
        instance.APP.triggerSelected( 'identities-validated', instance.APP.$select.multipleSelect( 'getSelects' ));
        closeFn();
    }
});
