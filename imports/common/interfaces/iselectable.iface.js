/*
 * /imports/common/interfaces/iselectable.iface.js
 *
 * Manage the selectability of a provider:
 * - whether it defaults to be selected -> defaulting to false
 * - whether it is selectable by the user (i.e. may the user change the selection ?) -> defaulting to true
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

import { Providers } from '/imports/common/collections/providers/index.js';

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
        const features = Providers.featuresByIds( selected );
        if( this instanceof IRequires ){
            this.requires().every(( it ) => {
                selectable &&= features.includes( it );
                return selectable;
            });
        }
        return selectable;
    }

    /**
     * Getter/Setter
     * @param {Boolean} selectable whether the allowded user can choose himself to select or not the provider
     * @returns {Boolean} the current selectability status
     */
    userSelectable( selectable ){
        if( selectable === true || selectable === false ){
            this.#priv.iselectable.userSelectable = selectable
        }
        return this.#priv.iselectable.userSelectable;
    }
});
