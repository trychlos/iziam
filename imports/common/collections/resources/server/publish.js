/*
 * /imports/common/collections/resources/server/publish.js
 */

import { Resources } from '../index.js';

// returns the raw list of known authorizations for a given organization (of for all organizations if unset)
Meteor.publish( 'resources.listAll', function( organizationId ){
    //const query = organization ? { organization: organization } : {};
    //return Authorizations.find( query );
});
