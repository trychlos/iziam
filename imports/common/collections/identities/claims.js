/*
 * /imports/common/collections/identities/claims.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Field } from 'meteor/pwix:field';

import { Claim } from '/imports/common/classes/claim.class.js';
import { Scope } from '/imports/common/classes/scope.class.js';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';
import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';

import { Identities } from './index.js';

Identities.claims = {

    _myClaims: {},

    _defineClaim( name, opts ){
        const claim = new Claim( name, opts );
        Identities.claims._myClaims[name] = claim;
        return claim;
    },

    // returns the name of the claim
    claim_name( def ){
        return def.def().oid.name || def.name();
    },

    // called once at IdentityScopesProvider instanciation
    //  register all the provided claims now
    defineClaims(){
        // claims directly derived from fieldset
        this.get().forEach(( it ) => {
            const oid = it.def().oid;
            const name = this.claim_name( it );
            let opts = {};
            if( oid.fn ){
                opts.fn = oid.fn;
            }
            if( oid.args ){
                opts.args = oid.args;
            }
            if( oid.scopes ){
                opts.scopes = oid.scopes;
            }
            if( oid.use ){
                opts.use = oid.use;
            }
            opts.def = it;
            Identities.claims._defineClaim( name, opts );
        });
        // other claims
        // all (identities) groups the identity is member of
        Identities.claims._defineClaim( Meteor.APP.C.oidcUrn+'identity:claim:groups/all', {
            async fn( identity, client ){
                let groups = [];
                for await( const it of identity.DYN.memberOf.all ){
                    const group = await IdentitiesGroups.s.getBy( identity.organization, { _id: it }, null, { from: identity.organization });
                    if( group && group.length ){
                        groups.push( group[0].label );
                    }
                }
                return groups;
            },
            scopes: [
                Meteor.APP.C.oidcUrn+'identity:scope:profile',
                Meteor.APP.C.oidcUrn+'identity:scope:groups',
            ],
            use: [
                'userinfo'
            ]
        });
        // the (identities) groups the identity is directly member of
        Identities.claims._defineClaim( Meteor.APP.C.oidcUrn+'identity:claim:groups/direct', {
            async fn( identity, client ){
                let groups = [];
                for await( const it of identity.DYN.memberOf.direct ){
                    const group = await IdentitiesGroups.s.getBy( identity.organization, { _id: it }, null, { from: identity.organization });
                    if( group && group.length ){
                        groups.push( group[0].label );
                    }
                }
                return groups;
            },
            scopes: [
                Meteor.APP.C.oidcUrn+'identity:scope:profile',
                Meteor.APP.C.oidcUrn+'identity:scope:groups',
            ],
            use: [
                'userinfo'
            ]
        });
        // the authorizations (and the permissions) the identity is provided for the client
        Identities.claims._defineClaim( Meteor.APP.C.oidcUrn+'identity:claim:authorizations', {
            async fn( identity, client ){
                //console.debug( 'identity:claim:authorizations: identity', identity, 'client', client );
                let authorizations = [];
                if( client ){
                    const query = {
                        subject_type: 'I',
                        subject_id: { $in: identity.DYN.memberOf.all || [] },
                        object_type: 'C',
                        object_id: client.entity._id
                    };
                    const fetched = await Authorizations.s.transformedGetBy( identity.organization, query, null, { from: identity.organization });
                    for await( const it of fetched ){
                        let perm = {
                            label: it.label || it.DYN.computed_label,
                        };
                        if( it.DYN.permissions && it.DYN.permissions.length ){
                            perm.permissions = it.DYN.permissions;
                        }
                        authorizations.push( perm );
                    }
                }
                //console.debug( 'authorizations', authorizations );
                return authorizations;
            },
            scopes: [
                Meteor.APP.C.oidcUrn+'identity:scope:authorizations'
            ],
            use: [
                'userinfo'
            ]
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
     *   e.g. 'openid email profile'
     * @param claims {object} - the part of the claims authorization parameter for either
     *   "id_token" or "userinfo" (depends on the "use" param)
     * @param rejected {Array[String]} - claim names that were rejected by the end-user, you might
     *   want to skip loading some claims from external resources or through db projection
     * @param client {Object} an { entity, record } object
     *  Note that client may be null when findAccount() is first triggered from GET /auth route
     * @return {Object} the claims for this identity
     */
    async oidcRequest( organization, identity, subject, use, scope, claims, rejected, client ){
        //console.debug( 'oidcRequest', arguments );
        // must return as least a sub (subject)
        let result = {
            sub: subject
        };
        switch( use ){
            case 'id_token':
            case 'userinfo':
                for ( const claim of Object.values( Identities.claims._myClaims )){
                    if( claim.isForUse( use ) && claim.isForScopes( scope )){
                        const name = claim.name();
                        const opts = claim.opts();
                        //console.debug( 'name', name );
                        // the claim value, either computed, or from the identity
                        //  note that array-ed fields value must be computed
                        let value = undefined;
                        if( opts.fn ){
                            if( typeof opts.fn === 'function' ){
                                value = await opts.fn( identity, client );
                            } else {
                                console.warn( 'expects fn be a function', opts );
                            }
                        } else {
                            const def = opts.def;
                            const fieldName = def.name();
                            if( fieldName ){
                                value = identity[fieldName];
                            }
                        }
                        //console.debug( 'value', value );
                        // if the claim has been explicitely refused ?
                        if( rejected && rejected.includes( name )){
                            name = undefined;
                            value = undefined;
                        }
                        if( name && value !== undefined ){
                            result[name] = value;
                        }
                    }
                }
            break;
        }
        //console.debug( 'oidcRequest result', use, result );
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
