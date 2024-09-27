/*
 * /imports/common/collections/identities/init.js
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { Permissions } from 'meteor/pwix:permissions';

import { Identities } from './index.js';

/**
 * @summary Define the accounts entity for the organization inside of the accounts manager
 *  This may be called several times for an organization - so protect against that
 * @param {<Organization>} item the full organization entity with its DYN sub-object
 * @returns {amClass} instance
 */
Identities.init = function( item ){
    console.debug( 'Identities.init' );
    if( !item.identities ){
        item.identities = {
            instance: new AccountsManager.amClass({
                name: 'identities_'+item._id,
                additionalFieldset: {
                    fields: Identities.fieldsDef()
                },
                allowFn: Permissions.isAllowed,
                hideDisabled: false,
            })
        };
    }
};
