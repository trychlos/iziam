/*
 * /import/common/tables/keygripschecks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { HmacAlg } from '/imports/common/definitions/hmac-alg.def.js';
import { HmacEncoding } from '/imports/common/definitions/hmac-encoding.def.js';

import { Keygrips } from './index.js';

// fields check
//  - value: mandatory, the value to be tested
//  - data: optional, the data passed to Checker instanciation
//    if set the target item as a ReactiveVar, i.e. the item to be updated with this value
//  - opts: an optional behaviour options, with following keys:
//    > update: whether the item be updated with the value, defaults to true
//    > id: the identifier of the edited row when editing an array
// returns a TypedMessage, or an array of TypedMessage, or null

// item is a ReactiveVar which contains the edited document object (inside of an array)
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.item && data.item instanceof ReactiveVar, caller+' data.item is expected to be set as a ReactiveVar, got '+data.item );
}

Keygrips.checks = {

    // cross checks
    async crossCheckSecretProperties( data, opts={} ){
        let result = [];
        const _check = async function( fn ){
            let res = await fn( data, opts );
            if( res ){
                res = _.isArray( res ) ? res : [ res ];
                result = result.concat( res );
            }
        };
        await _check( Keygrips.checks.crossCheckSecretStartingEnding );
        return result.length ? result : null;
    },

    // compare starting vs ending secret dates
    async crossCheckSecretStartingEnding( data, opts={} ){
        const item = data.item.get()
        if( item.startingAt && item.endingAt ){
            const cmp = DateJs.compare( item.startingAt, item.endingAt );
            return cmp <= 0 ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_starting_ending' )
            });
        }
        return null;
    },

    // keygrip algorithm
    async keygrip_alg( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_alg()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.alg = value;
            data.item.set( item );
        }
        if( value ){
            const def = HmacAlg.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_alg_invalid', value )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_alg_unset' )
            });
        }
    },

    // keygrip encoding
    async keygrip_encoding( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_encoding()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.encoding = value;
            data.item.set( item );
        }
        if( value ){
            const def = HmacEncoding.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_encoding_invalid', value )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_encoding_unset' )
            });
        }
    },

    // keygrip label
    async keygrip_label( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        return null;
    },

    // keygrip secret optional ending date
    async keygrip_secret_endingAt( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_secret_endingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.endingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_ending_invalid' )
            });
        }
        return null;
    },

    // keygrip secret optional starting date
    async keygrip_secret_startingAt( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_secret_startingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.startingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_starting_invalid' )
            });
        }
        return null;
    },

    // keygrip secret hash
    async keygrip_secret_hash( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_secret_hash()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.hash = value;
            data.item.set( item );
        }
        return null;
    },

    // keygrip secret label
    async keygrip_secret_label( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_secret_label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        return null;
    },

    // keygrip secret
    async keygrip_secret_secret( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_secret_secret()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.secret = value;
            data.item.set( item );
        }
        return null;
    },

    // keygrip secret size
    async keygrip_size( value, data, opts ){
        _assert_data_itemrv( 'Keygrips.checks.keygrip_size()', data );
        let item = data.item.get();
        value = Number( value );
        if( opts.update !== false ){
            item.size = value;
            data.item.set( item );
        }
        if( value && Number.isInteger( value ) && value > 0 ){
            return value > Meteor.APP.C.keygripMinSize ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_size_mini', Meteor.APP.C.keygripMinSize )
            });
        } else if( value ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_size_invalid' )
            });
        }
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'keygrips.checks.keygrip_size_unset' )
        });
    }
};
