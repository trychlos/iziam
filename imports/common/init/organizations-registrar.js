/*
 * /imports/common/init/organizations-registrar.js
 *
 * Instanciates the auto-maintained organizations registrar.
 */

import { OrganizationsRegistrar } from '/imports/common/classes/organizations-registrar.class.js';

Meteor.APP.Organizations = new OrganizationsRegistrar();

/*
Meteor.APP.Organizations = {
    _handle: Meteor.subscribe( TenantsManager.C.pub.tenantsAll.publish ),
    _tenants: new ReactiveVar( [] ),
};

// get the list of organizations
// each organization is published by the TenantsManager as an entity object with DYN { managers, records, closest } sub-object
Tracker.autorun(() => {
    if( Meteor.APP.Organizations._handle.ready()){
        TenantsManager.collections.get( TenantsManager.C.pub.tenantsAll.collection ).find({}).fetchAsync().then(( fetched ) => {
            //console.debug( 'organizations', fetched );
            Meteor.APP.Organizations._tenants.set( fetched );
        });
    }
});

// define the accounts entity for each organization
Tracker.autorun(() => {
    Meteor.APP.Organizations._tenants.get().forEach(( it ) => {
        it.DYN.identities = it.DYN.identities || {};
        it.DYN.identities.instance = Identities.init( it );
    });
});

// maintain the 'operational' status of each organization
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
                it.DYN.operational.status = res ? Forms.FieldStatus.C.UNCOMPLETE : Forms.FieldStatus.C.VALID;
            });
        } else {
            it.DYN.operational.results = [];
            it.DYN.operational.status = Forms.FieldStatus.C.INVALID;
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
*/
