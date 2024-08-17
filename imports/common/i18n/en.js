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
                checks: {
                    client_type_invalid: 'The client type is unknown or not valid',
                    client_type_unset: 'The client type is not set',
                    label_exists: 'The label is already used by another client',
                    label_unset: 'The label is not set',
                    profile_invalid: 'The chosen profile is unknown or not valid',
                },
                delete: {
                    confirmation_text: 'You are about to delete the "%s" client.<br />Are you sure ?',
                    confirmation_title: 'Deleting a client'
                },
                edit: {
                    description_label: 'Description: ',
                    description_ph: 'The client description',
                    description_title: 'A not too long description (which are not notes)',
                    label_label: 'Label: ',
                    label_ph: 'My unique label',
                    label_title: 'The mandatory, unique, name of your client application',
                    providers_tab_title: 'Providers',
                    softid_label: 'Software identifier: ',
                    softid_ph: 'MySoftware',
                    softid_title: 'How the client software identifies itself',
                    softver_label: 'Software version: ',
                    softver_ph: 'vx.yy.zzz-aaaa',
                    softver_title: 'The client software version which distinguish it from other registered clients'
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
                },
                new_assistant: {
                    assistant_title: 'Defining a new client application',
                    grant_type_nav: 'Grant type',
                    introduction_nav: 'Introduction',
                    introduction_text: 'This assistant will guide you through the process of defining a new client to your Authorization Server.',
                    profile_nav: 'Profile',
                    profile_text: 'Choose the application profile which corresponds best to your use case.<br />'
                        +'This will define many other parameters, but you still will be able to modify each of them at your convenience.<br />'
                        +'If none of the proposed profiles suit your needs, just choose the "Generic" one, and set each parameter to your taste.',
                    properties_nav: 'Properties',
                    properties_text: 'Define some properties specific to your client application.',
                    providers_nav: 'Providers',
                    summary_features_label: 'Needed features :',
                    summary_legend: 'Summary',
                    summary_name_label: 'Label :',
                    summary_profile_label: 'Profile :',
                    summary_providers_label: 'Providers :'
                },
                providers: {
                    list_preamble: 'Select here the providers among those allowed by your organization to satisfy the features needed by the client profile you have chosen.'
                }
            },
            definitions: {
                auth_method: {
                    private_jwt_desc: 'Uses a client-generated JSON Web Token (JWT) signed with a RSA or ECDSA algorithm to confirm the client\'s identity.',
                    private_jwt_label: 'Private Key JWT Client Authentication',
                    private_jwt_short: 'JWT by private key',
                    secret_jwt_desc: 'Uses a client-generated JSON Web Token (JWT) signed with a HMAC SHA algorithm to confirm the client\'s identity.',
                    secret_jwt_label: 'Shared Secret JWT Client Authentication',
                    secret_jwt_short: 'JWT by shared secret',
                    none_desc: 'No secret at all',
                    none_label: 'None',
                    none_short: 'None',
                    select_text: 'Select the client authentification method',
                    shared_desc: 'A shared secret generated by the authorization server at registration time; the client must use Basic HTTP authentification scheme',
                    shared_label: 'Shared secret - Basic HTTP scheme',
                    shared_short: 'Shared / Basic',
                    post_desc: 'A shared secret generated by the authorization server at registration time; the client uses HTTP POST parameters',
                    post_label: 'Shared secret - HTTP POST parms',
                    post_short: 'Shared / POST'
                },
                client_profile: {
                    confidential_label: 'Trusted user-oriented',
                    confidential_description: 'Your client application requires user authentification and needs user consent, but runs on a trusted server.',
                    generic_label: 'Generic',
                    generic_description: 'If your use case doesn\'t fall in any of the previous categories, then you will have to dive '
                        +'into the full set of configuration parameters.',
                    m2m_label: 'Machine-to-Machine',
                    m2m_description: 'Machine-to-machine scenarii are not runned on behalf a particular user, nor they need any sort of user consent. '
                        +'This gathers for example running automated tasks, background processes or server services.',
                    public_label: 'User-device user-oriented',
                    public_description: 'A web single-page application as well as a mobile or a native desktop application which requires user authentication, '
                        +'as soon as it runs on an (untrustable by nature) user device.',
                    select_text: 'Choose the profile of your client application'
                },
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
                        select_text: 'Select the client application type',
                    },
                },
                grant_type: {
                    authcode_20_label: 'Authorization code grant',
                    authcode_20_description: 'The authorization server returns a single-use authorization code to the client. '
                        +'The client then exchanges the code for an access token.',
                    authcode_21_label: 'Authorization code grant + PKCE',
                    authcode_21_description: 'The authorization server returns a single-use authorization code to the client. '
                        +'The client then exchanges the code for an access token.',
                    client_label: 'Client credentials grant',
                    client_description: 'A grant type suitable for machine-to-machine authentication.',
                    device_label: 'Device code grant',
                    device_description: 'Aimed at devices with limited input or display capabilities, such as game consoles or smart TVs.',
                    hybrid_label: 'Hybrid authorization flow',
                    hybrid_description: 'An OpenID authorization flow which enables clients to obtain some tokens straight from the Authorization Endpoint, '
                        +'while still having the possibility to get others from the Token Endpoint.',
                    implicit_20_label: 'Implicit grant',
                    implicit_20_description: 'The client application receives the access token immediately after the user gives their consent. '
                        +'<b>This grant flow is deprecated in favor of Authorization code flow.</b>',
                    jwt_label: 'JWT Bearer token grant',
                    jwt_description: 'JSON Web Tokens encrypted and signed using JSON Web Key Sets.',
                    password_label: 'Resource owner password credentials grant',
                    password_description: 'This grant type should only be used when there is a high degree of trust between the resource owner and the client.',
                    reftoken_label: 'Refresh token grant',
                    reftoken_description: 'Optional, may be exchanged for another access token when the first has expired.',
                    //saml_label: 'SAML 2.0 Bearer Assertion',
                    select_text: 'The grant types the client can use at the token endpoint'
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
                    baseurl_label: 'REST Base URL : ',
                    baseurl_ph: '/base',
                    baseurl_title: 'The first level of all REST URL\'s managed by and available to this organization. This is mandatory to have access to the Authorization Server REST API.',
                    clients_tab_title: 'Clients',
                    dynconfidential_label: 'Accept dynamic registration from confidential client applications',
                    dynconfidential_title: 'Whether a confidential client can be configured to allow dynamic registration of other client applications',
                    dynpublic_label: 'Accept dynamic registration from public client applications',
                    dynpublic_title: 'Whether a public client can be configured to allow dynamic registration of other client applications (be cautious with that)',
                    dynregistration_preamble: 'Define here if the organization will allow some clients or users to perform dynamic registration.<br />'
                        +'Please be cautious with this feature as they can lead to unknown clients making fake requests to your authorization server.',
                    dynregistration_tab_title: 'Dynamic registration',
                    dynuser_label: 'Accept dynamic registration from allowed identified users',
                    dynuser_title: 'Whether an identified user can be allowed to perform dynamic registration of client applications',
                    providers_tab_title: 'Providers',
                    urls_tab_title: 'URL\'s'
                },
                providers: {
                    list_preamble: 'Select here, among all registered providers, those that your organization is willing to manage. '
                        +'Each client will then be able to choose the exact provider(s) it wants use.'
                }
            },
            powered_by: {
                label: 'Powered by Meteor&trade;'
            },
            providers: {
                list: {
                    features_th: 'Features',
                    ident_th: 'Identifier',
                    label_th: 'Label',
                    origin_th: 'Origin',
                    preamble: 'Selecting providers is the same as saying which protocol(s) and which feature(s) you want use. '
                        +'Some are strongly needed, or even required, while others may be freely chosen at your convenience.',
                    selected_th: 'Selected'
                }
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
