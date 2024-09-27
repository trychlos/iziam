/*
 * /imports/client/components/organization_clients_load/organization_clients_load.js
 *
 * An non-visible component which loads the clients of the organization, creating a <organization>.DYN.clients object as:
 * - list: a ReactiveVar which contains the array of the clients
 * - byId( id<String> ): <Client>: a search function available at '<organization>.DYN.clients.byId()'
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { Clients } from '/imports/common/collections/clients/index.js';

import './organization_clients_load.html';

Template.organization_clients_load.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the organization item
        organization: new ReactiveVar( null ),
        // the subscription to the clients of the above organization
        handle: null
    };

    // get the organization entity identifier
    self.autorun(() => {
        const organization = Template.currentData().item.get();
        if( organization ){
            //console.debug( 'organization', organization );
            self.APP.organization.set( organization );
            self.APP.handle = self.subscribe( Meteor.APP.C.pub.clientsAll.publish, organization );
            organization.DYN.clients = {
                list: new ReactiveVar( [] ),
                byId( clientId ){
                    let found = null;
                    organization.DYN.clients.list.get().every(( it ) => {
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
        }
    });

    // get the list of clients
    // each client is published by the TenantsManager as an entity object with DYN { managers, records, closest } sub-object
    self.autorun(() => {
        if( self.APP.handle && self.APP.handle.ready()){
            const organization = self.APP.organization.get();
            //console.debug( 'query', Meteor.APP.C.pub.clientsAll.query( self.APP.organization.get()));
            Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsAll.collection ).find( Meteor.APP.C.pub.clientsAll.query( organization )).fetchAsync().then(( fetched ) => {
                //console.debug( 'fetched', fetched );
                organization.DYN.clients.list.set( fetched );
            });
        }
    });

    // maintain the 'operational' status of each client
    // when the clients change, update their status
    // we add (or update) here a DYN.status object
    /*
    self.autorun(() => {
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
    */
});
