/*
 * /imports/client/init/run-context.js
 */

import { RunContext } from '../classes/run-context.class';

Meteor.APP.runContext = new RunContext();

/*
{
    // whether the connected user has some roles which are scoped
    userHasScope(){
        let hasScope = Object.keys( Roles.current().scoped ).length > 0;
        //console.debug( 'hasScope', hasScope );
        return hasScope;
    }
};
*/
