/*
 * /imports/common/definitions/yesno.def.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

export const YesNo = {
    /**
     * @param {Any} value an expected boolean value
     * @param {Object} opts an optional options object with following keys
     *  - default: a boolean value to be considered if 'value' is not a Boolean
     * @returns {String} the yes/no label associated to this value
     */
    label( value, opts={} ){
        let bool = value;
        if( !_.isBoolean( value )){
            if( Object.keys( opts ).includes( 'default' ) && _.isBoolean( opts.default )){
                bool = opts.default;
            }
        }
        return _.isBoolean( bool ) ? pwixI18n.label( I18N, bool ? 'definitions.yesno.yes' : 'definitions.yesno.no' ) : null;
    }
};
