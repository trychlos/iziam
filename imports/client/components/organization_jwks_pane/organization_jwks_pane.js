/*
 * pwix:tenants-manager/src/client/components/organization_jwks_pane/organization_jwks_pane.js
 *
 * Parms:
 * - see README
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import '/imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js';
import '/imports/client/components/jwk_new_button/jwk_new_button.js';
import '/imports/client/components/jwks_list/jwks_list.js';

import './organization_jwks_pane.html';

Template.organization_jwks_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // an object { entity, record }
        organization: new ReactiveVar( null )
    };

    // get the data context and instanciate the organization tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        self.APP.organization.set({
            entity: entity,
            record: entity.DYN.records[dataContext.index].get()
        });
    });
});

Template.organization_jwks_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the jwks_list
    // see the jwks_list component for a description of the expected data context
    parmsJwksList(){
        let parms = {
            listGetFn: Organizations.fn.jwksGet,
            listAddFn: Organizations.fn.jwksAdd,
            listRemoveFn: Organizations.fn.jwksRemove,
            args: {
                caller: Template.instance().APP.organization.get(),
                parent: null,
            }
        };
        return parms;
    }
});
