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
// organization is the entity with its DYN sub-object
const _assert_data_content = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be an instance of ReactiveVar, got '+data.item );
    assert.ok( data.organization, caller+' data.organization expected to be set' );
    assert.ok( data.organization._id && data.organization.DYN, caller+' data.organization expected to be an organization with its DYN sub-object, got '+data.organization );
}

Groups.checks = {
    // label - must be unique
    //  not only in the database, but also in the passed-in groups being edited (if any)
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
            let res = await ( Meteor.isClient ? 
                    Meteor.callAsync( 'groups.getBy', data.organization._id, { organization: data.organization._id, label: value }) :
                    Groups.s.getBy( data.organization._id, { organization: data.organization._id, label: value }));
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
            return res;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'groups.checks.label_mandatory' )
            });
        }
    }
};
