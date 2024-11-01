/*
 * /imports/common/interfaces/iselectable.iface.js
 *
 * Manage the selectability of a provider:
 * - whether it defaults to be selected -> defaulting to false
 * - whether it is selectable by the user (i.e. may the user change the selection ?) -> defaulting to true
 * 
 * Please note that we only manage here the selectability at the client level:
 *  i.e. when the organization manager defines the providers used by an app client (chosen among above available providers)
 *  which is obsoleted at the moment: the client doesn't choose the providers, but only the authorization grant flow it will use.
 *  This is up to the Authorization Server to choose the ad-hoc provider amongo those selected at the organization level.
 * 
 * A provider is only selectable by the user when all its prerequisites are already selected.
 * A provider may become unselectable because:
 * - either one of its prerequisite is not satisfied
 * - or because another selected provider provides the same features
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { DeclareMixin } from '@vestergaard-company/js-mixin';

import { Providers } from '/imports/common/tables/providers/index.js';

import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

export const ISelectable = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @returns {ISelectable}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.iselectable ){
            this.#priv = {
                iselectable: o.iselectable
            };
        }

        this.#priv = this.#priv || {};
        this.#priv.iselectable = this.#priv.iselectable || {};

        if( !Object.keys( this.#priv?.iselectable ).includes( 'defaultSelected' )){
            this.defaultSelected( false );
        }
        if( !Object.keys( this.#priv?.iselectable ).includes( 'userSelectable' )){
            this.userSelectable( true );
        }

        return this;
    }

    /**
     * Getter/Setter
     * @param {Boolean} selected whether this provider should be selected by default
     * @returns {Boolean} whether this provider is selected by default
     */
    defaultSelected( selected ){
        if( selected === true || selected === false ){
            this.#priv.iselectable.defaultSelected = selected
        }
        return this.#priv.iselectable.defaultSelected;
    }

    /**
     * Getter
     * @summary Given the features provided by the currently selected providers, is this provider selectable ?
     * @param {Array<String>} selected the list of currently selected providers id's
     * @returns {Boolean} whether this provider is selectable, i.e. when the input checkbox can be enabled to be selected by the user
     */
    isSelectable( selected ){
        if( !this.userSelectable()){
            return false;
        }
        let selectable = true;
        let features = Providers.featuresByIds( selected );
        // the provider is selectable if all of its prerequisites are there
        if( this instanceof IRequires ){
            this.requires().every(( it ) => {
                selectable &&= features.includes( it );
                return selectable;
            });
        }
        // the provider is not selectable (or rather not unselectable) if it is itself a prerequisite of another selected
        if( selectable ){
            features = this.features();
            selected.every(( it ) => {
                if( it !== this.identId()){
                    const itProvider = Providers.byId( it );
                    if( itProvider ){
                        const itRequires = itProvider.requires();
                        const intersection = features.filter( e => itRequires.includes( e ));
                        if( intersection.length ){
                            selectable = false;
                        }
                    }
                }
                return selectable;
            });
        }
        return selectable;
    }

    /**
     * Getter/Setter
     * @param {Boolean} selectable whether the allowed user can choose himself to select or not the provider
     * @returns {Boolean} the current selectability status
     */
    userSelectable( selectable ){
        if( selectable === true || selectable === false ){
            this.#priv.iselectable.userSelectable = selectable
        }
        return this.#priv.iselectable.userSelectable;
    }
});
