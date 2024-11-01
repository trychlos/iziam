/*
 * /imports/common/collections/identities/collection.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

export const Identities = {
    instanceName( organizationId ){
        return 'identities_'+organizationId;
    },
    isIdentities( name ){
        return name.startsWith( 'identities_' );
    },
    scope( name ){
        return name.replace( /^identities_/, '' );
    },
    fieldSet: null
};
