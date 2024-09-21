/*
 * /import/common/tables/jwks/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { DateJs } from 'meteor/pwix:date';

import { Jwks } from './index.js';

Jwks.fn = {
    /**
     * @summary extract the active JSON Web Keys
     * @param {Object} container an { entity, record } organization/client object
     * @returns {Array<JWK>}
     */
    activeKeys( container ){
        let result = [];
        ( container.record.jwks || [] ).forEach(( jwk ) => {
            let active = true;
            if( active && jwk.startingAt ){
                active = Boolean( DateJs.compare( jwk.startingAt, Date.now()) <= 0 );
            }
            if( active && jwk.endingAt ){
                active = Boolean( DateJs.compare( jwk.endingAt, Date.now()) >= 0 );
            }
            if( active ){
                result.keys.push( it );
            }
        });
        return result;
    },

    /**
     * @summary extract the JSON Web Keys needed by the AuthServer to sign/encrypt the emitted JWT
     * @param {Object} container an { entity, record } organization/client object
     * @returns {Object} with a 'keys' array of JWK's containing only private parts
     */
    authKeys( container ){
        let result = { keys: [] };
        Jwks.fn.activeKeys().forEach(( jwk ) => {
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
     * @summary Returns the JWKS for the entity/record organization/client
     *  This is needed for a reactive tabular display management
     * @param {Object} o an argument object with following keys:
     * - caller: an { entity, record } organization/client
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
