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
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';

import './jwk_keyspair_pane.html';

Template.jwk_keyspair_pane.onCreated( function(){
    const self = this;

    self.APP = {
        // the Tabbed instance
        tabbed: new ReactiveVar( null )
    };

    // instanciates the Tabbed component
    self.autorun(() => {
        self.APP.tabbed.set( new Tabbed.Instance( self, new ReactiveVar({
            name: 'jwk_keyspair_pane',
            tabs: [
                {
                    name: 'jwk_private_pane',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.private_tab_title' ),
                    paneTemplate: 'jwk_private_pane'
                },
                {
                    name: 'jwk_public_pane',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.public_tab_title' ),
                    paneTemplate: 'jwk_public_pane'
                }
            ]
        })));
    });
});
