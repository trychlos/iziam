/*
 * /imports/collections/clients_records/fieldset.js
 *
 * The clients registered with an organization.
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { ClientsRecords } from './index.js';

const _defaultFieldSet = function(){
    let columns = [
        {
            // the client displayed name, mandatory, unique
            name: 'label',
            type: String
        },
        {
            // the client chosen profile from ClientProfile which determines the client type
            name: 'profile',
            type: String
        },
        {
            // the client type in the OAuth 2 sense (https://datatracker.ietf.org/doc/html/rfc6749#section-2)
            //  confidential or public
            name: 'type',
            type: String
        },
        Notes.fieldDef(),
        Validity.recordsFieldDef(),
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldSet();
    let fieldset = new Field.Set( columns );
    ClientsRecords.fieldSet.set( fieldset );
});
