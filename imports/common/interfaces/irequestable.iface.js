/*
 * /imports/common/interfaces/irequestable.iface.js
 *
 * A IRequestable provider is a plugin which accepts URL requests and is able to answer them.
 * 
 * Each request to which we will answer is defined by an object with following keys:
 * - path: the url to be answered to
 * - fn: an async fn( url<String>, args<WebArgs>, organization<Object>): <Boolean>
 * 
 * A provider may define an '*' path, but the first executed will eat all others, i.e. only the first executed will have a chance
 * to handle the provided url in its '*' function.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IRequestable = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @returns {IRequestable}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.irequestable ){
            this.#priv = {
                irequestable: o.irequestable
            };
        }

        this.#priv = this.#priv || {};
        this.#priv.irequestable = this.#priv.irequestable || [];

        return this;
    }

    /**
     * @locus Server
     * @returns {Object} the options needed to instanciate a RequestServer
     */
    requestOptions(){
        return {};
    }

    /**
     * @param {String} url
     * @param {WebArgs} args
     * @param {Object} organization an { entity, record } organization object
     * @param {Function} asterCb a callback function which is called with these three first arguments plus the provider, and targets the aster path
     * @returns {Boolean} whether we have handled the requested url
     */
    async request( url, args, organization, asterCb ){
        const localUrl = url.substring( organization.record.baseUrl.length );
        const baseUrl = organization.record.baseUrl + '/';
        //console.debug( this.identId(), 'url', url, 'localUrl', localUrl );
        let found = false;
        for( let i=0 ; i<this.#priv.irequestable.length && !found ; ++i ){
            const it = this.#priv.irequestable[i];
            if( it.method === args.method()){
                if( it.path === localUrl && url.startsWith( baseUrl )){
                    found = true;
                    if( it.fn ){
                        await it.fn( it, args, organization );
                    } else {
                        args.error( 'the requested url "'+url+'" doesn\'t have any associated function' );
                        args.status( 501 ); // not implemented
                        args.end();
                    }
                } else if( it.path === '*' && asterCb ){
                    found = true;
                    assert( typeof asterCb === 'function', 'expects asterCb be a function, got '+asterCb );
                    await asterCb( url, args, organization, this );
                }
            }
        }
        return found;
    }
});
