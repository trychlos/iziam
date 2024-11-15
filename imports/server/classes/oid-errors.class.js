/*
 * /imports/server/classes/oid-errors.class.js
 *
 * A class to provide an error page..
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import htmlSafe from 'oidc-provider/lib/helpers/html_safe.js';

import { pwixI18n } from 'meteor/pwix:i18n';

import { izObject } from '/imports/common/classes/iz-object.class.js';

export class OIDErrors extends izObject {

    // static data

    // static methods

    // private data

    // instanciation
    #out = null;
    #error = null;

    // runtime

    // private methods

    // returns the body
    _renderBody( out, error ){
        let str = ''
            +'<body>'
            +'  <div class="container">'
            +     this._renderBodyTitle( out, error )
            +     this._renderBodyContent( out, error )
            +'  </div>'
            +'</body>';
        return str;
    }

    // returns the body content
    _renderBodyContent( out, error ){
        let str = '';
        Object.entries( out ).map(([ key, value ]) => {
            if( key !== 'iss' ){
                str += ''
                    +'<pre>'
                    +'  <strong>'+key+'</strong>: '
                    +   htmlSafe( value )
                    +'</pre>';
            }
        });
        return str;
    }

    // returns the body title
    _renderBodyTitle( out, error ){
        //console.debug( '_renderBodyTitle', arguments );
        const title = pwixI18n.label( I18N, 'auth.error.title' );
        let str = ''
            +'<div class="header">'
            +'  <div class="row">';
        if( out.iss ){
            const url = new URL( out.iss );
            str += '  <img src="'+url.origin+'/favicon.svg" width="64" />';
        }
        str += ''
            +'    <h1>izIAM</h1>'
            +'  </div>'
            +'  <h2>'+( out.iss || out.error )+'</h2>'
            +'</div>';
        return str;
    }

    // returns the head
    _renderHead( out, error ){
        let str = ''
            +'<head>'
            +'  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
            +'  <meta charset="utf-8">'
            +'  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
        const title = pwixI18n.label( I18N, 'auth.error.title' );
        str += ''
            +'<title>'+title+'</title>'
            +'<style>'
            +'  @import url(https://fonts.googleapis.com/css?family=Roboto:400,100);body{font-family:Roboto,sans-serif;margin-top:25px;margin-bottom:25px}.container{padding:0 40px 10px;width:274px;background-color:#F7F7F7;margin:0 auto 10px;border-radius:2px;box-shadow:0 2px 2px rgba(0,0,0,.3);overflow:hidden}pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;margin:0 0 0 1em;text-indent:-1em}'
            +'  .header .row { display: flex; flex-direction: row; justify-content: space-around; align-items: center; }'
            +'  h1 { margin: 0; font-size: 3em; }'
            +'</style>'
            +'</head>';
        return str;
    }

    // public data

    /**
     * Constructor
     * @returns {OIDErrors} this instance
     */
    constructor( out, error ){
        super( ...arguments );

        this.#out = out;
        this.#error = error;

        return this;
    }

    /**
     * @returns {String} the HTML output
     */
    render(){
        let html = '<!DOCTYPE html>'
            +'<html>'
            +  this._renderHead( this.#out, this.#error )
            +  this._renderBody( this.#out, this.#error )
            +'</html>';
        return html;
    }
}
