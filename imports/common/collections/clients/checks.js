/*
 * /imports/collections/clients/clients-checks.js
 * The clients registered with an organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import validator from 'email-validator';
import validUrl from 'valid-url';

import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

//import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
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
};

// returns the index of the identified row in the array
const _id2index = function( array, id ){
    for( let i=0 ; i<array.length ; ++i ){
        if( array[i].id === id ){
            return i;
        }
    }
    console.warn( 'id='+id+' not found' );
    return -1;
};

// check an email address
// - value: the value to be checked
// - opts: an optional options object with following keys
//   > prefix: a prefix for the messages strings
//   > acceptFragment: whether to accept fragment component, defaulting to true
//   > acceptUnset: whether to accept unset URI, defaulting to true (if accepted, then no message is sent when it is empty)
//   > acceptOthers: whether to accept other protocols, defaulting to true (defaulting to only accept https, when accepted also allows application-defined protocols)
//     ex: "com.example.app:///auth" as a scheme defined for a native mobile app
//   > wantHost: whether hostname is mandatory, defaulting to true (pathname only is accepted in not a special protocol)
// returns a TypedMessage, or null if ok
const _validEmail = function( value, opts ){
    if( value ){
        if( validator.validate( value )){
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, opts.prefix+'_invalid' )
            });
        }
    } else if( opts.acceptUnset === false ){
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, opts.prefix+'_unset' )
        });
    } else {
        return null;
    }
};

// check an URL
// - value: the value to be checked
// - opts: an optional options object with following keys
//   > prefix: a prefix for the messages strings
//   > acceptFragment: whether to accept fragment component, defaulting to true
//   > acceptUnset: whether to accept unset URI, defaulting to true (if accepted, then no message is sent when it is empty)
//   > acceptOthers: whether to accept other protocols, defaulting to true (defaulting to only accept https, when accepted also allows application-defined protocols)
//     ex: "com.example.app:///auth" as a scheme defined for a native mobile app
//   > wantHost: whether hostname is mandatory, defaulting to true (pathname only is accepted in not a special protocol)
// returns a TypedMessage, or null if ok
const _validUrl = function( value, opts ){
    if( value ){
        const specialProtocols = [ 'ftp:', 'file:', 'http:', 'https:', 'ws:', 'wss:' ];
        if( _.isNil( validUrl.isUri( value ))){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, opts.prefix+'_invalid' )
            });
        } else if( opts.acceptFragment === false && value.indexOf( '#' ) > -1 ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, opts.prefix+'_fragment' )
            });
        } else {
            try {
                const url = new URL( value );
                if( opts.acceptOthers === false && url.protocol !== 'https:' ){
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, opts.prefix+'_https' )
                    });
                } else if( opts.acceptOthers !== false && url.protocol === 'http:' ){
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, opts.prefix+'_http' )
                    });
                } else if( opts.wantHost !== false && !url.hostname && specialProtocols.includes( url.protocol )){
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, opts.prefix+'_host' )
                    });
                } else {
                    return null;
                }
            }
            catch( e ){
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, opts.prefix+'_invalid' )
                });
            }
        }
    } else if( opts.acceptUnset === false ){
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, opts.prefix+'_unset' )
        });
    } else {
        return null;
    }
};

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
    async token_endpoint_auth_method( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_authMethod()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.token_endpoint_auth_method = value || null;
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
    async client_type( value, data, opts ){
        _assert_data_content( 'Clients.checks.client_type()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.client_type = value;
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
    // the grant types used on the token endpoint
    async grant_types( value, data, coreApp={} ){
        _assert_data_itemrv( 'Clients.check_grantTypes()', data );
        const item = data.item.get();
        return Promise.resolve( null )
            .then(() => {
                if( coreApp.update !== false ){
                    item.grant_types = value || null;
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
                        } else if( !data.item.token_endpoint_auth_method || data.item.token_endpoint_auth_method === 'none' ){
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

    async client_uri( value, data, opts ){
        _assert_data_content( 'Clients.checks.client_uri()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.client_uri = value;
        }
        return _validUrl( value, { prefix: 'clients.checks.home', acceptHttp: false });
    },

    // contact_email, optional in the UI
    async contact_email( value, data, opts ){
        _assert_data_content( 'Clients.checks.contact_email()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        const index = opts.id ? _id2index( item.contacts, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.contacts = item.contacts || [];
                item.contacts.push({ id: opts.id });
                index = 0;
            }
            item.contacts[index].uri = value;
        }
        return _validEmail( value, { prefix: 'clients.checks.contact', acceptUnset: false });
    },

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

    async logo_uri( value, data, opts ){
        _assert_data_content( 'Clients.checks.logo_uri()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.logo_uri = value;
        }
        return _validUrl( value, { prefix: 'clients.checks.logo', acceptOthers: false });
    },

    async policy_uri( value, data, opts ){
        _assert_data_content( 'Clients.checks.policy_uri()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.policy_uri = value;
        }
        return _validUrl( value, { prefix: 'clients.checks.privacy', acceptOthers: false });
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

    // redirect_uris, optional in the UI
    // see https://www.oauth.com/oauth2-servers/redirect-uris/redirect-uri-validation/
    // see https://datatracker.ietf.org/doc/html/rfc7591#section-2
    // must be https unless a native client which may define its own applicative scheme (e.g. com.example.app:///auth)
    // there must not be any fragment component
    async redirect_uri( value, data, opts ){
        _assert_data_content( 'Clients.checks.redirect_uri()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        const index = opts.id ? _id2index( item.redirect_uris, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.redirect_uris = item.redirect_uris || [];
                item.redirect_uris.push({ id: opts.id });
                index = 0;
            }
            item.redirect_uris[index].uri = value;
        }
        return _validUrl( value, { prefix: 'clients.checks.redirect', acceptUnset: false, acceptFragment: false });
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

    async software_id( value, data, opts ){
        _assert_data_content( 'Clients.checks.software_id()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.software_id = value;
        }
        return null;
    },

    async software_version( value, data, opts ){
        _assert_data_content( 'Clients.checks.software_version()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.software_version = value;
        }
        return null;
    },

    async tos_uri( value, data, opts ){
        _assert_data_content( 'Clients.checks.tos_uri()', data );
        let item = data.entity.get().DYN.records[data.index].get();
        if( opts.update !== false ){
            item.tos_uri = value;
        }
        return _validUrl( value, { prefix: 'clients.checks.tos', acceptOthers: false });
    },
};
