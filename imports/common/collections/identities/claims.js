/*
 * /imports/common/collections/identities/claims.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Field } from 'meteor/pwix:field';

import { Claim } from '/imports/common/classes/claim.class.js';
import { OAuth2 } from '/imports/common/classes/oauth2.class.js';
import { Scope } from '/imports/common/classes/scope.class.js';

import { Identities } from './index.js';

Identities.claims = {

    _myClaims: {},

    // returns the name of the claim
    claim_name( def ){
        return def.def().oid.claim_name || def.name();
    },

    // called once at IdentiyScopesProvider instanciation
    //  register all the provided claims now
    defineClaims(){
        this.get().forEach(( it ) => {
            const oid = it.def().oid;
            const name = this.claim_name( it );
            let opts = {};
            if(oid.claim_fn ){
                opts.fn = oid.claim_fn;
            }
            if(oid.claim_args ){
                opts.args = oid.claim_args;
            }
            if(oid.scopes ){
                opts.scopes = oid.scopes;
            }
            opts.def = it;
            const claim = new Claim( name, opts );
            Identities.claims._myClaims[name] = claim;
        });
    },

    // returns {Array<Field.Def>} the list of fields which provide a claim
    get(){
        const fieldSet = new Field.Set( Identities.fieldsDef());
        assert( fieldSet && fieldSet instanceof Field.Set, 'expects an instance of Field.Set, got '+fieldSet );
        return fieldSet.byPrefix( 'oid' );
    },

    /**
     * @param use {string} - can either be "id_token" or "userinfo", depending on
     *   where the specific claims are intended to be put in
     * @param scope {string} - the intended scope, while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources or through db projection etc. based on this
     *   detail or not return them in ID Tokens but only UserInfo and so on
     * @param claims {object} - the part of the claims authorization parameter for either
     *   "id_token" or "userinfo" (depends on the "use" param)
     * @param rejected {Array[String]} - claim names that were rejected by the end-user, you might
     *   want to skip loading some claims from external resources or through db projection
     * @return {Object} the claims for this identity
     */
    async oidcRequest( organization, identity, subject, use, scope, claims, rejected ){
        // must return as least a sub (subject)
        let result = {
            sub: subject
        };
        switch( use ){
            case 'id_token':
                break;
            case 'userinfo':
                break;
        }
        Identities.claims.get( organization.entity._id ).forEach(( it ) => {
            const oid = it.def().oid;
            // the claim name, either specified, defaulting to the field name (if set)
            const itname = it.name();
            const name = this.claim_name( it );
            // the claim value, either computed, or from the identity
            //  note that array-ed fields value must be computed
            let value = undefined;
            if( oid.claim_fn ){
                if( typeof oid.claim_fn === 'function' ){
                    value = oid.claim_fn( identity );
                } else {
                    console.warn( 'expects claim_fn be a function', it );
                }
            } else {
                if( itname ){
                    value = identity[itname];
                }
            }
            // if the claim is reserved for some use ?
            if( oid.claim_use && !oid.claim_use.includes( use )){
                name = undefined;
                value = undefined;
            }
            // if the claim has been explicitely refused ?
            if( rejected && rejected.includes( name )){
                name = undefined;
                value = undefined;
            }
            if( name && value !== undefined ){
                result[name] = value;
            }
        });
        console.debug( 'oidcRequest result', result );
        return result;
    },

    /**
     * Handle the scope
     */
    scope( scope, context, args ){
        console.debug( 'Identities.claims.scope', scope, context, args );
    },

    /**
     * @return {Array<Scope>} the handled scopes
     *  i.e. the scopes which include a claim provided by Identities
     */
    scopes(){
        let scopes = {};
        const myClaims = Identities.claims._myClaims;
        Object.keys( myClaims ).forEach(( it ) => {
            myClaims[it].scopes().forEach(( s ) => {
                scopes[s.name] = s;
            });
        });
        return Object.values( scopes );
    }
};
