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

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class AuthorizationsRegistrar extends mix( izRegistrar ).with(){

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
        return AuthorizationsRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side
    #handle = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {AuthorizationsRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        const self = this;

        // common code
        AuthorizationsRegistrar.#registry[organization._id] = this;
        Authorizations.getTabular( organization._id );

        return this;
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the authorizations of the organization
     */
    clientLoad(){
        assert( Meteor.isClient );
        const self = this;
        const organizationId = self.organization()._id;
        this.#handle = Meteor.subscribe( 'authorizations_list_all', organizationId );

        if( !this.clientInitialized()){
            // get the list of authorizations
            Tracker.autorun(() => {
                if( self.#handle.ready()){
                    Authorizations.collection( organizationId ).find({ organization: organizationId }).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.set( fetched );
                    });
                }
            });
            this.clientInitialized( true );
        }
    }
}
