/*
 * /imports/common/collections/identities/collection.js
 */

export const Identities = {
    instanceName( organizationId ){
        return 'identities_'+organizationId;
    },
    isIdentities( name ){
        return name.startsWith( 'identities_' );
    },
    scope( name ){
        return name.replace( /^identities_/, '' );
    },
    fieldSet: null
};
