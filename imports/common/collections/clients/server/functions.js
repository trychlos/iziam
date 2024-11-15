/*
 * /imports/common/collections/clients/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { Validity } from 'meteor/pwix:validity';

import { Clients } from '../index.js';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';

Clients.s = Clients.s || {};

/**
 * @summary Make sure all the fields of the fieldset are set in the item, even if undefined
 * @param {Object} item
 * @returns {Object} item
 */
Clients.s.addUndef = function( item ){
    Clients.fieldSet.get().names().forEach(( it ) => {
        if( !Object.keys( item ).includes( it )){
            item[it] = undefined;
        }
    });
    return item;
};

// return a client by its oauth client_id
// returns a { entity, record } client object valid at date, or null
// Note: no permission can be checked here as this function is the first of the authentication exchanges: everybody can ask for a clientId
Clients.s.byClientIdAtDate = async function( clientId ){
    let result = null;
    const entities = await ClientsEntities.collection.find({ clientId: clientId }).fetchAsync();
    if( entities.length === 1 ){
        const records = await ClientsRecords.collection.find({ entity: entities[0]._id }).fetchAsync();
        if( records.length > 0 ){
            const atdate = Validity.atDateByRecords( records );
            if( atdate ){
                result = { entity: entities[0], record: atdate };
            }
        }
    }
    return result;
};

// entity is the client entity with a DYN.records array of ReactiveVar's
//  there is at least one item
// @returns {Object} with full result
// @throws {Error}
Clients.s.delete = async function( entityId, userId ){
    check( entityId, String );
    check( userId, String );
    //if( !await TenantsManager.isAllowed( 'pwix.tenants_manager.feat.delete', userId, entity )){
    //    return null;
    //}
    // delete the entity
    let entitiesRes = await ClientsEntities.s.delete( entityId, userId );
    // and delete all the Records
    let recordsRes = await ClientsRecords.s.delete( entityId, userId );
    // emit an event
    Clients.s.eventEmitter.emit( 'delete', { entity: entityId });

    return {
        entities: entitiesRes,
        records: recordsRes
    }
};

// Find and returns the client entity with its DYN records
// when dealing from an external identity, we expect userId=null and opts.from=<organizationId>
// @returns {Object} with { entities, records, closest } keys
// @throws {Error}
Clients.s.getByEntity = async function( organizationId, entityId, userId, opts={} ){
    assert( organizationId && _.isString( organizationId ), 'expects a string, got '+organizationId );
    assert( entityId && _.isString( entityId ), 'expects a string, got '+entityId );
    assert( !userId || _.isString( userId ), 'expects a string or null, got '+userId );
    if( !await Permissions.isAllowed( 'feat.clients.list', userId, organizationId, opts )){
        return false;
    }
    const res = await ClientsEntities.s.getBy( organizationId, { _id: entityId }, userId, opts );
    return res && res.length ? await Clients.s.transform( res[0], userId, opts ) : null;
};

// returns the full list of groups this identity is member of
// if set, an identity is necessarily inside of a group
//  maybe this group is itself inside of another group and so on
// when dealing from an external identity, we expect userId=null and opts.from=<organizationId>
// returns an object { all: [], direct: [] }
Clients.s.memberOf = async function( organizationId, item, userId, opts={} ){
    let all = {};
    let direct = {};
    const parentsFn = async function( parentId, hash ){
        if( parentId ){
            hash[parentId] = true;
            all[parentId] = true;
            const written = await ClientsGroups.s.getBy( organizationId, { type: 'G', _id: parentId }, userId, opts );
            for( const it of written ){
                await parentsFn( it.parent, all );
            };
        }
    };
    const written = await ClientsGroups.s.getBy( organizationId, { type: 'C', client: item._id }, userId, opts );
    for( const it of written ){
        await parentsFn( it.parent, direct );
    };
    return { all: Object.keys( all ), direct: Object.keys( direct )};
};

// returns the registered client metadata
// client: an { entity, record } object
Clients.s.registeredMetadata = async function( client ){
    let data = {
        client_id: client.entity.clientId,
        grant_types: client.record.grant_types,
        token_endpoint_auth_method: client.record.token_endpoint_auth_method,
    };
    if( client.record.post_logout_redirect_uris && client.record.post_logout_redirect_uris.length > 0 ){
        data.post_logout_redirect_uris = [];
        client.record.post_logout_redirect_uris.map( it => data.post_logout_redirect_uris.push( it.uri ));
    }
    if( client.record.redirect_uris && client.record.redirect_uris.length > 0 ){
        data.redirect_uris = [];
        client.record.redirect_uris.map( it => data.redirect_uris.push( it.uri ));
    } else {
        console.warn( 'no redirect_uri found at date' );
    }
    if( client.record.secrets && client.record.secrets.length ){
        const secret = ClientSecrets.fn.atDate( client.record.secrets );
        if( secret && secret.hex ){
            data.client_secret = secret.hex;
        } else {
            console.warn( 'no secret found at date' );
        }
    }
    return data;
};

// add to the entity item the DYN sub-object { records, closest }
// when dealing from an external identity, we expect userId=null and opts.from=<organizationId>
Clients.s.transform = async function( item, userId, opts ){
    item.DYN = item.DYN || {};
    item.DYN.managers = item.DYN.managers || [];
    let promises = [];
    /*
    promises.push( Meteor.roleAssignment.find({ 'role._id': 'ORG_SCOPED_MANAGER', scope: item._id }).fetchAsync().then(( fetched ) => {
        fetched.forEach(( it ) => {
            Meteor.users.findOneAsync({ _id: it.user._id }).then(( user ) => {
                if( user ){
                    item.DYN.managers.push( user );
                } else {
                    console.warn( 'user not found, but allowed by an assigned scoped role', it.user._id );
                }
            });
        });
        return true;
    }));
    */
    item.DYN.memberOf = item.DYN.memberOf || await Clients.s.memberOf( item.organization, item, userId, opts );
    promises.push( ClientsRecords.collection.find({ entity: item._id }).fetchAsync().then(( fetched ) => {
        item.DYN.records = fetched;
        item.DYN.closest = Validity.closestByRecords( fetched ).record;
        return true;
    }));
    await Promise.allSettled( promises );
    return item;
};

// entity is the client entity with a DYN.records array of ReactiveVar's
//  there is at least one item
// @returns {Object} with full result
// @throws {Error}
Clients.s.upsert = async function( entity, userId ){
    assert( entity && _.isObject( entity ), 'expect an entity object, got '+entity );
    assert( userId && _.isString( userId ), 'expect a non-null string, got '+userId );
    if( !await Permissions.isAllowed( 'feat.clients.create', userId, entity )){
        return null;
    }
    //console.debug( 'Clients.s.upsert()', entity );

    // upsert the entity
    //  we get back not only a result but also the original entity
    //  when new, 'entity' has been updated with newly inserted id
    let entitiesRes = await ClientsEntities.s.upsert( entity, userId );

    // and asks the Records to do the rest
    let recordsRes = await ClientsRecords.s.upsert( entity, userId );

    // update memberships
    await ClientsGroups.s.updateMemberships( entity.organization, entity._id, entity.DYN.memberOf, userId );

    Clients.s.eventEmitter.emit( 'upsert', { entity: entity });

    return {
        entities: entitiesRes,
        records: recordsRes
    }
};
