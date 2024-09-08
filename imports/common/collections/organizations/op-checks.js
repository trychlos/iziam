/*
 * /import/common/collections/organizations/op-checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Organizations } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the organization, defined by its entity and the to-be-checked record, is operational.
 * @param {Object} organization as an { entity, record } object
 * @returns {Array<TypedMessage>} or null
 */
Organizations.isOperational = async function( organization ){
    let errors = [];
    // prepare data for the checks functions
    const data = { entity: new ReactiveVar( null ), index: 0 };
    data.entity.set( organization.entity );
    data.entity.get().DYN = { records: [ new ReactiveVar( organization.record )] };
    // a generic function to call the check functions and get their result
    // the result is pushed as a Promise
    const fnCheck = async function( name, value ){
        return Organizations.checks[name]( value, data, { update: false, mustHave: true }).then(( errs ) => {
            if( errs ){
                errors = errors.concat( errs );
            }
        });
    }
    // check if the organizations has all its mandatory datas
    let promises = [];
    promises.push( fnCheck( 'issuer', organization.record.issuer ));
    promises.push( fnCheck( 'baseUrl', organization.record.baseUrl ));
    promises.push( fnCheck( 'authorization_endpoint', organization.record.authorization_endpoint ));
    promises.push( fnCheck( 'token_endpoint', organization.record.token_endpoint ));
    // registration_endpoint: not required
    // jwks_uri: not required
    await Promise.allSettled( promises );
    //console.debug( 'errors', errors );
    return errors.length ? errors : null;
};
