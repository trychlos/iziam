/*
 * /imports/common/collections/authorizations/checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { TM } from 'meteor/pwix:typed-message';

import { AuthObject } from '/imports/common/definitions/auth-object.def.js';
import { AuthSubject } from '/imports/common/definitions/auth-subject.def.js';

import { Authorizations } from './index.js';

// item is a ReactiveVar which contains the edited record
const _assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be a ReactiveVar' );
};

// returns the index of the identified row in the array
const _id2index = function( array, id ){
    for( let i=0 ; i<array.length ; ++i ){
        if( array[i]._id === id ){
            return i;
        }
    }
    console.warn( 'id='+id+' not found' );
    return -1;
};

Authorizations.checks = {

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
        await _check( Authorizations.checks.crossCheckStartingEnding );
        return result.length ? result : null;
    },

    // compare starting vs ending dates
    async crossCheckStartingEnding( data, opts={} ){
        const item = data.item.get()
        if( item.startingAt && item.endingAt ){
            const cmp = DateJs.compare( item.startingAt, item.endingAt );
            return cmp <= 0 ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.starting_ending' )
            });
        }
        return null;
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

    async endingAt( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.endingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.endingAt = value ? new Date( value ) : value;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.ending_invalid' )
            });
        }
        return null;
    },

    // the object group identifier
    // this is expected to be an identifier, but the UI manages by label
    async object_id( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.object_id()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.object_id = value;
            data.item.set( item );
        }
        if( value ){
            const organization = TenantsManager.list.byEntity( data.entity._id );
            if( organization ){
                let registrar = null;
                if( item.object_type === 'C' ){
                    registrar = organization && organization.DYN.clients;
                }
                if( item.object_type === 'R' ){
                    registrar = organization && organization.DYN.resources;
                }
                if( registrar ){
                    const object = registrar.byId( value );
                    return object ? null : new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'authorizations.checks.object_id_unknown' )
                    });
                }
            }
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.unknown_error' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.object_id_unset' )
            });
        }
    },

    // the object group label
    // used by the UI
    async object_label( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.object_label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.object_label = value;
            data.item.set( item );
        }
        if( value ){
            const organization = TenantsManager.list.byEntity( data.entity._id );
            if( organization ){
                let registrar = null;
                if( item.object_type === 'C' ){
                    registrar = organization && organization.DYN.clients;
                }
                if( item.object_type === 'R' ){
                    registrar = organization && organization.DYN.resources;
                }
                if( registrar ){
                    const object = registrar.byLabel( value );
                    if( object ){
                        item.object_id = object._id;
                        return null;
                    }
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'authorizations.checks.object_label_unknown' )
                    });
                }
            }
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.unknown_error' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.object_label_unset' )
            });
        }
    },

    // the object type
    async object_type( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.object_type()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.object_type = value;
            data.item.set( item );
        }
        if( value ){
            const def = AuthObject.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.object_type_unknown' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.object_type_unset' )
            });
        }
    },

    // a permission label
    // must be set and unique (do not leave an empty permission)
    async permission_label( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.permission_label()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.permissions, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.permissions = item.permissions || [];
                item.permissions.push({ _id: opts.id });
                index = 0;
            }
            item.permissions[index].label = value;
            data.item.set( item );
        }
        if( value ){
            let found = null;
            item.permissions.every(( it ) => {
                if( it.label === value && it._id !== opts.id ){
                    found = it;
                }
                return !found;
            });
            return found ? new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.permission_exists' )
            }) : null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.permission_unset' )
            });
        }
    },

    async startingAt( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.startingAt()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.startingAt = value ? new Date( value ) : value;
            data.item.set( item );
        }
        if( value ){
            return DateJs.isValid( value ) ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.starting_invalid' )
            });
        }
        return null;
    },

    // the subject group identifier
    // this is expected to be an identifier, but the UI manages by label
    async subject_id( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.subject_id()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.subject_id = value;
            data.item.set( item );
        }
        if( value ){
            const organization = TenantsManager.list.byEntity( data.entity._id );
            if( organization ){
                let registrar = null;
                if( item.subject_type === 'C' ){
                    registrar = organization && organization.DYN.clients_groups;
                }
                if( item.subject_type === 'I' ){
                    registrar = organization && organization.DYN.identities_groups;
                }
                if( registrar ){
                    const group = registrar.byId( value );
                    return group ? null : new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'authorizations.checks.subject_id_unknown' )
                    });
                }
            }
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.unknown_error' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.subject_id_unset' )
            });
        }
    },

    // the subject group label
    // used by the UI
    async subject_label( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.subject_label()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.subject_label = value;
            data.item.set( item );
        }
        if( value ){
            const organization = TenantsManager.list.byEntity( data.entity._id );
            if( organization ){
                let registrar = null;
                if( item.subject_type === 'C' ){
                    registrar = organization && organization.DYN.clients_groups;
                }
                if( item.subject_type === 'I' ){
                    registrar = organization && organization.DYN.identities_groups;
                }
                if( registrar ){
                    const group = registrar.byLabel( value );
                    if( group ){
                        item.subject_id = group._id;
                        return null;
                    }
                    return new TM.TypedMessage({
                        level: TM.MessageLevel.C.ERROR,
                        message: pwixI18n.label( I18N, 'authorizations.checks.subject_label_unknown' )
                    });
                }
            }
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.unknown_error' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.subject_label_unset' )
            });
        }
    },

    // the subject type
    async subject_type( value, data, opts={} ){
        _assert_data_itemrv( 'Authorizations.checks.subject_type()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.subject_type = value;
            data.item.set( item );
        }
        if( value ){
            const def = AuthSubject.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.subject_type_unknown' )
            });
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'authorizations.checks.subject_type_unset' )
            });
        }
    }
}