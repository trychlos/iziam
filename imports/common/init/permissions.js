/*
 * /imports/common/init/permissions.js
 *
 * Manage the permissions of a user.
 * 
 * Permissions are managed per task.
 * For each terminal node, the permission can be specified as: 
 * - an async function with proto: async fn( user<String|Object> ): Boolean
 * - a role name or a list of role names which are or-ed
 */

import _ from 'lodash';

import { Roles } from 'meteor/pwix:roles';

Meteor.APP.Permissions = {
    tasks: {
        // the permissions needed to have an item in the specified menu
        menus: {
            app: {
                // application settings
                async settings( user ){
                    return await Roles.userIsInRoles( user, Meteor.APP.C.appAdmin );
                }
            },
            async managers( user ){
                return await Roles.userIsInRoles( user, [ 'ACCOUNTS_MANAGER', 'TENANTS_MANAGER' ]);
        }
        }
    },

    /**
     * @param {String} task can be dot.named 
     * @param {Object|String} user either a user identifier or a user document, mandatory server side, defaulting client side to current user
     * @returns {Boolean} whether the user is allowed to do that
     */
    async isAllowed( task, user=null ){
        if( Meteor.isClient && !user ){
            user = Meteor.userId();
        }
        let allowed = false;
        if( user ){
            // find the task
            const words = task.split( '.' );
            let taskobj = Meteor.APP.Permissions.tasks;
            let promises = [];
            words.every(( it ) => {
                let iter = false;
                if( taskobj[it] ){
                    if( _.isFunction( taskobj[it] )){
                        promises.push( taskobj[it]( user ));
                    } else if( _.isString( taskobj[it] )){
                        promises.push( Roles.userIsInRoles( user, taskobj[it] ));
                    } else if( _.isArray( taskobj[it] )){
                        promises.push( Roles.userIsInRoles( user, taskobj[it] ));
                    } else if( _.isObject( taskobj[it] )){
                        taskobj = taskobj[it];
                        iter = true;
                    } else {
                        console.error( 'unmanaged task definition', taskobj[it] );
                    }
                } else {
                    console.error( 'task not defined', task );
                }
                return iter;
            });
            const res = await Promise.allSettled( promises );
            allowed = res[0].value;
        } else {
            console.warn( 'user is not provided, considering allowed=false ('+task+')' );
        }
        //console.debug( 'isAllowed', task, user, allowed );
        return allowed;
    }
};
