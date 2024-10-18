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
 * - index: the index of the currently edited Client record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - organization: the Organization as an entity with its DYN.records array
 * - enableChecks: whether the checks should be enabled at startup, defaulting to true
 * 
 * Forms.Checker doesn't manage well radio buttons: do not use here.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import { GrantNature } from '/imports/common/definitions/grant-nature.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import { Providers } from '/imports/common/tables/providers/index.js';

import './client_grant_types_panel.html';

Template.client_grant_types_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        organizationProviders: new ReactiveVar( {} ),
        selectables: new ReactiveVar( {} ),
        checker: new ReactiveVar( null ),

        // whether we have a radio button or a checkbox
        isRadio( dataContext, nature, it ){
            const selectables = self.APP.selectables.get();
            return selectables[nature] && selectables[nature].types[it] && GrantNature.uiType( selectables[nature].def ) === 'radio';
        },

        // whether this item is selected
        isSelected( dataContext, nature, it ){
            const selected = ( Template.currentData().entity.get().DYN.records[Template.currentData().index].get().grant_types || [] ).includes( it );
            return selected;
        }
    };

    // get the available organization providers
    self.autorun(() => {
        self.APP.organizationProviders.set( Organizations.fn.selectedProviders( Template.currentData().organization ));
    });

    // get the selectable grant types
    self.autorun(() => {
        self.APP.selectables.set( GrantType.Selectables( Object.keys( self.APP.organizationProviders.get())));
    });
});

Template.client_grant_types_panel.onRendered( function(){
    const self = this;
    //console.debug( this );

    // advertize of the selectables list
    self.autorun(() => {
        self.$( '.c-client-grant-types-panel' ).trigger( 'iz-selectables', { selectables: self.APP.selectables.get() });
    });

    // try to setup a suitable default value for each grant nature
    self.autorun(() => {
        let record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
        let changed = false;
        let grantTypes = record.grant_types || [];
        const selectedProviders = Object.keys( self.APP.organizationProviders.get());
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
            }
        });
        // reactively update if needed
        if( changed ){
            record.grant_types = grantTypes;
            Template.currentData().entity.get().DYN.records[Template.currentData().index].set( record );
            self.$( '.c-client-grant-types-panel' ).trigger( 'iz-grant-types', { grant_types: grantTypes });
        }
    });

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                enabled: Template.currentData().enableChecks !== false
            }));
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
        return Template.instance().APP.isSelected( this, nature, it ) ? 'checked' : '';
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
        return Template.instance().APP.isRadio( this, nature, it ) ? 'radio' : 'checkbox';
    },

    // label
    itLabel( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return selectables[nature] && selectables[nature].types[it] ? GrantType.label( selectables[nature].types[it] ) : '';
    },

    // whether this item is selected ?
    // only emphasize this selection for radio buttons
    itSelected( nature, it ){
        return Template.instance().APP.isRadio( this, nature, it ) && Template.instance().APP.isSelected( this, nature, it ) ? 'selected' : '';
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
        //console.debug( 'naturesList', Object.keys( Template.instance().APP.selectables.get()).sort());
        return Object.keys( Template.instance().APP.selectables.get()).sort();
    }
});

Template.client_grant_types_panel.events({
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-client-grant-types-panel'( event, instance, enabled ){
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
    },
    // grant type selection
    // reactively reset the full list of selected grant types in the record to let the UI auto-update
    'click .by-item'( event, instance ){
        let selected = [];
        instance.$( '.chooser input:checked' ).each( function( index, item ){
            selected.push( $( this ).closest( '.by-item' ).data( 'item-id' ));
        });
        // check and maybe sent an error message
        // the async check function returns null or an array of TypedMessage's
        const checker = instance.APP.checker.get();
        if( checker ){
            ClientsRecords.checks.grant_types( selected, { entity: this.entity, index: this.index, selectables: instance.APP.selectables.get() }).then(( res ) => {
                if( res ){
                    checker.messagerPush( res );
                } else {
                    checker.messagerClearMine();
                }
            });
        }
        // last, advertize the eventual caller (e.g. the client_new_assistant) of the new auth flow
        instance.$( '.c-client-grant-types-panel' ).trigger( 'iz-grant-types', { grant_types: selected });
    }
});
