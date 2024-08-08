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
        xxxxxx: {
            collection: 'iziam_providers_tabular_collection',
            publish: 'iziam_providers_tabular_pub'
        }
    }
}

I18N = 'izIAM.Internationalization';
