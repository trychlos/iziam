/*
 * /imports/client/components/client_id_panel/client_id_panel.js
 *
 * Client Identifier panel.
 * Displays the generated identifier.
 * 
 * Parms:
 * - organization: an { entity, record } object
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';

import './client_id_panel.html';

Template.client_id_panel.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            clientId: {
                js: '.js-id'
            }
        },
        // the Forms.Checker instance
        checker: new ReactiveVar( null )
    };
});

Template.client_id_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const entity = Template.currentData().entity.get();
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'client_id_panel',
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, ClientsEntities.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: entity
            }));
        }
    });
});

Template.client_id_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
