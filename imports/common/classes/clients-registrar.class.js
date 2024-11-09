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

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { Tracker } from 'meteor/tracker';

import { Clients } from '/imports/common/collections/clients/index.js';

import { ISearchableLabel } from '/imports/common/interfaces/isearchable-label.iface.js';

import { izRegistrar } from './iz-registrar.class.js';

export class ClientsRegistrar extends mix( izRegistrar ).with( ISearchableLabel ){

    // static data

    // the registry
    static #registry = {};

    // static methods

    /*
     * Getter
     * @param {Object} organization a full organization entity object, with its DYN sub-object
     * @returns {izRegistrar} the required instance, or null
     */
    static getRegistered( organization ){
        return ClientsRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side
    #handle = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {ClientsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        const self = this;

        // common code
        ClientsRegistrar.#registry[organization._id] = this;

        return this;
    }

    /**
     * @param {Object} item a client entity
     * @returns {String} the object (unique) label from the closest record
     */
    label( item ){
        return item.DYN.closest.label;
    }

    /**
     * @locus Client
     * @summary Initialize client side
     *  - subscribe and receive the full list of the clients of the organization
     *  This is run each time we try to edit an organization
     *  (because we are a multi-tenants application, we do not want load at startup all clients of all organizations)
     */
    clientLoad(){
        assert( Meteor.isClient );
        const self = this;
        self.#handle = Meteor.subscribe( Meteor.APP.C.pub.clientsAll.publish, self.organization());

        // get the list of clients
        // each client is published as an entity object with DYN { managers, records, closest } sub-object
        Tracker.autorun(() => {
            if( self.#handle.ready()){
                Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsAll.collection ).find( Meteor.APP.C.pub.clientsAll.query( self.organization())).fetchAsync().then(( fetched ) => {
                    console.debug( 'fetched', fetched );
                    self.set( fetched );
                });
            }
        });

        // install the auto operational check on client side
        Tracker.autorun(() => {
            self.get().forEach(( it ) => {
                Clients.setupOperational( it );
            });
        });    
    }
}
