/*
 * /imports/client/components/client_new_assistant_current/client_new_assistant_current.js
 *
 *  A sub-template which displays the current choices.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 * - display: an array of the page names to be displayed here
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_new_assistant_current.html';

Template.client_new_assistant_current.helpers({
    // authentification method
    authText(){
        const def = AuthMethod.byId( this.parentAPP.assistantStatus.get( 'authMethod' ));
        return def ? AuthMethod.label( def ) : '';
    },

    // registered contacts
    contactsText(){
        return ( this.parentAPP.assistantStatus.get( 'contacts' ) || [] ).join( ', ' );
    },

    // registered endpoints
    endpointsText(){
        return ( this.parentAPP.assistantStatus.get( 'endpoints' ) || [] ).join( ', ' );
    },

    // grant types
    grantText(){
        return GrantType.joinedLabels( this.parentAPP.assistantStatus.get( 'grantTypes' ));
    },

    // whether we want display the pane ?
    havePane( pane ){
        return ( this.display || [] ).includes( pane );
    },

    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // client nature description
    natureDescription(){
        const def = this.parentAPP.assistantStatus.get( 'profileDefinition' );
        return def ? ClientNature.description( def ) : '';
    },

    // client nature description
    natureText(){
        const def = this.parentAPP.assistantStatus.get( 'profileDefinition' );
        return def ? ClientNature.label( def ) : '';
    },

    // client description
    propDescription(){
        return this.parentAPP.assistantStatus.get( 'description' ) || '';
    },

    // client name
    propName(){
        return this.parentAPP.assistantStatus.get( 'name' );
    },

    // client software description
    propSoftware(){
        const softid = this.parentAPP.assistantStatus.get( 'softwareId' );
        const softver = this.parentAPP.assistantStatus.get( 'softwareVersion' );
        return softid || softver ? ( softid || '' ) + ' ' + ( softver || '' ) : '';
    }
});
