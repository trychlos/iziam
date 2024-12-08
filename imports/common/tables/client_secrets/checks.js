/*
 * /import/common/tables/client_secrets/checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

import { HmacEncoding } from '/imports/common/definitions/hmac-encoding.def.js';

import { ClientSecrets } from './index.js';

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

ClientSecrets.checks = {

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
        await _check( ClientSecrets.checks.crossCheckStartingEnding );
        return result.length ? result : null;
    },

    // compare starting vs ending secret dates
    async crossCheckStartingEnding( data, opts={} ){
        const item = data.item.get()
        if( item.startingAt && item.endingAt ){
            const cmp = DateJs.compare( item.startingAt, item.endingAt );
            return cmp <= 0 ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.starting_ending' )
            });
        }
        return null;
    },

    // secret encoding
    async secret_encoding( value, data, opts ){
        _assert_data_itemrv( 'ClientSecrets.checks.secret_encoding()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.encoding = value;
            data.item.set( item );
        }
        if( value ){
            const def = HmacEncoding.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.secret_encoding_invalid', value )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.secret_encoding_unset' )
            });
        }
    },

    // secret optional expiration date
    async secret_endingAt( value, data, opts ){
        _assert_data_itemrv( 'ClientSecrets.checks.secret_endingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.endingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.ending_invalid' )
            });
        }
        return null;
    },

    // clear secret as an hex value
    async secret_hex( value, data, opts ){
        _assert_data_itemrv( 'ClientSecrets.checks.secret_hex()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.hex = value;
            data.item.set( item );
        }
        return null;
    },

    // secret label
    async secret_label( value, data, opts ){
        _assert_data_itemrv( 'ClientSecrets.checks.secret_label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        return null;
    },

    // secret size
    async secret_size( value, data, opts ){
        _assert_data_itemrv( 'ClientSecrets.checks.secret_size()', data );
        let item = data.item.get();
        value = Number( value );
        if( opts.update !== false ){
            item.size = value;
            data.item.set( item );
        }
        if( value && Number.isInteger( value ) && value > 0 ){
            return value > Meteor.APP.C.secretMinSize ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.secret_size_mini', Meteor.APP.C.secretMinSize )
            });
        } else if( value ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.secret_size_invalid' )
            });
        }
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'clients.secrets.checks.secret_size_unset' )
        });
    },

    // secret optional starting date
    async secret_startingAt( value, data, opts ){
        _assert_data_itemrv( 'ClientSecrets.checks.secret_startingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.startingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.secrets.checks.starting_invalid' )
            });
        }
        return null;
    },
};
