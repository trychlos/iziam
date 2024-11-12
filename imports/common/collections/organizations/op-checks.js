/*
 * /import/common/collections/organizations/op-checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Validity } from 'meteor/pwix:validity';

import { Jwks } from '/imports/common/tables/jwks/index.js';
import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import { Organizations } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the organization, defined by its entity and the to-be-checked record, is operational.
 * @param {Object} organization as an { entity, record } object
 * @returns {Array<TypedMessage>} or null
 */
Organizations.isOperational = async function( organization ){
    //Meteor.isClient && console.debug( 'Organizations.isOperational', organization );
    let errors = [];
    // prepare data for the checks functions
    const data = { entity: new ReactiveVar( null ), index: 0 };
    data.entity.set( organization.entity );
    data.entity.get().DYN = { records: [ new ReactiveVar( organization.record )] };
    // a generic function to call the check functions and get their result
    // the result is pushed as a Promise
    const fnCheck = async function( name, value ){
        return Organizations.checks[name]( value, data, { update: false, opCheck: true }).then(( errs ) => {
            if( errs ){
                errors = errors.concat( errs );
            }
        });
    };
    const jwkCheck = async function( name, item, fldName ){
        const itemrv = new ReactiveVar( item );
        const jwkData = {
            ...data,
            item: itemrv
        }
        // field check
        if( fldName ){
            return Jwks.checks[name]( item[fldName], jwkData, { update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        // cross checks
        } else {
            return Jwks.checks[name]( data, { update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        }
    };
    const keygripCheck = async function( name, item, fldName ){
        const itemrv = new ReactiveVar( item );
        const keygripData = {
            ...data,
            item: itemrv
        }
        // field check
        if( fldName ){
            return Keygrips.checks[name]( item[fldName], keygripData, { update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        // cross checks
        } else {
            return Keygrips.checks[name]( data, { update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        }
    }
    // check all organization datas
    let promises = [];
    promises.push( fnCheck( 'authorization_endpoint', organization.record.authorization_endpoint ));
    promises.push( fnCheck( 'baseUrl', organization.record.baseUrl ));
    // code_challenge_methods_supported
    promises.push( fnCheck( 'dynamicRegistrationByConfidential', organization.record.dynamicRegistrationByConfidential ));
    promises.push( fnCheck( 'dynamicRegistrationByPublic', organization.record.dynamicRegistrationByPublic ));
    promises.push( fnCheck( 'dynamicRegistrationByUser', organization.record.dynamicRegistrationByUser ));
    promises.push( fnCheck( 'end_session_endpoint', organization.record.end_session_endpoint ));
    promises.push( fnCheck( 'identitiesEmailAddressesIdentifier', organization.record.identitiesEmailAddressesIdentifier ));
    promises.push( fnCheck( 'identitiesEmailAddressesMaxCount', organization.record.identitiesEmailAddressesMaxCount ));
    promises.push( fnCheck( 'identitiesEmailAddressesMaxHow', organization.record.identitiesEmailAddressesMaxHow ));
    promises.push( fnCheck( 'identitiesEmailAddressesMinCount', organization.record.identitiesEmailAddressesMinCount ));
    promises.push( fnCheck( 'identitiesEmailAddressesMinHow', organization.record.identitiesEmailAddressesMinHow ));
    promises.push( fnCheck( 'identitiesUsernamesIdentifier', organization.record.identitiesUsernamesIdentifier ));
    promises.push( fnCheck( 'identitiesUsernamesMaxCount', organization.record.identitiesUsernamesMaxCount ));
    promises.push( fnCheck( 'identitiesUsernamesMaxHow', organization.record.identitiesUsernamesMaxHow ));
    promises.push( fnCheck( 'identitiesUsernamesMinCount', organization.record.identitiesUsernamesMinCount ));
    promises.push( fnCheck( 'identitiesUsernamesMinHow', organization.record.identitiesUsernamesMinHow ));
    promises.push( fnCheck( 'identitiesIdentifier' ));
    promises.push( fnCheck( 'introspection_endpoint', organization.record.introspection_endpoint ));
    // introspection_endpoint_auth_methods_supported
    // introspection_endpoint_auth_signing_alg_values_supported
    promises.push( fnCheck( 'issuer', organization.record.issuer ));
    promises.push( fnCheck( 'jwks_uri', organization.record.jwks_uri ));
    // JSON Web Key Set is an optional feature
    const jwks = Jwks.fn.activeKeys( organization );
    if( jwks.length ){
        for( const it of jwks ){
            promises.push( jwkCheck( 'jwk_alg', it, 'alg' ));
            promises.push( jwkCheck( 'jwk_endingAt', it, 'endingAt' ));
            promises.push( jwkCheck( 'jwk_kid', it, 'kid' ));
            promises.push( jwkCheck( 'jwk_kty', it, 'kty' ));
            promises.push( jwkCheck( 'jwk_label', it, 'label' ));
            promises.push( jwkCheck( 'jwk_startingAt', it, 'startingAt' ));
            promises.push( jwkCheck( 'jwk_use', it, 'use' ));
            promises.push( jwkCheck( 'crossCheckProperties', it ));
        }
    } else {
        errors.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.jwks_unset' )
        }));
    }
    // though keygrips is theorically optional, we make it mandatory to help to prevent a security hole
    const keygrips = Keygrips.fn.activeKeys( organization );
    if( keygrips.length ){
        for( const it of keygrips ){
            promises.push( keygripCheck( 'keygrip_alg', it, 'alg' ));
            promises.push( keygripCheck( 'keygrip_encoding', it, 'encoding' ));
            promises.push( keygripCheck( 'keygrip_label', it, 'label' ));
            promises.push( keygripCheck( 'keygrip_size', it, 'size' ));
            for( const secret in keygrips.keylist ){
                promises.push( keygripCheck( 'keygrip_secret_endingAt', secret, 'endingAt' ));
                promises.push( keygripCheck( 'keygrip_secret_hash', secret, 'hash' ));
                promises.push( keygripCheck( 'keygrip_secret_label', secret, 'label' ));
                promises.push( keygripCheck( 'keygrip_secret_secret', secret, 'secret' ));
                promises.push( keygripCheck( 'keygrip_secret_startingAt', secret, 'startingAt' ));
                promises.push( keygripCheck( 'crossCheckSecretProperties', secret ));
            }
        }
    } else {
        errors.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'organizations.checks.keygrips_unset' )
        }));
    }
    promises.push( fnCheck( 'registration_endpoint', organization.record.registration_endpoint ));
    // request_object_signing_alg_values_supported
    promises.push( fnCheck( 'revocation_endpoint', organization.record.revocation_endpoint ));
    // revocation_endpoint_auth_methods_supported
    // revocation_endpoint_auth_signing_alg_values_supported
    promises.push( fnCheck( 'selectedProviders', organization.record.selectedProviders ));
    // service_documentation
    // signed_metadata
    promises.push( fnCheck( 'token_endpoint', organization.record.token_endpoint ));
    // token_endpoint_auth_signing_alg_values_supported
    promises.push( fnCheck( 'ttl_AccessToken', organization.record.ttl_AccessToken ));
    promises.push( fnCheck( 'ttl_ClientCredentials', organization.record.ttl_ClientCredentials ));
    promises.push( fnCheck( 'ttl_Grant', organization.record.ttl_Grant ));
    promises.push( fnCheck( 'ttl_IdToken', organization.record.ttl_IdToken ));
    promises.push( fnCheck( 'ttl_Interaction', organization.record.ttl_Interaction ));
    promises.push( fnCheck( 'ttl_Session', organization.record.ttl_Session ));
    // ui_locales_supported
    promises.push( fnCheck( 'userinfo_endpoint', organization.record.userinfo_endpoint ));
    promises.push( fnCheck( 'wantsPkce', organization.record.wantsPkce ));
    await Promise.allSettled( promises );
    //console.debug( 'errors', errors );
    return errors.length ? errors : null;
};

/**
 * @locus Anywhere
 * @summary Maintain the 'operational' status of each organization
 *  When the organizations change, update their status
 *  We add (or update) here a DYN.status object
 * @param {Object} organization as a full entity object with its DYN sub-object
 */
Organizations.setupOperational = async function( item ){
    //console.debug( 'Organizations.setupOperational', item );
    const atdate = Validity.atDateByRecords( item.DYN.records );
    if( !item.DYN.operational ){
        item.DYN.operational = {
            results: [],
            status: new ReactiveVar( Forms.FieldStatus.C.NONE )
        };
    }
    let entity = { ...item };
    delete entity.DYN;
    if( atdate ){
        Organizations.isOperational({ entity: entity, record: atdate }).then(( res ) => {
            // null or a TM.TypedMessage or an array of TM.TypedMessage's
            item.DYN.operational.results = res || [];
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
    item.DYN.operational.stats = false;
};
//