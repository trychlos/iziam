/*
 * /imports/common/collections/identities/checks.js
 *
 * The identities registered with an organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import validator from 'email-validator';
import validUrl from 'valid-url';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';
import { Validity } from 'meteor/pwix:validity';

import { Gender } from '/imports/common/definitions/gender.def.js';
import { Locale } from '/imports/common/definitions/locale.def.js';
import { Zoneinfo } from '/imports/common/definitions/zoneinfo.def.js';

import { Identities } from './index.js';

// fields check
//  - value: mandatory, the value to be tested
//  - data: optional, the data passed to Checker instanciation
//    if set the target item as a ReactiveVar, i.e. the item to be updated with this value
//  - opts: an optional behaviour options, with following keys:
//    > update: whether the item be updated with the value, defaults to true
//    > id: the identifier of the edited row when editing an array
// returns a TypedMessage, or an array of TypedMessage, or null

// the data passed to the crossed checks
// in the UI, organization is an entity with its DYN sub-object
// from the REST API, this is an { entity, record } object
const _assert_cross_data_content = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.item && data.item instanceof ReactiveVar, caller+' data.item is expected to be set as a ReactiveVar, got '+data.item );
    assert.ok( data.amInstance && data.amInstance instanceof AccountsManager.amClass, caller+' data.amInstance is expected to be set as an instance of AccountsManager.amClass, got '+data.amInstance );
    assert.ok( data.organization && _.isObject( data.organization ), caller+' data.organization is expected to be set an object, got '+data.organization );
};

// entity is a ReactiveVar which contains the edited entity document and its validity records
const _assert_data_content = function( caller, data ){
    assert.ok( data, caller+' data is required' );
    assert.ok( data.item && data.item instanceof ReactiveVar, caller+' data.item is expected to be set as a ReactiveVar, got '+data.item );
};

// returns the index of the identified row in the array
const _id2index = function( array, id ){
    for( let i=0 ; i<array.length ; ++i ){
        if( array[i]._id === id ){
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
    // cross check
    // data is:
    //  item: a ReactiveVar which contains the currently edited identity
    //  amInstance: the AccountsManager.amClass instance
    //  organization: an { entity, record } object

    // whether this address object is set ?
    // emits a warning if the address is empty
    async crossAddress( data, opts ){
        const address = opts.checker.panel().objectData();
        return Identities.fn.addressEmpty( address ) ? new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.address_unset' )
        }) : null;
    },

    // whether this identity has an identifier ?
    async crossHasIdentifier( data, opts ){
        _assert_cross_data_content( 'Identities.checks.crossHasIdentifier()', data );
        const item = data.item.get();
        const haveIdentifier = await Identities.fn.hasIdentifier( data.organization, item );
        return haveIdentifier ? null : new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'identities.checks.identifier_missing' )
        });
    },

    // crossh check on the two clear versions of the password
    async crossPasswords( data, opts ){
        _assert_cross_data_content( 'Identities.checks.crossPasswords()', data );
        const item = data.item.get();
        return item.password?.UI?.clear1 === item.password?.UI?.clear2 ? null : new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'identities.checks.passwords_different' )
        });
    },

    // addresses
    async address_country( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_country()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].country = value;
            data.item.set( item );
        }
        return null;
    },

    async address_label( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_label()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].label = value;
            data.item.set( item );
        }
        return null;
    },

    async address_line1( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_line1()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].line1 = value;
            data.item.set( item );
        }
        return null;
    },

    async address_line2( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_line2()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].line2 = value;
            data.item.set( item );
        }
        return null;
    },

    async address_line3( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_line3()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].line3 = value;
            data.item.set( item );
        }
        return null;
    },

    async address_locality( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_locality()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].locality = value;
            data.item.set( item );
        }
        return null;
    },

    async address_po_number( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_po_number()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].poNumber = value;
            data.item.set( item );
        }
        return null;
    },

    async address_postal_code( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_postal_code()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].postalCode = value;
            data.item.set( item );
        }
        return null;
    },

    async address_preferred( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_preferred()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].preferred = Boolean( value );
            data.item.set( item );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.address_preferred_invalid' )
            });
        }
        // must have a single preferred (if any)
        let count = 0;
        ( item.addresses || [] ).forEach(( it ) => {
            if( it.preferred === true ){
                count += 1;
            }
        });
        return count > 1 ? new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.address_preferred_count' )
        }) : null;
    },

    async address_region( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.address_region()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.addresses, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.addresses = item.addresses || [];
                item.addresses.push({ _id: opts.id });
                index = 0;
            }
            item.addresses[index].region = value;
            data.item.set( item );
        }
        return null;
    },

    // the birthdate (full date)
    async birthdate( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.birthdate()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.birthdate = new Date( value );
            data.item.set( item );
        }
        return null;
    },

    // the birthday ('mm-dd' string)
    async birthday( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.birthday()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.birthday = value;
            data.item.set( item );
        }
        return null;
    },

    // emails
    // if there is a row, it must have a valid email address
    async email_address( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.email_address()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.emails, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.emails = item.emails || [];
                item.emails.push({ _id: opts.id });
                index = 0;
            }
            item.emails[index].address = value;
            data.item.set( item );
        }
        if( !value ){
            // this is an error if this identity doesn't have yet any identifier
            //  else only a warning
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.checks.email_address_unset' )
            });
        }
        if( !validator.validate( value )){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.checks.email_address_invalid' )
            });
        }
        if( data.organization ){
            const organization = Validity.getEntityRecord( data.organization );
            if( organization.record.identitiesEmailAddressesIdentifier ){
                return data.amInstance.byEmailAddress( value )
                    .then(( user ) => {
                        let ok = true;
                        if( user ){
                            user.emails.every(( it ) => {
                                if( it.address === value && it._id !== opts.id ){
                                    ok = false;
                                }
                                return ok;
                            });
                        }
                        return ok ? null : new TM.TypedMessage({
                            level: TM.MessageLevel.C.ERROR,
                            message: pwixI18n.label( I18N, 'identities.checks.email_address_exists' )
                        });
                    });
            }
        } else {
            console.warn( 'organization expected in data, not found' );
        }
        return null;
    },

    async email_label( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.email_label()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.emails, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.emails = item.emails || [];
                item.emails.push({ _id: opts.id });
                index = 0;
            }
            item.emails[index].label = value;
            data.item.set( item );
        }
        return null;
    },

    async email_preferred( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.email_preferred()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.emails, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.emails = item.emails || [];
                item.emails.push({ _id: opts.id });
                index = 0;
            }
            item.emails[index].preferred = Boolean( value );
            data.item.set( item );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.email_preferred_invalid' )
            });
        }
        // must have a single preferred (if any)
        let count = 0;
        ( item.emails || [] ).forEach(( it ) => {
            if( it.preferred === true ){
                count += 1;
            }
        });
        return count > 1 ? new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.email_preferred_count' )
        }) : null;
    },

    async email_verified( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.email_verified()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.emails, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.emails = item.emails || [];
                item.emails.push({ _id: opts.id });
                index = 0;
            }
            item.emails[index].verified = Boolean( value );
            data.item.set( item );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.email_verified_invalid' )
            });
        }
        return null;
    },

    // the family name
    // if we enter a family name, then name should be empty
    async family_name( value, data, opts ){
        _assert_data_content( 'Identities.checks.family_name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.family_name = value;
            data.item.set( item );
        }
        let errors = [];
        if( value ){
            if( item.name ){
                errors.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.WARNING,
                    message: pwixI18n.label( I18N, 'identities.checks.family_name_set' )
                }));
            }
        }
        return errors.length ? errors : null;
    },

    // the gender
    async gender( value, data, opts ){
        _assert_data_content( 'Identities.checks.gender()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.gender = value;
            data.item.set( item );
        }
        if( value ){
            const def = Gender.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.gender_invalid' )
            });
        }
        return null;
    },

    // the given name
    // if we enter a given name, then name should be empty
    async given_name( value, data, opts ){
        _assert_data_content( 'Identities.checks.given_name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.given_name = value;
            data.item.set( item );
        }
        let errors = [];
        if( value ){
            if( item.name ){
                errors.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.WARNING,
                    message: pwixI18n.label( I18N, 'identities.checks.given_name_set' )
                }));
            }
        }
        return errors.length ? errors : null;
    },

    // the locale
    async locale( value, data, opts ){
        _assert_data_content( 'Identities.checks.locale()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.locale = value;
            data.item.set( item );
        }
        if( value ){
            const def = Locale.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.locale_invalid' )
            });
        }
        return null;
    },

    // the middle name
    // exclusive from entering a name
    async middle_name( value, data, opts ){
        _assert_data_content( 'Identities.checks.middle_name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.middle_name = value;
            data.item.set( item );
        }
        if( value && item.name ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.middle_name_set' )
            });
        }
        return null;
    },

    // the full name
    // may be computed from given_name+middle_name+family_name or entered
    // the two ways are exclusive (but one must be used)
    async name( value, data, opts ){
        _assert_data_content( 'Identities.checks.name()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.name = value;
            data.item.set( item );
        }
        let errors = [];
        if( value ){
            if( item.given_name || item.middle_name || item.family_name ){
                errors.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.WARNING,
                    message: pwixI18n.label( I18N, 'identities.checks.name_others_set' )
                }));
            }
        } else {
            if( !item.given_name && !item.family_name ){
                errors.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.WARNING,
                    message: pwixI18n.label( I18N, 'identities.checks.name_others_unset' )
                }));
            }
        }
        return errors.length ? errors : null;
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

    // the clear password
    async password_clear1( value, data, opts ){
        _assert_data_content( 'Identities.checks.password_clear1()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.password = item.password || {};
            item.password.UI = item.password.UI || {};
            item.password.UI.clear1 = value;
            data.item.set( item );
        }
        // if this field mandatory (if never set) or optional (just allow for reset) ?
        // doesn't rely on the UI setup to be able to answer to REST requests
        //const type = opts.checker.panel().byName( 'password.UI.clear1' ).iSpecType();
        const mandatory = !Boolean( item.password?.hashed );
        if( value ){
            const result = await data.amInstance.checkPassword( value );
            item.password = item.password || {};
            item.password.UI = item.password.UI || {};
            item.password.UI.check = result;
            if( result.ok ){
                return null;
            }
            let res = [];
            result.errors.forEach(( it ) => {
                res.push( new TM.TypedMessage({
                    level: TM.MessageLevel.C.ERROR,
                    message: it
                }));
            });
            return res;
        }
        return mandatory ? new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'identities.checks.password_unset' )
        }) : null;
    },

    async password_clear2( value, data, opts ){
        _assert_data_content( 'Identities.checks.password_clear2()', data );
        let item = data.item.get();
        if( opts.update !== false ){
            item.password = item.password || {};
            item.password.UI = item.password.UI || {};
            item.password.UI.clear2 = value;
            data.item.set( item );
        }
        const mandatory = !Boolean( item.password?.hashed );
        if( value ){
            // this is the same than the cross check on passwords
            // but this one is only triggered on field input
            // + returning an error message let the field be marked as bad
            return item.password?.UI?.clear1 === item.password?.UI?.clear2 ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.checks.passwords_different' )
            });
        }
        return mandatory ? new TM.TypedMessage({
            level: TM.MessageLevel.C.ERROR,
            message: pwixI18n.label( I18N, 'identities.checks.password_unset' )
        }) : null;
    },

    async phone_label( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.phone_label()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.phones, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.phones = item.phones || [];
                item.phones.push({ _id: opts.id });
                index = 0;
            }
            item.phones[index].label = value;
            data.item.set( item );
        }
        return null;
    },

    async phone_number( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.phone_numnber()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.phones, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.phones = item.phones || [];
                item.phones.push({ _id: opts.id });
                index = 0;
            }
            item.phones[index].number = value;
            data.item.set( item );
        }
        if( !value ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.phone_number_unset' )
            });
        }
        return null;
    },

    async phone_preferred( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.phone_preferred()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.phones, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.phones = item.phones || [];
                item.phones.push({ _id: opts.id });
                index = 0;
            }
            item.phones[index].preferred = Boolean( value );
            data.item.set( item );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.phone_preferred_invalid' )
            });
        }
        // must have a single preferred (if any)
        let count = 0;
        ( item.phones || [] ).forEach(( it ) => {
            if( it.preferred === true ){
                count += 1;
            }
        });
        return count > 1 ? new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.phone_preferred_count' )
        }) : null;
    },

    async phone_verified( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.phone_verified()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.phones, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.phones = item.phones || [];
                item.phones.push({ _id: opts.id });
                index = 0;
            }
            item.phones[index].verified = Boolean( value );
            data.item.set( item );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.phone_verified_invalid' )
            });
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

    // usernames
    async username_label( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.username_label()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.usernames, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.usernames = item.usernames || [];
                item.usernames.push({ _id: opts.id });
                index = 0;
            }
            item.usernames[index].label = value;
            data.item.set( item );
        }
        return null;
    },

    async username_preferred( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.username_preferred()', data );
        let item = data.item.get();
        const index = opts.id ? _id2index( item.usernames, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.usernames = item.usernames || [];
                item.usernames.push({ _id: opts.id });
                index = 0;
            }
            item.usernames[index].preferred = Boolean( value );
            data.item.set( item );
        }
        if( value !== true && value !== false ){
            return new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.username_preferred_invalid' )
            });
        }
        // must have a single preferred (if any)
        let count = 0;
        ( item.usernames || [] ).forEach(( it ) => {
            if( it.preferred === true ){
                count += 1;
            }
        });
        return count > 1 ? new TM.TypedMessage({
            level: TM.MessageLevel.C.WARNING,
            message: pwixI18n.label( I18N, 'identities.checks.username_preferred_count' )
        }) : null;
    },

    // if there is a row, it must have a valid username
    async username_username( value, data, opts={} ){
        _assert_data_content( 'Identities.checks.username_address()', data );
        let item = data.item.get();
        let index = opts.id ? _id2index( item.usernames, opts.id ) : -1;
        if( opts.update !== false ){
            if( index < 0 ){
                item.usernames = item.usernames || [];
                item.usernames.push({ _id: opts.id });
                index = 0;
            }
            item.usernames[index].username = value;
            data.item.set( item );
        }
        if( !value ){
            const haveIdentifier = await Identities.fn.hasIdentifier( data.organization, item );
            // this is an error if this identity doesn't have yet any identifier
            //  else just a warning
            return new TM.TypedMessage({
                level: haveIdentifier ? TM.MessageLevel.C.WARNING : TM.MessageLevel.C.ERROR,
                message: pwixI18n.label( I18N, 'identities.checks.username_unset' )
            });
        }
        if( data.organization ){
            const organization = Validity.getEntityRecord( data.organization );
            if( organization.record.identitiesUsernamesIdentifier ){
                return data.amInstance.byUsername( value )
                    .then(( user ) => {
                        let ok = true;
                        if( user ){
                            user.usernames.every(( it ) => {
                                if( it.username === value && it._id !== opts.id ){
                                    ok = false;
                                }
                                return ok;
                            });
                        }
                        return ok ? null : new TM.TypedMessage({
                            level: TM.MessageLevel.C.ERROR,
                            message: pwixI18n.label( I18N, 'identities.checks.username_exists' )
                        });
                    });
            }
        } else {
            console.warn( 'organization expected in data, not found' );
        }
        return null;
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
        if( value ){
            const def = Zoneinfo.byId( value );
            return def ? null : new TM.TypedMessage({
                level: TM.MessageLevel.C.WARNING,
                message: pwixI18n.label( I18N, 'identities.checks.zoneinfo_invalid' )
            });
        }
        return null;
    }
};
