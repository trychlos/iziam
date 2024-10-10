/*
 * /imports/server/interfaces/iinteractions.iface.js
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

export const IOIDInteractions = DeclareMixin(( superclass ) => class extends superclass {

    _renderBody( req, res, provider, interaction, client ){
        let str = '';
        switch( interaction.prompt.name ){
            case 'login':
                str = this._renderBodyLogin( req, res, provider, interaction, client );
                break;
            case 'consent':
                str = this._renderBodyConsent( req, res, provider, interaction, client );
                break;
            default:
                res.status( 501 ).send( 'Not implemented.' );
        }
        return str;
    }

    _renderBodyConsent( req, res, provider, interaction, client ){
        let route, cancel;
        try {
            const url = new URL( interaction.returnTo );
            route = url.origin + this.iRequestServer().organization().record.baseUrl + Meteor.APP.C.oidcInteractionPath + '/' + interaction.uid + '/confirm';
            cancel = url.origin + this.iRequestServer().organization().record.baseUrl + Meteor.APP.C.oidcInteractionPath + '/' + interaction.uid + '/cancel';
        } catch( e ){
            console.error( e );
            next( e, req, res, next );
        }
        let str = ''
            +'<body>'
            + this._renderPreamble( req, res, provider, interaction, client );
        // https://github.com/panva/node-oidc-provider/blob/47a77d9afe90578ea4dfed554994b60b837a3059/lib/views/interaction.js#L6
        console.debug( 'interaction.details', interaction.details );
        console.debug( '[ interaction.details.missingOIDCScope, interaction.details.missingOIDCClaims, interaction.details.missingResourceScopes, interaction.details.rar].filter( Boolean )', [ interaction.details?.missingOIDCScope, interaction.details?.missingOIDCClaims, interaction.details?.missingResourceScopes, interaction.details?.rar].filter( Boolean ));
        if([ interaction.details?.missingOIDCScope, interaction.details?.missingOIDCClaims, interaction.details?.missingResourceScopes, interaction.details?.rar].filter( Boolean ).length > 0 ){
            str += '<ul>';
            let missingOIDCScope = new Set( interaction.details?.missingOIDCScope );
            missingOIDCScope.delete( 'openid' );
            missingOIDCScope.delete( 'offline_access' );
            if( missingOIDCScope.size ){
                str += '<li>'+pwixI18n.label( I18N, 'auth.interactions.scopes_title' )+'</li>';
                str += '<ul>';
                missingOIDCScope.forEach(( it ) => {
                    str += '<li>'+it+'</li>';
                });
                str += '</ul>';
            }
            let missingOIDCClaims = new Set( interaction.details?.missingOIDCClaims );
            [ 'sub', 'sid', 'auth_time', 'acr', 'amr', 'iss' ].forEach( Set.prototype.delete.bind( missingOIDCClaims ));
            if( missingOIDCClaims.size ){
                str += '<li>'+pwixI18n.label( I18N, 'auth.interactions.claims_title' )+'</li>';
                str += '<ul>';
                missingOIDCClaims.forEach(( it ) => {
                    str += '<li>'+it+'</li>';
                });
                str += '</ul>';
            }
            let missingResourceScopes = interaction.details?.missingResourceScopes;
            if( missingResourceScopes ){
                for( const [ indicator, scopes ] of Object.entries( missingResourceScopes )){
                    str += '<li>'+indicator+' :</li>';
                    str += '<ul>';
                    scopes.forEach(( it ) => {
                        str += '<li>'+it+'</li>';
                    });
                    str += '</ul>';
                }
            }
            let rar = interaction.details?.rar;
            if( rar ){
                str += '<li>'+pwixI18n.label( I18N, 'auth.interactions.rar_title' )+'</li>';
                str += '<ul>';
                for( const { type, ...detail } of rar ){
                    str += '<li><pre>'+JSON.stringify({ type, ...detail }, null, 4 )+'</pre></li>';
                }
                str += '</ul>';
            }
            if( interaction.params?.scope && interaction.params?.scope.includes( 'offline_access' )){
                const already_granted = (( !interaction.details?.missingOIDCScope ) || !interaction.details?.missingOIDCScope.includes( 'offline_access' ));
                str += '<li>'+pwixI18n.label( I18N, already_granted ? 'auth.interactions.offline_already' : 'auth.interactions.offline_togrant' )+'</li>';
            }
            str += '</ul>';
        } else {
            str += '<div class="no-grant">'+pwixI18n.label( I18N, 'auth.interactions.none_grant' )+'</div>';
        }
        str += ''
            +'  <form autocomplete="off" action="'+route+'" method="post">'
            +'    <input type="hidden" name="prompt" value="consent" />'
            +'    <button type="submit" class="login login-submit btn btn-sm btn-primary">'+pwixI18n.label( I18N, 'auth.interactions.consent_button' )+'</button>'
            +'  </form>'
            +'</body>';
        return str;
    }

    _renderBodyLogin( req, res, provider, interaction, client ){
        console.debug( 'interaction', interaction );
        console.debug( 'client', client );
        let route, cancel;
        try {
            const url = new URL( interaction.returnTo );
            route = url.origin + this.iRequestServer().organization().record.baseUrl + Meteor.APP.C.oidcInteractionPath + '/' + interaction.uid + '/login';
            cancel = url.origin + this.iRequestServer().organization().record.baseUrl + Meteor.APP.C.oidcInteractionPath + '/' + interaction.uid + '/cancel';
        } catch( e ){
            console.error( e );
            next( e, req, res, next );
        }
        let str = ''
            +'<body>'
            + this._renderPreamble( req, res, provider, interaction, client )
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
            +'          <div class="d-flex align-items-center justify-content-evenly">'
            +'            <button class="login-cancel btn btn-sm btn-secondary" onClick="location.href=\''+cancel+'\'; window.close();">'+pwixI18n.label( I18N, 'auth.interactions.cancel_button' )+'</button>'
            +'            <button type="submit" class="login login-submit btn btn-sm btn-primary">'+pwixI18n.label( I18N, 'auth.interactions.login_button' )+'</button>'
            +'          </div>'
            +'        </td>'
            +'      </tr>'
            +'    </table>'
            +'  </form>'
            +'</body>';
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
            +'    font-weight: normal;'
            +'    font-style: normal;'
            +'    display: flex;'
            +'    flex-direction: column;'
            +'    justify-content: space-evenly;'
            +'    height: 100%;'
            +'  }'
            +'  form { display: flex; align-items:center; justify-content: center; }'
            +'  tr:not(:first-child) td { padding-top: 1em; }'
            +'  td.ui-w40 { width: 40%; }'
            +'  td.ui-w60 { width: 60%; }'
            +'  td.ui-center { text-align: center; }'
            +'  td.ui-right { text-align: right; }'
            +'  p.label { margin: 0 0.5em 0 0; white-space: nowrap; }'
            +'  .no-grant { display: flex; align-items: center; justify-content: center; }'
            +'</style>';
        str += '</head>';
        return str;
    }

    // Display a client-dependant preamble
    _renderPreamble( req, res, provider, interaction, client ){
        let str = '';
        return str;
    }

    /**
     * @returns {IOIDInteractions}
     */
    constructor(){
        super( ...arguments );
        return this;
    }

    /**
     * @summary ?
     *  GET /iziam/interaction/:uid/abort
     */
    async interactionGetAbort( provider, req, res, next ){
        try {
            console.debug( 'interactionGetAbort' );

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary The user has cancelled the login page
     *  GET /iziam/interaction/:uid/cancel
     */
    async interactionGetCancel( provider, req, res, next ){
        try {
            console.debug( 'interactionGetCancel' );
            const result = {
                error: 'request_cancelled',
                error_description: 'End-User cancelled interaction',
            };
            await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary Render a dialog box to the user-agent client
     *  GET /iziam/interaction/:uid
     */
    async interactionGetLogin( provider, req, res, next ){
        console.debug( 'interactionGetLogin' );
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
     *  see https://github.com/panva/node-oidc-provider/blob/47a77d9afe90578ea4dfed554994b60b837a3059/example/routes/express.js
     */
    async interactionPostConfirm( provider, req, res, next ){
        try {
            console.debug( 'interactionPostConfirm' );
            const interactionDetails = await provider.interactionDetails( req, res );
            const { prompt: { name, details }, params, session: { accountId } } = interactionDetails;
            assert.equal( name, 'consent' );

            let { grantId } = interactionDetails;
            let grant;

            if( grantId ){
                // we'll be modifying existing grant in existing session
                grant = await provider.Grant.find(grantId);
            } else {
                // we're establishing a new grant
                grant = new provider.Grant({
                    accountId,
                    clientId: params.client_id,
                });
            }

            if( details.missingOIDCScope ){
                grant.addOIDCScope(details.missingOIDCScope.join(' '));
            }
            if( details.missingOIDCClaims ){
                grant.addOIDCClaims(details.missingOIDCClaims);
            }
            if( details.missingResourceScopes ){
                for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
                    grant.addResourceScope(indicator, scopes.join(' '));
                }
            }

            grantId = await grant.save();

            const consent = {};
            if( !interactionDetails.grantId ){
                // we don't have to pass grantId to consent, we're just modifying existing one
                consent.grantId = grantId;
            }

            const result = { consent };
            await provider.interactionFinished( req, res, result, { mergeWithLastSubmission: true });

        } catch( err ){
            console.error( 'err', err );
            return next( err );
        }
    }

    /**
     * @summary Interpret the login dialog box
     *  POST /iziam/interaction/:uid/login
     */
    async interactionPostLogin( provider, req, res, next ){
        console.debug( 'interactionPostLogin' );
        try {
            //console.debug( 'interactionPostLogin provider', provider );
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
    async interactionTry( provider, ctx, next ){
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
                    await this.interactionGetLogin( provider, ctx.req, ctx.res, next );

                } else if(( haveBaseUrl && words.length === 5 && words[4] === 'abort' ) || ( !haveBaseUrl && words.length === 4 && words[3] === 'abort' )){
                    // GET /iziam/interaction/:uid/abort
                    await this.interactionGetAbort( provider, ctx.req, ctx.res, next );
                }
            }
        } else if( ctx.method === 'POST' ){
            const words = ctx.path.split( '/' );

            if(( haveBaseUrl && words[1] === baseUrl && words[2] === interactionPath ) ||
                ( !haveBaseUrl && words[1] === interactionPath )){

                if(( haveBaseUrl && words.length === 5 && words[4] === 'login' ) || ( !haveBaseUrl && words.length === 4 && words[3] === 'login' )){
                    // POST /iziam/interaction/:uid/login
                    await this.interactionPostLogin( provider, ctx.req, ctx.res, next );

                } else if(( haveBaseUrl && words.length === 4 && words[4] === 'confirm' ) || ( !haveBaseUrl && words.length === 4 && words[3] === 'confirm' )){
                    // POST /iziam/interaction/:uid/confirm
                    await this.interactionPostConfirm( provider, ctx.req, ctx.res, next );
                }
            }
        }
    }
});
