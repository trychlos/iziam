/*
 * /imports/common/init/app-pages.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AppPages } from 'meteor/pwix:app-pages';
import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';

AppPages.configure({
    allowFn: Permissions.isAllowed,
    //allowFn: null,
    classes: [ Meteor.APP.C.layoutTheme, Meteor.APP.C.colorTheme ],
    //classes: [ 't-page' ],
    //menuIcon: 'fa-chevron-right',
    //verbosity: 65535
    //verbosity: AppPages.C.Verbose.CONFIGURE
});

Permissions.set({
    pwix: {
        app_pages: {
            menus: {
                app: {
                    async settings(){
                        return Roles.userIsInRoles( Meteor.userId(), [ 'ACCOUNTS_MANAGER', 'TENANTS_MANAGER', 'PROVIDERS_MANAGER' ] );
                    }
                },
                async managers(){
                    return Roles.userIsInRoles( Meteor.userId(), [ 'ACCOUNTS_MANAGER', 'TENANTS_MANAGER', 'PROVIDERS_MANAGER' ] );
                },
                // this is a per-organization page, so a scoped page
                async organization(){
                    return Roles.userIsInRoles( Meteor.userId(), [ 'ORG_SCOPED_MANAGER' ] );
                }
            }
        }
    }
});

    /**
     * @returns {Boolean} with value=true if the current page is scoped.
     *  A page is said 'scoped':
     *  - if it is qualified with 'wantScope=true' in the display units definition
     *  - or if one of the permissions it requires is itself scoped (qualified as such in the roles hierarchy definition)
     *  - or if the roleAssignment of this role for this user is itself scoped
     */
    /*
    wantScope(){
        if( this.get( 'wantScope' )){
            return true;
        }
        let wantScope = false;
        this.get( 'rolesAccess' ).every(( role ) => {
            if( Roles.isRoleScoped( role )){
                wantScope = true;
                return !wantScope;
            }
        });
        return wantScope;
    }
    */
