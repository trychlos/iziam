/*
 * /imports/client/components/identity_profile_pane/identity_profile_pane.js
 *
 * Parms:
 * - amInstance: a ReactiveVar which contains the AccountsManager.amClass instance
 * - checker: a ReactiveVar which contains the parent checker
 * - organization: 
 * - item: a ReactiveVar which contains the edited identity
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from '/imports/common/collections/identities/index.js';

import '/imports/client/components/gender_select/gender_select.js';
import '/imports/client/components/image_includer/image_includer.js';
import '/imports/client/components/locale_select/locale_select.js';
import '/imports/client/components/zoneinfo_select/zoneinfo_select.js';

import './identity_profile_pane.html';

Template.identity_profile_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

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
    };

    /*
    // have a ReactiveVar for the image url
    self.autorun(() => {
        const item = Template.currentData().item.get();
        item.DYN = item.DYN || {};
        item.DYN.pictureRv = item.DYN.pictureRv || new ReactiveVar( null );
        item.DYN.pictureRv.set( item.picture_url );
    });

    // have a ReactiveVar for the name
    self.autorun(() => {
        const item = Template.currentData().item.get();
        item.DYN = item.DYN || {};
        item.DYN.nameRv = item.DYN.nameRv || new ReactiveVar( null );
        Identities.fn.name( item )
            .then(( name ) => {
                item.DYN.nameRv.set( name );
            });
    });
    */
});

Template.identity_profile_pane.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const itemRv = Template.currentData().item;
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, Meteor.APP.AccountsManager.identities.fieldSet()),
                data: {
                    //container: Template.currentData().container,
                    item: itemRv
                },
                setForm: itemRv.get()
            }));
        }
    });
});

Template.identity_profile_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
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
