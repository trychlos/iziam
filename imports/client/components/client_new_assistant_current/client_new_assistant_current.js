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
import { ClientNature } from '/imports/common/definitions/client-nature.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_new_assistant_current.html';

Template.client_new_assistant_current.helpers({
    // authentification method
    authText(){
        const def = AuthMethod.byId( this.parentAPP.dataParts.get( 'authMethod' ));
        return def ? AuthMethod.label( def ) : '';
    },

    // registered contacts
    contactsText(){
        return ( this.parentAPP.dataParts.get( 'contacts' ) || [] ).join( ', ' );
    },

    // registered endpoints
    endpointsText(){
        return ( this.parentAPP.dataParts.get( 'endpoints' ) || [] ).join( ', ' );
    },

    // grant types
    grantText(){
        return GrantType.joinedLabels( this.parentAPP.dataParts.get( 'grantTypes' ));
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
        const def = this.parentAPP.dataParts.get( 'natureDefinition' );
        return def ? ClientNature.description( def ) : '';
    },

    // client nature description
    natureText(){
        const def = this.parentAPP.dataParts.get( 'natureDefinition' );
        return def ? ClientNature.label( def ) : '';
    },

    // client description
    propDescription(){
        return this.parentAPP.dataParts.get( 'description' ) || '';
    },

    // client name
    propName(){
        return this.parentAPP.dataParts.get( 'name' );
    },

    // client software description
    propSoftware(){
        const softid = this.parentAPP.dataParts.get( 'softwareId' );
        const softver = this.parentAPP.dataParts.get( 'softwareVersion' );
        return softid || softver ? ( softid || '' ) + ' ' + ( softver || '' ) : '';
    }
});
