/*
 * /imports/common/classes/clients-groups-registrar.class.js
 *
 * A registration of groups attached to an organization.
 * This is needed so that we are able to manage groups instances from common code.
 * Relies on OrganizationsRegistrar.
 * 
 * The ClientsGroupsRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.groups
 * It maintains a full list of the groups of an organization both on client and server sides.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { Tracker } from 'meteor/tracker';

import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';

import { ISearchableLabel } from '/imports/common/interfaces/isearchable-label.iface.js';

import { izRegistrar } from './iz-registrar.class.js';

export class ClientsGroupsRegistrar extends mix( izRegistrar ).with( ISearchableLabel ){

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
        return ClientsGroupsRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side
    #handle = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {ClientsGroupsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        const self = this;

        // common code
        ClientsGroupsRegistrar.#registry[organization._id] = this;

        return this;
    }

    /**
     * @param {Object} item a clients group object
     * @returns {String} the object (unique) label
     */
    label( item ){
        return item.label;
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the groups of the organization
     */
    clientLoad(){
        assert( Meteor.isClient );
        const self = this;
        const organizationId = self.organization()._id;
        self.#handle = Meteor.subscribe( 'clients_groups.listAll', organizationId );

        // get the list of groups
        // each group is published as an object with DYN sub-object
        Tracker.autorun(() => {
            //console.debug( 'self', self, self.#handle.get(), self.#handle.get().ready());
            if( self.#handle.ready()){
                ClientsGroups.collection( organizationId ).find({ organization: organizationId }).fetchAsync().then(( fetched ) => {
                    console.debug( 'fetched', fetched );
                    self.set( fetched );
                });
            }
        });
    }
}
