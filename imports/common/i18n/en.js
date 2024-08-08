/*
 * /imports/i18n/en.js
 */

Meteor.APP.i18n = {
    ...Meteor.APP.i18n,
    ...{
        en: {
            accounts: {
                edit: {
                    api_allowed_label: 'Is REST API allowed: ',
                    api_last_label: 'Last API connection: ',
                    tab_title: 'Application'
                },
                fieldset: {
                    api_allowed_dt_title: 'Is API allowed',
                    api_connection_dt_title: 'Last API connection'
                },
                login: {
                    preamble: 'The page you are requesting requires permissions which are only given to identified user accounts.<br />'
                        +'Please connect and enjoy.'
                },
            },
            header: {
                available_pages: 'The available pages',
                menu: {
                    managers: 'Managers',
                    configuration: 'Organization configuration',
                    properties: 'Main properties',
                    settings: 'Application settings'
                },
                my_roles: 'My roles'
            },
            home: {
                hero: {
                    iziam: ''
                        +'<span class="iziam">'
                        +' <span class="name">izIAM</span>'
                        +' <span class="label"> the Easy Identity Manager</span>'
                        +'</span>'
                }
            },
            manager: {
                accounts: {
                    preamble: 'Register and manage here the accounts allowed to connect to the izIAM Identity and Access Manager.',
                    tab_title: 'Accounts Management'
                },
                organizations: {
                    preamble: 'Register and manage here the involved organizations.<br />'
                        +'Organizations can take advantage of validity periods.<br />'
                        +'Do not omit to define at least one manager per organization so that he/she can later be autonomous.<br />',
                    tab_title: 'Organizations Management'
                }
            },
            organizations: {
                checks: {
                    baseurl_exists: 'The candidate REST Base URL is already used by another organization',
                    baseurl_onelevel: 'The REST Base URL must have a single level path',
                    baseurl_reserved: 'The candidate REST Base URL is a reserved path',
                    baseurl_short: 'The REST Base URL is too short',
                    baseurl_starts: 'The REST Base URL must be an absolute path (must start with \'/\')'
                },
                edit: {
                    baseurl_label: 'REST Base URL: ',
                    baseurl_ph: '/base',
                    baseurl_title: 'The first level of all REST URL\'s managed by and available to this organization. This is mandatory to have access to the Authorization Server REST API.',
                    providers_tab_title: 'Providers',
                    urls_tab_title: 'URL\'s'
                },
                providers: {
                    list_features_th: 'Features',
                    list_ident_th: 'Identifier',
                    list_label_th: 'Label',
                    list_origin_th: 'Origin',
                    list_preamble: 'These are the available feature providers.<br />Some are rather required while others may be freely chosen at your convenience.',
                    list_selected_th: 'Selected'
                }
            },
            powered_by: {
                label: 'Powered by Meteor&trade;'
            }
        }
    }
};
