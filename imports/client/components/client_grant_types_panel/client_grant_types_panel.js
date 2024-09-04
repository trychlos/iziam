/*
 * /imports/client/components/client_grant_types_panel/client_grant_types_panel.js
 *
 * Client grant types selection panel.
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - organization: an { entity, record } object
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - selectables: the (optional) list of selectables auth methods
 * 
 * Forms.Checker doesn't manage well radio buttons: do not use here.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Providers } from '/imports/common/collections/providers/index.js';

import { GrantNature } from '/imports/common/definitions/grant-nature.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_grant_types_panel.html';

Template.client_grant_types_panel.onCreated( function(){
    const self = this;

    self.APP = {
        selectables: new ReactiveVar( {} ),

        // whether we have a radio button or a checkbox
        isRadio( nature, it ){
            const selectables = self.APP.selectables.get();
            return selectables[nature] && selectables[nature].types[it] && !GrantNature.acceptSeveral( selectables[nature].def );
        },

        // whether this item is selected
        isSelected( nature, it ){
            const selected = ( Template.currentData().entity.get().DYN.records[Template.currentData().index].get().grant_types || [] ).includes( it );
            //console.debug( it, selected );
            return selected;
        }
    };
});

Template.client_grant_types_panel.onRendered( function(){
    const self = this;
    //console.debug( this );

    // set the selectables list
    self.autorun(() => {
        const selectables = GrantType.Selectables( Template.currentData().entity.get().DYN.records[Template.currentData().index].get().selectedProviders );
        self.APP.selectables.set( selectables );
        self.$( '.c-client-grant-types-panel' ).trigger( 'iz-selectables', { selectables: selectables });
    });

    // try to setup a suitable default value for each grant nature
    self.autorun(() => {
        let record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
        let changed = false;
        let grantTypes = record.grant_types || [];
        const selectedProviders = record.selectedProviders || [];
        const selectables = self.APP.selectables.get();
        Object.keys( selectables ).forEach(( it ) => {
            const natureDef = GrantNature.byId( it );
            if( natureDef ){
                // if the nature is mandatory, try to see if there is an intersection with the already recorded grant types
                if( GrantNature.isMandatory( natureDef )){
                    const candidates = Object.keys( selectables[it].types );
                    const intersect = grantTypes.filter( val => candidates.includes( val ));
                    if( !intersect.length ){
                        grantTypes.push( candidates[0] );
                        changed = true;
                    }
                } else {
                    // if a grant type is provided by a mandatory provider, then the grant type is mandatory too
                    Object.keys( selectables[it].types ).forEach(( grant ) => {
                        const providers = Providers.forGrantType( grant );
                        let found = false;
                        providers.every(( p ) => {
                            if( selectedProviders.includes( p.identId())){
                                if( p.isMandatory( Template.currentData().organization ) && !grantTypes.includes( grant )){
                                    grantTypes.push( grant );
                                    changed = true;
                                    found = true;
                                }
                            }
                            return !found;
                        });
                    })
                }
            } else {
                console.warn( 'grant nature not found', it );
            }
        });
        // reactively update if needed
        if( changed ){
            record.grant_types = grantTypes;
            Template.currentData().entity.get().DYN.records[Template.currentData().index].set( record );
            self.$( '.c-client-grant-types-panel' ).trigger( 'iz-grant-types', { grant_types: grantTypes });
        }
    });
});

Template.client_grant_types_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( nature, it ){
        return Template.instance().APP.isSelected( nature, it ) ? 'checked' : '';
    },

    // description
    itDescription( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return selectables[nature] && selectables[nature].types[it] ? GrantType.description( selectables[nature].types[it] ) : null;
    },

    // proposed grant types are selected based of the providers features
    // one can be disabled when checked and mandatory - so not uncheckable
    itDisabled( nature, it ){
    },

    // whether this input element is a checkbox or a radio button ?
    itInputType( nature, it ){
        return Template.instance().APP.isRadio( nature, it ) ? 'radio' : 'checkbox';
    },

    // label
    itLabel( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return selectables[nature] && selectables[nature].types[it] ? GrantType.label( selectables[nature].types[it] ) : '';
    },

    // whether this item is selected ?
    // only emphasize this selection for radio buttons
    itSelected( nature, it ){
        //console.debug( nature, it, Template.instance().APP.isRadio( nature, it ) && Template.instance().APP.isSelected( nature, it ));
        return Template.instance().APP.isRadio( nature, it ) && Template.instance().APP.isSelected( nature, it ) ? 'selected' : '';
    },

    // selectable list for one grant nature
    itemsList( nature ){
        const selectables = Template.instance().APP.selectables.get();
        return nature && selectables[nature] ? Object.keys( selectables[nature].types ) : [];
    },

    // a label for the grant nature
    natureHeader( nature ){
        const selectables = Template.instance().APP.selectables.get();
        const natureDef = nature && selectables[nature] ? selectables[nature].def : null;
        return natureDef ? GrantNature.label( natureDef ) : '';
    },

    // list of available natures (sorted to have access at first position)
    naturesList(){
        return Object.keys( Template.instance().APP.selectables.get()).sort();
    }
});

Template.client_grant_types_panel.events({
    // grant type selection
    // non reactively reset the full list of selected grant types in the record
    'click .by-item'( event, instance ){
        let selected = [];
        instance.$( '.chooser input:checked' ).each( function( index, item ){
            selected.push( $( this ).closest( '.by-item' ).data( 'item-id' ));
        });
        this.entity.get().DYN.records[this.index].get().grant_types = selected;
        // advertize the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-grant-types-panel' ).trigger( 'iz-grant-types', { grant_types: selected });
    }
});
