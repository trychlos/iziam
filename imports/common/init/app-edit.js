/*
 * /imports/common/init/app-edit.js
 */

import { AppEdit } from 'meteor/pwix:app-edit';
import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';

AppEdit.configure({
    allowFn: Permissions.isAllowed,
    //allowFn: null,
    //collection: 'contents',
    //toggleHiddenWhenNotConnected: true,
    //toggleHiddenWhenUnallowed: true,
    //verbosity: AppEdit.C.Verbose.CONFIGURE
});

Permissions.set({
    pwix: {
        app_edit: {
            feat: {
                // whether the current user is allowed to edit the current document in the current environment
                async editable(){
                    const user = Meteor.userId();
                    let allowed = false;
                    if( user ){
                        const page = Meteor.APP.runContext.ipageablePage();
                        let wantSwitch = page.get( 'wantEditionSwitch' );
                        if( wantSwitch ){
                            const settings = Meteor.settings.public[Meteor.APP.name].environment;
                            wantSwitch &&= settings.wantEditionSwitch;
                        }
                        if( wantSwitch ){
                            const roles = page.get( 'wantEditionRoles' );
                            if( roles && roles.length ){
                                allowed = await Roles.userIsInRoles( user, roles );
                            }
                        }
                    }
                    return allowed;
                }
            }
        }
    }
});
