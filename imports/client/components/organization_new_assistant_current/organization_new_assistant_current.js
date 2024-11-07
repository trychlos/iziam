/*
 * /imports/client/components/organization_new_assistant_current/organization_new_assistant_current.js
 *
 *  A sub-template which displays the current choices.
 *
 * Parms:
 * - same than all other panes
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
//import { ClientProfile } from '/imports/common/definitions/organization-profile.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';
import { IdentityAuthMode } from '/imports/common/definitions/identity-auth-mode.def.js';
import { IdentityAccessMode } from '/imports/common/definitions/identity-access-mode.def.js';
import { TokenExtension } from '/imports/common/definitions/token-extension.def.js';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import './organization_new_assistant_current.html';

Template.organization_new_assistant_current.helpers({
    /*
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

    // organization type
    organizationText(){
        return this.parentAPP.entity.get().DYN.records[0].get().organization_type;
    },

    // registered contacts
    contactsText(){
        const contacts = this.parentAPP.entity.get().DYN.records[0].get().contacts || [];
        const emails = contacts.length ? contacts.map(( it ) => { return it.email; }) : null;
        return emails ? emails.join( ', ' ) : pwixI18n.label( I18N, 'organizations.new_assistant.summary_contacts_none' );
    },

    // token extensions
    formatersText(){
        return TokenExtension.joinedLabels( this.parentAPP.entity.get().DYN.records[0].get().token_extensions || [] );
    },

    // grant types
    grantText(){
        return GrantType.joinedLabels( this.parentAPP.entity.get().DYN.records[0].get().grant_types || [] );
    },
    */

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

    /*
    // json web key set
    jwksText(){
        return Jwks.fn.joinedLabels( this.parentAPP.entity.get().DYN.records[0].get().jwks || [] );
    },

    // organization profile description
    profileDescription(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.description( def ) : '';
    },

    // suggested organization type from organization profile
    profileClientText(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.defaultClientType( def ) : '';
    },

    // needed features from organization profile
    profileFeaturesText(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.defaultFeatures( def ).join( ', ' ) : '';
    },

    // organization profile description
    profileText(){
        const id = this.parentAPP.entity.get().DYN.records[0].get().profile;
        const def = id ? ClientProfile.byId( id ) : null;
        return def ? ClientProfile.label( def ) : '';
    },
    */

    // organization contact email
    propContactEmail(){
        return this.parentAPP.entity.get().DYN.records[0].get().contactEmail || '';
    },

    // organization contact url
    propContactUrl(){
        return this.parentAPP.entity.get().DYN.records[0].get().contactUrl || '';
    },

    // organization general terms of use
    propGtu(){
        return this.parentAPP.entity.get().DYN.records[0].get().gtuUrl || '';
    },

    // organization home page
    propHome(){
        return this.parentAPP.entity.get().DYN.records[0].get().homeUrl || '';
    },

    // organization unique label
    propLabel(){
        return this.parentAPP.entity.get().DYN.records[0].get().label || '';
    },

    // organization legal conditions
    propLegals(){
        return this.parentAPP.entity.get().DYN.records[0].get().legalsUrl || '';
    },

    // organization logo url
    propLogo(){
        return this.parentAPP.entity.get().DYN.records[0].get().logoUrl || '';
    },

    // organization personal data management page
    propPdmp(){
        return this.parentAPP.entity.get().DYN.records[0].get().pdmpUrl || '';
    },

    // organization support email
    propSupportEmail(){
        return this.parentAPP.entity.get().DYN.records[0].get().supportEmail || '';
    },

    // organization support url
    propSupportUrl(){
        return this.parentAPP.entity.get().DYN.records[0].get().supportUrl || '';
    },

    // REST API base path
    restText(){
        return this.parentAPP.entity.get().DYN.records[0].get().baseUrl || '';
    }
});
