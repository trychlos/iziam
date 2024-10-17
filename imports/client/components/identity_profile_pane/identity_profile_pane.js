/*
 * /imports/client/components/identity_profile_pane/identity_profile_pane.js
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Validity } from 'meteor/pwix:validity';

import { Identities } from '/imports/common/collections/identities/index.js';

import '/imports/client/components/gender_select/gender_select.js';
import '/imports/client/components/image_includer/image_includer.js';
import '/imports/client/components/locale_select/locale_select.js';
import '/imports/client/components/zoneinfo_select/zoneinfo_select.js';

import './identity_profile_pane.html';

Template.identity_profile_pane.onCreated( function(){
    const self = this;
    console.debug( this );

    self.APP = {
        fields: {
            name: {
                js: '.js-name'
            },
            given_name: {
                js: '.js-given'
            },
            middle_name: {
                js: '.js-middle'
            },
            family_name: {
                js: '.js-family'
            },
            nickname: {
                js: '.js-nickname'
            },
            gender: {
                js: '.c-gender-select'
            },
            zoneinfo: {
                js: '.c-zoneinfo-select'
            },
            locale: {
                js: '.c-locale-select'
            },
            profile_url: {
                js: '.js-profile'
            },
            picture_url: {
                js: '.js-picture'
            },
            website_url: {
                js: '.js-website'
            },
        },
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // set the name
        setName( item ){
            let name = '';
            if( item.family_name || item.middle_name || item.given_name ){
                name = Identities.fn.name( item );
            }
            if( !item.name ){
                self.$( '.c-identity-profile-pane .js-name input' ).val( name );
            }
        }
    };
});

Template.identity_profile_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const amInstance = Template.currentData().amInstance?.get();
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( amInstance && parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, amInstance.fieldSet()),
                data: {
                    amInstance: amInstance,
                    item: itemRv,
                    organization: Validity.getEntityRecord( Template.currentData().organization )
                },
                setForm: itemRv.get()
            }));
        }
    });

    // maintain the display name
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.setName( item );
    })
});

Template.identity_profile_pane.helpers({
    // whether the family name is disabled ? yes if name is set
    familyDisabled(){
        return this.item.get().name ? 'disabled' : '';
    },

    // whether the given name is disabled ? yes if name is set
    givenDisabled(){
        return this.item.get().name ? 'disabled' : '';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether the middle name is disabled ? yes if name is set
    middleDisabled(){
        return this.item.get().name ? 'disabled' : '';
    },

    // whether the name is disabled ? yes if either given, middle or family names are set
    nameDisabled(){
        const item = this.item.get();
        return item.given_name || item.middle_name || item.family_name ? 'disabled' : '';
    },

    // the user gender
    parmsGender(){
        return {
            selected: this.item.get().gender
        };
    },

    // the picture url
    parmsImage(){
        return {
            imageUrl: this.item.get().picture_url
        };
    },

    // the user's locale
    parmsLocale(){
        return {
            selected: this.item.get().locale
        };
    },

    // the user's (time) zoneinfo
    parmsZoneinfo(){
        return {
            selected: this.item.get().zoneinfo
        };
    },

    // the user's picture
    picture(){
        return this.item.get().picture || '';
    },

    // show the picture ?
    picImgClass(){
        return this.item.get().picture && this.item.get().picture.length ? 'x-dblock' : 'x-dnone';
    },

    // hide the svg if we have a picture (FontAwesome is not dynamic)
    picSvgClass(){
        return this.item.get().picture && this.item.get().picture.length ? 'x-dnone' : 'x-dblock';
    }
});

Template.identity_profile_pane.events({
    // ask for clear the panel
    'iz-clear-panel .c-identity-profile-pane'( event, instance ){
        instance.APP.checker.get().clear();
    }
});
