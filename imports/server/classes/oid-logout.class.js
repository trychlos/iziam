/*
 * /imports/server/classes/oid-logout.class.js
 *
 * A class to provide an error page..
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import formPost from 'oidc-provider/lib/response_modes/form_post.js';
import instance from 'oidc-provider/lib/helpers/weak_cache.js';
import redirectUri from 'oidc-provider/lib/helpers/redirect_uri.js';
import revoke from 'oidc-provider/lib/helpers/revoke.js';
import * as ssHandler from 'oidc-provider/lib/helpers/samesite_handler.js';

import { pwixI18n } from 'meteor/pwix:i18n';

import { izObject } from '/imports/common/classes/iz-object.class.js';

export class OIDLogout extends izObject {

    // static data

    // static methods

    // private data

    // instanciation
    #ctx = null;
    #form = null;

    // runtime

    // private methods

    // public data

    /**
     * Constructor
     * @param {Object} ctx
     * @param {String} form
     *  <form id="op.logoutForm" method="post" action="${action}"><input type="hidden" name="xsrf" value="${secret}"/></form>
     * @returns {OIDLogout} this instance
     */
    constructor( ctx, form ){
        super( ...arguments );

        this.#ctx = ctx;
        this.#form = form;

        //console.debug( 'instanciating', this );
        return this;
    }

    /**
     * @summary just re-post the form accepting the logout
     */
    async render(){
        const action = this.#form.replace( /^.*action="/, '' ).replace( /"><input.*$/, '' );
        const secret = this.#form.replace( /^.*value="/, '' ).replace( /"\/\><\/form>.*$/, '' );
        await formPost( this.#ctx, action, {
            xsrf: secret,
            logout: 'yes',
        });
    }
}
