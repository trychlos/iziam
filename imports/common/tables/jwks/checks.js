/*
 * /import/common/tables/jwks/checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

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
    async jwk_expireAt( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_expireAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.expireAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        return null;
    },

    // JWK Key ID
    async jwk_kid( value, data, opts ){
        _assert_data_itemrv( 'Jwks.checks.jwk_kid()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.kid = value;
            data.item.set( item );
        }
        return null;
    },

    // JWK key type (crypto alg family)
    async jwk_kty( value, data, opts ){
        console.debug( 'jwk_kty', arguments );
        _assert_data_itemrv( 'Jwks.checks.jwk_kty()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.kty = value;
            data.item.set( item );
            console.debug( 'set item', data.item.get());
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

    // JWK usage
    async jwk_use( value, data, opts ){
        console.debug( 'jwk_use', arguments );
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
