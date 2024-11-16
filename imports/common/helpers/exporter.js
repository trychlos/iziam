/*
 * /imports/common/helpers/exporter.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tolert } from 'meteor/pwix:tolert';

export const Exporter = {

    /**
     * @param {Object} entity the entity with its DYN sub-object
     * @param {Object} opts an optional options object to be passed to the filePicker
     */
    async run( entity, opts={} ){
        try {
            if( !opts.types ){
                opts.types = [
                    {
                        description: pwixI18n.label( I18N, 'exporter.types.json_description' ),
                        accept: {
                            'application/json': [ '.json' ]
                        }
                    }
                ];
            }
            const handle = await window.showSaveFilePicker( opts );
            const stream = await handle.createWritable();
            let o = { ...entity };
            o.records = o.DYN.records;
            delete o.DYN;
            await stream.write( JSON.stringify( o, null, 2 ), 'utf8' );
            await stream.close();
            Tolert.success( pwixI18n.label( I18N, 'exporter.result.success', handle.name ));
        } catch( e ){
            // ignore
            Tolert.error( e );
        }
    }
};
