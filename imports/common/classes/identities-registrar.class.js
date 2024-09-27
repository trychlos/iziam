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
import { Permissions } from 'meteor/pwix:permissions';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import { Identities } from '/imports/common/collections/identities/index.js';

import { izRegistrar } from './iz-registrar.class.js';

export class IdentitiesRegistrar extends izRegistrar {

    // static data

    // static methods

    // private data

    // client-side
    #handle = new ReactiveVar( null );

    // common
    #amInstance = null;
    #list = new ReactiveVar( [] );

    // private methods

    // client-side
    _initClient( organization ){
        const self = this;
        this.#handle.set( Meteor.subscribe( Meteor.APP.C.pub.identitiesAll.publish, organization ));

        // get the list of identities
        // each identity is published as an object with DYN sub-object
        Tracker.autorun(() => {
            if( self.#handle.get()?.ready()){
                Meteor.APP.Collections.get( Meteor.APP.C.pub.identitiesAll.collection ).find( Meteor.APP.C.pub.identitiesAll.query( organization )).fetchAsync().then(( fetched ) => {
                    self.#list.set( fetched );
                });
            }
        });

        // client-side only autorun's
        Tracker.autorun(() => {
            self.#list.get().forEach(( it ) => {
                // ?
            });
        });
    }

    // public data

    /**
     * Constructor
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {IdentitiesRegistrar}
     */
    constructor(){
        super( ...arguments );

        this.#amInstance = new AccountsManager.amClass({
            name: 'identities_'+organization._id,
            additionalFieldset: {
                fields: Identities.fieldsDef()
            },
            allowFn: Permissions.isAllowed,
            hideDisabled: false
        });

        // client-side initialization
        if( Meteor.isClient ){
            this._initClient( organization );

        // server-side initialization
        } else {

        }

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
}
