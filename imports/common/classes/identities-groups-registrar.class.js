/*
 * /imports/common/classes/identities-groups-registrar.class.js
 *
 * A registration of groups of identities attached to an organization.
 * This is needed so that we are able to manage groups instances from common code.
 * Relies on OrganizationsRegistrar.
 * 
 * The IdentitiesGroupsRegistrar is instanciated once per organization, when the user is about to edit it.
 * The instance is available as <organization>.DYN.identities_groups
 * It maintains a full list of the identities groups of an organization both on client and server sides.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { Tracker } from 'meteor/tracker';

import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';

import { ISearchableLabel } from '/imports/common/interfaces/isearchable-label.iface.js';

import { izRegistrar } from './iz-registrar.class.js';

export class IdentitiesGroupsRegistrar extends mix( izRegistrar ).with( ISearchableLabel ){

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
        return IdentitiesGroupsRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side
    #handle = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {IdentitiesGroupsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        const self = this;

        // common code
        IdentitiesGroupsRegistrar.#registry[organization._id] = this;

        return this;
    }

    /**
     * @param {Object} item an identities group object
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
        if( Meteor.isClient );
        const self = this;
        const organizationId = self.organization()._id;
        self.#handle = Meteor.subscribe( 'identities_groups.listAll', organizationId );

        // get the list of groups
        // each group is published as an object with DYN sub-object
        Tracker.autorun(() => {
            if( self.#handle.ready()){
                IdentitiesGroups.collection( organizationId ).find({ organization: organizationId }).fetchAsync().then(( fetched ) => {
                    console.debug( 'fetched', fetched );
                    self.set( fetched );
                });
            }
        });
    }
}
