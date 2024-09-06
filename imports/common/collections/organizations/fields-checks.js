/*
 * /import/common/collections/organizations/fields-checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

import { Organizations } from './index.js';

// fields check
//  - value: mandatory, the value to be tested
//  - data: optional, the data passed to Checker instanciation
//    if set the target item as a ReactiveVar, i.e. the item to be updated with this value
//  - opts: an optional behaviour options, with following keys:
//    > update: whether the item be updated with the value, defaults to true
//    > id: the identifier of the edited row when editing an array
// returns a TypedMessage, or an array of TypedMessage, or null

// entity is a ReactiveVar which contains the edited entity document and its validity records
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.entity && data.entity instanceof ReactiveVar, caller+' data.entity is expected to be set as a ReactiveVar, got '+data.entity );
    const entity = data.entity.get();
    assert.ok( entity.DYN && _.isObject( entity.DYN ), caller+' data.entity.DYN is expected to be set as a Object, got '+entity.DYN );
    assert.ok( entity.DYN.records && _.isArray( entity.DYN.records ), caller+' data.entity.DYN.records is expected to be set as an Array, got '+entity.DYN.records );
    entity.DYN.records.forEach(( it ) => {
        assert.ok( it && it instanceof ReactiveVar, caller+' each record is expected to be a ReactiveVar, got '+it );
    });
    // this index because we are managing valdiity periods here
    assert.ok( _.isNumber( data.index ) && data.index >= 0, caller+' data.index is expected to be a positive or zero integer, got '+data.index );
}

// check a server url
//  opts:
//  - mandatory, defaulting to true
//  - prefix, the prefix of the i18n label, defaulting to 'url'
//  - field: the name of the field
// returns a Promise or null
const _check_url = function( value, opts={} ){
    const mandatory = _.isBoolean( opts.mandatory ) ? opts.mandatory : true;
    const prefix = opts.prefix || 'url';
    const field = opts.field || '';
    if( value ){
        if( !value.startsWith( '/' )){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_starts', field )
            });
        } else if( value.length < 2 ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_short', field )
            });
        } else {
            return null;
        }
    } else if( mandatory ){
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_mandatory', field )
        });
    } else {
        return null;
    }
}

// returns the index of the identified row in the array
const _id2index = function( array, id ){
    for( let i=0 ; i<array.length ; ++i ){
        if( array[i].id === id ){
            return i;
        }
    }
    console.warn( 'id='+id+' not found' );
    return -1;
}

Organizations.checks = {
    // the REST Base URL
    async baseUrl( value, data, opts ){
        _assert_data_itemrv( 'Organizations.checks.baseUrl()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.baseUrl = value;
        }
        return Promise.resolve( null )
            .then(() => {
                return _check_url( value, { mandatory: false, prefix: 'baseurl' });
            })
            .then(( err ) => {
                if( err ){
                    return err;
                } else {
                    // must have only one level
                    const idx = value.indexOf( '/', 1 );
                    if( idx !== -1 ){
                        return new TM.TypedMessage({
                            level: TM.MessageLevel.C.ERROR,
                            message: pwixI18n.label( I18N, 'organizations.checks.baseurl_onelevel' )
                        });
                    } else if( Meteor.APP.isReservedWord( value )){
                        return new TM.TypedMessage({
                            level: TM.MessageLevel.C.ERROR,
                            message: pwixI18n.label( I18N, 'organizations.checks.baseurl_reserved' )
                        });
                    } else {
                        const fn = function( result ){
                            let ok = false;
                            if( result.length ){
                                // we have found an existing base url
                                //  this is normal if the found entity is the same than ours
                                const found_entity = result[0].entity;
                                if( item.entity === found_entity ){
                                    ok = true;
                                }
                            } else {
                                ok = true;
                            }
                            return ok ? null : new TM.TypedMessage({
                                level: TM.MessageLevel.C.ERROR,
                                message: pwixI18n.label( I18N, 'organizations.checks.baseurl_exists' )
                            });
                        };
                        return Meteor.isClient ?
                            Meteor.callAsync( 'pwix_tenants_manager_records_getBy', { baseUrl: value }).then(( result ) => { return fn( result ); }) :
                            fn( TenantsManager.Records.server.getBy({ baseUrl: value }));
                    }
                }
            });
    },

    // whether the organization allow dynamic registration by confidential clients
    async dynamicRegistrationByConfidential( value, data, opts ){
        _assert_data_itemrv( 'Organizations.checks.dynamicRegistrationByConfidential()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.dynamicRegistrationByConfidential = Boolean( value );
        }
        return null;
    },

    // whether the organization allow dynamic registration by public clients
    async dynamicRegistrationByPublic( value, data, opts ){
        _assert_data_itemrv( 'Organizations.checks.dynamicRegistrationByPublic()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.dynamicRegistrationByPublic = Boolean( value );
        }
        return null;
    },

    // whether the organization allow dynamic registration by identified allowed users
    async dynamicRegistrationByUser( value, data, opts ){
        _assert_data_itemrv( 'Organizations.checks.dynamicRegistrationByUser()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.dynamicRegistrationByUser = Boolean( value );
        }
        return null;
    },

    // whether the organization forces the usage of OAth 2.1
    async wantsOAuth21( value, data, opts ){
        _assert_data_itemrv( 'Organizations.checks.wantsOAuth21()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.wantsOAuth21 = Boolean( value );
        }
        return null;
    },

    // whether the organization wants all clients use PKCE (rfc7636)
    async wantsPkce( value, data, opts ){
        _assert_data_itemrv( 'Organizations.checks.wantsPkce()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.wantsPkce = Boolean( value );
        }
        return null;
    }
};
