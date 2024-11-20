/*
 * /imports/common/collections/clients/op-checks.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';
import { Jwks } from '/imports/common/tables/jwks/index.js';

import { Clients } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the client, defined by its entity and all its records, is operational at date.
 * @param {Object} client as an { entity, record } object
 * @returns {Array<TypedMessage>} or null
 */
Clients.isOperational = async function( client ){
    //Meteor.isClient && console.debug( 'Clients.isOperational', client );
    let errors = [];
    // prepare data for the checks functions
    const data = { entity: new ReactiveVar( null ), index: 0 };
    data.entity.set( client.entity );
    data.entity.get().DYN = { records: [ new ReactiveVar( client.record )] };
    // a generic function to call the check functions and get their result
    // the result is pushed as a Promise
    const fnEntityCheck = async function( name, value ){
        return ClientsEntities.checks[name]( value, data, { update: false, opCheck: true }).then(( errs ) => {
            if( errs ){
                errors = errors.concat( errs );
            }
        });
    };
    const fnRecordCheck = async function( name, value ){
        return ClientsRecords.checks[name]( value, data, { update: false, opCheck: true }).then(( errs ) => {
            if( errs ){
                errors = errors.concat( errs );
            }
        });
    };
    const contactCheck = async function( name, item, fldName ){
        // field check
        if( fldName ){
            return ClientsRecords.checks[name]( item[fldName], data, { id: item._id, update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        }
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
    const logoutCheck = async function( name, item, fldName ){
        // field check
        if( fldName ){
            return ClientsRecords.checks[name]( item[fldName], data, { id: item._id, update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        }
    };
    const redirectCheck = async function( name, item, fldName ){
        // field check
        if( fldName ){
            return ClientsRecords.checks[name]( item[fldName], data, { id: item._id, update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        }
    };
    const secretCheck = async function( name, item, fldName ){
        const itemrv = new ReactiveVar( item );
        const secretData = {
            ...data,
            item: itemrv
        }
        // field check
        if( fldName ){
            return ClientSecrets.checks[name]( item[fldName], secretData, { update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        // cross checks
        } else {
            return ClientSecrets.checks[name]( data, { update: false, opCheck: true }).then(( errs ) => {
                if( errs ){
                    errors = errors.concat( errs );
                }
            });
        }
    };
    // check all client datas
    let promises = [];
    // entity
    promises.push( fnEntityCheck( 'clientId', client.entity.clientId ));
    // record
    promises.push( fnRecordCheck( 'application_type', client.record.application_type ));
    promises.push( fnRecordCheck( 'author', client.record.author ));
    promises.push( fnRecordCheck( 'client_type', client.record.client_type ));
    promises.push( fnRecordCheck( 'client_uri', client.record.client_uri ));
    const contacts = client.record.contacts;
    if( contacts.length ){
        for( const it of contacts ){
            promises.push( contactCheck( 'contact_email', it, 'email' ));
        }
    }
    promises.push( fnRecordCheck( 'description', client.record.description ));
    promises.push( fnRecordCheck( 'enabled', client.record.enabled ));
    promises.push( fnRecordCheck( 'grant_types', client.record.grant_types ));
    promises.push( fnRecordCheck( 'identity_access_mode', client.record.identity_access_mode ));
    promises.push( fnRecordCheck( 'identity_auth_mode', client.record.identity_auth_mode ));
    // JSON Web Key Set is an optional feature for the client
    const jwks = Jwks.fn.activeKeys( client );
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
            level: TM.MessageLevel.C.NOTICE,
            message: pwixI18n.label( I18N, 'clients.checks.jwks_unset' )
        }));
    }
    promises.push( fnRecordCheck( 'label', client.record.label ));
    promises.push( fnRecordCheck( 'logo_uri', client.record.logo_uri ));
    promises.push( fnRecordCheck( 'policy_uri', client.record.policy_uri ));
    promises.push( fnRecordCheck( 'profile', client.record.profile ));
    const logouts = client.record.post_logout_redirect_uris;
    if( logouts && logouts.length ){
        for( const it of logouts ){
            promises.push( logoutCheck( 'post_logout_redirect_uri', it, 'uri' ));
        }
    } else {
        errors.push( new TM.TypedMessage({
            level: TM.MessageLevel.C.NOTICE,
            message: pwixI18n.label( I18N, 'clients.checks.logouts_unset' )
        }));
    }
    const redirects = client.record.redirect_uris;
    if( redirects && redirects.length ){
        for( const it of redirects ){
            promises.push( redirectCheck( 'redirect_uri', it, 'uri' ));
        }
    }
    // secrets
    const secrets = ClientSecrets.fn.activeSecrets( client );
    if( secrets.length ){
        for( const it of secrets ){
            promises.push( secretCheck( 'secret_encoding', it, 'encoding' ));
            promises.push( secretCheck( 'secret_endingAt', it, 'endingAt' ));
            promises.push( secretCheck( 'secret_hex', it, 'hex' ));
            promises.push( secretCheck( 'secret_label', it, 'label' ));
            promises.push( secretCheck( 'secret_size', it, 'size' ));
            promises.push( secretCheck( 'secret_startingAt', it, 'startingAt' ));
            promises.push( secretCheck( 'crossCheckProperties', it ));
        }
    }
    promises.push( fnRecordCheck( 'software_id', client.record.software_id ));
    promises.push( fnRecordCheck( 'software_version', client.record.software_version ));
    promises.push( fnRecordCheck( 'token_endpoint_auth_method', client.record.token_endpoint_auth_method ));
    promises.push( fnRecordCheck( 'tos_uri', client.record.tos_uri ));
    await Promise.allSettled( promises );
    //console.debug( 'errors', errors );
    return errors.length ? errors : null;
};
