/*
 * /imports/common/collections/identities/checks.js
 *
 * The identities registered with an organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import validator from 'email-validator';
import validUrl from 'valid-url';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { Identities } from './index.js';

// fields check
//  - value: mandatory, the value to be tested
//  - data: optional, the data passed to Checker instanciation
//    if set the target item as a ReactiveVar, i.e. the item to be updated with this value
//  - opts: an optional behaviour options, with following keys:
//    > update: whether the item be updated with the value, defaults to true
//    > id: the identifier of the edited row when editing an array
// returns a TypedMessage, or an array of TypedMessage, or null

// entity is a ReactiveVar which contains the edited entity document and its validity records
const _assert_data_content = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.item && data.item instanceof ReactiveVar, caller+' data.item is expected to be set as a ReactiveVar, got '+data.item );
};

// returns the index of the identified row in the array
const _id2index = function( array, id ){
    for( let i=0 ; i<array.length ; ++i ){
        if( array[i].id === id ){
            return i;
        }
    }
    console.warn( 'id='+id+' not found' );
    return -1;
};

// check an url
//  opts:
//  - mandatory, defaulting to true
//  - prefix, the prefix of the i18n label, defaulting to 'url'
//  - field: the name of the field
// returns a Promise or null
const _check_url = function( value, opts={} ){
    const mandatory = _.isBoolean( opts.mandatory ) ? opts.mandatory : true;
    const prefix = opts.prefix || 'url';
    const field = opts.field || '';
    if( value ){
        if( validUrl.isWebUri( value )){
            try {
                const url = new URL( value );
            } catch {
                return new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: pwixI18n.label( I18N, 'identities.checks.'+prefix+'_invalid', field )
                });
            }
            return null;
        } else {
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.checks.'+prefix+'_invalid', field )
            });
        }
    } else if( mandatory ){
        return new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'identities.checks.'+prefix+'_mandatory', field )
        });
    } else {
        return null;
    }
}

Identities.checks = {
    // the family name
    async family_name( value, data, opts ){
        _assert_data_content( 'Identities.checks.family_name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.family_name = value;
            data.item.set( item );
        }
        return value || item.given_name || item.name ? null : new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.family_empty' )
        });
    },

    // the gender
    async gender( value, data, opts ){
        _assert_data_content( 'Identities.checks.gender()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.gender = value;
            data.item.set( item );
        }
        return null;
    },

    // the given name
    async given_name( value, data, opts ){
        _assert_data_content( 'Identities.checks.given_name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.given_name = value;
            data.item.set( item );
        }
        return value || item.family_name || item.name ? null : new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.given_empty' )
        });
    },

    // the locale
    async locale( value, data, opts ){
        _assert_data_content( 'Identities.checks.locale()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.locale = value;
            data.item.set( item );
        }
        return null;
    },

    // the middle name
    async middle_name( value, data, opts ){
        _assert_data_content( 'Identities.checks.middle_name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.middle_name = value;
            data.item.set( item );
        }
        return null;
    },

    // the full name
    async name( value, data, opts ){
        _assert_data_content( 'Identities.checks.name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.name = value;
        }
        return value || item.family_name || item.given_name ? null : new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.name_empty' )
        });
    },

    // the nickname
    async nickname( value, data, opts ){
        _assert_data_content( 'Identities.checks.nickname()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.nickname = value;
            data.item.set( item );
        }
        return null;
    },

    // the picture url
    async picture_url( value, data, opts ){
        _assert_data_content( 'Identities.checks.picture_url()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.picture_url = value;
            data.item.set( item );
        }
        return _check_url( value, { field: 'picture_url', prefix: 'picture', mandatory: false });
    },

    // the profile url
    async profile_url( value, data, opts ){
        _assert_data_content( 'Identities.checks.profile_url()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.profile_url = value;
            data.item.set( item );
        }
        return _check_url( value, { field: 'profile_url', prefix: 'profile', mandatory: false });
    },

    // the website url
    async website_url( value, data, opts ){
        _assert_data_content( 'Identities.checks.website_url()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.website_url = value;
            data.item.set( item );
        }
        return _check_url( value, { field: 'website_url', prefix: 'website', mandatory: false });
    },

    // the zoneinfo
    async zoneinfo( value, data, opts ){
        _assert_data_content( 'Identities.checks.zoneinfo()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.zoneinfo = value;
            data.item.set( item );
        }
        return null;
    }
};

/*
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
                            message: pwixI18n.label( I18N, 'identities.checks.emailaddress_invalid' )
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
                                message: pwixI18n.label( I18N, 'identities.checks.emailaddress_exists' )
                            });
                        };
                        return Meteor.isClient ?
                            Meteor.callPromise( 'identity.getBy', { 'emails.address': value }).then(( result ) => { return fn( result ); }) :
                            fn( Identities.s.getBy({ 'emails.address': value }));
                        }
                } else {
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.ERROR,
                        message: pwixI18n.label( I18N, 'identities.checks.emailaddress_empty' )
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
                    message: pwixI18n.label( I18N, 'identities.checks.phonenumber_empty' )
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
                            message: pwixI18n.label( I18N, 'identities.checks.username_exists' )
                        });
                    };
                    return Meteor.isClient ?
                        Meteor.callPromise( 'identity.getBy', { 'usernames.username': value }).then(( result ) => { return fn( result ); }) :
                        fn( Identities.s.getBy({ 'usernames.username': value }));
                } else {
                    return new CoreApp.TypedMessage({
                        type: CoreApp.MessageType.C.ERROR,
                        message: pwixI18n.label( I18N, 'identities.checks.username_empty' )
                    });
                }
            }
            return null;
        });
};
*/
