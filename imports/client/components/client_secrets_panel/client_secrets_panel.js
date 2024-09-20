/*
 * /imports/client/components/client_secrets_panel/client_secrets_panel.js
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which contains the parent checker
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';

import '/imports/client/components/client_secret_edit_dialog/client_secret_edit_dialog.js';
import '/imports/client/components/client_secret_new_button/client_secret_new_button.js';
import '/imports/client/components/client_secrets_list/client_secrets_list.js';

import './client_secrets_panel.html';

Template.client_secrets_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        client: new ReactiveVar({ entity: null, record: null })
    };

    self.autorun(() => {
        let entity = { ...Template.currentData().entity.get() };
        delete entity.DYN;
        const record = Template.currentData().entity.get().DYN.records[0].get();
        self.APP.client.set({ entity: entity, record: record });
    });
});

Template.client_secrets_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the secrets list
    // see the secrets_list component for a description of the expected data context
    parmsSecretsList(){
        let parms = {
            ...this,
            listGetFn: ClientSecrets.fn.get,
            listAddFn: ClientSecrets.fn.add,
            listRemoveFn: ClientSecrets.fn.remove,
            args: {
                caller: Template.instance().APP.client.get(),
                parent: this.organization
            }
        };
        return parms;
    }
});
