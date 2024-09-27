/*
 * /imports/client/init/clients-list.js
 *
 * Maintain a reactive list of the clients, and their operational status
 * 
 * Each client item is an entity object, with a DYN:
 * - managers
 * - records
 * - closest
 */

import { Forms } from 'meteor/pwix:forms';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { Clients } from '/imports/common/collections/clients/index.js';

Meteor.APP.Clients = {
    _handle: Meteor.subscribe( Meteor.APP.C.pub.clientsAll.publish ),
    _clients: new ReactiveVar( [] ),

    /**
     * @param {String} clientId the client entity identifier
     * @returns {Object} the found client, with its DYN object, or null
     */
    byId( clientId ){
        let found = null;
        Meteor.APP.Clients._clients.get().every(( it ) => {
            if( it._id === clientId ){
                found = it;
            }
            return !found;
        });
        if( !found ){
            console.warn( 'unable to find a client', clientId );
        }
        return found;
    }
};

// get the list of clients
// each client is published by the TenantsManager as an entty object with DYN { managers, records, closest } sub-object
Tracker.autorun(() => {
    if( Meteor.APP.Clients._handle.ready()){
        Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsAll.collection ).find().fetchAsync().then(( fetched ) => {
            Meteor.APP.Clients._clients.set( fetched );
            //console.debug( 'fetched', fetched );
        });
}
});

// maintain the 'operational' status of each client
// when the clients change, update their status
// we add (or update) here a DYN.status object
Tracker.autorun(() => {
    Meteor.APP.Clients._clients.get().forEach(( it ) => {
        const atdate = Validity.atDateByRecords( it.DYN.records );
        if( atdate ){
            let entity = { ...it };
            delete entity.DYN;
            it.DYN.operational = it.DYN.operational || {};
            Clients.isOperational({ entity: entity, record: atdate }).then(( res ) => {
                // null or a TM.TypedMessage or an array of TM.TypedMessage's
                it.DYN.operational.results = res;
                it.DYN.operational.status = res ? Forms.FieldStatus.C.UNCOMPLETE : Forms.FieldStatus.C.VALID;
            });
        } else {
            it.DYN.operational.results = [];
            it.DYN.operational.status = Forms.FieldStatus.C.INVALID;
            it.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.checks.atdate_none' )
            }));
            it.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'clients.checks.atdate_next' )
            }));
            Clients.isOperational({ entity: entity, record: it.DYN.closest }).then(( res ) => {
                if( res ){
                    it.DYN.operational.results = it.DYN.operational.results.concat( res );
                } else {
                    it.DYN.operational.results.push( new TM.TypedMessage({
                        level: TM.MessageLevel.C.INFO,
                        message: pwixI18n.label( I18N, 'clients.checks.atdate_closest_done' )
                    }));
                }
            });
        }
        //console.debug( 'it', it );
    });
});
