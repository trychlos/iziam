/*
 * /imports/client/components/client_jwks_panel/client_jwks_panel.js
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which contains the parent checker
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import '/imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js';
import '/imports/client/components/jwk_new_button/jwk_new_button.js';
import '/imports/client/components/jwks_list/jwks_list.js';

import './client_jwks_panel.html';

Template.client_jwks_panel.onCreated( function(){
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

Template.client_jwks_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the jwks_list
    // see the jwks_list component for a description of the expected data context
    parmsJwksList(){
        let parms = {
            ...this,
            listGetFn: Jwks.fn.get,
            listAddFn: Jwks.fn.add,
            listRemoveFn: Jwks.fn.remove,
            args: {
                caller: Template.instance().APP.client.get(),
                parent: this.organization
            }
        };
        return parms;
    }
});
