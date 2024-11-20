/*
 * /imports/common/helpers/operational.js
 *
 * Check for operational status and compute the to-be-displayed result.
 * 
 * This is used both by the organization and by the client.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import printf from 'printf';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';
import { Validity } from 'meteor/pwix:validity';

export const Operational = {

    // counts the registered TypedMessage's
    _counts( item ){
        item.DYN.operational.errswarns = [];
        item.DYN.operational.results.forEach(( it ) => {
            switch( it.iTypedMessageLevel()){
                // all critical, urgent and alerts are counted as errors
                case TM.MessageLevel.C.EMERG:
                case TM.MessageLevel.C.ALERT:
                case TM.MessageLevel.C.CRIT:
                case TM.MessageLevel.C.ERR:
                case TM.MessageLevel.C.ERROR:
                    item.DYN.operational.errors += 1;
                    item.DYN.operational.errswarns.push( it.iTypedMessageMessage());
                    break;
                case TM.MessageLevel.C.WARNING:
                    item.DYN.operational.warnings += 1;
                    item.DYN.operational.errswarns.push( it.iTypedMessageMessage());
                    break;
                case TM.MessageLevel.C.NOTICE:
                    item.DYN.operational.notices += 1;
                    break;
                case TM.MessageLevel.C.LOG:
                case TM.MessageLevel.C.INFO:
                case TM.MessageLevel.C.DEBUG:
                    item.DYN.operational.infos += 1;
                    break;
            }
        });
    },

    // dump the message which are errors or warnings
    _dumpResults( item ){
        return item.DYN.operational.errswarns;
    },

    // make sure we only have unique messages
    _filter( array ){
        let hash = {};
        let res = [];
        array.forEach(( it ) => {
            const key = it.iTypedMessageLevel()+it.iTypedMessageMessage();
            if( !hash[key] ){
                hash[key] = true;
                res.push( it );
            }
        });
        return res;
    },

    /**
     * 
     */
    async check(){
        
    },

    /**
     * @locus Anywhere
     * @summary Install in item.DYN an 'operational' object with following keys:
     *  - results: an array of TypedMessage's, maybe empty
     *  - status: a ReactiveVar which contains the global check status
     *  - errors: count of errors
     *  - warnings: count of warnings
     *  - notices: count of notices
     *  - infos: count of infos
     *  
     * @param {Object} item as a full entity object with its DYN sub-object
     * @param {Function} checkFn the function to be called to check the item
     */
    async setup( item, checkFn ){
        item.DYN = item.DYN || {};
        if( !item.DYN.operational ){
            item.DYN.operational = {
                results: [],
                status: new ReactiveVar( Forms.FieldStatus.C.NONE ),
                errors: 0,
                warnings: 0,
                notices: 0,
                infos: 0
            };
        }
        let entity = { ...item };
        delete entity.DYN;
        let atdate = false;
        let checkable = Validity.atDateByRecords( item.DYN.records );
        if( checkable ){
            atdate = true;
        } else {
            checkable = item.DYN.closest;
        }
        if( checkable ){
            let res = await checkFn({ entity: entity, record: checkable });
            if( res ){
                res = _.isArray( res ) ? res : [ res ];
            } else {
                res = [];
            }
            // sort and filter unique messages
            res = Operational._filter( res );
            // have a preamble
            res.unshift( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, atdate ? 'operational.checks.atdate_preamble' : 'operational.checks.closest_preamble' )
            }));
            // have a conclusion
            res.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, atdate ? 'operational.checks.atdate_done' : 'operational.checks.closest_done' )
            }));
            item.DYN.operational.results = res;
            // have counters
            Operational._counts( item );
            item.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'operational.checks.counts', item.DYN.operational.errors, item.DYN.operational.warnings )
            }));
            // have a global status
            if( Meteor.isClient ){
                if( atdate ){
                    const total = item.DYN.operational.errors + item.DYN.operational.warnings;
                    item.DYN.operational.status.set( total ? Forms.FieldStatus.C.UNCOMPLETE : Forms.FieldStatus.C.VALID );
                } else {
                    item.DYN.operational.status.set( Forms.FieldStatus.C.INVALID );
                }
            }
            //console.debug( 'checkable', checkable.label, item.DYN.operational.errors, item.DYN.operational.warnings, Operational._dumpResults( item ));
        } else {
            item.DYN.operational.results.push( new TM.TypedMessage({
                level: TM.MessageLevel.C.INFO,
                message: pwixI18n.label( I18N, 'operational.checks.checkable_unset' )
            }));
        }
    }
};
