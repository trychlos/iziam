/*
 * /imports/common/collections/identities/collection.js
 */

export const Identities = {
    instanceName( organizationId ){
        return 'identities_'+organizationId;
    },
    scope( name ){
        return name.replace( /^identities_/, '' );
    }
};
