/*
 * /imports/common/classes/claim.class.js
 *
 * Each instanciated claim - which must be unique - simultaneously maintains a list of scopes and their claims: see Scope class
 *
 * A claim.
 */

import _ from 'lodash';

import { izObject } from './iz-object.class.js';
import { Scope } from './scope.class.js';

export class Claim extends izObject {

    // static data
    // all the claims indexed by their names
    static _claims = {};

    // static methods

    /**
     * @param {String} name
     * @return {Claim}
     */
    static byName( name ){
        let claim = Claim._claims[name];
        if( !claim ){
            console.warn( 'unknown claim', name );
        }
        return claim;
    }

    // private data
    // instanciation time
    #claim = null;
    #opts = null;

    // runtime
    // the Scope's which contain this claim
    #scopes = [];

    // private methods

    // public data

    /**
     * Constructor
     * @param {String} claim
     * @param {Object} opts an optional object with following keys:
     *  - fn {Function}: function provider
     *  - args {Any}: function args
     *  - scopes {Array<String>}: the scopes which include this claim
     * @returns {Claim} this instance
     */
    constructor( claim, opts={} ){
        super( ...arguments );

        // keep instanciation arguments
        this.#claim = claim;
        this.#opts = opts;

        // register this claims
        Claim._claims[claim] = this;

        // and update the corresponding scopes
        if( opts.scopes ){
            const scopes = _.isArray( opts.scopes ) ? opts.scopes : [ opts.scopes ];
            scopes.forEach(( it ) => {
                const scope = Scope.byName( it );
                scope.addClaim( this );
                this.#scopes.push( scope );
            });
        }

        return this;
    }

    /**
     * @returns {Object} the options provided at instanciation time
     */
    opts(){
        return this.#opts;
    }

    /**
     * @returns {Array<Scope>} the list of scopes this claim is included in
     *  Is never null, but may be empty
     */
    scopes(){
        return this.#scopes;
    }
}
