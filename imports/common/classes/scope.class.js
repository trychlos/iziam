/*
 * /imports/common/classes/scope.class.js
 *
 * A scope, with its handling function and its claims.
 */

import { izObject } from './iz-object.class.js';

export class Scope extends izObject {

    // static data
    static _scopes = {};

    // static methods

    /**
     * 
     * @param {String} name
     * @returns {Scope} the corresponding scope
     */
    static byName( name ){
        let scope = Scope._scopes[name];
        if( !scope ){
            scope = new Scope( name );
        }
        return scope;
    }

    /**
     * @returns {Array<String>} the list of supported scopes
     */ 
    static scopeNames(){
        return Object.keys( Scope._scopes );
    }

    // private data
    // instanciation arguments
    #scope = null;

    // runtime
    #claims = [];

    // private methods

    // public data
    /**
     * Constructor
     * @param {String} scope the scope name
     * @returns {Scope}
     */
    constructor( scope ){
        super( ...arguments );

        // keep the instanciation arguments
        this.#scope = scope;

        // register this scope
        Scope._scopes[scope] = this;

        return this;
    }

    /**
     * @param {Claim} claim
     * @returns {Scope}
     */
    addClaim( claim ){
        this.#claims.push( claim );
    }

    /**
     * @returns {String} the scope name
     */
    name(){
        return this.#scope;
    }
}