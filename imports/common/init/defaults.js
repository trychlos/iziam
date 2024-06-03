/*
 * /imports/common/init/defaults.js
 */

Meteor.APP.defaults = {

    // display
    colorTheme: 't-default-color',
    layoutTheme: 't-default-layout',

    useBootstrapValidationClasses: true,

    // Default endpoints
    authorizationEndpoint: '/authorization/endpoint',
    clientsDynRegistrationUrl: '/client/dyn',
    jwksEndpoint: '/jwks/endpoint',
    logoutEndpoint: '/logout/endpoint',
    tokenEndpoint: '/token/endpoint',
    userinfoEndpoint: '/userinfo/endpoint',

    // when generating a client secret, the size of this secret
    clientSecretDefSize: 64,

    // OpenID
    // the minimal length of tokens (when the spec allows to choose it)
    tokenMinLength: 32,
}
