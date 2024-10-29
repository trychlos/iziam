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

    // display
    colorTheme: 't-default-color',
    layoutTheme: 't-default-layout',
    useBootstrapValidationClasses: true,

    // some publication which have a special target collection
    pub: {
        clientsAll: {
            collection: 'clients_all_collection',
            publish: 'clients_all_pub',
            query( organization ){
                return { organization: organization._id };
            }
        },
        clientsTabularOne: {
            collection: 'clients_tabular_one_collection',
            publish: 'clients_tabular_one_pub',
            query( organization ){
                return { organization: organization._id };
            }
        },
        clientsTabularTwo: {
            collection: 'clients_tabular_two_collection',
            publish: 'clients_tabular_two_pub'
        },
        identitiesAll: {
            query( organization ){
                return { organization: organization._id };
            }
        }
    },

    // the server metadata discovery OAuth URL path
    oauthMetadataPath: '/.well-known/oauth-authorization-server',
    // the server metadata discovery OAuth URL path
    openidMetadataPath: '/.well-known/openid-configuration',
    // the interaction path used by the node-oidc-provider package
    oidcInteractionPath: '/interaction',
    // a common prefix to all our dedicated data
    // Meteor OAuth doesn't want '.' in the names
    // Error in OAuth Server: Key urn:org.trychlos.iziam:identity:claim:groups must not contain '.'
    oidcUrn: 'urn:org-trychlos-iziam:',

    // a standard acr when authenticating an end-user with its password
    oidcEndUserPasswordAcr: 'urn:iziam:password:0',

    // when generating a cookie keygrip key secret, the used defaults
    keygripDefAlg: 'SHA512',
    keygripDefEncoding: 'hex',
    keygripDefSize: 64,
    keygripMinSize: 32,

    // when generating a client secret, the used defaults
    secretDefEncoding: 'hex',
    secretDefSize: 64,
    secretMinSize: 32,

    // when hashing the identity password
    identitySaltSize: 32

    // OpenID
    // the minimal length of tokens (when the spec allows to choose it)
    //tokenMinLength: 32,
}

I18N = 'izIAM.Internationalization';
