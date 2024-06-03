/*
 * /imports/client/init/run-context.js
 */

import { RunContext } from '../classes/run-context.class';

Meteor.APP.runContext = new RunContext({ title: Meteor.APP.name });

/*
{

    // toggleSwitch edition management
    //  - on a per-environment basis: wantEditionSwitch = true|false (defaulting to false)
    //  - on a per-page basis: wantEditionSwitch = true|false (defaulting to false)
    //  when both are true, the toggleSwitch is displayed on the header of the page
    //  this var is updated on toggleSwitch toggle...
    asked: new ReactiveVar( false ),

    // whether the connected user has some roles which are scoped
    userHasScope(){
        let hasScope = Object.keys( Roles.current().scoped ).length > 0;
        //console.debug( 'hasScope', hasScope );
        return hasScope;
    }
};
*/
