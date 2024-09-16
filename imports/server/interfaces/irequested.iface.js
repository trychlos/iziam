/*
 * /imports/server/interfaces/irequested.iface.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

import { RequestServer } from '/imports/server/classes/request-server.class.js';

export const IRequested = DeclareMixin(( superclass ) => class extends superclass {

    #requestServer = null;

    /**
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {IRequested}
     */
    constructor( server ){
        super( ...arguments );

        assert( server && server instanceof RequestServer, 'expects a RequestServer instance, got '+server );
        this.#requestServer = server;

        return this;
    }

    /**
     * @returns {RequestServer} the list of the exposed features
     */
    iRequestServer(){
        return this.#requestServer;
    }
});
