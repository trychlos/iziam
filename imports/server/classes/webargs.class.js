/*
 * /imports/server/classes/webargs.class.js
 *
 * A class to handle requests arguments and their results.
 */

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { Statistics } from '/imports/common/collections/statistics/index.js';

export class Webargs {

    // static data

    // static methods

    // private data

    #req = null;
    #res = null;
    #next = null;
    #answer = null;
    #errors = [];

    // private methods

    // public data

    /**
     * Constructor
     * @param {Object} req the request
     * 
     *  req.url             '/v32'
     *  req.method          'GET'
     *  req.httpVersion     '1.1'
     *  req.headers {
     *      'x-forwarded-host': 'localhost:3003',
     *      'x-forwarded-proto': 'http',
     *      'x-forwarded-port': '3003',
     *      'x-forwarded-for': '127.0.0.1',
     *      accept: '* /*',
     *      'user-agent': 'curl/8.6.0',
     *      host: 'localhost:3003',
     *      connection: 'keep-alive'
     *  }
     *
     *
     * @param {Object} res the result object
     * @param {Function} next the next function
     * @returns {Webargs} this instance
     */
    constructor( req, res, next ){
        this.#req = req;
        this.#res = res;
        this.#next = next;
        this.#res.statusCode = null;
        return this;
    }

    /**
     * @param {Object} o any object to be answered to the client
     */
    answer( o ){
        this.#answer = o;
    }

    /**
     * @summary End of the request and answer to the client
     */
    end(){
        // if the HTTP status code has not been set by the handler, suppose it to be OK
        if( !this.#res.statusCode ){
            this.#res.statusCode = 200;
        }
        // if there are any error messages, send them
        if( this.#errors.length ){
            this.#res.setHeader( 'Content-Type', 'application/json' );
            this.#res.end( JSON.stringify( this.#errors ));
            this.recordStat();

        // if the handler has not set the content, then returns an empty JSON string
        } else if( this.#answer ){
            this.#res.setHeader( 'Content-Type', 'application/json' );
            this.#res.end( JSON.stringify( this.#answer ));
            this.recordStat();

        // neither an error message nor any answer - this is weird
        // force an error message and an error status code
        } else {
            this.#res.setHeader( 'Content-Type', 'application/json' );
            this.#res.statusCode = 500;
            this.error( 'Unfortunately, the server has not detected any error, but is unable to provide any answer' );
            this.#res.end( JSON.stringify( this.#errors ));
            this.recordStat();
        }
    }

    /**
     * @param {String} msg an error message
     */
    error( msg ){
        this.#errors.push( msg );
    }

    /**
     * @param {Object} api the object which describe the global or scoped API
     * @param {Object} opts an optional options object with following keys:
     *  - organization: the { entity, record } at date non null organization object, if and only if we are handling an organization-scoped request
     *  - url: the url to be searched as an API path, defaulting to req.url
     *  - providers: a sorted list of providers which may be able to deal with this request
     *  - asterCb: an async callback which targets the aster path, and run server-side
     * NB: must terminate by calling end() to answer to the client
     * @returns {izProvider} a provider willing to handle and answer, or null
     */
    async handle( api, opts ){
        const self = this;
        const url = opts.url || this.#req.url;
        let handled = false;
        let provider = null;
        // rather targeting global API
        if( api[this.#req.method] ){
            for( let i=0 ; i<api[this.#req.method].length && !handled ; ++i ){
                const it = api[this.#req.method][i];
                if( url === it.path || it.path === '*' ){
                    handled = true;
                    if( it.fn ){
                        await it.fn( it, self, opts.organization );
                    } else {
                        self.error( 'the requested url "'+this.#req.url+'" doesn\'t have any associated function' );
                        self.status( 501 ); // not implemented
                        self.end();
                    }
                }
            }
        }
        // rather targeting scoped API
        //  first try fixed paths, only then aster
        if( !handled && opts.providers ){
            for( let i=0 ; i<opts.providers.length && !handled ; ++i ){
                handled = await opts.providers[i].request( url, self, opts.organization );
            }
            for( let i=0 ; i<opts.providers.length && !handled ; ++i ){
                handled = await opts.providers[i].request( url, self, opts.organization, opts.asterCb );
            }
        }
        if( !handled ){
            self.error( 'the requested url "'+this.#req.url+'" is not managed' );
            self.status( 501 ); // not implemented
            self.end();
        }
        return provider;
    }

    /**
     * Getter
     * @returns {String} the HTTP method
     */
    method(){
        return this.#req.method;
    }

    /**
     * Getter
     * @returns {Function} the next function
     */
    next(){
        return this.#next;
    }

    /**
     * @summary Record a statistic line
     */
    recordStat(){
        let record = {
            url: this.#req.url,
            method: this.#req.method,
            httpVersion: this.#req.httpVersion,
            headers: this.#req.headers,
            status: this.#res.statusCode,
            ip: this.#req.headers['x-forwarded-for']
        };
        if( this.#answer ){
            record.answer = this.#answer;
        }
        if( this.#errors.length ){
            record.errors = this.#errors;
        }
        Statistics.s.record( record );
    }

    /**
     * Getter
     * @returns {Object} the request
     */
    req(){
        return this.#req;
    }

    /**
     * Getter
     * @returns {Object} the result
     */
    res(){
        return this.#res;
    }

    /**
     * @param {Integer} status
     */
    status( status ){
        this.#res.statusCode = status;
    }

    /**
     * Getter
     * @returns {String} url
     */
    url(){
        return this.#req.url;
    }
}
