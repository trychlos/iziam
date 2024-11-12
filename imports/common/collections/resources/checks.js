/*
 * /imports/common/collections/resources/checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { Resources } from './index.js';

// item is a ReactiveVar which contains the edited record
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be a ReactiveVar' );
};

Resources.checks = {

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
        await _check( Resources.checks.crossCheckStartingEnding );
        return result.length ? result : null;
    },

    // compare starting vs ending secret dates
    async crossCheckStartingEnding( data, opts={} ){
        const item = data.item.get()
        if( item.startingAt && item.endingAt ){
            const cmp = DateJs.compare( item.startingAt, item.endingAt );
            return cmp <= 0 ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'resources.checks.starting_ending' )
            });
        }
        return null;
    },

    // an optional label
    async label( value, data, opts={} ){
        _assert_data_itemrv( 'Resources.checks.label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        return null;
    },

    // the name is mandatory, unique
    //  should be considered immutable
    async name( value, data, opts={} ){
        _assert_data_itemrv( 'Resources.checks.name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.name = value;
            data.item.set( item );
        }
        if( value ){
            const res = await( Meteor.isClient ? Meteor.callAsync( 'resources.getBy', data.entity._id, { name: value }) : Resources.s.getBy( data.entity._id, { name: value }));
            let ok = true;
            if( res.length ){
                res.every(( it ) => {
                    if( it.name === value && it._id !== item._id ){
                        ok = false;
                    }
                    return ok;
                });
            }
            return ok ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'resources.checks.name_exists' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'resources.checks.name_unset' )
            });
        }
    },

    // ending date
    // if set, must be a valid date, after starting date
    async endingAt( value, data, opts={} ){
        _assert_data_itemrv( 'Resources.checks.endingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.endingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'resources.checks.ending_invalid' )
            });
        }
        return null;
    },

    // starting date
    // if set, must be a valid date, before ending date
    async startingAt( value, data, opts={} ){
        _assert_data_itemrv( 'Resources.checks.startingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.startingAt = value ? new Date( value ) : null;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'resources.checks.starting_invalid' )
            });
        }
        return null;
    }
};
