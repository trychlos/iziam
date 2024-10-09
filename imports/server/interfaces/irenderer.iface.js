/*
 * /imports/server/interfaces/irenderer.iface.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';
const { inspect } = require( 'util' );
import querystring from 'querystring';

import { pwixI18n } from 'meteor/pwix:i18n';

const keys = new Set();
const debug = ( obj ) => querystring.stringify( Object.entries( obj ).reduce(( acc, [ key, value ]) => {
    keys.add( key );
    if( _.isEmpty( value )) return acc;
    acc[key] = inspect( value, { depth: null });
    return acc;
}, {}), '<br/>', ': ', {
    encodeURIComponent( value ){ return keys.has( value ) ? `<strong>${value}</strong>` : value; }
});

export const IRenderer = DeclareMixin(( superclass ) => class extends superclass {

    _renderBody( req, res, provider, interaction, client ){
        let str = '';
        switch( interaction.prompt.name ){
            case 'login':
                let route;
                try {
                    const url = new URL( interaction.returnTo );
                    route = url.origin + this.iRequestServer().organization().record.baseUrl + Meteor.APP.C.oidcInteractionPath + '/' + interaction.uid + '/login';
                } catch( e ){
                    console.error( e );
                    next( e, req, res, next );
                }
                str += ''
                    +'<body class="h-100">'
                    +'  <div class="preamble">'
                    +'  </div>'
                    +'  <form class="h-100" autocomplete="off" action="'+route+'" method="post" enctype="application/x-www-form-urlencoded">'
                    +'    <input type="hidden" name="prompt" value="login" />'
                    +'    <table class="form-table w-100">'
                    +'      <tr>'
                    +'        <td class="ui-w40 ui-right">'
                    +'          <p class="form-label label">'+pwixI18n.label( I18N, 'auth.interactions.login_label' )+'</p>'
                    +'        </td>'
                    +'        <td class="ui-w60">'
                    +'          <input class="form-control w-75" required type="text" name="login" '
                    +'            placeholder="'+pwixI18n.label( I18N, 'auth.interactions.login_ph' )+'" '
                    +             ( interaction.params.login_hint ? 'value="'+interaction.params.login_hint+'"' : 'autofocus="on" ' )
                    +'            />'
                    +'        </td>'
                    +'      </tr>'
                    +'      <tr>'
                    +'        <td class="ui-w40 ui-right">'
                    +'          <p class="form-label label">'+pwixI18n.label( I18N, 'auth.interactions.password_label' )+'</p>'
                    +'        </td>'
                    +'        <td class="ui-w60">'
                    +'          <input class="form-control w-75" required type="password" name="password" '
                    +'            placeholder="'+pwixI18n.label( I18N, 'auth.interactions.password_ph' )+'" '
                    +             ( interaction.params.login_hint ? 'autofocus="on" ' : '' )
                    +'            />'
                    +'        </td>'
                    +'      </tr>'
                    +'      <tr>'
                    +'        <td class="w-100 ui-center" colspan="2">'
                    +'          <button type="submit" class="login login-submit btn btn-sm btn-primary">'+pwixI18n.label( I18N, 'auth.interactions.login_button' )+'</button>'
                    +'        </td>'
                    +'      </tr>'
                    +'    </table>'
                    +'  </form>'
                    +'</body>';
                break;
            case 'consent':
                break;
            default:
                res.status( 501 ).send( 'Not implemented.' );
        }
        return str;
    }

    _renderHead( req, res, provider, interaction, client ){
        let str = '<head>';
        str += '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
        str += '<meta charset="utf-8">';
        str += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
        // may be 'consent' or 'login'
        const title = pwixI18n.label( I18N, 'auth.interactions.'+interaction.prompt.name+'_title', this.iRequestServer().organization().record.label );
        str += '<title>'+title+'</title>';
        str += '<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">';
        str += '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
        str += '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
        str += '<style>'
            +'  body {'
            +'    font-family: "Josefin Sans", sans-serif;'
            +'    font-optical-sizing: auto;'
            +'    font-weight: <weight>;'
            +'    font-style: normal;'
            +'  }'
            +'  form { display: flex; align-items:center; justify-content: center; }'
            +'  tr:not(:first-child) td { padding-top: 1em; }'
            +'  td.ui-w40 { width: 40%; }'
            +'  td.ui-w60 { width: 60%; }'
            +'  td.ui-center { text-align: center; }'
            +'  td.ui-right { text-align: right; }'
            +'  p.label { margin: 0 0.5em 0 0; white-space: nowrap; }'
            +'</style>';
        str += '</head>';
        return str;
    }

    /**
     * @returns {IRenderer}
     */
    constructor(){
        super( ...arguments );
        return this;
    }

    /**
     * @summary ?
     *  GET /iziam/interaction/:uid/abort
     */
    async renderGetAbort( provider, req, res, next ){
        try {
            console.debug( 'renderGetAbort' );

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary Render a dialog box to the user-agent client
     *  GET /iziam/interaction/:uid
     */
    async renderGetLogin( provider, req, res, next ){
        console.debug( 'renderGetLogin' );
        try {
            const interaction = await provider.interactionDetails( req, res );
            const client = await provider.Client.find( interaction.params.client_id );
            let html = '<!DOCTYPE html>'
                +'<html class="h-100">';
            html += this._renderHead( req, res, provider, interaction, client );
            html += this._renderBody( req, res, provider, interaction, client );
            html += '</html>';
            return res.send( html );

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary ?
     *  POST /iziam/interaction/:uid/confirm
     */
    async renderPostConfirm( provider, req, res, next ){
        try {
            console.debug( 'renderPostConfirm' );

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary Interpret the login dialog box
     *  POST /iziam/interaction/:uid/login
     */
    async renderPostLogin( provider, req, res, next ){
        console.debug( 'renderPostLogin' );
        try {
            //console.debug( 'renderPostLogin provider', provider );
            assert( req.body && req.body.prompt === 'login', 'expects "login" prompt name, got '+req.body.prompt );
            const account = await this.iRequestServer().identityServer().findByLogin( req.body.login );
            if( account ){
                const result = {
                    login: {
                        accountId: account.login,
                        acr: Meteor.APP.C.oidcEndUserPasswordAcr
                    },
                };
                await provider.interactionFinished( req, res, result, { mergeWithLastSubmission: false });
            }

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary Try to handle interactions from inside the OIDC pre-middleware
     */
    async renderTryInteractions( provider, ctx, next ){
        // depends of whether we handle scoped requests with the full url or the url without the baseUrl
        const haveBaseUrl = true;
        const interactionPath = Meteor.APP.C.oidcInteractionPath.substring( 1 ); // remove leading slash
        const baseUrl = this.iRequestServer().organization().record.baseUrl.substring( 1 );

        if( ctx.method === 'GET' ){
            const words = ctx.path.split( '/' );

            if(( haveBaseUrl && words[1] === baseUrl && words[2] === interactionPath ) ||
                ( !haveBaseUrl && words[1] === interactionPath )){

                if(( haveBaseUrl && words.length === 4 ) || ( !haveBaseUrl && words.length === 3 )){
                    // GET /iziam/interaction/:uid
                    await this.renderGetLogin( provider, ctx.req, ctx.res, next );

                } else if(( haveBaseUrl && words.length === 5 && words[4] === 'abort' ) || ( !haveBaseUrl && words.length === 4 && words[3] === 'abort' )){
                    // GET /iziam/interaction/:uid/abort
                    await this.renderGetAbort( provider, ctx.req, ctx.res, next );
                }
            }
        } else if( ctx.method === 'POST' ){
            const words = ctx.path.split( '/' );

            if(( haveBaseUrl && words[1] === baseUrl && words[2] === interactionPath ) ||
                ( !haveBaseUrl && words[1] === interactionPath )){

                if(( haveBaseUrl && words.length === 5 && words[4] === 'login' ) || ( !haveBaseUrl && words.length === 4 && words[3] === 'login' )){
                    // POST /iziam/interaction/:uid/login
                    await this.renderPostLogin( provider, ctx.req, ctx.res, next );

                } else if(( haveBaseUrl && words.length === 4 && words[4] === 'confirm' ) || ( !haveBaseUrl && words.length === 4 && words[3] === 'confirm' )){
                    // POST /iziam/interaction/:uid/confirm
                    await this.renderPostConfirm( provider, ctx.req, ctx.res, next );
                }
            }
        }
    }
});
