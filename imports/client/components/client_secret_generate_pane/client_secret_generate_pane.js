/*
 * /imports/client/components/client_secret_generate_pane/client_secret_generate_pane.js
 *
 * Let the client generate its secret.
 * Only displayed for a new item.
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

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';

import './client_secret_generate_pane.html';

Template.client_secret_generate_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // generate the secret
        //  reactively update the item
        async generate( dataContext ){
            let item = dataContext.item.get();
            item = await ClientSecrets.fn.generateSecret( item );
            dataContext.item.set( item );
            if( item.createdAt ){
                Tolert.success( pwixI18n.label( I18N, 'clients.secrets.edit.generated' ));
            }
        },
    };
});

Template.client_secret_generate_pane.helpers({
    // have a color class which exhibit the enable status
    btnClass(){
        return this.item.get().encoding && this.item.get().size ? 'btn-secondary' : 'btn-outline-secondary';
    },

    // whether the Generate button is disabled
    btnDisabled(){
        return this.item.get().encoding && this.item.get().size ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.client_secret_generate_pane.events({
    // generate the jwk key
    'click .js-generate'( event, instance ){
        instance.APP.generate( this );
    }
});
