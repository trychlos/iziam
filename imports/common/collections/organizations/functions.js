/*
 * /import/common/collections/organizations/functions.js
 */

const assert = require( 'assert' ).strict;

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { Providers } from '/imports/common/collections/providers/index.js';

import { Organizations } from './index.js';

/**
 * @summary Compute and returns the list of selected providers for the entity/record organization
 *  Computed selected providers are:
 *  - providers explictely selected by the organization manager read from the collection
 *  - plus maybe non-selectable provider(s) which default to be selected
 *  - minus non-selected pprovider(s) which default to be unselected (maybe because they are obsolete)
 *  - minus providers whose prerequisites are not satisfied by the above list
 * @param {Object} tenant the to-be-considered organization as an object with following keys:
 * - entity
 * - record
 * @returns {Object} the selected providers as a hash whose keys are the provider IIdent identifier and the value:
 * - provider: the izProvider instance
 * - features: an array of the provided IFeatured's
 */
Organizations.selectedProvidersIds = function( tenant ){
    let selectedIds = tenant.record.selectedProviders || [];
    // add providers non-selectable by the user, which default to be selected
    Providers.allProviders().forEach(( p ) => {
        assert( p && p instanceof izProvider, 'expects an instance of izProvider, got '+p );
        assert( p && p instanceof IIdent, 'expects an instance of IIdent, got '+p );
        if( !p.userSelectable()){
            const pId = p.identId();
            if( p.defaultSelected()){
                selectedIds.push( pId );
            } else {
                selectedIds = selected.filter( id => id !== pId );
            }
        }
    });
    // build a hash by id with provider and features
    //  features are not recorded in the collection as they can change from a version to another
    let result = {};
    let allFeatures = [];
    selectedIds.forEach(( id ) => {
        const p = Providers.byId( id );
        // can be null if the provider is no more part of the code
        if( p ){
            result[id] = { provider: p };
            const features = p instanceof IFeatured ? p.features() : [];
            result[id].features = features;
            allFeatures = allFeatures.concat( features );
        } else {
            console.log( 'provider not found', id );
        }
    });
    // check the requisite features
    let selected = [];
    Object.keys( result ).forEach(( id ) => {
        const p = result[id].provider;
        let found = true;
        if( p instanceof IRequires ){
            const requires = p.requires();
            requires.every(( reqId ) => {
                if( !allFeatures.includes( reqId )){
                    console.log( 'prerequisite not found', 'provider='+id, 'requires='+reqId );
                    found = false;
                }
                return found;
            });
        }
        if( !found ){
            delete result[id];
        }
    });
    // update the record with this current result
    tenant.record.selectedProviders = Object.keys( result );
    return result;
}
