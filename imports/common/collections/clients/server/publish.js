/*
 * /imports/collections/clients/server/publish.js
 */

import { Permissions } from 'meteor/pwix:permissions';
import { Validity } from 'meteor/pwix:validity';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { AuthFlow } from '/imports/common/definitions/auth-flow.def.js';

import { Clients } from '../index.js';

/*
 * returns a cursor of all clients for the organization, published here as a 'clients_all' pseudo collection
 *  where each item is a client entity, and contains a DYN sub-object with:
 *  - records: the list of validity records for this entity
 *  - closest: the closest record
 * @param {Object} organizationId
 */
Meteor.publish( Meteor.APP.C.pub.clientsAll.publish, async function( organizationId, entityIdArray ){
    if( !await Permissions.isAllowed( 'feat.clients.pub.list_all', this.userId, organizationId )){
        this.ready();
        return false;
    }
    if( !organizationId ){
        this.ready();
        return [];
    }
    const self = this;
    let initializing = true;

    // transform the array of objects { _id } to an array of ids
    const entityIds = [];
    entityIdArray.map(( it ) => { entityIds.push( it._id )});
    
    // find ORG_SCOPED_MANAGER allowed users, and add to each entity the list of its records
    const f_entityTransform = async function( item ){
        item.DYN = {
            managers: [],
            records: [],
            closest: null
        };
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
        promises.push( ClientsRecords.collection.find({ entity: item._id }).fetchAsync().then(( fetched ) => {
            item.DYN.records = fetched;
            item.DYN.closest = Validity.closestByRecords( fetched ).record;
            return true;
        }));
        return Promise.allSettled( promises ).then(() => {
            // make sure that each defined field appears in the returned item
            // happens that clearing notes on server side does not publish the field 'notes' and seems that the previously 'notes' on the client is kept
            // while publishing 'notes' as undefined rightly override (and erase) the previous notes on the client
            ClientsEntities.server.addUndef( item );
            //console.debug( 'list_all', item );
            return item;
        });
    };

    const entitiesObserver = ClientsEntities.collection.find({ organization: organizationId }).observeAsync({
        added: async function( item ){
            self.added( Meteor.APP.C.pub.clientsAll.collection, item._id, await f_entityTransform( item ));
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                self.changed( Meteor.APP.C.pub.clientsAll.collection, newItem._id, await f_entityTransform( newItem ));
            }
        },
        removed: async function( oldItem ){
            self.removed( Meteor.APP.C.pub.clientsAll.collection, oldItem._id );
        }
    });

    const recordsObserver = ClientsRecords.collection.find({}).observeAsync({
        added: async function( item ){
            ClientsEntities.collection.findOneAsync({ _id: item.entity }).then( async ( entity ) => {
                if( entity ){
                    try {
                        self.changed( Meteor.APP.C.pub.clientsAll.collection, entity._id, await f_entityTransform( entity ));
                    } catch( e ){
                        // on HMR, happens that Error: Could not find element with id wx8rdvSdJfP6fCDTy to change
                        self.added( Meteor.APP.C.pub.clientsAll.collection, entity._id, await f_entityTransform( entity ));
                        console.debug( e, 'ignored' );
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
                        self.changed( Meteor.APP.C.pub.clientsAll.collection, entity._id, await f_entityTransform( entity ));
                    } else {
                        console.warn( 'changed: entity not found', newItem.entity );
                    }
                });
            }
        },
        // remind that records are deleted after entity when deleting a tenant
        removed: async function( oldItem ){
            ClientsEntities.collection.findOneAsync({ _id: oldItem.entity }).then( async ( entity ) => {
                if( entity ){
                    self.changed( Meteor.APP.C.pub.clientsAll.collection, oldItem.entity, await f_entityTransform( entity ));
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
 * And also a prerequisite for clientsAll publication
 */
Meteor.publish( Meteor.APP.C.pub.clientsTabularOne.publish, async function( organizationId ){
    if( !await Permissions.isAllowed( 'feat.clients.pub.tabular', this.userId, organizationId )){
        this.ready();
        return false;
    }
    if( !organizationId ){
        this.ready();
        return [];
    }
    //console.debug( 'clientsTabularOne: organization', organizationId );
    const self = this;
    let initializing = true;
    const observer = ClientsEntities.collection.find({ organization: organizationId }).observeAsync({
        added: function( item ){
            self.added( Meteor.APP.C.pub.clientsTabularOne.collection, item._id );
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
Meteor.publish( Meteor.APP.C.pub.clientsTabularTwo.publish, async function( organizationId, entityIdArray ){
    if( !await Permissions.isAllowed( 'feat.clients.pub.tabular', this.userId, organizationId )){
        this.ready();
        return false;
    }
    if( !organizationId ){
        this.ready();
        return [];
    }
    const self = this;
    let initializing = true;
    // transform the array of objects { _id } to an array of ids
    const entityIds = [];
    entityIdArray.map(( it ) => { entityIds.push( it._id )});
    //console.debug( 'clientsTabularTwo: organization', organizationId, 'entityIdArray', entityIdArray, 'entityIds', entityIds );

    // map the entities to their closest record and maintain that
    //  index is entity_id, value is closest_id
    let entities = {};

    // records are changed, added or removed for a given entity: have to recompute the closest
    const f_closestChanged = async function( entity_id ){
        ClientsRecords.collection.find({ entity: entity_id }).fetchAsync().then(( fetched ) => {
            if( fetched && fetched.length ){
                const closest = Validity.closestByRecords( fetched ).record;
                if( closest ){
                    const prev_closest = entities[entity_id];
                    if( prev_closest ){
                        if( closest._id !== prev_closest ){
                            self.removed( Meteor.APP.C.pub.clientsTabularTwo.collection, prev_closest );
                            entities[entity_id] = closest._id;
                            self.added( Meteor.APP.C.pub.clientsTabularTwo.collection, closest._id );
                        }
                    } else {
                        entities[entity_id] = closest._id;
                        self.added( Meteor.APP.C.pub.clientsTabularTwo.collection, closest._id );
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
    if( !await Permissions.isAllowed( 'feat.clients.pub.tabular', this.userId )){
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
    //   > count: the count of records for this client
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
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                const transformed = await f_transform( newItem );
                entities[newItem.entity] = transformed;
                self.changed( collectionName, newItem._id, transformed );
            }
        },
        removed: async function( oldItem ){
            self.removed( collectionName, oldItem._id);
        }
    });

    initializing = false;

    self.onStop( function(){
        entitiesObserver.then(( handle ) => { handle.stop(); });
        recordsObserver.then(( handle ) => { handle.stop(); });
    });

    self.ready();
});
