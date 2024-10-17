/*
 * /imports/common/classes/authorizations-registrar.class.js
 *
 * A registration of authorizations attached to an organization.
 * This is needed so that we are able to manage authorizations instances from common code.
 * Relies on OrganizationsRegistrar.
 * 
 * The AuthorizationsRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.authorizations
 * It maintains a full list of the authorizations of an organization both on client and server sides.
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class AuthorizationsRegistrar extends izRegistrar {

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
        //console.debug( 'AuthorizationsRegistrar.getRegistered: organization', organization, 'registry', AccountsHub.instances );
        return AuthorizationsRegistrar.#registry[organization._id] || null;
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
     * @returns {AuthorizationsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        //console.debug( 'instanciating AuthorizationsRegistrar', organization._id );
        const self = this;

        // common code
        this.#organization = organization;
        AuthorizationsRegistrar.#registry[organization._id] = this;
        Authorizations.getTabular( organization._id );

        return this;
    }

    /**
     * @param {String} authorizationId the authorization identifier
     * @returns {Object} the found authorization, with its DYN object, or null
     */
    byId( authorizationId ){
        let found = null;
        Meteor.APP.Authorizations._authorizations.get().every(( it ) => {
            if( it._id === authorizationId ){
                found = it;
            }
            return !found;
        });
        // this may be normal just after having deleted an item - so better to not warn
        if( !found ){
            console.debug( 'unable to find authorization', authorizationId );
        }
        return found;
    }

    /**
     * @returns {Array} the loaded authorizations
     */
    get(){
        return this.#list.get();
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the authorizations of the organization
     */
    authorizationsLoad(){
        if( Meteor.isClient && !this.#clientInitialized ){
            const self = this;
            //console.debug( 'subscribing to', self.#amInstance.name());
            this.#handle.set( Meteor.subscribe( 'authorizations_list_all', self.#organization._id ));
    
            // get the list of authorizations
            Tracker.autorun(() => {
                if( self.#handle.get()?.ready()){
                    Authorizations.collection( self.#organization._id ).find({ organization: self.#organization._id }).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.#list.set( fetched );
                    });
                }
            });
            this.#clientInitialized = true;
        }
    }

    /**
     * @returns {integer} the current authorizations count
     */
    count(){
        return this.#list.get().length;
    }
}
