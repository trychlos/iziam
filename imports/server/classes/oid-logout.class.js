/*
 * /imports/server/classes/oid-logout.class.js
 *
 * A class to provide an error page..
 */

import htmlSafe from 'oidc-provider/lib/helpers/html_safe.js';

import { pwixI18n } from 'meteor/pwix:i18n';

import { izObject } from '/imports/common/classes/iz-object.class.js';

export class OIDLogout extends izObject {

    // static data

    // static methods

    // private data

    // instanciation
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
     * @returns {OIDLogout} this instance
     */
    constructor( form ){
        super( ...arguments );

        this.#form = form;

        return this;
    }

    /**
     * @returns {String} the HTML output
     */
    render(){
        let html = '<!DOCTYPE html>'
            +'<html>'
            + this._renderHead( this.#form )
            + this._renderBody( this.#form )
            + '</html>';
        console.debug( 'html', html );
        return html;
    }
}
