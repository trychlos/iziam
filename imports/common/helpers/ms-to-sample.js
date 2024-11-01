/*
 * /imports/common/helpers/ms-to-sample.js
 *
 * Try to convert a ms value to a human-readable string
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import printf from 'printf';

import { pwixI18n } from 'meteor/pwix:i18n';

export const msToSample = async function( value ){
    const min = 60*1000;
    const hour = 60*min;
    const day = 24*hour;
    if( value < min ){
        return printf( '%.1f %s', value / 1000, pwixI18n.label( I18N, 'helpers.ms_to_sample.second_abbr' ));
    }
    if( value < hour ){
        return printf( '%.1f %s', value / min, pwixI18n.label( I18N, 'helpers.ms_to_sample.minute_abbr' ));
    }
    if( value < day ){
        return printf( '%.1f %s', value / hour, pwixI18n.label( I18N, 'helpers.ms_to_sample.hour_abbr' ));
    }
    return printf( '%.1f %s', value / day, pwixI18n.label( I18N, 'helpers.ms_to_sample.day_abbr' ));
};
