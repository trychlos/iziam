/*
 * /imports/common/collections/groups/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from '/imports/common/collections/identities/index.js';

import { Groups } from './index.js';

Groups.fn = {

    /**
     * @summary Setup dynamic vars for the UI
     * @locus Anywhere
     * @param {Identity} group
     */
    dyn( group ){
        if( !group.DYN ){
            group.DYN = {};
        }
        if( !group.DYN.members ){
            group.DYN.members = [];
        }
        if( !group.DYN.membership ){
            group.DYN.membership = [];
        }
        // members can be groups or identities
        //  but identities names are built as a Promise which resolves to a Reactive Var
        if( !group.DYN.memberNames ){
            group.DYN.memberNames = new ReactiveVar( [] );
        }
        let promises = [];
        let names = [];
        group.DYN.members.every(( doc ) => {
            if( doc.type === 'G' ){
                promises.push( Promise.resolve( doc.o.name ));
            } else {
                promises.push( Identities.fn.name( doc.o ));
            }
            return true;
        });
        Promise.allSettled( promises ).then(( results ) => {
            results.forEach(( res ) => {
                names.push( res.value );
            });
        });
        group.DYN.memberNames.set( names );
        // membership group names
        group.DYN.groupNames = group.DYN.membership.map( doc => doc.o.name );
    },
};
