/*
 * /imports/client/classes/run-context.class.js
 */

import { CoreApp } from 'meteor/pwix:core-app';
import { EnvSettings } from 'meteor/pwix:env-settings';

export class RunContext extends CoreApp.RunContext {

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @param {Object} o an optional parameters object
     * @returns {RunContext} this instance
     */
    constructor(){
        super( ...arguments );
        const self = this;

        // track the current datacontext to track the currently (routed) displayed page
        //  rationale: the router cannot pass an object instance as part of the datacontext, so get here the DisplayUnit for the page
        /*
        Tracker.autorun(() => {
            const dc = self.dataContext();
            if( dc && dc.name ){
                self.page( Meteor.APP.displaySet.byName( dc.name ));
            }
        });
        */

        // get the application title from settings per environment
        Tracker.autorun(() => {
            if( EnvSettings.ready()){
                self.title( Meteor.settings.public[Meteor.APP.name].environment.title || '' );
            }
        });

        return this;
    }

    /**
     * @summary Return the classes to be provided to other display units than the current page
     *  This may come from the application defaults, from the page itself, or from the user preferences
     * @returns {Array} the list of color and layout themes
     */
    pageUIClasses(){
        const page = this.ipageablePage();
        const colorTheme = page ? page.get( 'colorTheme' ) || Meteor.APP.defaults.colorTheme : Meteor.APP.defaults.colorTheme;
        const layoutTheme = page ? page.get( 'layoutTheme' ) || Meteor.APP.defaults.layoutTheme : Meteor.APP.defaults.layoutTheme;
        let classesArray = [];
        classesArray.push( colorTheme );
        classesArray.push( layoutTheme );
        return classesArray;
    }
}
