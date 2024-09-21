/*
 * /imports/client/components/jwk_generate_pane/jwk_generate_pane.js
 *
 * Let the user generate its keys.
 * Only displayed for a new JWK item.
 *
 * Parms:
 * - container: an { entity, record } organization/client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tolert } from 'meteor/pwix:tolert';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import '/imports/client/components/jwa_alg_select/jwa_alg_select.js';
import '/imports/client/components/jwk_kty_select/jwk_kty_select.js';
import '/imports/client/components/jwk_use_select/jwk_use_select.js';

import './jwk_generate_pane.html';

Template.jwk_generate_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // generate the JWK
        //  reactively update the item
        async generate( itemRv ){
            let item = itemRv.get();
            item = await Jwks.fn.generateKeys( item );
            itemRv.set( item );
            if( item.createdAt ){
                Tolert.success( pwixI18n.label( I18N, 'jwks.edit.generated' ));
            }
        },
    };
});

Template.jwk_generate_pane.helpers({
    // have a color class which exhibit the enable status
    btnClass(){
        return this.item.get().alg ? 'btn-secondary' : 'btn-outline-secondary';
    },

    // whether the Generate button is disabled
    btnDisabled(){
        return this.item.get().alg ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.jwk_generate_pane.events({
    // generate the jwk key
    'click .js-generate'( event, instance ){
        instance.APP.generate( this.item );
    }
});
