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
        clientsAll: {
            collection: 'clients_all_collection',
            publish: 'clients_all_pub'
        },
        closests: {
            collection: 'clients_closests_collection',
            publish: 'clients_closests_pub'
        }
    }
}

I18N = 'izIAM.Internationalization';
