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

import mix from '@vestergaard-company/js-mixin';

import { Tracker } from 'meteor/tracker';

import { Resources } from '/imports/common/collections/resources/index.js';

import { ISearchableLabel } from '/imports/common/interfaces/isearchable-label.iface.js';

import { izRegistrar } from './iz-registrar.class.js';

export class ResourcesRegistrar extends mix( izRegistrar ).with( ISearchableLabel ){

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
        return ResourcesRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side
    #handle = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {ResourcesRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        const self = this;

        // common code
        ResourcesRegistrar.#registry[organization._id] = this;
        Resources.getTabular( organization._id );

        return this;
    }

    /**
     * @param {Object} item a resource object
     * @returns {String} the object (unique) label
     */
    label( item ){
        return item.name;
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the resources of the organization
     */
    clientLoad(){
        if( Meteor.isClient && !this.clientInitialized()){
            const self = this;
            const organizationId = self.organization()._id;
            self.#handle = Meteor.subscribe( 'resources_list_all', organizationId );

            // get the list of resources
            Tracker.autorun(() => {
                if( self.#handle.ready()){
                    Resources.collection( organizationId ).find({ organization: organizationId }).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.set( fetched );
                    });
                }
            });
            this.clientInitialized( true );
        }
    }
}
