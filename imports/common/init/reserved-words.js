/*
 * /imports/common/init/reserved-words.js
 *
 * The list of reserved words, to be available both in the client and in the server.
 * 
 * Reserved words are the first level of URL paths which CAN NOT be used as a base URL by the organizations.
 * They are built from:
 * - the first level or UI URL paths
 * - the REST global base URL.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

Meteor.APP.ReservedWords = null;

/**
 * @param {String} path as '/base'
 * @returns {Boolean} whether the provided path is a reserved URL
 */
Meteor.APP.isReservedWord = function( path ){
    if( !Meteor.APP.ReservedWords ){
        let paths = {};
        Object.keys( Meteor.APP.displayUnits ).forEach(( it ) => {
            const route = Meteor.APP.displayUnits[it].route;
            if( route ){
                const words = route.split( '/' );
                paths['/'+words[1]] = true;
            }
        });
        Meteor.APP.ReservedWords = Object.keys( paths );
    }
    // is the provided path used as a client UI URL ?
    let reserved = false;
    if( Meteor.APP.ReservedWords.includes( path )){
        reserved = true;
    // by convention (and as a design decision), global REST API always starts with /vnn
    //  '/v' is forbidden too
    } else {
        const regex = /\/v[\d]*/;
        if( path === '/packages' || path.match( regex )){
            reserved = true;
        }
    }
    return reserved;
};
