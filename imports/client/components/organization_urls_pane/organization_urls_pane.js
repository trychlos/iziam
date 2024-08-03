/*
 * pwix:tenants-manager/src/client/components/organization_urls_pane/organization_urls_pane.js
 *
 * Parms:
 * - see README
 */

import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tolert } from 'meteor/pwix:tolert';

import './organization_urls_pane.html';

Template.organization_urls_pane.onCreated( function(){
    const self = this;

    self.APP = {
    };

    self.autorun(() => {
    });
});

Template.organization_urls_pane.helpers({
    // whether the current user has the permission to see the list of tenants
    canList(){
        return true;
        const res = TenantsManager.isAllowed( 'pwix.tenants_manager.pub.list_all' );
        //console.debug( 'res', res );
        return res;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
