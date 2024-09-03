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
        const def = AuthMethod.byId( this.parentAPP.assistantStatus.get( 'token_endpoint_auth_method' ));
        return def ? AuthMethod.label( def ) : '';
    },

    // client type
    clientText(){
        return this.parentAPP.assistantStatus.get( 'client_type' );
    },

    // registered contacts
    contactsText(){
        return ( this.parentAPP.assistantStatus.get( 'contacts' ) || [] ).join( ', ' );
    },

    // grant types
    grantText(){
        return GrantType.joinedLabels( this.parentAPP.assistantStatus.get( 'grant_types' ));
    },

    // whether we want display the pane ?
    //  also returns false if the pane is disabled
    havePane( pane ){
        let have = this.parentAPP.previousPanes().includes( pane );
        if( have ){
            have &&= ( this.parentAPP.assistantPck.enabledPanes.get( pane ) !== false );
        }
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
        const softid = this.parentAPP.entity.get().DYN.records[0].get().software_id;
        const softver = this.parentAPP.entity.get().DYN.records[0].get().software_version;
        return softid || softver ? ( softid || '' ) + ' ' + ( softver || '' ) : '';
    },

    // selected providers - which may be none
    providersText(){
        const selected = Clients.fn.selectedProviders( this.parentAPP.organization, Template.instance().APP.client );
        return Object.keys( selected ).join( ', ' ) || pwixI18n.label( I18N, 'clients.new_assistant.summary_providers_none' );
    },

    // registered redirect URLs
    redirectsText(){
        const redirect_uris = this.parentAPP.entity.get().DYN.records[0].get().redirect_uris;
        const urls = redirect_uris.map(( it ) => { return it.url; });
        return urls.join( ', ' );
    }
});
