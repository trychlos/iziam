/*
 * /import/common/tables/jwks/checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';
import { JwkKty } from '/imports/common/definitions/jwk-kty.def.js';
import { JwkUse } from '/imports/common/definitions/jwk-use.def.js';

import { Jwks } from './index.js';

// item is a ReactiveVar which contains the edited document object (inside of an array)
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.item && data.item instanceof ReactiveVar, caller+' data.item is expected to be set as a ReactiveVar, got '+data.item );
}

Jwks.checks = {

    // cross checks
    async crossCheckProperties( data, opts={} ){
        let result = [];
        const _check = async function( fn ){
            let res = await fn( data, opts );
            if( res ){
                res = _.isArray( res ) ? res : [ res ];
                result = result.concat( res );
            }
        };
        await _check( Jwks.checks.crossCheckStartingEnding );
        return result.length ? result : null;
    },

    // compare starting vs ending secret dates
    async crossCheckStartingEnding( data, opts={} ){
        const item = data.item.get()
        if( item.startingAt && item.endingAt ){
            const cmp = DateJs.compare( item.startingAt, item.endingAt );
            return cmp <= 0 ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.starting_ending' )
            });
        }
        return null;
    },

    // whether the userId is allowed to create a new JWK 
    // wether the current state of the existing JWKs permit another creation
    // @param {Object} container an { entity, record } organization/client
    // @param {String} the current user identifier
    // @param {Object} an optional options object with following keys:
    //  - isOrganization: whether the container is an organization, defaulting to true
    // @returns TM.TypedMessage or null
    async canCreate( container, userId, opts ){
        let res = null;
        // is the user allowed ?
        const isOrganization = opts.isOrganization !== false;
        const permission = isOrganization ? 'feat.organizations.edit' : 'feat.clients.edit';
        const permitted = await Permissions.isAllowed( permission, userId, container.entity._id );
        if( !permitted ){
            res = res || [];
            res.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_not_permitted' )
            }));
        }
        // what is the current jwks state ?
        //  remind that a kid is mandatory as soon as we have more than only one JWK
        let found = false;
        ( container.record.jwks || [] ).every(( it ) => {
            if( !it.kid ){
                found = true;
            }
            return !found;
        });
        if( found ){
            res = res || [];
            res.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_kid_empty' )
            }));
        }
        return res;
    },

    // JWK algorithm
    // NB: this is an item edited inside of an array - so the data is different
    async jwk_alg( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_alg()', data );
        let item = data.item.get();
        //console.debug( 'jwk_alg value', value, 'item', item );
        if( opts.update !== false ){
            item.alg = value;
            data.item.set( item );
        }
        if( value ){
            const def = JwaAlg.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_alg_invalid', value )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_alg_unset' )
            });
        }
    },

    // JWK optional expiration date
    //  must be equal or after the starting date
    async jwk_endingAt( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_endingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.endingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.ending_invalid' )
            });
        }
        return null;
    },

    // JWK Key ID
    // kid is mandatory on every JWK as soon as there are more than one
    // and must be unique
    async jwk_kid( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_kid()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.kid = value;
            data.item.set( item );
        }
        // container is the current jwks (as displayed in the edit dialog of the organization/client)
        //  which means that it may have not been saved yet
        const jwks = data.container.record.jwks || [];
        if( value ){
            let found = false;
            jwks.every(( it ) => {
                if( it.kid === value && it._id !== item._id ){
                    found = true;
                }
                return !found;
            });
            return found ? new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_kid_exists' )
            }) : null;
        } else {
            const level = jwks.length <= 1 ? TM.MessageLevel.C.WARNING : TM.MessageLevel.C.ERROR;
            return new TM.TypedMessage({
                level: level,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_kid_unset' )
            });
        }
        return null;
    },

    // JWK key type (crypto alg family)
    async jwk_kty( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_kty()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.kty = value;
            data.item.set( item );
        }
        if( value ){
            const def = JwkKty.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_kty_invalid', value )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_kty_unset' )
            });
        }
    },

    // JWK label
    async jwk_label( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        return null;
    },

    // JWK optional starting date
    //  must be equal or before the ending date
    async jwk_startingAt( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_startingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.startingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.starting_invalid' )
            });
        }
        return null;
    },

    // JWK usage
    async jwk_use( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_use()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.use = value;
            data.item.set( item );
        }
        if( value ){
            const def = JwkUse.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_use_invalid', value )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'jwks.checks.jwk_use_unset' )
            });
        }
    }
};
