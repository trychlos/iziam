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
                    +'<body class="h-100">\n'
                    +'  <div class="preamble">'
                    +'  </div>'
                    +'  <form class="h-100" autocomplete="off" action="'+route+'" method="post" enctype="application/x-www-form-urlencoded">\n'
                    +'    <input type="hidden" name="prompt" value="login" />\n'
                    +'    <table class="form-table w-100">'
                    +'      <tr>'
                    +'        <td class="ui-w40 ui-right">'
                    +'          <p class="label">'+pwixI18n.label( I18N, 'auth.render.login_label' )+'</p>'
                    +'        </td>'
                    +'        <td class="ui-w60">'
                    +'          <input class="w-75" required type="text" name="login" '
                    +'            placeholder="'+pwixI18n.label( I18N, 'auth.render.login_ph' )+'" '
                    +             ( interaction.params.login_hint ? 'value="'+interaction.params.login_hint+'"' : 'autofocus="on" ' )
                    +'            />\n'
                    +'        </td>'
                    +'      </tr>'
                    +'      <tr>'
                    +'        <td class="ui-w40 ui-right">'
                    +'          <p class="label">'+pwixI18n.label( I18N, 'auth.render.password_label' )+'</p>'
                    +'        </td>'
                    +'        <td class="ui-w60">'
                    +'          <input class="w-75" required type="password" name="password" '
                    +'            placeholder="'+pwixI18n.label( I18N, 'auth.render.password_ph' )+'" '
                    +             ( interaction.params.login_hint ? 'autofocus="on" ' : '' )
                    +'            />\n'
                    +'        </td>'
                    +'      </tr>'
                    +'      <tr>'
                    +'        <td class="w-100 ui-center" colspan="2">'
                    +'          <button type="submit" class="login login-submit btn btn-sm btn-primary">'+pwixI18n.label( I18N, 'auth.render.login_button' )+'</button>\n'
                    +'        </td>'
                    +'      </tr>'
                    +'    </table>'
                    +'  </form>\n'
                    +'</body>\n';
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
        const title = pwixI18n.label( I18N, 'auth.render.'+interaction.prompt.name+'_title', this.iRequestServer().organization().record.label );
        str += '<title>'+title+'</title>';
        str += '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
        str += '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
        str += '<style>'
            +'  @import url(https://fonts.googleapis.com/css?family=Roboto:400,100);body{font-family:Roboto,sans-serif;}.container{padding:0 40px 10px;width:274px;background-color:#F7F7F7;margin:0 auto 10px;border-radius:2px;box-shadow:0 2px 2px rgba(0,0,0,.3);overflow:hidden}pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;margin:0 0 0 1em;text-indent:-1em}'
            +'  form { display: flex; align-items:center; justify-content: center; }'
            +'  tr:not(:first-child) td { padding-top: 1em; }'
            +'  td.ui-w40 { width: 40%; }'
            +'  td.ui-w60 { width: 60%; }'
            +'  td.ui-center { text-align: center; }'
            +'  td.ui-right { text-align: right; }'
            +'  p.label { margin: 0 0.5em 0 0; }'
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
     * @summary Render a dialog box to the user-agent client
     *  GET /iziam/interaction/:uid
     */
    async renderGetInteraction( provider, req, res, next ){
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
     * @summary Render a dialog box to the user-agent client
     *  POST /iziam/interaction/:uid/login
     */
    async renderPostLogin( provider, req, res, next ){
        try {
            console.debug( 'renderPostLogin provider', provider );
            const { express } = WebApp;
            const interaction = await provider.interactionDetails( req, res );
            assert( interaction && interaction.prompt && interaction.prompt.name === 'login', 'expects "login" prompt name, got '+interaction.prompt.name );
            assert( req.body && req.body.prompt === 'login', 'expects "login" prompt name, got '+req.body.prompt );
            const account = await this.iRequestServer().identityServer().findByLogin( req.body.login );
            if( account ){
                console.debug( 'account', account );
                const result = {
                    login: {
                        accountId: account.login,
                    },
                };
                await provider.interactionFinished( req, res, result, { mergeWithLastSubmission: false });
            }

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }
});
