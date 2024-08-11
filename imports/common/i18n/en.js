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
            clients: {
                delete: {
                    confirmation_text: 'You are about to delete the "%s" client.<br />Are you sure ?',
                    confirmation_title: 'Deleting a client'
                },
                list: {
                    delete_button_title: 'Delete the "%s" client',
                    edit_button_title: 'Edit the "%s" client',
                    info_button_title: 'Informations about the "%s" client',
                    info_modal_title: 'Informations about the "%s" client',
                    label_th: 'Label',
                    organization_th: 'Organization',
                    type_th: 'Type',
                },
                new: {
                    assistant_title: 'Defining a new client',
                    button_label: 'New client',
                    button_title: 'Define a new client in the organization'
                }
            },
            definitions: {
                client_type: {
                    client_type: {
                        confidential_short: 'Confidential',
                        confidential_label: 'Confidential client',
                        confidential_text_oauth20: 'Clients which are considered as capable of maintaining the confidentiality of their credentials '
                            +'(e.g., client implemented on a secure server with restricted access to the client credentials), or capable of secure '
                            +'client authentication using other means.',
                        confidential_text_oauth21: 'Clients that have credentials with the Authorization Server are designated as "confidential clients".',
                        confidential_summary: 'The \'confidential\' type should be reserved to server-based code, and only when the Authorization Server '
                            +'considers this server-based code as capable of maintaining the security of the allocated credentials.',
                        public_short: 'Public',
                        public_label: 'Public client',
                        public_text_oauth20: 'Clients which are incapable of maintaining the confidentiality of their credentials '
                            +'(e.g., clients executing on the device used by the resource owner, such as an installed native application or a web '
                            +'browser-based application), and incapable of secure client authentication via any other means.',
                        public_text_oauth21: 'Clients without credentials are called "public clients".',
                        public_summary: 'The \'public\' type should be chosen for any code whose security cannot be guaranted, and, in particular, '
                            +'for any code running on a user-accessible device.',
                        select_text: 'Select the client type',
                    },
                }
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
                clients: {
                    list_preamble: 'The list of clients defined by and for the organization.<br />'
                        +'Capabilities of the clients depend of their type and of the chozen authorization grant flow.',
                },
                edit: {
                    baseurl_label: 'REST Base URL: ',
                    baseurl_ph: '/base',
                    baseurl_title: 'The first level of all REST URL\'s managed by and available to this organization. This is mandatory to have access to the Authorization Server REST API.',
                    clients_tab_title: 'Clients',
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
            },
            validity: {
                list: {
                    effect_end_th: 'Last ending',
                    effect_start_th: 'First starting'
                }
            }
        }
    }
};
