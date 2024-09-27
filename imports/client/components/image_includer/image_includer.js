/*
 * /imports/client/components/image_includer/image_includer.js
 *
 * Identity profile panel.
 * 
 * Parms:
 * - imageUrl: the url of the image to be displayed
 * 
 * Triggered events:
 * - 'image-included' with data { url: <url> }
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './image_includer.html';

Template.image_includer.onCreated( function(){
    const self = this;

    self.APP = {
    };
});

Template.image_includer.onRendered( function(){
    const self = this;
});

Template.image_includer.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the picture's URL
    picture(){
        return this.imageUrl;
    },

    // show the picture ?
    picImgClass(){
        return this.imageUrl ? 'ui-dblock' : 'ui-dnone';
    },

    // hide the svg if we have a picture (FontAwesome is not dynamic)
    picSvgClass(){
        return this.imageUrl ? 'ui-dnone' : 'ui-dblock';
    }
});

Template.image_includer.events({
    // input checks
    'click .js-go'( event, instance ){
        const url = instance.$( '.js-url' ).val();
        this.imageUrl.set( url );
        instance.$( '.c-image-includer' ).trigger( 'image-included', { url: url });
    },

    // ask for clear the panel
    'iz-clear-panel .c-image-includer'( event, instance ){
        instance.APP.form.get().clear();
    }
});
