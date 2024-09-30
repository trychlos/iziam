/*
 * /imports/common/classes/iz-registrar.class.js
 *
 * A base class for registrars.
 * 
 * - OrganizationsRegistrar: instanciated at client init time, is fed by a subscription to a publication.
 * 
 *   Note that when a component of the UI has an organization as a data context, it is most often a deep copy of the organization item read from OrganizationsRegistrar.
 *   This deep copy may or may not have a ClientsRegistrar or an IdentitiesRegistrar.
 * 
 *   Note too that any update on a tenant will publish a new version of the entity, records, and thus a new item in the OrganizationsRegistrar, thus loosing previous
 *   registrars instances.
 *   We so have to keep a registry of instanciated registars per organization, to be able to re-provide them instead of instanciating new ones.
 * 
 * - ClientsRegistrar: instanciated when editing a tenant, fed by a subscription to a publication.
 *   Use this static registry to keep clients per organization.
 * 
 * - IdentitiesRegistrar: instanciated when editing a tenant, fed by a subscription to a publication.
 *   the registry is maintained by AccountsHub package.
 */

import { izObject } from './iz-object.class.js';

export class izRegistrar extends izObject {

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {izRegistrar}
     */
    constructor(){
        super( ...arguments );
        return this;
    }
}
