/*
 * /imports/client/components/jwk_properties_pane/jwk_properties_pane.js
 *
 * Manage a JWK, maybe empty but have at least an id.
 * When editing, doesn't let the main characteristics of the key (use, kty, alg) be modified
 *
 * Parms:
 * - container: an { entity, record } organization/client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';
import { JwkKty } from '/imports/common/definitions/jwk-kty.def.js';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import '/imports/client/components/jwa_alg_select/jwa_alg_select.js';
import '/imports/client/components/jwk_kty_select/jwk_kty_select.js';
import '/imports/client/components/jwk_use_select/jwk_use_select.js';

import './jwk_properties_pane.html';

Template.jwk_properties_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // generate the JWK
        //  reactively update the item
        async generate( itemRv ){
            let item = itemRv.get();
            item = await Jwks.fn.generateKeys( item );
            console.debug( 'item.createdAt', item.createdAt );
            itemRv.set( item );
        },

        // reset the chosen algorithm when usage or crypto family change
        resetAlg( item ){
            if( item.alg ){
                self.$( '.js-alg select' ).val( null );
                delete item.pair;
                delete item.secret;
                self.APP.checker.get().check();
            }
        }
    };
});

Template.jwk_properties_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    // NB: cannotuse Forms.FormField defaults as the schema name addresses the full Organization record
    //  while this panel only addresses a single JWK
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel({
                    'jwks.$.label': {
                        js: '.js-label',
                        formTo( $node, item ){
                            $node.val( item.label );
                        }
                    },
                    'jwks.$.use': {
                        js: '.js-use',
                        formTo( $node, item ){
                            $node.val( item.use );
                        }
                    },
                    'jwks.$.kty': {
                        js: '.js-kty',
                        formTo( $node, item ){
                            $node.val( item.kty );
                        }
                    },
                    'jwks.$.alg': {
                        js: '.js-alg',
                        formTo( $node, item ){
                            $node.val( item.alg );
                        }
                    },
                    'jwks.$.kid': {
                        js: '.js-kid',
                        formTo( $node, item ){
                            $node.val( item.kid );
                        }
                    },
                    'jwks.$.expireAt': {
                        js: '.js-expire',
                        formTo( $node, item ){
                            $node.val( item.expireAt );
                        }
                    }
                }, TenantsManager.Records.fieldSet.get()),
                data: {
                    container: Template.currentData().container,
                    item: itemRv
                },
                setForm: itemRv.get()
            }));
        }
    });
});

Template.jwk_properties_pane.helpers({
    // have a color class which exhibit the enable status
    btnClass(){
        return this.item.get().alg ? 'btn-secondary' : 'btn-outline-secondary';
    },

    // whether the Generate button is disabled
    btnDisabled(){
        return this.item.get().alg ? '' : 'disabled';
    },

    // haveGenerate
    // - do not display the button when editing an existing JWK (nothing to generate)
    // - on new JWK, the button is disabled until having all required data (i.e. an alg)
    haveGenerate(){
        return this.isNew.get();
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the DateInput
    parmsDate(){
        return {
            placeholder: pwixI18n.label( I18N, 'jwks.edit.expire_ph' ),
            withHelp: true
        };
    },

    // parms for algorithm selection
    parmsJwaAlgSelect(){
        const ktyId = this.item.get().kty;
        const ktyDef = ktyId ? JwkKty.byId( ktyId ) : null;
        const useId = this.item.get().use;
        return {
            ...this,
            list: ktyDef && useId ? JwaAlg.byIds( JwkKty.availableAlgorithms( ktyDef, useId )) : null,
            selected: this.item.get().alg || null,
            disabled: !( ktyId && useId && this.isNew.get())
        };
    },

    // parms for key type (crypto family) selection
    parmsJwkKtySelect(){
        return {
            ...this,
            selected: this.item.get().kty || null,
            disabled: !this.isNew.get()
        };
    },

    // parms for use selection
    parmsJwkUseSelect(){
        return {
            ...this,
            selected: this.item.get().use || null,
            disabled: !this.isNew.get()
        };
    }
});

Template.jwk_properties_pane.events({
    // generate the jwk
    'click .js-generate'( event, instance ){
        instance.APP.generate( this.item );
    },
    // reset the algorithm on any change on usage or crypto family
    'jwk-use-selected .c-jwk-properties-pane'( event, instance, data ){
        instance.APP.resetAlg( this.item.get());
    },
    'jwk-kty-selected .c-jwk-properties-pane'( event, instance, data ){
        instance.APP.resetAlg( this.item.get());
    }
});
