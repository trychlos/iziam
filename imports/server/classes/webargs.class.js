/*
 * /imports/server/classes/webargs.class.js
 *
 * A class to handle requests arguments and their results.
 */

import { Statistics } from '/imports/common/collections/statistics/index.js';

export class Webargs {

    // static data

    // static methods

    // private data

    #req = null;
    #res = null;
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
     * @returns {Webargs} this instance
     */
    constructor( req, res ){
        this.#req = req;
        this.#res = res;
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
        console.debug( this );
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
     * @param {Integer} status
     */
    status( status ){
        this.#res.statusCode = status;
    }
}
