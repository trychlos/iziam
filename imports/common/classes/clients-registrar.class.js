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

    // the registry of clients registars per organization
    static #registry = {};

    // static methods

    /*
     * Getter
     * @param {Object} organization a full organization entity object, with its DYN sub-object
     * @returns {izRegistrar} the required instance, or null
     */
    static getRegistered( organization ){
        //console.debug( 'ClientsRegistrar.getRegistered: organization', organization, 'registry', this.#registry );
        return ClientsRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side: is initialized ?
    #clientInitialized = false;
    // client-side: the subscription handle
    #handle = new ReactiveVar( null );

    // common: the clients of the organization
    #organization = null;
    #list = new ReactiveVar( [] );

    // server-side: is initialized ?
    #serverInitialized = false;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {ClientsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        //console.debug( 'instanciating ClientsRegistrar', organization._id );
        const self = this;

        // common code
        this.#organization = organization;
        ClientsRegistrar.#registry[organization._id] = this;

        Tracker.autorun(() => {
            self.#list.get().forEach(( it ) => {
                Clients.setupOperational( it );
            });
        });

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

    /**
     * @locus Client
     * @summary Initialize client side
     *  - subscribe and receive the full list of the clients of the organization
     *  This is run the first time we try to edit an organization
     *  (because we are a multi-tenants application, we do not want load at startup all clients of all organizations)
     */
    clientsLoad(){
        if( Meteor.isClient && !this.#clientInitialized ){
            this.#handle.set( Meteor.subscribe( Meteor.APP.C.pub.clientsAll.publish, this.#organization ));
            // get the list of clients
            // each client is published as an entity object with DYN { managers, records, closest } sub-object
            const self = this;
            Tracker.autorun(() => {
                if( self.#handle.get()?.ready()){
                    Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsAll.collection ).find( Meteor.APP.C.pub.clientsAll.query( self.#organization )).fetchAsync().then(( fetched ) => {
                        self.#list.set( fetched );
                    });
                }
            });
    
            this.#clientInitialized = true;
        }
    }

    /**
     * @returns {integer} the current clients count
     */
    count(){
        return this.#list.get().length;
    }
}
