/*
 * /imports/common/classes/resources-registrar.class.js
 *
 * A registration of resources attached to an organization.
 * This is needed so that we are able to manage resources instances from common code.
 * Relies on OrganizationsRegistrar.
 * 
 * The ResourcesRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.resources
 * It maintains a full list of the resources of an organization both on client and server sides.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Resources } from '/imports/common/collections/resources/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class ResourcesRegistrar extends izRegistrar {

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
        //console.debug( 'ResourcesRegistrar.getRegistered: organization', organization, 'registry', AccountsHub.instances );
        return ResourcesRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side: is initialized ?
    #clientInitialized = false;
    // client-side
    #handle = new ReactiveVar( null );

    // common
    #organization = null;
    #list = new ReactiveVar( [] );

    // server-side: is initialized ?
    #serverInitialized = false;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {ResourcesRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        //console.debug( 'instanciating ResourcesRegistrar', organization._id );
        const self = this;

        // common code
        this.#organization = organization;
        ResourcesRegistrar.#registry[organization._id] = this;
        Resources.getTabular( organization._id );

        return this;
    }

    /**
     * @param {String} resourceId the resource identifier
     * @returns {Object} the found resource, with its DYN object, or null
     */
    byId( resourceId ){
        let found = null;
        Meteor.APP.Resources._resources.get().every(( it ) => {
            if( it._id === resourceId ){
                found = it;
            }
            return !found;
        });
        // this may be normal just after having deleted an item - so better to not warn
        if( !found ){
            console.debug( 'unable to find resource', resourceId );
        }
        return found;
    }

    /**
     * @returns {Array} the loaded resources
     */
    get(){
        return this.#list.get();
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the resources of the organization
     */
    resourcesLoad(){
        if( Meteor.isClient && !this.#clientInitialized ){
            const self = this;
            //console.debug( 'subscribing to', self.#amInstance.name());
            this.#handle.set( Meteor.subscribe( 'resources_list_all', self.#organization._id ));
    
            // get the list of resources
            Tracker.autorun(() => {
                if( self.#handle.get()?.ready()){
                    Resources.collection( self.#organization._id ).find({ organization: self.#organization._id }).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.#list.set( fetched );
                    });
                }
            });
            this.#clientInitialized = true;
        }
    }

    /**
     * @returns {integer} the current resources count
     */
    count(){
        return this.#list.get().length;
    }
}
