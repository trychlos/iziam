/*
 * /imports/common/collections/clients/op-checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

import { Clients } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the organization, defined by its entity and all its records, is operational at date.
 * @param {Object} entity
 * @param {Array<Object>} records
 * @returns {}
 */
Clients.isOperational = async function( entity, record ){
    //Meteor.isClient && console.debug( 'Clients.isOperational', entity, record );
    return null;
};

/**
 * @locus Anywhere
 * @summary Maintain the 'operational' status of each client
 *  When the clients change, update their status
 *  We add (or update) here a DYN.status object
 * @param {Object} item as a full entity object with its DYN sub-object
 */
Clients.setupOperational = async function( item ){
    //console.debug( 'Clients.setupOperational', item );
    const atdate = Validity.atDateByRecords( item.DYN.records );
    if( !item.DYN.operational ){
        item.DYN.operational = {
            results: [],
            status: new ReactiveVar( Forms.FieldStatus.C.NONE )
        };
    }
    let entity = { ...item };
    delete entity.DYN;
    if( atdate ){
        Clients.isOperational({ entity: entity, record: atdate }).then(( res ) => {
            // null or a TM.TypedMessage or an array of TM.TypedMessage's
            item.DYN.operational.results = res;
            item.DYN.operational.status.set( res ? Forms.FieldStatus.C.UNCOMPLETE : Forms.FieldStatus.C.VALID );
        });
    } else {
        item.DYN.operational.results = [];
        item.DYN.operational.status.set( Forms.FieldStatus.C.INVALID );
        item.DYN.operational.results.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'clients.checks.atdate_none' )
        }));
        item.DYN.operational.results.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.INFO,
            message: pwixI18n.label( I18N, 'clients.checks.atdate_next' )
        }));
        Clients.isOperational({ entity: entity, record: item.DYN.closest }).then(( res ) => {
            if( res ){
                item.DYN.operational.results = item.DYN.operational.results.concat( res );
            } else {
                item.DYN.operational.results.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.INFO,
                    message: pwixI18n.label( I18N, 'clients.checks.atdate_closest_done' )
                }));
            }
        });
    }
    item.DYN.operational.stats = false;
};
