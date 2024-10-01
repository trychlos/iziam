/*
 * /imports/client/components/operational_panel/operational_panel.js
 *
 * A panel which displays the result of the organization/client operatonal checks.
 * 
 * Parms:
 * - organization: an { entity, record } object if the entity is a client
 * - entityId: the currently edited organization/client identifier
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { TM } from 'meteor/pwix:typed-message';

import './operational_panel.html';

Template.operational_panel.onCreated( function(){
    const self = this;

    self.APP = {
        entity: new ReactiveVar( null ),
    };

    // get the entity
    self.autorun(() => {
        const entityId = Template.currentData().entityId;
        const organization = Template.currentData().organization;
        if( organization ){
            // handle the client case
        } else {
            const org = TenantsManager.list.byEntity( entityId );
            if( org ){
                self.APP.entity.set( org );
                //console.debug( 'org', org );
            }
        }
    });

    // complete the checks results with a conclusion
    self.autorun(() => {
        let errors = 0;
        let warnings = 0;
        const entity = self.APP.entity.get();
        if( entity.DYN.operational.stats === false ){
            entity.DYN.operational.results.forEach(( it ) => {
                // all critical, urgent and alerts are counted as errors
                if( TM.LevelOrder.compare( it.iTypedMessageLevel(), TM.MessageLevel.C.ERROR ) <= 0 ){
                    errors += 1;
                }
                if( it.iTypedMessageLevel() === TM.MessageLevel.C.WARNING ){
                    warnings += 1;
                }
            });
            entity.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'manager.checks.errors_count', errors, warnings )
            }));
            entity.DYN.operational.stats = true;
        }
    });
});

Template.operational_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the class to be attached to the message
    itClass( it ){
        return it.iTypedMessageLevel();
    },

    // the message label
    itLabel( it ){
        return it.iTypedMessageMessage();
    },

    // the list of message
    itemsList(){
        const entity = Template.instance().APP.entity.get();
        return entity && entity.DYN && entity.DYN.operational ? entity.DYN.operational.results || [] : null;
    }
});
