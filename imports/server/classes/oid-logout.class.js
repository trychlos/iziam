/*
 * /imports/server/classes/oid-logout.class.js
 *
 * A class to provide an error page..
 */

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

    // from https://github.com/panva/node-oidc-provider/blob/47a77d9afe90578ea4dfed554994b60b837a3059/lib/models/session.js
    // from https://github.com/panva/node-oidc-provider/blob/47a77d9afe90578ea4dfed554994b60b837a3059/lib/actions/end_session.js#L76
    // pwi 2024-10-11 don't know why this is not called by oidc-provider :()
    static async endSession( provider, ctx, next ){
        //const { oidc: { session, params } } = ctx;
        //const { state } = session;

        const session = await provider.Session.get( ctx );
        console.debug( 'session', session );

        const { state } = session;
        console.debug( 'state', state );

        const {
            features: { backchannelLogout },
            cookies: { long: opts },
        } = instance( provider ).configuration();
        console.debug( 'opts', opts );

        if (backchannelLogout.enabled) {
            const clientIds = Object.keys(session.authorizations || {});
            const back = [];
            for (const clientId of clientIds) {
                if (params.logout || clientId === state.clientId) {
                    const client = await provider.Client.find(clientId);
                    if (client) {
                    const sid = session.sidFor(client.clientId);
                    if (client.backchannelLogoutUri) {
                        const { accountId } = session;
                        back.push(client.backchannelLogout(accountId, sid)
                        .then(() => {
                            provider.emit('backchannel.success', ctx, client, accountId, sid);
                        }, (err) => {
                            provider.emit('backchannel.error', ctx, err, client, accountId, sid);
                        }));
                    }
                    }
                }
            }
            await Promise.all(back);
        }

        // this is not supposed to be here in pre-middleware
        ctx.oidc = provider;
        ctx.oidc.cookies = provider.app.createContext(ctx.req, ctx.res).cookies;
        ctx.oidc.provider = provider;
        let params = { logout: true };

        if (state?.clientId) {
            //ctx.oidc.entity('Client', await provider.Client.find(state.clientId));
            ctx.oidc.client = await provider.Client.find(state.clientId);
            console.debug( 'client', ctx.oidc.client );
        }

        // wants both session destroy and grant revocation
        //if (params.logout) {
        if( true ){
            if (session.authorizations) {
                await Promise.all(
                    Object.entries(session.authorizations).map(async ([clientId, { grantId }]) => {
                    // Drop the grants without offline_access
                    // Note: tokens that don't get dropped due to offline_access having being added
                    // later will still not work, as such they will be orphaned until their TTL hits
                    if (grantId && !session.authorizationFor(clientId).persistsLogout) {
                        await revoke(ctx, grantId);
                    }
                    }),
                );
            }

            await session.destroy();

            ssHandler.set(
            ctx.oidc.cookies,
            provider.cookieName('session'),
            null,
            opts,
            );
        } // else if (state.clientId) {
            if (state?.clientId) {
                const grantId = session.grantIdFor(state.clientId);
                if (grantId && !session.authorizationFor(state.clientId).persistsLogout) {
                await revoke(ctx, grantId);
                provider.emit('grant.revoked', ctx, grantId);
            }
            session.state = undefined;
            if (session.authorizations && state?.clientId ) {
                delete session.authorizations[state.clientId];
            }
            session.resetIdentifier();
        }

        const usePostLogoutUri = state?.postLogoutRedirectUri;
        const forwardClientId = !usePostLogoutUri && !params.logout && state?.clientId;
        const uri = redirectUri(
            usePostLogoutUri ? state.postLogoutRedirectUri : ctx.oidc.urlFor('end_session_success'),
            {
            ...(usePostLogoutUri && state?.state != null
                ? { state: state?.state } : undefined), // != intended
            ...(forwardClientId ? { client_id: state?.clientId } : undefined),
            },
        );
        console.debug( 'uri', uri );

        provider.emit('end_session.success', ctx);

        ctx.status = 303;
        ctx.redirect(uri);
        await next();
    }

    // private data

    // instanciation
    #ctx = null;
    #form = null;

    // runtime

    // private methods

    // returns the body
    _renderBody( form ){
        let str = ''
            +'<body>'
            +'  <div class="container">'
            +'    <h1>'+pwixI18n.label( I18N, 'auth.logout.form_title' )+'</h1>'
            +     form
            +'    <button autofocus type="submit" form="op.logoutForm" value="yes" name="logout">'+pwixI18n.label( I18N, 'auth.logout.ok_button' )+'</button>'
            +'    <button type="submit" form="op.logoutForm">'+pwixI18n.label( I18N, 'auth.logout.cancel_button' )+'/button>'
            +'  </div>'
            +'</body>';
        return str;
    }

    // returns the head
    _renderHead( form ){
        let str = ''
            +'<head>'
            +'  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
            +'  <meta charset="utf-8">'
            +'  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
            +'  <title>'+pwixI18n.label( I18N, 'auth.logout.dialog_title' )+'</title>'
            +'  <style>'
            +'    @import url(https://fonts.googleapis.com/css?family=Roboto:400,100);body{font-family:Roboto,sans-serif;margin-top:25px;margin-bottom:25px}.container{padding:0 40px 10px;width:274px;background-color:#F7F7F7;margin:0 auto 10px;border-radius:2px;box-shadow:0 2px 2px rgba(0,0,0,.3);overflow:hidden}pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;margin:0 0 0 1em;text-indent:-1em}'
            +'    .header .row { display: flex; flex-direction: row; justify-content: space-around; align-items: center; }'
            +'    h1 { margin: 0; font-size: 3em; }'
            +'  </style>'
            +'</head>';
        return str;
    }

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

        return this;
    }

    /**
     * @returns {String} the HTML output
     */
    render0(){
        let html = '<!DOCTYPE html>'
            +'<html>'
            + this._renderHead( this.#form )
            + this._renderBody( this.#form )
            + '</html>';
        console.debug( 'html', html );
        return html;
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
