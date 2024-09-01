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
import { ClientType } from '/imports/common/definitions/client-type.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';
import { Clients } from '/imports/common/collections/clients/index.js';

import './client_new_assistant_current.html';

Template.client_new_assistant_current.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        client: null
    };

    self.autorun(() => {
        const parentAPP = Template.currentData().parentAPP;
        if( parentAPP ){
            self.APP.client = {
                entity: parentAPP.entity.get(),
                record: parentAPP.entity.get().DYN.records[0].get()
            };
        }
    });
});

Template.client_new_assistant_current.helpers({
    // authentification method
    authText(){
        const def = AuthMethod.byId( this.parentAPP.assistantStatus.get( 'authMethod' ));
        return def ? AuthMethod.label( def ) : '';
    },

    // client type
    clientText(){
        return this.parentAPP.assistantStatus.get( 'clientType' );
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
        const def = this.parentAPP.assistantStatus.get( 'profileDef' );
        return def ? ClientProfile.description( def ) : '';
    },

    // suggested client type from client profile
    profileClientText(){
        return ClientProfile.defaultClientType( this.parentAPP.assistantStatus.get( 'profileDef' ));
    },

    // needed features from client profile
    profileFeaturesText(){
        return ClientProfile.defaultFeatures( this.parentAPP.assistantStatus.get( 'profileDef' )).join( ', ' );
    },

    // client profile description
    profileText(){
        const def = this.parentAPP.assistantStatus.get( 'profileDef' );
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
    },

    // selected providers
    providersText(){
        const selected = Clients.fn.selectedProviders( this.parentAPP.organization, Template.instance().APP.client );
        return Object.keys( selected ).join( ', ' );
    }
});
