/*
 * /import/common/collections/organizations/fields-checks.js
 *
 * UI: the optional fields are first seen empty, only checked when there is something
 *  this way, Forms doesn't put any field status
 * 
 * Operational check: emit a notice in this case
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { OpenID } from '/imports/common/classes/openid.class.js';

import { HowCount } from '/imports/common/definitions/how-count.def.js';

import { Providers } from '/imports/common/tables/providers/index.js';

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
const _assert_data_entityrv = function( caller, data ){
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

// item is a ReactiveVar which contains the edited document object (inside of an array)
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.item && data.item instanceof ReactiveVar, caller+' data.item is expected to be set as a ReactiveVar, got '+data.item );
}

// check that the provided endpoint is unique
//  opts:
//  - prefix, the prefix of the i18n label, defaulting to 'endpoint'
//  - field: the name of the field
//  - record: the organization record to be checked in
// returns a Promise or null
const _check_endpoint = function( value, opts={} ){
    const prefix = opts.prefix || 'endpoint';
    const field = opts.field || '';
    let res = null;
    if( value.substr( 0, 1 ) !== '/' ){ 
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_absolute' )
        });
    } else if( value.length < 2 ){
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_short' )
        });
    } else {
        // first level mus tbe empty (and this has already been checked above)
        // other levels must be set (no empty other level)
        const w = value.split( '/' );
        let levelsSet = true;
        for( let i=1 ; i<w.length ; ++i ){
            if( !w[i] ){
                levelsSet = false;
                break;
            }
        }
        if( !levelsSet ){
            new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_level', it )
            });
        }
        // check that the endpoint is unique inside of the tenant
        OpenID.fn.endpointAllNames().every(( it ) => {
            if( it !== field ){
                if( opts.record[it] === value ){
                    res = new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'organizations.checks.'+prefix+'_exists', it )
                    });
                }
            }
            return !res;
        });
    }
    return res;
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
        if( array[i]._id === id ){
            return i;
        }
    }
    console.warn( 'id='+id+' not found' );
    return -1;
}

Organizations.checks = {

    // check the jwks_uri vs the jwks array
    // data expects:
    //  - entity: an { entity, record } organization
    async crossCheckJwks( data, opts={} ){
        const item = data.entity.get().DYN.records[data.index].get();
        if( item.jwks_uri && ( !item.jwks || !item.jwks.length )){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'organizations.checks.jwks_uri_wo_jwk' )
            });
        }
        if( !item.jwks_uri && item.jwks && item.jwks.length ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'organizations.checks.jwks_no_but_jwk' )
            });
        }
        return null;
    },

    // authorization endpoint
    // must be provided as an absolute path
    async authorization_endpoint( value, data, opts ){
        //console.debug( 'checks.authorization_endpoint' );
        _assert_data_entityrv( 'Organizations.checks.authorization_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.authorization_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'authorization', field: 'authorization_endpoint', record: item });
        // value is optional in the UI, but must be set for the organization be operational
        } else {
            return new TM.TypedMessage({
                level: opts.opCheck ? TM.MessageLevel.C.ERROR : TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'organizations.checks.authorization_unset' )
            });
        }
    },

    // the REST Base URL
    // must be provided as an absolute path
    async baseUrl( value, data, opts ){
        //console.debug( 'checks.baseUrl' );
        _assert_data_entityrv( 'Organizations.checks.baseUrl()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.baseUrl = value;
            data.entity.set( entity );
        }
        let res = await _check_url( value, { mandatory: true, prefix: 'baseurl' });
        if( res ){
            return res;
        }
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
                fn( TenantsManager.Records.s.getBy({ baseUrl: value }));
        }
    },

    // whether the organization allow dynamic registration by confidential clients
    async dynamicRegistrationByConfidential( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.dynamicRegistrationByConfidential()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.dynamicRegistrationByConfidential = Boolean( value );
            data.entity.set( entity );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.dynamic_confidential_invalid' )
            });
        }
        return null;
    },

    // whether the organization allow dynamic registration by public clients
    async dynamicRegistrationByPublic( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.dynamicRegistrationByPublic()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.dynamicRegistrationByPublic = Boolean( value );
            data.entity.set( entity );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.dynamic_public_invalid' )
            });
        }
        return null;
    },

    // whether the organization allow dynamic registration by identified allowed users
    async dynamicRegistrationByUser( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.dynamicRegistrationByUser()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.dynamicRegistrationByUser = Boolean( value );
            data.entity.set( entity );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.dynamic_user_invalid' )
            });
        }
        return null;
    },

    // end session endpoint
    // must be provided as an absolute path
    async end_session_endpoint( value, data, opts ){
        //console.debug( 'checks.token_endpoint' );
        _assert_data_entityrv( 'Organizations.checks.end_session_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.end_session_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'end_session', field: 'end_session_endpoint', record: item });
        }
        // should be set
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.end_session_unset' )
        });
    },

    // are email addresses an identifier ?
    async identitiesEmailAddressesIdentifier( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesEmailAddressesIdentifier()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesEmailAddressesIdentifier = Boolean( value );
            data.entity.set( entity );
        }
        if( value === true || value === false ){
            return await Organizations.checks.identitiesIdentifier( null, data, opts );
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.email_identifier_invalid' )
            });
        }
    },

    // how do we want manage email addresses ?
    async identitiesEmailAddressesMaxCount( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesEmailAddressesMaxCount()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesEmailAddressesMaxCount = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else if( item.identitiesEmailAddressesMaxHow && item.identitiesEmailAddressesMaxHow !== 'nospec' ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.email_max_count_invalid' )
            });
        } else {
            return null;
        }
    },

    async identitiesEmailAddressesMaxHow( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesEmailAddressesMaxHow()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesEmailAddressesMaxHow = value;
            data.entity.set( entity );
        }
        if( value ){
            const def = HowCount.byId( value );
            if( def ){
                return HowCount.isForMax( def ) ? null : new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'organizations.checks.email_max_how_notfor' )
                    });
            } else {
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'organizations.checks.email_max_how_invalid' )
                });
            }
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.email_max_how_unset' )
            });
        }
    },

    async identitiesEmailAddressesMinCount( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesEmailAddressesMinCount()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesEmailAddressesMinCount = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else if( item.identitiesEmailAddressesMinHow && item.identitiesEmailAddressesMinHow !== 'nospec' ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.email_min_count_invalid' )
            });
        } else {
            return null;
        }
    },

    async identitiesEmailAddressesMinHow( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesEmailAddressesMinHow()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesEmailAddressesMinHow = value;
            data.entity.set( entity );
        }
        if( value ){
            const def = HowCount.byId( value );
            if( def ){
                if( HowCount.isForMin( def )){
                    return null;
                } else {
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'organizations.checks.email_min_how_notfor' )
                    });
                }
            }
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.email_min_how_invalid' )
            });
        } else {
            new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.email_min_how_unset' )
            });
        }
    },

    // cross-check
    // check that the identities have an identifier, either a well-defined email address or a well-defined username
    async identitiesIdentifier( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesIdentifier()', data );
        const organization = {
            entity: data.entity.get(),
            record: data.entity.get().DYN.records[data.index].get()
        };
        const have = Organizations.fn.haveIdentityIdentifier( organization );
        const res = have ? null : new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.identities_noid' )
        });
        //console.debug( res );
        return res;
    },

    // are usernames an identifier ?
    async identitiesUsernamesIdentifier( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesUsernamesIdentifier()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesUsernamesIdentifier = Boolean( value );
            data.entity.set( entity );
        }
        if( value === true || value === false ){
            return await Organizations.checks.identitiesIdentifier( null, data, opts );
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.username_identifier_invalid' )
            });
        }
    },

    // how to we want manage usernames ?
    async identitiesUsernamesMaxCount( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesUsernamesMaxCount()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesUsernamesMaxCount = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else if( item.identitiesUsernamesMaxHow && item.identitiesUsernamesMaxHow !== 'nospec' ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.username_max_count_invalid' )
            });
        } else {
            return null;
        }
    },

    async identitiesUsernamesMaxHow( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesUsernamesMaxHow()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesUsernamesMaxHow = value;
            data.entity.set( entity );
        }
        if( value ){
            const def = HowCount.byId( value );
            if( def ){
                return HowCount.isForMax( def ) ? null : new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'organizations.checks.username_max_how_notfor' )
                });
            } else {
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'organizations.checks.username_max_how_invalid' )
                });
            }
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.username_max_how_unset' )
            });
        }
    },

    async identitiesUsernamesMinCount( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesUsernamesMinCount()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesUsernamesMinCount = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else if( item.identitiesUsernamesMinHow && item.identitiesUsernamesMinHow !== 'nospec' ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.username_min_count_invalid' )
            });
        } else {
            return null;
        }
    },

    async identitiesUsernamesMinHow( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.identitiesUsernamesMinHow()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.identitiesUsernamesMinHow = value;
            data.entity.set( entity );
        }
        if( value ){
            const def = HowCount.byId( value );
            if( def ){
                if( HowCount.isForMin( def )){
                    return null;
                } else {
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'organizations.checks.username_min_how_notfor' )
                    });
                } 
            } else {
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'organizations.checks.username_min_how_invalid' )
                });
            }
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.username_min_how_unset' )
            });
        }
    },

    // introspection endpoint
    // must be provided as an absolute path
    async introspection_endpoint( value, data, opts ){
        //console.debug( 'checks.token_endpoint' );
        _assert_data_entityrv( 'Organizations.checks.introspection_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.introspection_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'introspection', field: 'introspection_endpoint', record: item });
        }
        // this is optional
        return opts.opCheck ? new TM.TypedMessage({
            level: TM.MessageLevel.C.NOTICE,
            message: pwixI18n.label( I18N, 'organizations.checks.introspection_unset' )
        }) : null;
    },

    // the issuer this organization may wants identify itself
    async issuer( value, data, opts ){
        //console.debug( 'checks.issuer' );
        _assert_data_entityrv( 'Organizations.checks.issuer()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.issuer = value;
            data.entity.set( entity );
        }
        if( value ){
            let url = null;
            try {
                url = new URL( value );
            } catch( e ){
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'organizations.checks.issuer_invalid' )
                });
            }
            // requires https protocol unless host is localhost and environment is development
            if( url.protocol !== 'https:' ){
                const allowed = [ 'localhost', '127.0.0.1', '::1' ];
                //console.debug( 'url', url );
                if( url.protocol === 'http:' && allowed.includes( url.hostname ) && Meteor.settings.public[Meteor.APP.name].environment.type === 'development' ){
                    // fine
                } else {
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'organizations.checks.issuer_https' )
                    });
                }
            // check for a valid hostname
            } else {
                const words = url.hostname.split( '.' );
                if( words.length < 2){
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'organizations.checks.issuer_hostname' )
                    });
                }
            }
        // value is optional in the UI, but must be set for the organization be operational
        } else if( opts.opCheck ){
            const issuer = Organizations.fn.issuer({ entity: entity, record: item });
            if( !issuer ){
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'organizations.checks.issuer_unset' )
                });
            }
        }
        return null;
    },

    // JWKS document
    // must be provided as an absolute pathn, should be set
    async jwks_uri( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.jwks_uri()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.jwks_uri = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'jwks_uri', field: 'jwks_uri', record: item });
        }
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.jwks_uri_unset' )
        });
    },

    // dynamic registration endpoint
    // must be provided as an absolute path
    async registration_endpoint( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.registration_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.registration_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'registration', field: 'registration_endpoint', record: item });
        }
        // this is optional
        return opts.opCheck ? new TM.TypedMessage({
            level: TM.MessageLevel.C.NOTICE,
            message: pwixI18n.label( I18N, 'organizations.checks.registration_unset' )
        }) : null;
    },

    // revocation endpoint
    // must be provided as an absolute path
    async revocation_endpoint( value, data, opts ){
        //console.debug( 'checks.token_endpoint' );
        _assert_data_entityrv( 'Organizations.checks.revocation_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.revocation_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'revocation', field: 'revocation_endpoint', record: item });
        }
        // this is optional
        return opts.opCheck ? new TM.TypedMessage({
            level: TM.MessageLevel.C.NOTICE,
            message: pwixI18n.label( I18N, 'organizations.checks.revocation_unset' )
        }) : null;
    },

    // selectedProviders
    // there should be at least one - we will not be able to create any client while no provider is selected
    // value here is expected to be the array of selected providers identifiers
    async selectedProviders( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.selectedProviders()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.selectedProviders = value;
            data.entity.set( entity );
        }
        if( value && _.isArray( value ) && value.length ){
            let res = [];
            value.forEach(( it ) => {
                const provider = Providers.byId( it );
                if( !provider ){
                    res.push( new TM.TypedMessage({
                        level: TM.MessageLevel.C.WARNING,
                        message: pwixI18n.label( I18N, 'organizations.checks.provider_unknown', it )
                    }));
                }
            });
            return res.length ? res : null;
        }
        return new TM.TypedMessage({
            level: opts.opCheck ? TM.MessageLevel.C.ERROR : TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.provider_unset' )
        });
    },

    // token endpoint
    // must be provided as an absolute path
    async token_endpoint( value, data, opts ){
        //console.debug( 'checks.token_endpoint' );
        _assert_data_entityrv( 'Organizations.checks.token_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.token_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'token', field: 'token_endpoint', record: item });
        // value is optional in the UI, but must be set for the organization be operational
        }
        return new TM.TypedMessage({
            level: opts.opCheck ? TM.MessageLevel.C.ERROR : TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.token_unset' )
        });
    },

    // ttl_AccessToken
    async ttl_AccessToken( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.ttl_AccessToken()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.ttl_AccessToken = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.ttl_access_invalid' )
            });
        }
    },

    // ttl_ClientCredentials
    async ttl_ClientCredentials( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.ttl_ClientCredentials()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.ttl_ClientCredentials = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.ttl_client_invalid' )
            });
        }
    },

    // ttl_Grant
    async ttl_Grant( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.ttl_Grant()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.ttl_Grant = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.ttl_grant_invalid' )
            });
        }
    },

    // ttl_IdToken
    async ttl_IdToken( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.ttl_IdToken()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.ttl_IdToken = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.ttl_idtoken_invalid' )
            });
        }
    },

    // ttl_Interaction
    async ttl_Interaction( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.ttl_Interaction()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.ttl_Interaction = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.ttl_interaction_invalid' )
            });
        }
    },

    // ttl_Session
    async ttl_Session( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.ttl_Session()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.ttl_Session = parseInt( value );
            data.entity.set( entity );
        }
        value = parseInt( value );
        if( Number.isInteger( value ) && value >= 0 ){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.ttl_session_invalid' )
            });
        }
    },

    // openid: userinfo endpoint
    // must be provided as an absolute path
    async userinfo_endpoint( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.userinfo_endpoint()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.userinfo_endpoint = value;
            data.entity.set( entity );
        }
        if( value ){
            return _check_endpoint( value, { prefix: 'userinfo', field: 'userinfo_endpoint', record: item });
        }
        // should be set
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.userinfo_unset' )
        });
    },

    // whether the organization wants all clients use PKCE (rfc7636)
    async wantsPkce( value, data, opts ){
        _assert_data_entityrv( 'Organizations.checks.wantsPkce()', data );
        let entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.wantsPkce = Boolean( value );
            data.entity.set( entity );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.wants_pkce_invalid' )
            });
        }
        return null;
    }
};
