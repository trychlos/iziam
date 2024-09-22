/*
 * /imports/client/init/organizations-list.js
 *
 * Maintain a reactive list of the organizations, and their operational status
 */

import { Forms } from 'meteor/pwix:forms';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { Organizations } from '/imports/common/collections/organizations/index.js';

Meteor.APP.Organizations = {
    _handle: Meteor.subscribe( TenantsManager.C.pub.tenantsAll.publish ),
    _tenants: new ReactiveVar( [] ),

    /**
     * @param {String} entity the organization identifier
     * @returns {Object} the found organization, with its DYN object, or null
     */
    byEntity( id ){
        let found = null;
        Meteor.APP.Organizations._tenants.get().every(( it ) => {
            if( it._id === id ){
                found = it;
            }
            return !found;
        });
        if( !found ){
            console.warn( 'unable to find an organization', id );
        }
        return found;
    }
};

// get the list of organizations
// each organization is published by the TenantsManager as an entty object with DYN { managers, records, closest } sub-object
Tracker.autorun(() => {
    if( Meteor.APP.Organizations._handle.ready()){
        TenantsManager.collections.get( TenantsManager.C.pub.tenantsAll.collection ).find({}).fetchAsync().then(( fetched ) => {
            //console.debug( 'fetched', fetched );
            Meteor.APP.Organizations._tenants.set( fetched );
        });
    }
});

// when the organizations change, update their status
// we add (or update) here a DYN.status object
Tracker.autorun(() => {
    Meteor.APP.Organizations._tenants.get().forEach(( it ) => {
        const atdate = Validity.atDateByRecords( it.DYN.records );
        if( atdate ){
            let entity = { ...it };
            delete entity.DYN;
            it.DYN.operational = it.DYN.operational || {};
            Organizations.isOperational({ entity: entity, record: atdate }).then(( res ) => {
                // null or a TM.TypedMessage or an array of TM.TypedMessage's
                it.DYN.operational.results = res;
                it.DYN.operational.status = res ? Forms.CheckStatus.C.UNCOMPLETE : Forms.CheckStatus.C.VALID;
            });
        } else {
            it.DYN.operational.results = [];
            it.DYN.operational.status = Forms.CheckStatus.C.INVALID;
            it.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'organizations.checks.atdate_none' )
            }));
            it.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'organizations.checks.atdate_next' )
            }));
            Organizations.isOperational({ entity: entity, record: it.DYN.closest }).then(( res ) => {
                if( res ){
                    it.DYN.operational.results = it.DYN.operational.results.concat( res );
                } else {
                    it.DYN.operational.results.push( new TM.TypedMessage({
                        level: TM.MessageLevel.C.INFO,
                        message: pwixI18n.label( I18N, 'organizations.checks.atdate_closest_done' )
                    }));
                }
            });
        }
        //console.debug( 'it', it );
    });
});
