/*
 * /imports/client/init/index.js
 *
 *  Client-only UI init code.
 *  All third-party imports go here.
 */

// import here templates required to display fields in Tabular's
import '/imports/client/components/client_operational_badge/client_operational_badge.js';
import '/imports/client/components/organization_operational_badge/organization_operational_badge.js';
import '/imports/client/components/provider_selection_checkbox/provider_selection_checkbox.js';

import '/imports/common/init/index.js';

import './display-units.js';
import './identities-list.js';
import './organizations-list.js';
import './routes.js';
import './run-context.js';
