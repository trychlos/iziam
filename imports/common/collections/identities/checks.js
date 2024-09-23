/*
 * /imports/common/collections/identities/checks.js
 *
 * The identities registered with an organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import validator from 'email-validator';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from './index.js';

/*
// item is a ReactiveVar which contains the edited record
Identities._assert_data_itemrv = function( caller, data ){
    assert.ok( data, caller+' data required' );
    assert.ok( data.item, caller+' data.item required' );
    assert.ok( data.item instanceof ReactiveVar, caller+' data.item expected to be a ReactiveVar' );
}

// addresses
//  when checking from the UI inputHandler() for this field, we got an identifier in the coreApp options
//  in all other cases ?
//  - checking this field from an inputHandler() for another field ?
//  - global checking when initializing an UI ?
//  - global checking of an identity from the server ?
Identities.check_addresses_address1 = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_addresses_number()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const address = coreApp.id ? Identities.fn.addressById( item, coreApp.id ) : null;
            if( address ){
                if( coreApp.update !== false ){
                    address.address1 = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_addresses_address2 = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_addresses_number()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const address = coreApp.id ? Identities.fn.addressById( item, coreApp.id ) : null;
            if( address ){
                if( coreApp.update !== false ){
                    address.address2 = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_addresses_address3 = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_addresses_number()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const address = coreApp.id ? Identities.fn.addressById( item, coreApp.id ) : null;
            if( address ){
                if( coreApp.update !== false ){
                    address.address3 = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_addresses_label = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_addresses_label()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const address = coreApp.id ? Identities.fn.addressById( item, coreApp.id ) : null;
            if( address ){
                if( coreApp.update !== false ){
                    address.label = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_addresses_preferred = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_addresses_preferred()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const address = coreApp.id ? Identities.fn.addressById( item, coreApp.id ) : null;
            if( address ){
                if( coreApp.update !== false ){
                    address.preferred = Boolean( value );
                    // if preferred is checked, then take care of all other preferred should be unchecked
                    if( value ){
                        item.addresses.every(( it ) => {
                            if( it.id !== coreApp.id && it.preferred ){
                                it.preferred = false;
                            }
                            return true;
                        });
                    }
                    data.item.set( item );
                }
            }
            return null;
        });
};

// the birthdate (full date)
Identities.check_birthdate = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_birthdate()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.birthdate = value;
                data.item.set( item );
            }
            return null;
        });
};

// the birthday ('mm-dd' string)
Identities.check_birthday = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_birthday()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.birthday = value;
                data.item.set( item );
            }
            return null;
        });
};

// emails
//  when checking from the UI inputHandler() for this field, we got an identifier in the coreApp options
//  in all other cases ?
//  - checking this field from an inputHandler() for another field ?
//  - global checking when initializing an UI ?
//  - global checking of an identity from the server ?
Identities.check_emails_address = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_emails_address()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const email = coreApp.id ? Identities.fn.emailById( item, coreApp.id ) : null;
            if( email ){
                if( coreApp.update !== false ){
                    email.address = value;
                    data.item.set( item );
                }
                if( value ){
                    if( !validator.validate( value )){
                        return new CoreApp.TypedMessage({
                            type: CoreApp.MessageType.C.ERROR,
                            message: pwixI18n.label( I18N, 'identities.check.emailaddress_invalid' )
                        });
                    } else {
                        const fn = function( result ){
                            let ok = false;
                            if( result.length ){
                                // we have found an existing email address
                                //  this is normal if the found identity is the same than ours
                                const found_id = result[0]._id;
                                if( found_id === item._id ){
                                    ok = true;
                                }
                            } else {
                                ok = true;
                            }
                            return ok ? null : new CoreApp.TypedMessage({
                                type: CoreApp.MessageType.C.ERROR,
                                message: pwixI18n.label( I18N, 'identities.check.emailaddress_exists' )
                            });
                        };
                        return Meteor.isClient ?
                            Meteor.callPromise( 'identity.getBy', { 'emails.address': value }).then(( result ) => { return fn( result ); }) :
                            fn( Identities.s.getBy({ 'emails.address': value }));
                        }
                } else {
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.ERROR,
                        message: pwixI18n.label( I18N, 'identities.check.emailaddress_empty' )
                    });
                }
            }
            return null;
        });
};

Identities.check_emails_label = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_emails_label()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const email = coreApp.id ? Identities.fn.emailById( item, coreApp.id ) : null;
            if( email ){
                if( coreApp.update !== false ){
                    email.label = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_emails_preferred = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_emails_preferred()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const email = coreApp.id ? Identities.fn.emailById( item, coreApp.id ) : null;
            if( email ){
                if( coreApp.update !== false ){
                    email.preferred = Boolean( value );
                    // if preferred is checked, then take care of all other preferred should be unchecked
                    if( value ){
                        item.emails.every(( it ) => {
                            if( it.id !== coreApp.id && it.preferred ){
                                it.preferred = false;
                            }
                            return true;
                        });
                    }
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_emails_verified = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_emails_verified()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const email = coreApp.id ? Identities.fn.emailById( item, coreApp.id ) : null;
            if( email ){
                if( coreApp.update !== false ){
                    email.verified = Boolean( value );
                    data.item.set( item );
                }
            }
            return null;
        });
};

// the family name
Identities.check_family_name = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_family_name()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.family_name = value;
                data.item.set( item );
            }
            return value || item.given_name || item.name ? null : new CoreApp.TypedMessage({
                type: CoreApp.MessageType.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.check.family_empty' )
            });
        });
};

// the gender
Identities.check_gender = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_gender()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.gender = value;
                data.item.set( item );
            }
            return null;
        });
};

// the given name
Identities.check_given_name = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_given_name()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.given_name = value;
                data.item.set( item );
            }
            return value || item.family_name || item.name ? null : new CoreApp.TypedMessage({
                type: CoreApp.MessageType.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.check.given_empty' )
            });
        });
};

// the locale
Identities.check_locale = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_locale()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.locale = value;
                data.item.set( item );
            }
            return null;
        });
};

// the middle name
Identities.check_middle_name = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_middle_name()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.middle_name = value;
                data.item.set( item );
            }
            return null;
        });
};

// the full name
Identities.check_name = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_name()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.name = value;
                data.item.set( item );
            }
            return value || item.family_name || item.given_name ? null : new CoreApp.TypedMessage({
                type: CoreApp.MessageType.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.check.name_empty' )
            });
        });
};

// the nickname
Identities.check_nickname = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_nickname()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.nickname = value;
                data.item.set( item );
            }
            return null;
        });
};

// phones
//  when checking from the UI inputHandler() for this field, we got an identifier in the coreApp options
//  in all other cases ?
//  - checking this field from an inputHandler() for another field ?
//  - global checking when initializing an UI ?
//  - global checking of an identity from the server ?
Identities.check_phones_label = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_phones_label()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const phone = coreApp.id ? Identities.fn.phoneById( item, coreApp.id ) : null;
            if( phone ){
                if( coreApp.update !== false ){
                    phone.label = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_phones_number = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_phones_number()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const phone = coreApp.id ? Identities.fn.phoneById( item, coreApp.id ) : null;
            if( phone ){
                if( coreApp.update !== false ){
                    phone.number = value;
                    data.item.set( item );
                }
                return value ? null : new CoreApp.TypedMessage({
                    type: CoreApp.MessageType.C.ERROR,
                    message: pwixI18n.label( I18N, 'identities.check.phonenumber_empty' )
                });
            }
            return null;
        });
};

Identities.check_phones_preferred = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_phones_preferred()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const phone = coreApp.id ? Identities.fn.phoneById( item, coreApp.id ) : null;
            if( phone ){
                if( coreApp.update !== false ){
                    phone.preferred = Boolean( value );
                    // if preferred is checked, then take care of all other preferred should be unchecked
                    if( value ){
                        item.phones.every(( it ) => {
                            if( it.id !== coreApp.id && it.preferred ){
                                it.preferred = false;
                            }
                            return true;
                        });
                    }
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_phones_verified = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_phones_verified()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const phone = coreApp.id ? Identities.fn.phoneById( item, coreApp.id ) : null;
            if( phone ){
                if( coreApp.update !== false ){
                    phone.verified = Boolean( value );
                    data.item.set( item );
                }
            }
            return null;
        });
};

// the picture
Identities.check_picture = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_picture()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.picture = value;
                data.item.set( item );
            }
            return null;
        });
};

// the preferred username
Identities.check_preferred_username = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_preferred_username()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.preferred_username = value;
                data.item.set( item );
            }
            return null;
        });
};

// the profile
Identities.check_profile = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_profile()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.profile = value;
                data.item.set( item );
            }
            return null;
        });
};

// usernames
//  when checking from the UI inputHandler() for this field, we got an identifier in the coreApp options
//  in all other cases ?
//  - checking this field from an inputHandler() for another field ?
//  - global checking when initializing an UI ?
//  - global checking of an identity from the server ?
Identities.check_usernames_label = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_usernames_label()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const username = coreApp.id ? Identities.fn.usernameById( item, coreApp.id ) : null;
            if( username ){
                if( coreApp.update !== false ){
                    username.label = value;
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_usernames_preferred = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_usernames_preferred()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const username = coreApp.id ? Identities.fn.usernameById( item, coreApp.id ) : null;
            if( username ){
                if( coreApp.update !== false ){
                    username.preferred = Boolean( value );
                    // if preferred is checked, then take care of all other preferred should be unchecked
                    if( value ){
                        item.usernames.every(( it ) => {
                            if( it.id !== coreApp.id && it.preferred ){
                                it.preferred = false;
                            }
                            return true;
                        });
                    }
                    data.item.set( item );
                }
            }
            return null;
        });
};

Identities.check_usernames_username = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_usernames_username()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            const username = coreApp.id ? Identities.fn.usernameById( item, coreApp.id ) : null;
            if( username ){
                if( coreApp.update !== false ){
                    username.username = value;
                    data.item.set( item );
                }
                if( value ){
                    const fn = function( result ){
                        let ok = false;
                        if( result.length ){
                            // we have found an existing username
                            //  this is normal if the found identity is the same than ours
                            const found_id = result[0].usernames[0].id;
                            const me = username.id;
                            if( me === found_id ){
                                ok = true;
                            }
                        } else {
                            ok = true;
                        }
                        return ok ? null : new CoreApp.TypedMessage({
                            type: CoreApp.MessageType.C.ERROR,
                            message: pwixI18n.label( I18N, 'identities.check.username_exists' )
                        });
                    };
                    return Meteor.isClient ?
                        Meteor.callPromise( 'identity.getBy', { 'usernames.username': value }).then(( result ) => { return fn( result ); }) :
                        fn( Identities.s.getBy({ 'usernames.username': value }));
                } else {
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.ERROR,
                        message: pwixI18n.label( I18N, 'identities.check.username_empty' )
                    });
                }
            }
            return null;
        });
};

// the website
Identities.check_website = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_website()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.website = value;
                data.item.set( item );
            }
            return null;
        });
};

// the zoneinfo
Identities.check_zoneinfo = function( value, data, coreApp={} ){
    Identities._assert_data_itemrv( 'Identities.check_zoneinfo()', data );
    const item = data.item.get();
    return Promise.resolve( null )
        .then(() => {
            if( coreApp.update !== false ){
                item.zoneinfo = value;
                data.item.set( item );
            }
            return null;
        });
};
*/
