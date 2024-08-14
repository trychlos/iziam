/*
 * /imports/collections/clients/clients-checks.js
 * The clients registered with an organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import validUrl from 'valid-url';

import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

//import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
//import { ClientNature } from '/imports/common/definitions/client-nature.def.js';
import { ClientType } from '/imports/common/definitions/client-type.def.js';
//import { GrantType } from '/imports/common/definitions/grant-type.def.js';
//import { ResponseType } from '/imports/common/definitions/response-type.def.js';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { Clients } from './index.js';

// fields check
//  - value: mandatory, the value to be tested
//  - data: optional, the data passed to Checker instanciation
//    if set the target item as a ReactiveVar, i.e. the item to be updated with this value
//  - opts: an optional behaviour options, with following keys:
//    > update: whether the item be updated with the value, defaults to true
//    > id: the identifier of the edited row when editing an array
// returns a TypedMessage, or an array of TypedMessage, or null

// entity is a ReactiveVar which contains the edited entity document and its validity records
const _assert_data_content = function( caller, data ){
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

// check( item) is used to check a full item, typically when creating/updating an item via the REST API
//  the item must be intrasically correct and compatible with already existing items
/*
Clients.check = function( item ){
    let isOk = true;
    return Promise.resolve( null )
        .then(() => {
            if( isOk && ( !item || !_.isObjectLike( item ))){
                isOk = false;
                return 'Clients.check(): object expected';
            }
        })
        .then(() => { return isOk ? Clients.check_label( item ) : null; })
        .then(() => { return isOk ? Clients.check_effectStart( item ) : null; })
        .then(() => { return isOk ? Clients.check_effectEnd( item ) : null; })
    ;
}
*/

Clients.checks = {
    /*
    // the authentification method againt the token endpoint
    async authMethod( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_authMethod()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.authMethod = value || null;
                    data.item.set( item );
                }
                if( value ){
                    const def = AuthMethod.byId( value );
                    return def ? null : new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.WARNING,
                        message: pwixI18n.label( I18N, 'clients.check.authmethod_invalid' )
                    });
                } else {
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.WARNING,
                        message: pwixI18n.label( I18N, 'clients.check.authmethod_unset' )
                    });
                }
            });
    },

    async clientId( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_clientId()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.clientId = value;
                    data.item.set( item );
                }
                return value && value.length > 0 ? null : new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.WARNING,
                    message: pwixI18n.label( I18N, 'clients.check.clientid_unset' )
                });
            });
    },

    async clientSecrets( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_clientSecrets()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.clientSecrets = value;
                    data.item.set( item );
                }
                return value && value.length > 0 ? null : new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.WARNING,
                    message: pwixI18n.label( I18N, 'clients.check.secret_empty' )
                });
            });
    },
    */

    // client type: mandatory, must exist
    async clientType( value, data, opts ){
        _assert_data_content( 'Clients.checks.clientType()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.clientType = value;
        }
        if( value ){
            const def = ClientType.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.checks.client_type_invalid' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.checks.client_type_unset' )
            });
        }
    },

    async description( value, data, opts ){
        _assert_data_content( 'Clients.checks.description()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.description = value;
        }
        return null;
    },

    /*
    // not managed via FormChecker
    async endpoints( value ){
        return Promise.resolve( null )
            .then(() => {
                let err = null;
                if( !value || !value.length || !_.isArray( value )){
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.WARNING,
                        message: pwixI18n.label( I18N, 'clients.check.endpoints_unset' )
                    });
                } else {
                    value.every(( ep ) => {
                        if( _.isNil( validUrl.isHttpsUri( ep ))){
                            err = new CoreApp.TypedMessage({
                                type: CoreApp.MessageType.C.WARNING,
                                message: pwixI18n.label( I18N, 'clients.check.endpoint_invalid' )
                            });
                        }
                        return err === null;
                    });
                    return err;
                }
            });
    },

    // the grant types used on the token endpoint
    async grantTypes( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_grantTypes()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.grantTypes = value || null;
                    data.item.set( item );
                }
                // value here can be an array
                //  test every one until finding an error
                let array = _.isArray( value ) ? value : [value];
                let ret = null;
                array.every(( it ) => {
                    const def = GrantType.byId( it );
                    if( !def ){
                        ret = new CoreApp.TypedMessage({
                            type: CoreApp.MessageType.C.WARNING,
                            message: pwixI18n.label( I18N, 'clients.check.granttype_invalid' )
                        });
                    // must have a secret
                    //  must have responseTypes = ['none']
                    //  auth method cannot be 'none'
                    } else if( it === 'client_credentials' ){
                        if( !data.item.clientSecrets || !data.item.clientSecrets.length ){
                            ret = new CoreApp.TypedMessage({
                                type: CoreApp.MessageType.C.WARNING,
                                message: pwixI18n.label( I18N, 'clients.check.credentials_nosecret' )
                            });
                        } else if( !_.isEqual( data.item.responseTypes, ['none'] )){
                            ret = new CoreApp.TypedMessage({
                                type: CoreApp.MessageType.C.WARNING,
                                message: pwixI18n.label( I18N, 'clients.check.credentials_rtnone' )
                            });
                        } else if( !data.item.authMethod || data.item.authMethod === 'none' ){
                            ret = new CoreApp.TypedMessage({
                                type: CoreApp.MessageType.C.WARNING,
                                message: pwixI18n.label( I18N, 'clients.check.authmethod_none' )
                            });
                        }
                    }
                    return ret === null;
                });
                return ret;
            });
    },
    */

    // the label must be set, and must identify the client entity
    // need to update the entity (or something) so that the new assistant is reactive
    async label( value, data, opts ){
        _assert_data_content( 'Clients.checks.label()', data );
        const entity = data.entity.get();
        let item = entity.DYN.records[data.index].get();
        if( opts.update !== false ){
            item.label = value;
            data.entity.set( entity );
        }
        //console.debug( 'Clients.checks.label()', value, data );
        if( value ){
            const fn = function( result ){
                let ok = true;
                if( result.length ){
                    // we have found an existing label
                    //  this is normal if the found entity is the same than ours
                    const found_entity = result[0].entity;
                    ok = ( item.entity === found_entity );
                }
                return ok ? null : new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'clients.checks.label_exists' )
                });
            };
            return Meteor.isClient ? Meteor.callAsync( 'clients_records_getBy', { label: value }) : ClientsRecords.server.getBy({ label: value })
                .then(( result ) => {
                    return fn( result );
                });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.checks.label_unset' )
            });
        }
    },

    // client profile: optional, must exist
    async profile( value, data, opts ){
        _assert_data_content( 'Clients.checks.profile()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.profile = value;
        }
        if( value ){
            const def = ClientProfile.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'clients.checks.profile_invalid' )
            });
        }
        return null;
    },

    /*
    // the response types used on the token endpoint
    async responseTypes( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_responseTypes()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.responseTypes = value || null;
                    data.item.set( item );
                }
                // value here can be an array
                //  test every one until finding an error
                let array = _.isArray( value ) ? value : [value];
                let ret = null;
                array.every(( it ) => {
                    const def = ResponseType.byId( it );
                    if( !def ){
                        ret = new CoreApp.TypedMessage({
                            type: CoreApp.MessageType.C.WARNING,
                            message: pwixI18n.label( I18N, 'clients.check.responsetype_invalid' )
                        });
                    }
                    return ret === null;
                });
                return ret;
            });
    },
    */

    async softwareId( value, data, opts ){
        _assert_data_content( 'Clients.checks.softwareId()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.softwareId = value;
        }
        return null;
    },

    async softwareVersion( value, data, opts ){
        _assert_data_content( 'Clients.checks.softwareVersion()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.softwareVersion = value;
        }
        return null;
    }
};
