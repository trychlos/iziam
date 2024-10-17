/*
 * /imports/common/collections/authorizations/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Resources } from '/imports/common/collections/resources/index.js';

import { Authorizations } from './index.js';

Authorizations.fn = {

    /**
     * @locus Anywhere
     * @param {<Authorization>} authorization
     * @returns {String} a suitable multi-usage label for this authorization
     */
    label( authorization ){
        let _label = ''; //Resources.fn.resourceToDisplay( doc.resource );
        if( authorization.scope ){
            if( _label.length ){
                _label += ' / ';
            }
            _label += authorization.scope;
        }
        return _label;
    }
};
