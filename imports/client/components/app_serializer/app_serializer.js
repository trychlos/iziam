/*
 * /imports/client/components/app_serializer/app_serializer.js
 *
 * An application-level encapsulation for the 'teSerializer' component.
 * Rationale: manage the 'editable' flag and the collection name of the environment.
 * 
 * Parms:
 * - collection: the name of the collection, defaulting to 'contents'
 * - document: the name of the document, mandatory
 * 
 * Application context: pages manage a document name. We manage here a collection per language
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { UILayout } from 'meteor/pwix:ui-layout';

import './app_serializer.html';

Template.app_serializer.helpers({
    parmsSerializer(){
        const o = _.cloneDeep( this );
        o.collection = ( this.collection || 'contents' ) + ':' + pwixI18n.language();
        // editable defaults to false
        //  so make that always non-editable UNLESS we really have editable === true and enough width
        o.mode = Editor.C.Mode.STANDARD;
        if( Meteor.APP.runContext.editionAsked() === true && UILayout.width() >= UILayout.C.Breakpoints.MD ){
            o.mode = Editor.C.Mode.PREVIEW;
        }
        //console.debug( 'parmsSerializer', this, o );
        return o;
    }
});
