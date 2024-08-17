/*
 * /imports/client/components/client_new_assistant_current/client_new_assistant_current.js
 *
 *  A sub-template which displays the current choices.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_new_assistant_current.html';

Template.client_new_assistant_current.onCreated( function(){
    //console.debug( this );
});

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

    // required features from client profile
    featuresText(){
        return ClientProfile.defaultFeatures( this.parentAPP.assistantStatus.get( 'profileDefinition' )).join( ', ' );
    },

    // grant types
    grantText(){
        return GrantType.joinedLabels( this.parentAPP.assistantStatus.get( 'grantTypes' ));
    },

    // whether we want display the pane ?
    havePane( pane ){
        const have = this.parentAPP.previousPanes().includes( pane );
        //console.debug( 'havePane', pane, have );
        return have;
    },

    // whether we have any summary ?
    haveSummary(){
        const array = this.parentAPP.previousPanes();
        return array.length > 1;
    },

    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // client profile description
    profileDescription(){
        const def = this.parentAPP.assistantStatus.get( 'profileDefinition' );
        return def ? ClientProfile.description( def ) : '';
    },

    // client profile description
    profileText(){
        const def = this.parentAPP.assistantStatus.get( 'profileDefinition' );
        return def ? ClientProfile.label( def ) : '';
    },

    // client description
    propDescription(){
        return this.parentAPP.entity.get().DYN.records[0].get().description || '';
    },

    // client name
    propName(){
        return this.parentAPP.entity.get().DYN.records[0].get().label || '';
    },

    // client software description
    propSoftware(){
        const softid = this.parentAPP.entity.get().DYN.records[0].get().softwareId;
        const softver = this.parentAPP.entity.get().DYN.records[0].get().softwareVersion;
        return softid || softver ? ( softid || '' ) + ' ' + ( softver || '' ) : '';
    }
});
