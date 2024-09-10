/*
 * /imports/common/init/constants.js
 */

Meteor.APP.C = {

    // the app administrator role
    appAdmin: 'APP_ADMINISTRATOR',

    // data type
    DataType: {
        REQUIRED: 'REQUIRED',
        RECOMMENDED: 'RECOMMENDED',
        OPTIONAL: 'OPTIONAL',
    },

    managedLanguages: [
        'en',
        'fr'
    ],

    // some publication which have a special target collection
    pub: {
        clientsTabularOne: {
            collection: 'clients_tabular_one_collection',
            publish: 'clients_tabular_one_pub'
        },
        clientsTabularTwo: {
            collection: 'clients_tabular_two_collection',
            publish: 'clients_tabular_two_pub'
        }
    },

    // the server metadata discovery OAuth URL path
    oauthMetadataPath: '/.well-known/oauth-authorization-server'
}

I18N = 'izIAM.Internationalization';
