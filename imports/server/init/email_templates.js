/*
 * /imports/server/init/email_templates.js
 */

import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.from = Meteor.settings[Meteor.APP.name].environments[Meteor.settings.runtime.env].sender;

Accounts.emailTemplates.siteName = Meteor.APP.name;
