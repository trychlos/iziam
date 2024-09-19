/*
 * /imports/client/components/jwk_keyspair_pane/jwk_keyspair_pane.js
 *
 * Display the symmetric secret object
 *
 * Parms:
 * - organization: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabbed } from 'meteor/pwix:tabbed';

import './jwk_keyspair_pane.html';

Template.jwk_keyspair_pane.onCreated( function(){
    const self = this;

    self.APP = {
        // the Tabbed instance
        tabbed: new Tabbed.Instance( self, { name: 'jwk_keyspair_pane' })
    };

    // instanciates the Tabbed component
    self.autorun(() => {
        self.APP.tabbed.setDataContext({
            dataContext: Template.currentData(),
            tabs: [
                {
                    name: 'jwk_private_jwk_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.private_jwk_tab_title' ),
                    paneTemplate: 'jwk_private_jwk_pane'
                },
                {
                    name: 'jwk_private_pkcs8_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.private_pkcs8_tab_title' ),
                    paneTemplate: 'jwk_private_pkcs8_pane'
                },
                {
                    name: 'jwk_public_jwk_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.public_jwk_tab_title' ),
                    paneTemplate: 'jwk_public_jwk_pane'
                },
                {
                    name: 'jwk_public_spki_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.public_spki_tab_title' ),
                    paneTemplate: 'jwk_public_spki_pane'
                }
            ]
        });
    });
});
