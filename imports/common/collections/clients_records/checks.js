/*
 * /imports/collections/clients_records/checks.js
 * The clients registered with an organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import validUrl from 'valid-url';

//import { CoreApp } from 'meteor/pwix:core-app';
import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientNature } from '/imports/common/definitions/client-nature.def.js';
import { ClientType } from '/imports/common/definitions/client-type.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';
import { ResponseType } from '/imports/common/definitions/response-type.def.js';

import { Clients } from './clients.js';

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

// these functions check that the passed data are enough to check the field
//  this is the minimum, and is generally enough
//  item is expected to be a ReactiveVar
_assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be a ReactiveVar' );
}

// when checking for validity periods, we need the other items of the edited group
_assert_data_edited = function( caller, data ){
    _assert_data_itemrv( caller, data );
    assert.ok( data.edited, caller+' data.edited required' );
    assert.ok( _.isArray( data.edited ), caller+' data.edited expected to be an array' );
}

Clients.checks = {
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

    async description( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_description()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.description = value;
                    data.item.set( item );
                }
                return null;
            });
    },

    // if date is set, it must be valid - it is expected in yyyy-mm-dd format
    //  data comes from the edition panel, passed-in through the FormChecker instance
    async effectEnd( value, data, coreApp={} ){
        _assert_data_edited( 'Clients.check_effectEnd()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.effectEnd = value ? new Date( value ) : null;
                    data.item.set( item );
                }
                const msg = Meteor.APP.Validity.checkEnd( data.edited, item );
                return msg ? new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.ERROR,
                    message: msg
                }) : null;
            });
    },

    async effectStart( value, data, coreApp={} ){
        _assert_data_edited( 'Clients.check_effectStart()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.effectStart = value ? new Date( value ) : null;
                    data.item.set( item );
                }
                const msg = Meteor.APP.Validity.checkStart( data.edited, item );
                return msg ? new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.ERROR,
                    message: msg
                }) : null;
            });
    },

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

    // wants a label set, but doesn't need to be unique
    async label( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_label()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.label = value || null;
                    data.item.set( item );
                }
                return value && value.length && _.isString( value ) ? null : new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.ERROR,
                    message: pwixI18n.label( I18N, 'clients.check.label_unset' )
                });
            });
    },

    // client nature: must exist
    async nature( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_nature()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.nature = value || null;
                    data.item.set( item );
                }
                const def = ClientNature.byId( value );
                return def ? null : new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.ERROR,
                    message: pwixI18n.label( I18N, 'clients.check.nature_invalid' )
                });
            });
    },

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

    async softwareId( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_softwareId()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.softwareId = value;
                    data.item.set( item );
                }
                return null;
            });
    },

    async softwareVersion( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_softwareVersion()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.softwareVersion = value;
                    data.item.set( item );
                }
                return null;
            });
    },

    // client type: must exist
    async type( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_type()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.type = value || null;
                    data.item.set( item );
                }
                const def = ClientType.byId( value );
                return def ? null : new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.ERROR,
                    message: pwixI18n.label( I18N, 'clients.check.type_invalid' )
                });
            });
    }
};

