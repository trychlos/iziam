/*
 * /import/common/collections/resources/tabular.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { Resources } from '/imports/common/collections/resources/index.js';

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization manages its resources
 *  This must be run in common code
 * @param {String} organizationId
 */
Resources.getTabular = function( organizationId ){
    if( !Resources.tabulars[organizationId] ){
        let c = new Tabular.Table({
            name: 'Resources_'+organizationId,
            collection: Resources.collection( organizationId ),
            columns: Resources.fieldSet.get().toTabular(),
            tabular: {
                async infoButtonTitle( it ){
                    return pwixI18n.label( I18N, 'resources.tabular.info_title', it.label || it.name );
                },
                async deleteButtonTitle( it ){
                    return pwixI18n.label( I18N, 'resources.tabular.delete_title', it.label || it.name );
                },
                async deleteConfirmationText( it ){
                    return pwixI18n.label( I18N, 'resources.tabular.delete_confirm_text', it.label || it.name );
                },
                async deleteConfirmationTitle( it ){
                    return pwixI18n.label( I18N, 'resources.tabular.delete_confirm_title', it.label || it.name );
                },
                async editButtonTitle( it ){
                    return pwixI18n.label( I18N, 'resources.tabular.edit_title', it.label || it.name );
                },
            },
            destroy: true,
            order: [[ Resources.fieldSet.get().indexByName( 'name' ), 'asc' ]],
        });
        Resources.tabulars[organizationId] = c;
    }
    return Resources.tabulars[organizationId];
};
