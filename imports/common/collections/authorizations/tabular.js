/*
 * /import/common/collections/authorizations/tabular.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization manages its authorizations
 *  This must be run in common code
 * @param {String} organizationId
 */
Authorizations.getTabular = function( organizationId ){
    if( !Authorizations.tabulars[organizationId] ){
        let c = new Tabular.Table({
            name: 'Authorizations_'+organizationId,
            collection: Authorizations.collection( organizationId ),
            columns: Authorizations.fieldSet.get().toTabular(),
            tabular: {
                async infoButtonTitle( it ){
                    return pwixI18n.label( I18N, 'authorizations.tabular.info_title', it.label || it.name );
                },
                async deleteButtonTitle( it ){
                    return pwixI18n.label( I18N, 'authorizations.tabular.delete_title', it.label || it.name );
                },
                async deleteConfirmationText( it ){
                    return pwixI18n.label( I18N, 'authorizations.tabular.delete_confirm_text', it.label || it.name );
                },
                async deleteConfirmationTitle( it ){
                    return pwixI18n.label( I18N, 'authorizations.tabular.delete_confirm_title', it.label || it.name );
                },
                async editButtonTitle( it ){
                    return pwixI18n.label( I18N, 'authorizations.tabular.edit_title', it.label || it.name );
                },
            },
            destroy: true,
            order: [[ Authorizations.fieldSet.get().indexByName( 'name' ), 'asc' ]],
        });
        Authorizations.tabulars[organizationId] = c;
    }
    return Authorizations.tabulars[organizationId];
};
