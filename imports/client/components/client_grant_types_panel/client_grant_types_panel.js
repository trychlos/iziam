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
            const id = GrantType.id( it );
            return ( Template.currentData().parentAPP.assistantStatus.get( 'grant_types' ) || [] ).includes( id );
        }
    };

    // set the selectables list
    self.autorun(() => {
        const selectables = GrantType.Selectables( Template.currentData().entity.get().DYN.records[Template.currentData().index].get().selectedProviders );
        self.APP.selectables.set( selectables );
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
    // ask for clear the panel
    'iz-clear-panel .c-client-grant-types-panel'( event, instance ){
        /*
        instance.APP.checker.get().clear();
        */
    },
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-client-grant-types-panel'( event, instance, enabled ){
        /*
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
        */
    },
    // grant type selection
    // reset the full list of selected grant types in the record
    'click .by-item'( event, instance ){
        let selected = [];
        instance.$( '.chooser input.js-check:checked' ).each( function( index, item ){
            selected.push( $( this ).closest( '.by-item' ).data( 'item-id' ));
        });
        const recordRv = this.entity.get().DYN.records[this.index];
        const record = recordRv.get();
        record.grant_types = selected;
        recordRv.set( record );
        // advertize the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-grant-types-panel' ).trigger( 'iz-grant-types', { grant_types: selected });
    }
});
