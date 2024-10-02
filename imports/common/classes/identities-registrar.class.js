/*
 * /imports/common/classes/identities-registrar.class.js
 *
 * A registration of identities attached to an organization.
 * This is needed so that we are able to manage AccountsManager accounts entities instances from common code.
 * Relies on OrganizationsRegistrar.
 * 
 * The IdentitiesRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.identities
 * It maintains a full list of the identities of an organization both on client and server sides.
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { Field } from 'meteor/pwix:field';
import { Permissions } from 'meteor/pwix:permissions';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Identities } from '/imports/common/collections/identities/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class IdentitiesRegistrar extends izRegistrar {

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
        //console.debug( 'IdentitiesRegistrar.getRegistered: organization', organization, 'registry', AccountsHub.instances );
        return IdentitiesRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side: is initialized ?
    #clientInitialized = false;
    // client-side
    #handle = new ReactiveVar( null );

    // common
    #amInstance = null;
    #list = new ReactiveVar( [] );

    // server-side: is initialized ?
    #serverInitialized = false;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {IdentitiesRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        //console.debug( 'instanciating IdentitiesRegistrar', organization._id );
        const self = this;

        this.#amInstance = new AccountsManager.amClass({
            name: Identities.instanceName( organization._id ),
            baseFieldset: new Field.Set( Identities.fieldsDef( organization )),
            clientNewFn: Identities.fn.new,
            clientNewArgs: {
                organization: organization
            },
            haveIdent: false,
            haveRoles: false,
            allowFn: Permissions.isAllowed,
            hideDisabled: false,
            tabularFieldsDef: Identities.tabularFieldsDef( organization ),
            serverTabularExtend: Meteor.isServer && Identities.s.tabularExtend
        });

        // common code
        IdentitiesRegistrar.#registry[organization._id] = this;

        return this;
    }

    /**
     * @param {String} identityId the identity identifier
     * @returns {Object} the found identity, with its DYN object, or null
     */
    byId( identityId ){
        let found = null;
        Meteor.APP.Identities._identities.get().every(( it ) => {
            if( it._id === identityId ){
                found = it;
            }
            return !found;
        });
        if( !found ){
            console.warn( 'unable to find an identity', identityId );
        }
        return found;
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the identities of the organization
     * @param {Organization} organization 
     */
    clientLoad( organization ){
        if( !this.#clientInitialized ){
            const self = this;
            //console.debug( 'subscribing to', self.#amInstance.name());
            this.#handle.set( Meteor.subscribe( 'pwix_accounts_manager_accounts_list_all', self.#amInstance.name()));
    
            // get the list of identities
            // each identity is published as an object with DYN sub-object
            Tracker.autorun(() => {
                if( self.#handle.get()?.ready()){
                    self.#amInstance.collection().find( Meteor.APP.C.pub.identitiesAll.query( organization )).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.#list.set( fetched );
                    });
                }
            });
            this.#clientInitialized = true;
        }
    }

    /**
     * @returns {integer} the current identities count
     */
    count(){
        return this.#list.get().length;
    }
}
