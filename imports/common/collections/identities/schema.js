/*
 * /imports/common/collections/identities/schema.js
 */

import SimpleSchema from 'simpl-schema';

import { Mongo } from 'meteor/mongo';

export const Identities = new Mongo.Collection( 'identities' );

Identities.schema = new SimpleSchema({
    //  the organization entity
    organization: {
        type: String
    },
    // -- scope: profile
    // the user's full name
    name: {
        type: String,
        optional: true
    },
    // the user's surname(s) or last name(s)
    family_name: {
        type: String,
        optional: true
    },
    // the user's given name(s) or first name(s)
    given_name: {
        type: String,
        optional: true
    },
    middle_name: {
        type: String,
        optional: true
    },
    // the user's nick name that may or may not be the same as the given_name
    nickname: {
        type: String,
        optional: true
    },
    // the preferred username that the user wishes to be referred to
    preferred_username: {
        type: String,
        optional: true
    },
    // the URL of the user's profile page
    profile: {
        type: String,
        optional: true
    },
    // the URL of the user's profile picture
    picture: {
        type: String,
        optional: true
    },
    // the URL of the user's web page or blog
    website: {
        type: String,
        optional: true
    },
    gender: {
        type: String,
        optional: true
    },
    // full birth date
    birthdate: {
        type: Date,
        optional: true
    },
    // only 'mm-dd' month-day
    birthday: {
        type: String,
        optional: true
    },
    zoneinfo: {
        type: String,
        optional: true
    },
    locale: {
        type: String,
        optional: true
    },
    // -- scope: address
    //  adapted from https://schema.org/PostalAddress
    addresses: {
        type: Object,
        optional: true
    },
    'addresses.$': {
        type: Object
    },
    'addresses.$.id': {
        type: String
    },
    'addresses.$.label': {
        type: String,
        optional: true
    },
    'addresses.$.address1': {
        type: String
    },
    'addresses.$.address2': {
        type: String,
        optional: true
    },
    'addresses.$.address3': {
        type: String,
        optional: true
    },
    'addresses.$.postalCode': {
        type: String,
        optional: true
    },
    'addresses.$.region': {
        type: String,
        optional: true
    },
    'addresses.$.locality': {
        type: String,
        optional: true
    },
    'addresses.$.country': {
        type: String,
        optional: true
    },
    'addresses.$.poNumber': {
        type: String,
        optional: true
    },
    'addresses.$.preferred': {
        type: Boolean,
        defaultValue: false
    },
    // -- scope: email
    emails: {
        type: Array,
        optional: true
    },
    'emails.$': {
        type: Object
    },
    'emails.$.id': {
        type: String
    },
    'emails.$.label': {
        type: String,
        optional: true
    },
    'emails.$.address': {
        type: String
    },
    'emails.$.verified': {
        type: Boolean,
        defaultValue: false
    },
    'emails.$.preferred': {
        type: Boolean,
        defaultValue: false
    },
    // -- scope: phone
    //  we do not require phone number unicity
    phones: {
        type: Array,
        optional: true
    },
    'phones.$': {
        type: Object
    },
    'phones.$.id': {
        type: String
    },
    'phones.$.label': {
        type: String,
        optional: true
    },
    'phones.$.number': {
        type: String
    },
    'phones.$.verified': {
        type: Boolean,
        defaultValue: false
    },
    'phones.$.preferred': {
        type: Boolean,
        defaultValue: false
    },
    // -- scope: username
    usernames: {
        type: Array,
        optional: true
    },
    'usernames.$': {
        type: Object
    },
    'usernames.$.id': {
        type: String
    },
    'usernames.$.label': {
        type: String,
        optional: true
    },
    'usernames.$.username': {
        type: String
    },
    'usernames.$.preferred': {
        type: Boolean,
        defaultValue: false
    },
    // Mongo identifier
    // mandatory (auto by Meteor+Mongo)
    _id: {
        type: String,
        optional: true
    }
});

Identities.attachBehaviour( 'timestampable' );

Identities.schema.extend( Meteor.APP.ExtNotes.schema );
//Identities.schema.extend( Meteor.APP.ExtPublisher.schema );
//Identities.schema.extend( Meteor.APP.Validity.schema );
Identities.attachSchema( Identities.schema );
