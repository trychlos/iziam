/*
 * /imports/common/init/organizations-registrar.js
 *
 * Instanciates the auto-maintained organizations registrar.
 */

import { OrganizationsRegistrar } from '/imports/common/classes/organizations-registrar.class.js';

Meteor.APP.Organizations = new OrganizationsRegistrar();
