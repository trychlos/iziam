/*
 * /imports/client/components/keygrip_secret_generate_pane/keygrip_secret_generate_pane.js
 *
 * Let the user generate its key secret.
 * Only displayed for a new key item.
 *
 * Parms:
 * - container: an { entity, record } organization/client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the key item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 * - keygripRv: a ReactiveVar which contains the current keygrip item
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tolert } from 'meteor/pwix:tolert';

import { KeygripSecrets } from '/imports/common/tables/keygrip_secrets/index.js';

import './keygrip_secret_generate_pane.html';

Template.keygrip_secret_generate_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // generate the key
        //  reactively update the item
        async generate( dataContext ){
            const item = await KeygripSecrets.fn.generateSecret( dataContext.keygripRv.get(), dataContext.item.get());
            dataContext.item.set( item );
            if( item.createdAt ){
                Tolert.success( pwixI18n.label( I18N, 'keygrips.edit.generated' ));
            }
        },
    };
});

Template.keygrip_secret_generate_pane.helpers({
    // have a color class which exhibit the enable status
    btnClass(){
        return this.keygripRv.get().alg ? 'btn-secondary' : 'btn-outline-secondary';
    },

    // whether the Generate button is disabled
    btnDisabled(){
        return this.keygripRv.get().alg ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.keygrip_secret_generate_pane.events({
    // generate the jwk key
    'click .js-generate'( event, instance ){
        instance.APP.generate( this );
    }
});
