/*
 * /imports/common/classes/groups-registrar.class.js
 *
 * A registration of groups attached to an organization.
 * This is needed so that we are able to manage groups instances from common code.
 * Relies on OrganizationsRegistrar.
 * 
 * The GroupsRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.groups
 * It maintains a full list of the groups of an organization both on client and server sides.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Groups } from '/imports/common/collections/groups/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class GroupsRegistrar extends izRegistrar {

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
        //console.debug( 'GroupsRegistrar.getRegistered: organization', organization, 'registry', GroupsRegistrar.#registry );
        return GroupsRegistrar.#registry[organization._id] || null;
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
     * @returns {GroupsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        //console.debug( 'instanciating GroupsRegistrar', organization );
        const self = this;

        // common code
        this.#organization = organization;
        GroupsRegistrar.#registry[organization._id] = this;

        return this;
    }

    /**
     * @param {String} groupId the group identifier
     * @returns {Object} the found group, with its DYN object, or null
     */
    byId( groupId ){
        let found = null;
        this.#list.get().every(( it ) => {
            if( it._id === groupId ){
                found = it;
            }
            return !found;
        });
        // this may be normal just after having deleted an item - so better to not warn
        if( !found ){
            console.debug( 'unable to find group', groupId );
        }
        return found;
    }

    /**
     * @returns {Array<Group>} the current list of groups
     */
    get(){
        return this.#list.get();
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the groups of the organization
     */
    groupsLoad(){
        if( Meteor.isClient && !this.#clientInitialized ){
            const self = this;
            this.#handle.set( Meteor.subscribe( 'groups.listAll', this.#organization._id ));
    
            // get the list of groups
            // each group is published as an object with DYN sub-object
            Tracker.autorun(() => {
                if( self.#handle.get()?.ready()){
                    Groups.collection( self.#organization._id ).find({ organization: self.#organization._id }).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.#list.set( fetched );
                    });
                }
            });

            this.#clientInitialized = true;
        }
    }

    /**
     * @returns {integer} the current groups count
     */
    count(){
        return this.#list.get().length;
    }
}
