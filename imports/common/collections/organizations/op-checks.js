/*
 * /import/common/collections/organizations/op-checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Validity } from 'meteor/pwix:validity';

import { Organizations } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the organization, defined by its entity and the to-be-checked record, is operational.
 * @param {Object} organization as an { entity, record } object
 * @returns {Array<TypedMessage>} or null
 */
Organizations.isOperational = async function( organization ){
    console.debug( 'Organizations.isOperational' );
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
    promises.push( fnCheck( 'authorization_endpoint', organization.record.authorization_endpoint ));
    promises.push( fnCheck( 'baseUrl', organization.record.baseUrl ));
    promises.push( fnCheck( 'introspection_endpoint', organization.record.introspection_endpoint ));
    promises.push( fnCheck( 'issuer', organization.record.issuer ));
    promises.push( fnCheck( 'jwks_uri', organization.record.jwks_uri ));
    promises.push( fnCheck( 'registration_endpoint', organization.record.registration_endpoint ));
    promises.push( fnCheck( 'revocation_endpoint', organization.record.revocation_endpoint ));
    promises.push( fnCheck( 'token_endpoint', organization.record.token_endpoint ));
    promises.push( fnCheck( 'userinfo_endpoint', organization.record.userinfo_endpoint ));

    await Promise.allSettled( promises );
    //console.debug( 'errors', errors );
    return errors.length ? errors : null;
};

/**
 * @locus Client
 * @summary Maintain the 'operational' status of each organization
 *  When the organizations change, update their status
 *  We add (or update) here a DYN.status object
 * @param {Object} organization as a full entity object with its DYN sub-object
 */
Organizations.setupOperational = async function( item ){
    assert( Meteor.isClient, 'expects to only be called on client side' );
    //console.debug( 'Organizations.setupOperational' );
    const atdate = Validity.atDateByRecords( item.DYN.records );
    if( !item.DYN.operational ){
        item.DYN.operational = {
            results: [],
            status: new ReactiveVar( Forms.FieldStatus.C.NONE )
        };
    }
    if( atdate ){
        let entity = { ...item };
        delete entity.DYN;
        Organizations.isOperational({ entity: entity, record: atdate }).then(( res ) => {
            // null or a TM.TypedMessage or an array of TM.TypedMessage's
            item.DYN.operational.results = res;
            item.DYN.operational.status.set( res ? Forms.FieldStatus.C.UNCOMPLETE : Forms.FieldStatus.C.VALID );
        });
    } else {
        item.DYN.operational.results = [];
        item.DYN.operational.status.set( Forms.FieldStatus.C.INVALID );
        item.DYN.operational.results.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'organizations.checks.atdate_none' )
        }));
        item.DYN.operational.results.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.INFO,
            message: pwixI18n.label( I18N, 'organizations.checks.atdate_next' )
        }));
        Organizations.isOperational({ entity: entity, record: item.DYN.closest }).then(( res ) => {
            if( res ){
                item.DYN.operational.results = item.DYN.operational.results.concat( res );
            } else {
                item.DYN.operational.results.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.INFO,
                    message: pwixI18n.label( I18N, 'organizations.checks.atdate_closest_done' )
                }));
            }
        });
    }
};
