/*
 * /imports/common/collections/identities/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Validity } from 'meteor/pwix:validity';

import { Identities } from './index.js';

Identities.fn = {

    /**
     * @param {Address} address an address object
     * @return {String} the address in a single string
     */
    address( address ){
        return Identities.fn.addressJoined( ', ' );
    },

    /**
     * @param {Address} address an address object
     * @return {Array} each field in an array
     *  NB: this weird code to handle both objects as { line1, line2, ... } and as { addresses.$.line1, addresses.$.line2, ... }
     */
    addressAsArray( address ){
        let array = [];
        let bis = {};
        Object.keys( address ).forEach(( it ) => {
            const w = it.split( /\./ );
            const key = w[w.length-1];
            address[it] && ( bis[key] = address[it] );
        });
        // have to scan each field in this order to have a label in standard address order
        bis.line1 && array.push( bis.line1 );
        bis.line2 && array.push( bis.line2 );
        bis.line3 && array.push( bis.line3 );
        bis.poNumber && array.push( 'PO.'+bis.poNumber );
        bis.postalCode && array.push( bis.postalCode );
        bis.locality && array.push( bis.locality );
        bis.region && array.push( bis.region );
        bis.country && array.push( bis.country );
        return array;
    },

    /**
     * @param {Address} address an address object
     * @return {Boolean} whether the address is empty
     */
    addressEmpty( address ){
        return Boolean( Identities.fn.addressJoined( address ).length === 0 );
    },

    /**
     * @param {Address} address an address object
     * @return {String} the address in a single string
     */
    addressJoined( address, join='' ){
        return Identities.fn.addressAsArray( address ).join( join );
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the address object which holds this id, or null
     */
    addressById( identity, id ){
        let found = null;
        ( identity.addresses || [] ).every(( it ) => {
            if( it._id === id ){
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
     * @param {Identity} identity
     * @return {String} which eventually resolves to a label (the said 'better label') to associate to this identity
     */
    bestLabel( identity ){
        return Identities.fn.name( identity ) || Identities.fn.emailPreferred( identity )?.address || Identities.fn.usernamePreferred( identity )?.username || identity.DYN?.label;
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the email object which holds this id, or null
     */
    emailById( identity, id ){
        let found = null;
        ( identity.emails || [] ).every(( it ) => {
            if( it._id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {EmailAddress} email an email address object
     * @return {Boolean} whether the email is empty
     */
    emailEmpty( email ){
        return !email.label && !email.address;
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
     * @param {Object} organization an organization entity or an organization { entity, record }
     * @param {Object|String} identity an identity identifier or an identity obkect
     * @returns {Boolean} whether this identity has the identifier required by the organization configuration
     */
    async hasIdentifier( organization, identity ){
        let haveIdentifier = false;
        const org = Validity.getEntityRecord( organization );
        let ident = await Identities.fn.identity( org.entity._id, identity );
        if( !haveIdentifier && organization.record.identitiesEmailAddressesIdentifier ){
            if( ident.emails?.length > 0 ){
                if( ident.emails[0].address ){
                    haveIdentifier = true;
                }
            }
        }
        if (!haveIdentifier && organization.record.identitiesUsernamesIdentifier ){
            if( ident.usernames?.length > 0 ){
                if( ident.usernames[0].username ){
                    haveIdentifier = true;
                }
            }
        }
        return haveIdentifier;
    },

    /**
     * @param {String} organizationId
     * @param {Object|String} identity an identity identifier or an identity object
     * @returns {Object} the identity object
     */
    async identity( organization, identity ){
        let ident = null;
        if( _.isString( identity )){
            const array = await( Meteor.isClient ? Meteor.callAsync( 'identities.getBy', organizationId, { _id: identity }) : Identities.s.getBy( organizationId, { _id: identity }));
            ident = array && array.length && array[0];
        } else {
            ident = identity;
        }
        return ident;
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
        return Meteor.isClient ? await Meteor.callAsync( 'identity.upsert', identity, args ) : await Identities.s.upsert( identity, args );
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the phone object which holds this id, or null
     */
    phoneById( identity, id ){
        let found = null;
        ( identity.phones || [] ).every(( it ) => {
            if( it._id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Phone} phone a phone object
     * @return {Boolean} whether the username is empty
     */
    phoneEmpty( phone ){
        return !phone.label && !phone.number;
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
     * @summary Returns the preferred label for the user
     *  Override the AccountsHub.preferredLabel() for the amClass instances
     * @locus Anywhere
     * @param {String|Object} user the user identifier or the user document
     * @param {String} preferred the optional caller preference, either AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS,
     *  defaulting to the value configured at instanciation time
     * @returns {Promise} a Promise which eventually will resolve to an object with following keys:
     *  - label: the computed preferred label
     *  - origin: the origin, which may be 'ID' or AccountsHub.C.PreferredLabel.USERNAME or AccountsHub.C.PreferredLabel.EMAIL_ADDRESS
     */
    async preferredLabel( user, preferred=null ){
        return user ? {
            label: Identities.fn.bestLabel( user ),
            origin: 'IDENTITY'
        } : null;
    },

    /**
     * @param {Identity} identity
     * @param {String} id
     * @return {Object} the username object which holds this id, or null
     */
    usernameById( identity, id ){
        let found = null;
        ( identity.usernames || [] ).every(( it ) => {
            if( it._id === id ){
                found = it;
            }
            return found === null;
        });
        return found;
    },

    /**
     * @param {Username} username a username object
     * @return {Boolean} whether the username is empty
     */
    usernameEmpty( username ){
        return !username.label && !username.address;
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
