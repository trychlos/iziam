/*
 * /imports/client/components/client_new_assistant_current/client_new_assistant_current.js
 *
 *  A sub-template which displays the current choices.
 *
 * Parms:
 * - same than all other panes
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';
import { IdentityAuthMode } from '/imports/common/definitions/identity-auth-mode.def.js';
import { IdentityAccessMode } from '/imports/common/definitions/identity-access-mode.def.js';
import { TokenExtension } from '/imports/common/definitions/token-extension.def.js';

import { Jwks } from '/imports/common/tables/jwks/index.js';

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
    // application type
    applicationText(){
        return this.parentAPP.entity.get().DYN.records[0].get().application_type;
    },

    // authentification method
    authText(){
        const authMethod = this.parentAPP.entity.get().DYN.records[0].get().token_endpoint_auth_method;
        const def = authMethod ? AuthMethod.byId( authMethod ) : null;
        return def ? AuthMethod.label( def ) : '';
    },

    // identities authentification
    authenticationText(){
        const mode = this.parentAPP.entity.get().DYN.records[0].get().identity_auth_mode;
        const def = mode ? IdentityAuthMode.byId( mode ) : null;
        return def ? IdentityAuthMode.label( def ) : '';
    },

    // identities authorization
    authorizationText(){
        const mode = this.parentAPP.entity.get().DYN.records[0].get().identity_access_mode;
        const def = mode ? IdentityAccessMode.byId( mode ) : null;
        return def ? IdentityAccessMode.label( def ) : '';
    },

    // client type
    clientText(){
        return this.parentAPP.entity.get().DYN.records[0].get().client_type;
    },

    // registered contacts
    contactsText(){
        const contacts = this.parentAPP.entity.get().DYN.records[0].get().contacts || [];
        const emails = contacts.length ? contacts.map(( it ) => { return it.email; }) : null;
        return emails ? emails.join( ', ' ) : pwixI18n.label( I18N, 'clients.new_assistant.summary_contacts_none' );
    },

    // token extensions
    formatersText(){
        return TokenExtension.joinedLabels( this.parentAPP.entity.get().DYN.records[0].get().token_extensions || [] );
    },

    // grant types
    grantText(){
        return GrantType.joinedLabels( this.parentAPP.entity.get().DYN.records[0].get().grant_types || [] );
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

    // json web key set
    jwksText(){
        return Jwks.fn.joinedLabels( this.parentAPP.entity.get().DYN.records[0].get().jwks || [] );
    },

    // client profile description
    profileDescription(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.description( def ) : '';
    },

    // suggested client type from client profile
    profileClientText(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.defaultClientType( def ) : '';
    },

    // needed features from client profile
    profileFeaturesText(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.defaultFeatures( def ).join( ', ' ) : '';
    },

    // client profile description
    profileText(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
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
        const selected = this.parentAPP.entity.get().DYN.records[0].get().selectedProviders;
        return selected.join( ', ' ) || pwixI18n.label( I18N, 'clients.new_assistant.summary_providers_none' );
    },

    // registered redirect URLs
    redirectsText(){
        const redirect_uris = this.parentAPP.entity.get().DYN.records[0].get().redirect_uris || [];
        const urls = redirect_uris.length ? redirect_uris.map(( it ) => { return it.url; }) : null;
        return urls ? urls.join( ', ' ) : pwixI18n.label( I18N, 'clients.new_assistant.summary_redirects_none' );
    }
});
