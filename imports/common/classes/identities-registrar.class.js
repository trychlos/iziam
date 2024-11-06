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

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { Field } from 'meteor/pwix:field';
import { Permissions } from 'meteor/pwix:permissions';
import { Tracker } from 'meteor/tracker';

import { Identities } from '/imports/common/collections/identities/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class IdentitiesRegistrar extends izRegistrar {

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
        return IdentitiesRegistrar.#registry[organization._id] || null;
    }

    // private data

    // client-side
    #handle = null;

    // common
    #amInstance = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {IdentitiesRegistrar}
     */
    constructor( organization ){
        super( ...arguments );
        const self = this;

        // common code
        this.#amInstance = new AccountsManager.amClass({
            name: Identities.instanceName( organization._id ),
            baseFieldset: new Field.Set( Identities.fieldsDef()),
            clientNewFn: Identities.fn.clientNew,
            clientNewArgs: {
                organization: organization
            },
            clientUpdateFn: Identities.fn.clientUpdate,
            clientUpdateArgs: {
                organization: organization
            },
            haveIdent: false,
            haveRoles: false,
            allowFn: Permissions.isAllowed,
            hideDisabled: false,
            preferredLabel: Identities.fn.preferredLabel,
            tabularFieldsDef: Identities.tabularFieldsDef( organization ),
            serverAllExtend: Meteor.isServer && Identities.s.allExtend,
            serverTabularExtend: Meteor.isServer && Identities.s.tabularExtend
        });

        // common code
        IdentitiesRegistrar.#registry[organization._id] = this;

        return this;
    }

    /**
     * @summary Initialize client side
     *  - subscribe and receive the full list of the identities of the organization
     */
    clientLoad(){
        if( Meteor.isClient );
        const self = this;
        //console.debug( 'subscribing to', self.#amInstance.name());
        self.#handle = Meteor.subscribe( 'pwix_accounts_manager_accounts_list_all', self.#amInstance.name());

        if( !this.clientInitialized()){
            // get the list of identities
            // each identity is published as an object with DYN sub-object
            Tracker.autorun(() => {
                if( self.#handle.ready()){
                    self.#amInstance.collection().find( Meteor.APP.C.pub.identitiesAll.query( self.organization())).fetchAsync().then(( fetched ) => {
                        console.debug( 'fetched', fetched );
                        self.set( fetched );
                    });
                }
            });
            this.clientInitialized( true );
        }
    }
}
