/*
 * /imports/common/interfaces/iregistrar.iface.js
 *
 * The IRegistrar interface let the caller access some common features of all registrars.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

import { ReactiveVar } from 'meteor/reactive-var';

export const IRegistrar = DeclareMixin(( superclass ) => class extends superclass {

    // private data

    // client-side
    #clientInitialized = false;

    // common
    #organization = null;
    #list = new ReactiveVar( [] );

    // server-side
    #serverInitialized = false;

    /**
     * @param {<Organization>} organization the full organization entity with its DYN sub-object
     * @returns {IRegistrar}
     */
    constructor( organization ){
        super( ...arguments );

        this.#organization = organization;

        return this;
    }

    /**
     * Getter
     * @param {String} id the object identifier
     * @returns {Object} the found object, or null
     *  A reactive data source
     */
    byId( id ){
        let found = null;
        this.#list.get().every(( it ) => {
            if( it._id === id ){
                found = it;
            }
            return !found;
        });
        // this may be normal just after having deleted an item - so better to not warn
        if( !found ){
            console.debug( 'unable to find object', this.constructor.name, id );
        }
        return found;
    }

    /**
     * Getter/Setter
     * @param {Boolean} bool whether the client is initialized
     * @returns {Boolean} whether the client is initialized
     */
    clientInitialized( bool ){
        if( bool === true || bool === false ){
            this.#clientInitialized = bool;
        }
        return this.#clientInitialized;
    }

    /**
     * @summary Subscribe to the general publication, and fetch from the collection to feed our list
     *  Should be implemented by each registrar.
     */
    clientLoad(){
        console.warn( 'IRegistrar.clientLoad() should be implemented by the derived class', this );
    }

    /**
     * Getter
     * @returns {integer} the current objects count
     *  A reactive data source
     */
    count(){
        return this.#list.get().length;
    }

    /**
     * Getter
     * @returns {Array} the loaded objects
     *  A reactive data source
     */
    get(){
        return this.#list.get();
    }

    /**
     * Getter
     * @returns {<Organization>} the full organization entity with its DYN sub-object, as provided at instanciation time
     */
    organization(){
        return this.#organization;
    }

    /**
     * Setter
     * @param {Array} array the loaded objects
     */
    set( array ){
        this.#list.set( array );
    }
});
