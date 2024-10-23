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

    /**
     * @returns {Object} the claims configuration for oidc-provider configuration
     *  See https://github.com/panva/node-oidc-provider/blob/47a77d9afe90578ea4dfed554994b60b837a3059/recipes/claim_configuration.md
     */
    static claimList(){
        let res = {};
        Object.values( Claim._claims ).forEach(( it ) => {
            const scopes = it.scopes();
            if( scopes && _.isArray( scopes ) && scopes.length ){
                scopes.forEach(( s ) => {
                    const scopeName = s.name();
                    res[scopeName] = res[scopeName] || [];
                    res[scopeName].push( it.name());
                });
            } else {
                res[it.name()] = null;
            }
        });
        //§console.debug( 'res', res );
        return res;
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
        //console.debug( 'instanciating', this , claim );

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
     * @param {String|Array<String>} scopes a space-separated list of scopes or an array of individual scopes
     * @return {Boolean} whether this claim is suitable for one of these scopes
     */
    isForScopes( scopes ){
        let array = scopes;
        if( _.isString( scopes )){
            array = scopes.split( /\s+/ );
        }
        let found = false;
        this.#scopes.every(( it ) => {
            if( array.includes( it.name())){
                found = true;
            }
            return !found;
        });
        return found;
    }

    /**
     * @param {String} use either 'id_token' or 'userinfo'
     * @return {Boolean} whether this claim is suitable for the proposed use
     */
    isForUse( use ){
        const forUse = this.opts().use;
        return ( !forUse || !forUse.length || forUse.includes( use ));
    }

    /**
     * @returns {String} the claim name
     */
    name(){
        return this.#claim;
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

    /**
     * @returns {Array<String>} the uses accepted by this claim, or null which means all
     */
    use(){
        let use = this.opts().use;
        use = use ? ( _.isArray( use ) ? use : [ use ]) : null;
        return use;
    }
}
