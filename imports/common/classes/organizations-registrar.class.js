/*
 * /imports/common/classes/organizations-registrar.class.js
 *
 * A registration of all organizations.
 * 
 * Aims to maintain a registrar of all defined organizations.
 * Client side maintains a tracker on a tenant_all publication, so both client and server sides have the tools to update this central registration.
 * NB: 'central' here doesn't mean that the same instance is shared between client and server sides! That means that both instances are maintained equal.
 * 
 * The OrganizationsRegistrar is instanciated once in common init code.
 * It maintains the list of all organizations.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Tracker } from 'meteor/tracker';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { izRegistrar } from './iz-registrar.class.js';
import { ClientsRegistrar } from './clients-registrar.class.js';
import { IdentitiesRegistrar } from './identities-registrar.class.js';

export class OrganizationsRegistrar extends izRegistrar {

    // static data

    // static methods

    // private data

    // client side: the subscription handle
    #handle = new ReactiveVar( null );

    // common: the list of the organizations
    #list = new ReactiveVar( [] );

    // server side: the observers object
    #observers = null;
    #byIds = {};

    // private methods

    // on client side, the organizations registrar is maintained via the publish/subscribe mechanism
    _clientInit(){
        const self = this;
        this.#handle.set( Meteor.subscribe( TenantsManager.C.pub.tenantsAll.publish ));

        // get the list of organizations
        // each organization is published by the TenantsManager as an entity object with DYN { managers, records, closest } sub-object
        Tracker.autorun(() => {
            if( self.#handle.get()?.ready()){
                TenantsManager.collections.get( TenantsManager.C.pub.tenantsAll.collection ).find({}).fetchAsync().then(( fetched ) => {
                    //console.debug( 'organizations', fetched );
                    self.#list.set( fetched );
                });
            }
        });

        // client-side only autorun's
        Tracker.autorun(() => {
            self.#list.get().forEach(( it ) => {
                Organizations.setupOperational( it );
            });
        });
    }

    // on server side, the same above publish/subscribe mechanism is used to maintain the registrar
    _serverInit(){
        const self = this;
        const _onAdded = function( id, organization ){
            self.#byIds[id] = organization;
            self._serverUpdate();
        };
        const _onChanged = _onAdded;
        const _onRemoved = function( id, organization ){
            delete self.#byIds[id];
            self._serverUpdate();
        };
        TenantsManager.s.eventEmitter.on( 'added', _onAdded );
        TenantsManager.s.eventEmitter.on( 'changed', _onChanged );
        TenantsManager.s.eventEmitter.on( 'removed', _onRemoved );
    }

    // on server side, when the list has been updated, make sure we have ClientsRegistrar and IdentitiesRegistrar
    _serverUpdate(){
        const self = this;
        self.#list = Object.values( self.#byIds );
        this.#list.forEach(( it ) => {
            if( !it.DYN.clients ){
                it.DYN.clients = ClientsRegistrar.getRegistered( it ) || new ClientsRegistrar( it );
            }
            if( !it.DYN.identities ){
                it.DYN.identities = IdentitiesRegistrar.getRegistered( it ) || new IdentitiesRegistrar( it );
            }
        });
    }

    // public data

    /**
     * Constructor
     * @returns {OrganizationsRegistrar}
     */
    constructor(){
        super( ...arguments );
        const self = this;

        // on client side, subscribe the the tenants_all publication
        if( Meteor.isClient ){
            this._clientInit();

        // on server side, this is the publication itself which will maintaint us
        } else {
            this._serverInit();
        }

        // and for each organization some common codes to be executed when the organization are loaded
        Tracker.autorun(() => {
            self.#list.get().forEach(( it ) => {
            });
        });

        return this;
    }

    /**
     * @locus Everywhere
     * @param {String} organizationId the organization identifier
     * @returns {Object} the found organization, with its DYN object, or null
     */
    byId( organizationId ){
        let found = null;
        this.#list.get().every(( it ) => {
            if( it._id === organizationId ){
                found = it;
            }
            return !found;
        });
        if( !found ){
            console.warn( 'unable to find the organization', organizationId );
        }
        return found;
    }
}
