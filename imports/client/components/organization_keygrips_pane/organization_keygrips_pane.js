/*
 * /imports/client/components/organization_keygrips_pane/organization_keygrips_pane.js
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which contains the parent checker
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import '/imports/client/components/keygrip_edit_dialog/keygrip_edit_dialog.js';
import '/imports/client/components/keygrip_new_button/keygrip_new_button.js';
import '/imports/client/components/keygrips_list/keygrips_list.js';

import './organization_keygrips_pane.html';

Template.organization_keygrips_pane.onCreated( function(){
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

    // track the entity/record content
    self.autorun(() => {
        //console.debug( Template.currentData().entity.get().DYN.records[Template.currentData().index].get());
    });
});

Template.organization_keygrips_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the keygrips_list
    // see the keygrips_list component for a description of the expected data context
    parmsKeygripsList(){
        let parms = {
            ...this,
            listGetFn: Keygrips.fn.get,
            listAddFn: Keygrips.fn.add,
            listRemoveFn: Keygrips.fn.remove,
            args: {
                caller: Template.instance().APP.organization.get(),
                parent: null
            }
        };
        return parms;
    }
});
