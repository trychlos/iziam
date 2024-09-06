/*
 * /imports/client/components/client_operational_badge/client_operational_badge.js
 *
 * This component is used to display the operational status of the client in the tabular display.
 * 
 * Data context:
 * - item: the item as provided to the tabular display (i.e. a modified closest record)
 * - table: the Tabular.Table instance
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './client_operational_badge.html';

Template.client_operational_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // the status
    status(){
        return 'OK';
    },
    // make the badge transparent if count is just one
    classes(){
        return null;
    }
});
