/*
 * /imports/common/interfaces/iselectable.iface.js
 *
 * Manage the selectability of a provider.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

import { Providers } from '/imports/common/collections/providers/index.js';

import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

export const ISelectable = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    // whether the provider defaults to be selected
    #defaultSelected = false;

    // whether the user can modify the selection
    #userSelectable = true;

    /**
     * @returns {ISelectable}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.iselectable ){
            this.#priv = {
                iselectable: o.iselectable
            };
            if( Object.keys( this.#priv.iselectable ).includes( 'defaultSelected' )){
                this.defaultSelected( this.#priv.iselectable.defaultSelected );
            }
            if( Object.keys( this.#priv.iselectable ).includes( 'userSelectable' )){
                this.userSelectable( this.#priv.iselectable.userSelectable );
            }
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
            this.#defaultSelected = selected
        }
        return this.#defaultSelected;
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
            this.#userSelectable = selectable
        }
        return this.#userSelectable;
    }
});
