/*
 * /imports/common/collections/authorizations/checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { TM } from 'meteor/pwix:typed-message';

import { AuthTarget } from '/imports/common/definitions/auth-target.def.js';

import { Authorizations } from './index.js';

// item is a ReactiveVar which contains the edited record
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be a ReactiveVar' );
};

Authorizations.checks = {

    // the group which holds the authorization
    // must exists
    async group( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.group()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.group = value;
            data.item.set( item );
        }
        if( value ){
            const organization = TenantsManager.list.byEntity( data.entity._id );
            const group = organization ? organization.DYN.groups.byId( value ) : null;
            return group ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.group_unknown' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.group_unset' )
            });
        }
    },

    // an optional label
    async label( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.label = value;
            data.item.set( item );
        }
        return null;
    },

    async endingAt(){
        _assert_data_itemrv( 'Authorizations.checks.endingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.endingAt = new Date( value );
            data.item.set( item );
        }
        return null;
    },

    async startingAt(){
        _assert_data_itemrv( 'Authorizations.checks.startingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.startingAt = new Date( value );
            data.item.set( item );
        }
        return null;
    },

    // the target, either a client or a resource
    async target( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.target()', data );
        /*
        let item = data.item.get();
        if( opts.update !== false ){
            item.type = value;
            data.item.set( item );
        }
            */
        return null;
    },

    // the auth target type
    async type( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.type()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.type = value;
            data.item.set( item );
        }
        if( value ){
            const def = AuthTarget.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.type_unknown' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.type_unset' )
            });
        }
    }
}