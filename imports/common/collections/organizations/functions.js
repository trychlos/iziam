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

Organizations.fn = {
    /**
     * @summary Compute and returns the list of selected providers for the entity/record organization
     *  Computed selected providers are:
     *  - providers explicitely selected by the organization manager to be allowed to the clients (read from the organization records)
     *  - minus providers which are no more registered
     * @param {Object} organization the to-be-considered organization as an object with following keys:
     * - entity
     * - record
     * @returns {Object} the selected providers as a hash whose keys are the provider IIdent identifier and the value:
     * - provider: the izProvider instance
     * - features: an array of the provided IFeatured's
     */
    selectedProviders( organization ){
        let selectedIds = organization.record.selectedProviders || [];
        // add providers non-selectable by the user, which default to be selected
        selectedIds = Providers.filterDefaultSelectedNonUserSelectable( selectedIds );
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
        // update the record with this current result
        organization.record.selectedProviders = Object.keys( result );
        return result;
    }
};
