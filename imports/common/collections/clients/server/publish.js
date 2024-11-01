/*
 * /imports/common/collections/clients/server/publish.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { Validity } from 'meteor/pwix:validity';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { AuthFlow } from '/imports/common/definitions/auth-flow.def.js';
import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';

import { Clients } from '../index.js';

/*
 * returns a cursor of all clients for the organization, published here as a 'clients_all' pseudo collection
 *  where each item is a client entity, and contains a DYN sub-object with:
 *  - records: the list of validity records for this entity
 *  - closest: the closest record
 * @param {Object} organization as an entity item with its DYN object
 */
Meteor.publish( Meteor.APP.C.pub.clientsAll.publish, async function( organization ){
    if( !organization ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.clients.list', this.userId, organization._id )){
        this.ready();
        return false;
    }
    const self = this;
    const userId = this.userId;
    let initializing = true;
    const collectionName = Meteor.APP.C.pub.clientsAll.collection;
    
    // find ORG_SCOPED_MANAGER allowed users, and add to each entity the list of its records
    const f_entityTransform = async function( item ){
        await Clients.s.transform( item, userId );
        // make sure that each defined field appears in the returned item
        // happens that clearing notes on server side does not publish the field 'notes' and seems that the previously 'notes' on the client is kept
        // while publishing 'notes' as undefined rightly override (and erase) the previous notes on the client
        ClientsEntities.s.addUndef( item );
        return item;
    };

    const entitiesObserver = ClientsEntities.collection.find( Meteor.APP.C.pub.clientsAll.query( organization )).observeAsync({
        added: async function( item ){
            self.added( collectionName, item._id, await f_entityTransform( item ));
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                self.changed( collectionName, newItem._id, await f_entityTransform( newItem ));
            }
        },
        removed: async function( oldItem ){
            self.removed( collectionName, oldItem._id );
        }
    });

    const recordsObserver = ClientsRecords.collection.find({}).observeAsync({
        added: async function( item ){
            ClientsEntities.collection.findOneAsync({ _id: item.entity }).then( async ( entity ) => {
                if( entity ){
                    try {
                        self.changed( collectionName, entity._id, await f_entityTransform( entity ));
                    } catch( e ){
                        // on HMR, happens that Error: Could not find element with id wx8rdvSdJfP6fCDTy to change
                        self.added( collectionName, entity._id, await f_entityTransform( entity ));
                        //console.debug( e, 'ignored' );
                    }
                } else {
                    console.warn( 'added: entity not found', item.entity );
                }
            });
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                ClientsEntities.collection.findOneAsync({ _id: newItem.entity }).then( async ( entity ) => {
                    if( entity ){
                        self.changed( collectionName, entity._id, await f_entityTransform( entity ));
                    } else {
                        console.warn( 'changed: entity not found', newItem.entity );
                    }
                });
            }
        },
        // remind that records are deleted after entity when deleting a client
        removed: async function( oldItem ){
            ClientsEntities.collection.findOneAsync({ _id: oldItem.entity }).then( async ( entity ) => {
                if( entity ){
                    self.changed( collectionName, oldItem.entity, await f_entityTransform( entity ));
                }
            });
        }
    });

    initializing = false;
    self.onStop( function(){
        entitiesObserver.then(( handle ) => { handle.stop(); });
        recordsObserver.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});

/*
 * This publishes a list of the client entities identifiers for the given organization
 * A tabular requisite n° 1
 */
Meteor.publish( Meteor.APP.C.pub.clientsTabularOne.publish, async function( organization ){
    if( !organization ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.clients.list', this.userId, organization._id )){
        this.ready();
        return false;
    }
    //console.debug( 'clientsTabularOne: organization', organization, 'query', Meteor.APP.C.pub.clientsTabularOne.query( organization ));
    const self = this;
    let initializing = true;
    const observer = ClientsEntities.collection.find( Meteor.APP.C.pub.clientsTabularOne.query( organization )).observeAsync({
        added: function( item ){
            self.added( Meteor.APP.C.pub.clientsTabularOne.collection, item._id, item );
        },
        changed: function( newItem, oldItem ){
            if( !initializing ){
                self.changed( Meteor.APP.C.pub.clientsTabularOne.collection, newItem._id, newItem );
            }
        },
        removed: function( item ){
            self.removed( Meteor.APP.C.pub.clientsTabularOne.collection, item._id );
        }
    });
    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});

/*
 * This publishes a list of the closest record ids for the specified entity identifiers, as a list of { closest_id } objects
 * A tabular requisite n° 2
 */
Meteor.publish( Meteor.APP.C.pub.clientsTabularTwo.publish, async function( organization, entityIdArray ){
    if( !organization ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.clients.list', this.userId, organization._id )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;
    // transform the array of objects { _id } to an array of ids
    const entityIds = [];
    entityIdArray.map(( it ) => { entityIds.push( it._id )});
    //console.debug( 'clientsTabularTwo: organization', organization._id, 'entityIdArray', entityIdArray, 'entityIds', entityIds );

    // map the entities to their closest record and maintain that
    //  index is entity_id, value is closest_id
    let entities = {};

    // records are changed, added or removed for a given entity: have to recompute the closest
    const f_closestChanged = async function( entity_id ){
        ClientsRecords.collection.find({ entity: entity_id }).fetchAsync().then(( fetched ) => {
            //console.debug( 'entity', entity_id, 'fetched', fetched );
            if( fetched && fetched.length ){
                const closest = Validity.closestByRecords( fetched ).record;
                if( closest ){
                    const prev_closest = entities[entity_id];
                    if( prev_closest ){
                        if( closest._id !== prev_closest ){
                            self.removed( Meteor.APP.C.pub.clientsTabularTwo.collection, prev_closest );
                            entities[entity_id] = closest._id;
                            //console.debug( 'adding', closest );
                            self.added( Meteor.APP.C.pub.clientsTabularTwo.collection, closest._id, closest );
                        }
                    } else {
                        entities[entity_id] = closest._id;
                        //console.debug( 'adding', closest );
                        self.added( Meteor.APP.C.pub.clientsTabularTwo.collection, closest._id, closest );
                    }
                } else {
                    console.warn( 'unable to compute a closest for', fetched );
                }
            } else {
                console.warn( 'unable to find any record for entity', entity_id );
            }
        });
    };

    const observer = ClientsRecords.collection.find({ entity: { $in: entityIds }}).observeAsync({
        added: function( item ){
            f_closestChanged( item.entity );
        },
        changed: function( newItem, oldItem ){
            if( !initializing ){
                f_closestChanged( newItem.entity );
            }
        },
        removed: function( oldItem ){
            f_closestChanged( oldItem.entity );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    //console.debug( 'TabularTwo ready' );
    self.ready();
});

/*
 * the publication for the tabular display
 * A tabular requisite n° 3
 * For each id of the previous requisite, publishes the content line
 * @param {String} tableName
 * @param {Array} ids: all id's of the ClientsRecords collection - will be filtered by ClientsList component
 * @param {Object} fields the Mongo mmodifier which select the output fields
 * 
 *  [Arguments] {
 *    '0': 'Tenants',
 *    '1': [ 'Xi4PkJdirWQWALLNx', 'a2YdM4JPwB3wsHpqR' ],
 *    '2': {
 *      label: 1,
 *      entity_notes: 1,
 *      pdmpUrl: 1,
 *      gtuUrl: 1,
 *      legalsUrl: 1,
 *      homeUrl: 1,
 *      supportUrl: 1,
 *      contactUrl: 1,
 *      logoUrl: 1,
 *      logoImage: 1,
 *      supportEmail: 1,
 *      contactEmail: 1,
 *      notes: 1,
 *      entity: 1,
 *      effectStart: 1,
 *      effectEnd: 1,
 *      createdAt: 1,
 *      createdBy: 1,
 *      updatedAt: 1,
 *      updatedBy: 1
 *    }
 *  }
 */
Meteor.publish( 'clientsTabularLast', async function( tableName, ids, fields ){
    // because this permission is scoped, cannot be checked here
    /*
    if( !await Permissions.isAllowed( 'feat.clients.list', this.userId )){
        this.ready();
        return false;
    }
        */
    const self = this;
    const collectionName = ClientsRecords.collectionName;
    let initializing = true;
    //console.debug( tableName, ids, fields );

    // for each entity, the record sent after transformation
    let entities = {};

    // for tabular display we have to provide:
    // - entity_notes
    // - a DYN object which contains:
    //   > analyze: the result of the analyze, i.e. the list of fields which are different among this client records
    //   > records: the validity records for this client
    // - authorization flow is computed from the defined grant types
    // - start and end effect dates are modified with the englobing period of the entity
    const f_transform = async function( item ){
        let promises = [];
        item.DYN = {};
        // enriched the item from the entity
        promises.push( f_transformFromEntity( item ));
        // get all the records
        promises.push( ClientsRecords.collection.find({ entity: item.entity }).fetchAsync().then(( fetched ) => {
            item.DYN.analyze = Validity.analyzeByRecords( fetched );
            item.DYN.records = fetched;
            item.authorization_flow = AuthFlow.labelFromGrantTypes( item.grant_types );
            item.auth_method = AuthMethod.labelFromAuthMethod( item.token_endpoint_auth_method );
            const res = Validity.englobingPeriodByRecords( fetched );
            item.effectStart = res.start;
            item.effectEnd = res.end;
        }));
        await Promise.allSettled( promises );
        Clients.s.addUndef( item );
        return item;
    };

    // item is the closest record for the entity, to be enriched with our DYN data and - here - the entity notes
    const f_transformFromEntity = async function( item, entity ){
        if( !entity ){
            entity = await ClientsEntities.collection.findOneAsync({ _id: item.entity });
        }
        if( entity ){
            item.entity_notes = entity.notes;
            item.DYN.entity = entity;
        }
    };

    const entitiesObserver = ClientsEntities.collection.find().observeAsync({
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                const transformed = await f_transform( entities[newItem._id], newItem );
                self.changed( collectionName, entities[newItem._id]._id, transformed );
            }
        }
    });

    const recordsObserver = ClientsRecords.collection.find({ _id: { $in: ids }}).observeAsync({
        added: async function( item ){
            const transformed = await f_transform( item );
            entities[item.entity] = transformed;
            self.added( collectionName, item._id, transformed );
            //console.debug( 'adding', transformed );
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                const transformed = await f_transform( newItem );
                entities[newItem.entity] = transformed;
                self.changed( collectionName, newItem._id, transformed );
            }
        },
        removed: async function( oldItem ){
            self.removed( collectionName, oldItem._id );
            //console.debug( 'removing', oldItem._id );
        }
    });

    initializing = false;

    self.onStop( function(){
        entitiesObserver.then(( handle ) => { handle.stop(); });
        recordsObserver.then(( handle ) => { handle.stop(); });
    });

    self.ready();
});
