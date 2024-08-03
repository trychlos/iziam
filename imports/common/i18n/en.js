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
                edit: {
                    providers_tab_title: 'Providers',
                    urls_tab_title: 'URL\'s'
                }
            },
            powered_by: {
                label: 'Powered by Meteor&trade;'
            }
        }
    }
};
