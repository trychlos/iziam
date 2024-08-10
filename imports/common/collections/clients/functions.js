/*
 * /imports/collections/clients/clients-fn.js
 * The clients registered with an organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ReactiveVar } from 'meteor/reactive-var';

import { Clients } from './index.js';

Clients.fn = {
    /**
     * @param {<Client>} client 
     * @return {Promise} which eventually resolves to the result object with following keys:
     *  - client: the relevant client
     *  - errs: an array of CoreApp.TypedMessage
     *  This must be enough to say if the client is able to participate to a working OAuth / OpenID REST API.
     */
    async check( client ){
        const checkResult = {
            client: client,
            errs: []
        };
        const edited = Clients.find({ entity: client.entity }).fetch();
        const itemrv = new ReactiveVar( client );
        let promises = [];
        promises.push( Clients.check_authMethod( client.authMethod, { item: itemrv }, { update: false }));
        promises.push( Clients.check_clientId( client.clientId, { item: itemrv }, { update: false }));
        promises.push( Clients.check_clientSecrets( client.clientSecrets, { item: itemrv }, { update: false }));
        promises.push( Clients.check_effectEnd( client.effectEnd, { item: itemrv, edited: edited }, { update: false }));
        promises.push( Clients.check_effectStart( client.effectStart, { item: itemrv, edited: edited }, { update: false }));
        promises.push( Clients.check_endpoints( client.endpoints ));
        promises.push( Clients.check_grantTypes( client.grantTypes, { item: itemrv }, { update: false }));
        promises.push( Clients.check_label( client.label, { item: itemrv }, { update: false }));
        promises.push( Clients.check_responseTypes( client.responseTypes, { item: itemrv }, { update: false }));
        promises.push( Clients.check_type( client.type, { item: itemrv }, { update: false }));
        return Promise.allSettled( promises )
            .then(( results ) => {
                results.forEach(( res ) => {
                    if( res.value ){
                        checkResult.errs.push( res.value );
                    }
                });
                return checkResult;
            });
    },

    /**
     * @param {<Client>} client 
     * @return {Boolean} whether the client has a client_credentials grant type
     *  NOTE: ony returns true if not only the client wants 'client_credentials' grant type, but it also has (at least) a secret
     */
    wantsClientCredentials( client ){
        let wants = false;
        if( client.clientSecrets && client.clientSecrets.length > 0 ){
            client.grantTypes.every(( type ) => {
                if( type === 'client_credentials' ){
                    wants = true;
                }
                return wants === false;
            });
        }
        return wants;
    },
};
