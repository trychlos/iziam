/*
 * /imports/common/collections/clients_groups/checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { ClientsGroups } from './index.js';

// item is a ReactiveVar which contains the edited record
// organization is the entity with its DYN sub-object
const _assert_data_content = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be an instance of ReactiveVar, got '+data.item );
    assert.ok( data.organization, caller+' data.organization expected to be set' );
    assert.ok( data.organization._id && data.organization.DYN, caller+' data.organization expected to be an organization with its DYN sub-object, got '+data.organization );
}

ClientsGroups.checks = {
    // label - must be unique
    //  not only in the database, but also in the passed-in groups being edited (if any)
    async label( value, data, opts={} ){
        _assert_data_content( 'ClientsGroups.checks.label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        if( value ){
            let res = null;
            let array = [];
            if( data.targetDatabase === false ){
                array = data.groupsRv.get();
            } else {
                array = await ( Meteor.isClient ? 
                    Meteor.callAsync( 'groups.getBy', data.organization._id, { organization: data.organization._id, label: value }) :
                    ClientsGroups.s.getBy( data.organization._id, { organization: data.organization._id, label: value }, null, { from: data.organization._id }));
            }
            let found = false;
            array.every(( it ) => {
                if( it._id !== item._id && it.label === value ){
                    found = true;
                }
                return !found;
            });
            return found ? new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'groups.checks.label_exists' )
            }) : null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'groups.checks.label_mandatory' )
            });
        }
    }
};
