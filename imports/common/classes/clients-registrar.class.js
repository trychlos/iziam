/*
 * /imports/common/classes/clients-registrar.class.js
 *
 * A registration of clients of an organization.
 * Relies on OrganizationsRegistrar.
 * 
 * The ClientsRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.clients
 * It maintains a full list of the clients of an organization both on client and server sides.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Clients } from '/imports/common/collections/clients/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class ClientsRegistrar extends izRegistrar {

    // static data

    // static methods

    // private data

    // client-side: the subscription handle
    #handle = new ReactiveVar( null );

    // common: the organization 
    #organizationId = null;

    // common: the clients of the organization
    #list = new ReactiveVar( [] );

    // private methods

    _initClient( organization ){
        const self = this;
        this.#handle.set( Meteor.subscribe( Meteor.APP.C.pub.clientsAll.publish, organization ));

        // get the list of clients
        // each client is published as an entity object with DYN { managers, records, closest } sub-object
        Tracker.autorun(() => {
            if( self.#handle.get()?.ready()){
                Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsAll.collection ).find( Meteor.APP.C.pub.clientsAll.query( organization )).fetchAsync().then(( fetched ) => {
                    self.#list.set( fetched );
                });
            }
        });

        // client-side only autorun's
        Tracker.autorun(() => {
            self.#list.get().forEach(( it ) => {
                Clients.setupOperational( it );
            });
        });
    }

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {ClientsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );

        // client-side initialization
        if( Meteor.isClient ){
            this._initClient( organization );

        // server-side initialization
        } else {

        }

        // common code

        return this;
    }

    /**
     * @param {String} clientId the client Mongo entity identifier
     * @returns {<Client>}
     */
    byId( clientId ){
        let found = null;
        this.#list.get().every(( it ) => {
            if( it._id === clientId ){
                found = it;
            }
            return !found;
        });
        if( !found ){
            console.warn( 'unable to find the client', clientId );
        }
        return found;
    }
}
