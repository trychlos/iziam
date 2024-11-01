/*
 * /imports/common/collections/statistics/fieldset.js
 *
 * Statistics from the REST API.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Field } from 'meteor/pwix:field';
import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

import { Statistics } from './index.js';

const _defaultFieldDef = function(){
    let columns = [
        // --
        //  the url pathname
        {
            name: 'url',
            type: String
        },
        // the HTTP method
        {
            name: 'method',
            type: String
        },
        // the HTTP version
        {
            name: 'httpVersion',
            type: String
        },
        // the received HTTP headers
        {
            name: 'headers',
            type: Object,
            blackbox: true
        },
        // the returned value as a JSON string, may be empty
        {
            name: 'answer',
            type: Object,
            optional: true,
            blackbox: true
        },
        // the returned HTTP status code
        {
            name: 'status',
            type: SimpleSchema.Integer
        },
        // the client IP
        {
            name: 'ip',
            type: String
        },
        // maybe one or more error messages
        {
            name: 'errors',
            type: Array,
            optional: true
        },
        {
            name: 'errors.$',
            type: String
        },
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    Statistics.fieldSet.set( fieldset );
});
