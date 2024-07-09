/*
 * /imports/common/init/accounts-ui.js
 */

import { AccountsUI } from 'meteor/pwix:accounts-ui';
import { pwixI18n } from 'meteor/pwix:i18n';

// configure the AccountsUI package for production
AccountsUI.configure({
    //informWrongEmail: AccountsUI.C.WrongEmail.ERROR,
    //coloredBorders: AccountsUI.C.Colored.NEVER,
    //onEmailVerifiedBeforeFn: null,
    //onEmailVerifiedBox: true,
    //onEmailVerifiedBoxCb: null,
    //onEmailVerifiedBoxMessage: { namespace: I18N, i18n: 'user.verify_text' },
    //onEmailVerifiedBoxTitle: { namespace: I18N, i18n: 'user.verify_title' },
    //passwordLength: 8,
    //passwordStrength: AccountsUI.C.Password.MEDIUM,
    //passwordTwice: true,
    //resetPasswordTwice: _passwordTwice,
    //resetPwdTextOne: { namespace: I18N, i18n: 'reset_pwd.textOne' },
    //resetPwdTextTwo: '',
    //sendVerificationEmail: true,
    //usernameLength: 4,
    //verbosity: AccountsUI.C.Verbose.CONFIGURE
});

// provides the item to be added to acUserLogin logged/unlogged (client) menus
// please note that the 'click' event are handled at app_layout level
if( Meteor.isClient ){
    Meteor.APP.AccountsUI = {
        loggedItemsAfter(){
            return [
                '<hr class="dropdown-divider" />',
                '<a class="dropdown-item d-flex align-items-center justify-content-start" id="app-roles-item" href="#">'
                    + '<span class="fa-solid fa-fw fa-user-shield"></span>'
                    + '<p>'+pwixI18n.label( I18N, 'header.my_roles' )+'</p>'
                    + '</a>'
            ];
        }
    }
}
