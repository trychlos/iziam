/*
 * /import/common/tables/jwks/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Jwks } from './index.js';

Jwks.fn = {
    /**
     * @summary extract the JSON Web Keys needed by the AuthServer
     * @param {Object} organization an { entity, record } organization object
     * @returns {Array<JWK>}
     */
    authKeys( organization ){
        const result = { keys: [] };
        ( organization.record.jwks || [] ).forEach(( jwk ) => {
            let it = { ...jwk };
            delete it.secret;
            delete it.pair;
            if( jwk.secret ){
                _.merge( it, jwk.secret );
            }
            if( jwk.pair ){
                _.merge( it, jwk.pair.private.jwk );
            }
            result.keys.push( it );
        });
        return result;
    },

    /**
     * @locus Anywhere
     * @summary Generate the symmetric secret / asymmetric keys pair when creating a new JWK
     * @param {Object<JWK>} item the just defined JWK item
     * @returns {Object<JWK>} this same item
     */
    async generateKeys( item ){
        return Meteor.isClient ? await Meteor.callAsync( 'jwks_generate_keys', item ) : await Jwks.s.generateKeys( item );
    },

    /**
     * @param {Array} array a JWKS (json web key set)
     * @returns {String} the concatenation of the labels of the existing jwks
     *  Each JWK is advertised as kid|label|id + use + kty
     */
    joinedLabels( array ){
        let res = [];
        ( array || [] ).forEach(( it ) => {
            res.push(( it.kid || it.label || it.id ) + '-' + it.use + '-' + it.kty );
        });
        return res.join( ', ' );
    },

    /**
     * @summary Returns the JWKS for the entity/record organization
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization
     * @returns {Object} the organization JWKS, at least an empty array
     *  A reactive data source
     */
    _list: {
        dep: new Tracker.Dependency()
    },
    get( o ){
        Jwks.fn._list.dep.depend();
        return o.caller.record.jwks || [];
    },
    add( o, jwk ){
        o.caller.record.jwks.push( jwk );
        Jwks.fn._list.dep.changed();
    },
    remove( o, jwkId ){
        o.caller.record.jwks = o.caller.record.jwks.filter( it => it.id !== jwkId );
        Jwks.fn._list.dep.changed();
    }
};
