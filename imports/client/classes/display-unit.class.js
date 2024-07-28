/*
 * /imports/client/classes/display-unit.class.js
 */

import { AppPages } from 'meteor/pwix:app-pages';

export class DisplayUnit extends AppPages.DisplayUnit {

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @param {Object} o an optional parameters object
     * @returns {DisplayUnit} this instance
     */
    constructor(){
        console.debug( 'instanciating DisplayUnit' );
        super( ...arguments );
        return this;
    }
}
