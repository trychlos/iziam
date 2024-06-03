/*
 * /imports/client/classes/run-context.class.js
 */

import { CoreApp } from 'meteor/pwix:core-app';
import { ReactiveVar } from 'meteor/reactive-var';

export class RunContext extends CoreApp.Base {

    // static data

    // static methods

    // private data

    #dataContext = new ReactiveVar( null );
    #page = new ReactiveVar( null );
    #title = new ReactiveVar( Meteor.APP.name );

    // private methods

    // public data

    /**
     * Constructor
     * @param {Object}
     * @returns {GroupNode} the node instance
     */
    constructor( o ){
        super( ...arguments );
        const self = this;

        // track the current datacontext to track the currently (routed) displayed page
        //  rationale: the router cannot pass an object instance as part of the datacontext, so get here the DisplayUnit for the page
        Tracker.autorun(() => {
            const dc = self.#dataContext.get();
            if( dc && dc.name ){
                self.page( Meteor.APP.displaySet.get( dc.name ));
            }
        });

        return this;
    }

    /**
     * Getter/Setter
     * @summary
     *  The data context is attached to the current route.
     *  It is initialized by the router (cf. imports/client/init/routes.js), and passed to the `app_main` topmost root template as template data.
     *  We can get it through template helper as soon as we are willing to define a template helper per primary key of the passed object.
     *  So we have chosen to define a single standard 'dataContext' key which is expected to address all the data available to the router and
     *  needed to the pages..
     *  At the moment, only contains the name of the page to be displayed.
     * @param {Object} o the optional data context of the current page
     * @returns {Object} the current data context
     */
    dataContext( o ){
        if( o ){
            check( o, Object );
            this.#dataContext.set( o );
        }
        return this.#dataContext.get();
    }

    /**
     * Getter/Setter
     * @summary
     *  A reactive tracker of the currently displayed page as a DisplayUnit
     *  Note: the currently displayed page may not be the currently displayed DisplayUnit if this later, for example, is a modal on top of the page.
     * @param {DisplayUnit} du
     * @returns {DisplayUnit} the current DisplayUnit page
     */
    page( du ){
        if( du ){
            check( du, CoreApp.DisplayUnit );
            this.#page.set( du );
        }
        return this.#page.get();
    }

    /**
     * Getter
     * @summary
     *  The returned object is passed as a template datacontext from app_layout to below sub-templates.
     *  Data is so made reactive and the display is expected to be refreshed on data changes
     * @returns {Object} the current running context as a plain Javascript object to be used as data template
     */
    plainContext(){
        return {
            isConnected: Meteor.userId() !== null,
            title: this.title(),
            wantFooter: true,
            wantHeader: true
        };
    }

    /**
     * Getter/Setter
     * @summary
     *  The title of the application defaults to its name as the constant `Meteor.APP.name`.
     *  It it overridable on a per-environment basis: the `app_main` topmost root template takes care of getting the environment
     *  from the private configuration assets (from pwix:env-settings package) as soon as they are available, and set this title.
     * @param {String} s an optional title
     * @returns {String} the title of the application to be displayed in the browser title bar
     */
    title( s ){
        if( s ){
            check( s, String );
            this.#title.set( s );
        }
        return this.#title.get();
    }
}
