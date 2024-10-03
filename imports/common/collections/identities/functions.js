/*
 * /imports/common/collections/identities/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from './index.js';

Identities.fn = {

    /**
     * @param {Address} address an address object
     * @return {String} the address in a single string
     */
    address( address ){
        let array = [];
        address.address1 && array.push( address.address1 );
        address.address2 && array.push( address.address2 );
        address.address3 && array.push( address.address3 );
        address.poNumber && array.push( 'PO.'+address.poNumber );
        address.postalCode && array.push( address.postalCode );
        address.locality && array.push( address.locality );
        address.region && array.push( address.region );
        address.country && array.push( address.country );
        return array.join( ' ' );
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the address object which holds this id, or null
     */
    addressById( identity, id ){
        let found = null;
        ( identity.addresses || [] ).every(( it ) => {
            if( it.id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Identity} identity
     * @return {Object} the preferred address object, or the first one if none is set as preferred, or null if there is none
     */
    addressPreferred( identity ){
        let found = null;
        const _addresses = identity.addresses || [];
        _addresses.every(( it ) => {
            if( it.preferred ){
                found = it;
            }
            return found === null;
        });
        if( !found && _addresses.length ){
            found = _addresses[0];
        }
        return found;
    },

    /**
     * @summary Setup dynamic vars for the UI
     * @locus Anywhere
     * @param {Identity} identity
     */
    DYN( identity ){
        identity.DYN = identity.DYN || {};
        identity.DYN.membership = identity.DYN.membership || [];
        identity.DYN.nameRv = identity.DYN.nameRv || new ReactiveVar( null );
        // setup arrays of email address, usernames, ...
        identity.DYN.emailAddresses = ( identity.emails || [] ).map( o => o.address );
        identity.DYN.usernames = ( identity.usernames || [] ).map( o => o.username );
        identity.DYN.groupNames = identity.DYN.membership.map( doc => doc.o.name );
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the email object which holds this id, or null
     */
    emailById( identity, id ){
        let found = null;
        ( identity.emails || [] ).every(( it ) => {
            if( it.id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Identity} identity
     * @return {Object} the preferred email address object, or the first one if none is set as preferred, or null if there is none
     */
    emailPreferred( identity ){
        let found = null;
        const _emails = identity.emails || [];
        _emails.every(( it ) => {
            if( it.preferred ){
                found = it;
            }
            return found === null;
        });
        if( !found && _emails.length ){
            found = _emails[0];
        }
        return found;
    },

    /**
     * @param {Identity} identity
     * @return {Promise} which eventually resolves to the comma-separated list of email addresses
     */
    emails( identity ){
        let array = [];
        ( identity.emails || [] ).every(( it ) => {
            array.push( it.address );
            return true;
        });
        return Promise.resolve( array.join( ', ' ));
    },

    /**
     * @param {Identity} identity
     * @return {String} which eventually resolves to the name of the identity
     *  either as the 'name' itself, or as given_name+middle_name+family_name
     */
    name( identity ){
        let name = '';
        if( identity.name ){
            name = identity.name;
        } else {
            if( identity.family_name ){
                name += identity.family_name;
                if( identity.given_name || identity.middle_name ){
                    name += ',';
                }
            }
            if( identity.given_name ){
                if( name ){
                    name += ' ';
                }
                name += identity.given_name;
            }
            if( identity.middle_name ){
                if( name ){
                    name += ' ';
                }
                name += identity.middle_name;
            }
        }
        return name;
    },

    /**
     * @locus Anywhere
     * @param {Identity} identity
     * @param {Object} args an object with following keys:
     *  - organization the full organization entity with its DYN sub-object
     * @return {Boolean} whether the new identity has been successfully created
     */
    async new( identity, args ){
        identity.organization = args.organization._id;
        return Meteor.isClient ? await Meteor.callAsync( 'identity.upsert', identity, args ) : await Identities.s.new( identity, args );
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the phone object which holds this id, or null
     */
    phoneById( identity, id ){
        let found = null;
        ( identity.phones || [] ).every(( it ) => {
            if( it.id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Identity} identity
     * @return {Object} the preferred phone object, or the first one if none is set as preferred, or null if there is none
     */
    phonePreferred( identity ){
        let found = null;
        const _phones = identity.phones || [];
        _phones.every(( it ) => {
            if( it.preferred ){
                found = it;
            }
            return found === null;
        });
        if( !found && _phones.length ){
            found = _phones[0];
        }
        return found;
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the username object which holds this id, or null
     */
    usernameById( identity, id ){
        let found = null;
        ( identity.usernames || [] ).every(( it ) => {
            if( it.id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Identity} identity
     * @return {Object} the preferred username object, or the first one if none is set as preferred, or null if there is none
     */
    usernamePreferred( identity ){
        let found = null;
        const _usernames = identity.usernames || [];
        _usernames.every(( it ) => {
            if( it.preferred ){
                found = it;
            }
            return found === null;
        });
        if( !found && _usernames.length ){
            found = _usernames[0];
        }
        return found;
    }
};
