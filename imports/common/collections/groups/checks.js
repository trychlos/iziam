/*
 * /imports/common/collections/groups/checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { Groups } from './index.js';

// item is a ReactiveVar which contains the edited record
const _assert_data_content = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be a ReactiveVar' );
}

Groups.checks = {
    // label - must be unique
    //  not only in the database, but also in the passed-in groups being edited
    async label( value, data, opts={} ){
        _assert_data_content( 'Groups.checks.label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        if( value ){
            const fn = function( result ){
                let ok = false;
                if( result.length ){
                    // we have found an existing group label
                    //  this is normal if the found group is the same than ours
                    const found_id = result[0]._id;
                    const me = item._id;
                    if( me === found_id ){
                        ok = true;
                    }
                } else {
                    ok = true;
                }
                return ok ? null : new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'groups.checks.label_exists' )
                });
            };
            let res = await ( Meteor.isClient ? Meteor.callAsync( 'groups.getBy', { label: value }) : Groups.s.getBy({ label: value }));
            res = fn( res );
            if( res ){
                return res;
            }
            if( data.targetDatabase === false ){
                let found = false;
                data.groupsRv.get().every(( it ) => {
                    if( it.label === value ){
                        found = true;
                    }
                    return !found;
                });
                return found ? new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'groups.checks.label_exists' )
                }) : null;
            }
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'groups.checks.label_mandatory' )
            });
        }
        /*
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.name = value;
                    data.item.set( item );
                }
                if( value ){
                    const fn = function( result ){
                        let ok = false;
                        if( result.length ){
                            // we have found an existing email address
                            //  this is normal if the found group is the same than ours
                            const found_id = result[0]._id;
                            const me = item._id;
                            if( me === found_id ){
                                ok = true;
                            }
                        } else {
                            ok = true;
                        }
                        return ok ? null : new CoreApp.TypedMessage({
                            type: CoreApp.MessageType.C.ERROR,
                            message: pwixI18n.label( I18N, 'groups.check.name_exists' )
                        });
                    };
                    return Meteor.isClient ?
                        Meteor.callPromise( 'group.getBy', { name: value }).then(( result ) => { return fn( result ); }) :
                        fn( Groups.s.getBy({ name: value }));
                } else {
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.ERROR,
                        message: pwixI18n.label( I18N, 'groups.check.name_empty' )
                    });
                }
            });
            */
        }
};
