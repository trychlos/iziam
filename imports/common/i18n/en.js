/*
 * /imports/i18n/en.js
 */

Meteor.APP.i18n = {
    ...Meteor.APP.i18n,
    ...{
        en: {
            accounts: {
                /*
                check: {
                    email_exists: 'This email address already exists',
                    email_invalid: 'This email address is not valid',
                    email_unset: 'An email address is mandatory',
                    username_exists: 'This username already exists'
                },
                */
                manager: {
                    //allowed_th: 'Login allowed',
                    api_allowed_th: 'API allowed',
                    delete_btn: 'Delete the "%s" account',
                    delete_confirm: 'You are about to delete the "%s" account.<br />Are you sure ?',
                    delete_success: 'The "%s" has been successfully deleted',
                    delete_title: 'Deleting an account',
                    edit_btn: 'Edit the "%s" account',
                    edit_title: 'Editing an account',
                    email_th: 'Email address',
                    ident_title: 'Identity',
                    last_th: 'Last seen',
                    roles_btn: 'Edit the roles',
                    roles_th: 'Roles',
                    roles_title: 'Roles',
                    set_allowed_false: 'The "%s" email address is no more allowed to log in',
                    set_allowed_true: 'The "%s" email address is now allowed to log in',
                    set_api_allowed_false: 'The "%s" email address is no more allowed to access the API',
                    set_api_allowed_true: 'The "%s" email address is now allowed to access the API',
                    set_verified_false: 'The "%s" email address has been reset as "not verified"',
                    set_verified_true: 'The "%s" email address has been set as "verified"',
                    settings_title: 'Settings',
                    total_count: '%s registered account(s)',
                    username_th: 'Username',
                    verified_th: 'Verified',
                    verify_resend: 'Resend an email verification link',
                    verify_sent: 'Email verification link has been sent'
                },
                panel: {
                    add_title: 'Add a role',
                    allowed_label: 'Is login allowed',
                    api_allowed_label: 'Is API allowed',
                    email_label: 'Email:',
                    email_ph: 'you@example.com',
                    line_valid: 'Whether this line is valid',
                    no_role: 'No selected role',
                    remove_title: 'Remove this role',
                    role_option: 'Choose a role',
                    role_th: 'Role',
                    scope_th: 'Scope',
                    select_title: 'Select desired accounts',
                    settings_preamble: 'A placeholder for various settings available to the user',
                    username_label: 'Username:',
                    username_ph: 'An optional username',
                    verified_label: 'Is email verified',
                    with_scope: 'Select a scope',
                    without_scope: 'Role is not scoped'
                }
            },
            assistant: {
                cancel_btn: 'Cancel',
                cancel_title: 'Cancel the assistant',
                close_btn: 'Close',
                close_confirm: 'You are about to close this assistant while its actions are not finished. Are you sure ?',
                close_title: 'Close the assistant',
                confirm_btn: 'Confirm',
                confirm_title: 'Confirm your choices',
                next_btn: 'Next',
                next_title: 'Go to the next page',
                prev_btn: 'Previous',
                prev_title: 'Go back to the previous page'
            },
            // authorizations provider
            authorizations: {
                manager: {
                    btn_plus_label: 'New authorization',
                    btn_plus_title: 'Define a new authorization',
                    export_btn: 'Export...',
                    group_th: 'Group',
                    identity_th: 'Identity',
                    import_btn: 'Import...',
                    list_unallowed: 'You are unfortunately not allowed to consult this list. Please contact your administrator.',
                    preamble: 'Manage here the authorizations issued to your groups and your identities.<br />'
                        +'The authorization atom is the scope: all claims defined for a scope will be authorized to the identity.<br />',
                    resource_th: 'Resource',
                    resources_tab: 'Authorizations by Resources',
                    scope_th: 'Scope',
                    tab_title: 'Authorizations Management',
                    target_th: 'Target'
                },
                panel: {
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_success: 'The "%s" authorization has been successfully updated.',
                    edit_title: 'Edit the "%s" authorization',
                    group_label: 'Group:',
                    identity_label: 'Identity:',
                    new_success: 'The "%s" authorization has been successfully created.',
                    new_title: 'New authorization',
                    properties_tab: 'Properties',
                    resource_label: 'Resource:',
                    scope_label: 'Scope:',
                    target_label: 'Target:'
                }
            },
            authserver: {
                manager: {
                    authep_label: 'Authorization Endpoint:',
                    authep_title: 'The authorization endpoint is used to interact with the resource owner and obtain an authorization grant. '
                        +'The Authorization Endpoint published to the clients will be the concatenation of your endpoints root URL and this endpoint path. '
                        +'This endpoint is mandatory to build a working OAuth API.',
                    authep_url: 'Your Authorization Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    auth_grant_tab: 'Authorization Grants',
                    endpoints_tab: 'Endpoints',
                    keygrip_tab: 'Keygrips',
                    oauth_endpoints: 'OAuth 2.0 Endpoints',
                    tokenep_label: 'Token Endpoint:',
                    tokenep_title: 'The token endpoint is used by the client to obtain an access token by presenting its authorization grant or refresh token.'
                        +'The token endpoint is used with every authorization grant except for the implicit grant type.'
                        +'This endpoint is mandatory to build a working OAuth API.',
                    tokenep_url: 'Your Token Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    userep_label: 'Userinfo Endpoint:',
                    userep_url: 'Your Userinfo Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                },
                panel: {
                    keygrip_create_success: 'The Keygrip has been successfully created',
                    keygrip_createdat_th: 'Created at',
                    keygrip_createdby_th: 'Created by',
                    keygrip_delete_success: 'The Keygrip has been successfully deleted',
                    keygrip_encoding_th: 'Encoding',
                    keygrip_id_th: 'Identifier',
                    keygrip_hmac_th: 'Algorithm',
                    keygrip_label_ph: 'New Keygrip label',
                    keygrip_label_th: 'Label',
                    keygrip_label_title: 'A label is not mandatory, but will help you in the future',
                    keygrip_none: 'There is not yet any registered Keygrip',
                    keygrip_remove_title: 'Remove this Keygrip',
                    keygrip_save_title: 'Save this Keygrip',
                    keygrip_update_success: 'The Keygrip has been successfully updated'
                }
            },
            clients: {
                check: {
                    authmethod_invalid: 'Client authentification method is not valid',
                    authmethod_none: 'An authentification method is mandatory for this grant type',
                    authmethod_unset: 'Client authentification method is not set',
                    clientid_unset: 'Client identifier is not set',
                    contacts_unset: 'No contact at the moment, but this is mandatory',
                    credentials_nosecret: 'Client wants authenticate with "client_credentials" but do not have any secret',
                    credentials_rtnone: 'Client which wants authenticate with "client_credentials" muse have response_types = ["none"]',
                    endpoint_invalid: 'Redirection URI must be a valid HTTPS URL',
                    endpoints_unset: 'No redirection endpoint at the moment, but this is mandatory',
                    granttype_invalid: 'Unknown grant type',
                    label_unset: 'The label is mandatory',
                    nature_invalid: 'Client nature is not valid',
                    responsetype_invalid: 'Unknown response type',
                    secret_empty: 'Client has no secret, cannot authenticate itself',
                    type_invalid: 'Client type is not valid'
                },
                manager: {
                    api_th: 'API',
                    btn_plus_label: 'New client',
                    btn_plus_title: 'Define a new client',
                    checks_tab: 'Clients checks',
                    contacts_th: 'Contacts',
                    credentials_tab: 'Clients credentials',
                    credentials_th: 'Credentials',
                    delete_btn_title: 'Delete the "%s" client',
                    delete_confirm: 'You are about to delete the "%s" client.<br />Are you sure ?',
                    delete_success: 'Client "%s" successively deleted',
                    delete_title: 'Deleting a cient',
                    edit_btn_title: 'Edit the "%s" client',
                    end_th: 'Validity end',
                    export_btn: 'Export...',
                    import_btn: 'Import...',
                    item_valid: 'Item is valid for API use at date',
                    item_uncomplete: 'Item is still not complete',
                    list_unallowed: 'You are unfortunately not allowed to consult this list. Please contact your administrator.',
                    list_title: 'Clients list',
                    label_th: 'Label',
                    preamble: 'Manage your clients here.<br /',
                    preregister_title: 'Pre-registration',
                    registration_tab: 'Clients registration',
                    registration_th: 'Regist.',
                    start_th: 'Validity start',
                    tab_title: 'Clients <i>(aka &laquo;&nbsp;Applications&nbsp;&raquo;)</i> Management',
                    total_count: '%s registered client(s)',
                    type_th: 'Type',
                    validities_count: '%s validity periods'
                },
                new_assistant: {
                    assistant_title: 'Defining a new client',
                    auth_nav: 'Review the authentification mode',
                    contacts_nav: 'Contacts',
                    done_nav: 'Done',
                    endpoints_nav: 'Redirect URLs',
                    grant_nav: 'Review the proposed grant types',
                    introduction_nav: 'Introduction',
                    jwt_nav: 'JWT Authentification',
                    nature_nav: 'Choose the nature of your client',
                    properties_nav: 'Properties',
                    success_label: 'The new client has been successfully created.',
                    subsuccess_label: 'Please find below some informations created on the server, that you may find useful.',
                    summary_auth_label: 'Auth method:',
                    summary_contacts_label: 'Contacts:',
                    summary_endpoints_label: 'Redirect URLs:',
                    summary_grant_label: 'Grant types:',
                    summary_name_label: 'Name:',
                    summary_nav: 'Summary',
                    summary_legend: 'Your current choices',
                    summary_nature_label: 'Client nature:'
                },
                panel: {
                    /*
                    caution_dyn_text: 'Please be conscious that dynamic registration also means <i>open</i> registration.<br />'
                        +'You will have to take care of not creating any security leak by making sure your dynamic clients are trusted.<br />'
                        +'If you are not sure, you should prefer allow only pre-registration as you will be in better control of your trust relationship.<br />'
                        +'This way, you can also take full advantage of <i>dynamic configuration</i> of your pre-registered clients.',
                        */
                    add_title: 'Add this new item',
                    clear_title: 'Clear the input field',
                    clientid_label: 'Client Unique Identifier:',
                    conf_dynaccess_allowed_label: 'Allow dynamic registration with an initial access token:',
                    conf_dynaccess_url_label: 'Dynamic registration with access token URL:',
                    conf_dynopen_allowed_label: 'Allow open dynamic registration:',
                    conf_dynopen_url_label: 'Open dynamic registration URL:',
                    conf_pre_label: 'Allow pre-registration:',
                    contact_label: 'Email address:',
                    contact_ph: 'me@example.com',
                    contact_th: 'Email addresses',
                    contact_title: 'Register at least one contact email address',
                    contact_delete_title: 'Remove the "%s" contact address',
                    contact_plus_title: 'Add a new contact address',
                    contacts_tab: 'Contacts',
                    create_btn: 'Create',
                    createdat_th: 'Created at',
                    createdby_th: 'Created by',
                    cred_dynat_authent_label: 'Request the client to always authenticate ?',
                    cred_dynat_issue_label: 'Always issue a secret to the client ?',
                    cred_dynat_type_label: 'Secret type ?',
                    cred_dynopen_authent_label: 'Request the client to always authenticate ?',
                    cred_dynopen_issue_label: 'Always issue a secret to the client ?',
                    cred_dynopen_type_label: 'Secret type ?',
                    credentials_label: 'Authentification mode:',
                    delete_secret_title: 'Delete this secret',
                    description_label: 'Description:',
                    description_ph: 'A free description',
                    description_title: 'A free, single-line, description of your client application',
                    domain_all_label: 'Must all client provided URL\'s share the same domain ?',
                    domain_docs_label: 'Must documents URL\'s share the same domain ?',
                    domain_endpoints_label: 'Must redirection endpoint URL\'s share the same domain ?',
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_success: 'The "%s" client has been successfully updated.',
                    edit_title: 'Edit "%s" client',
                    endpoint_label: 'Redirect URL:',
                    endpoint_ph: 'https://me.example.com',
                    endpoint_th: 'Redirection endpoints',
                    endpoint_delete_title: 'Remove the "%s" endpoint URL',
                    endpoint_plus_title: 'Add a new endpoint URL',
                    endpoints_tab: 'Endpoints',
                    granttype_label: 'Grant Types:',
                    id_label: 'Client identifier:',
                    id_title: 'Identifiers',
                    jwtsource_label: 'JWT Privacy source:',
                    //jwtdata_ph: 'Either a X509 certificate, or a JWK public key, or the URI of such a JWK set',
                    //jwtdata_title: 'The origin of the JWT source control',
                    jwtdata_label: 'Content:',
                    jwtdata_ph: 'Either a X509 certificate, or a JWK public key, or the URI of such a JWK set',
                    jwtdata_title: 'The origin of the JWT source control',
                    label_label: 'Label:',
                    label_ph: 'A friendly label',
                    label_title: 'This label will be displayed to the end-user: it should be explicit and clear for the reader',
                    nature_label: 'Client nature:',
                    new_secret_label: 'Define a new secret',
                    new_secret_title: 'Defining a new secret',
                    new_success: 'The "%s" client has been successfully created.',
                    new_title: 'Register a client',
                    none_text: 'The list is empty',
                    nosecret_text: 'No secret has yet been generated',
                    oauth_tab: 'OAuth characteristics',
                    prereg_name_label: 'Client name:',
                    public_dynaccess_allowed_label: 'Allow dynamic registration with an initial access token:',
                    public_dynaccess_url_label: 'Dynamic registration with access token URL:',
                    public_dynopen_allowed_label: 'Allow open dynamic registration:',
                    public_dynopen_url_label: 'Open dynamic registration URL:',
                    public_pre_label: 'Allow pre-registration:',
                    properties_tab: 'Properties',
                    response_types_label: 'Response Types:',
                    secret_label: 'Secrets:',
                    secret_new: 'Secret:',
                    secret_text: 'A new secret has been been randomly generated for the client.<br />'
                        +'Please securely copy the below secret, and keep it safe.<br />'
                        +'Be conscious that <span class="iziam">izIAM</span> does NOT keep the clear secret, and so will not be able to re-provide this same secret if it happened you lose it.<br />'
                        +'In such a case, the only solution will be to defined a new secret, most probably inside of a new validity period.',
                    softid_label: 'Software Id.:',
                    softid_ph: 'An identifier',
                    softid_title: 'A free, single-line, identifier of your software (maybe its name ?)',
                    softver_label: 'Software version:',
                    softver_ph: 'A version number',
                    softver_title: 'When relevant, set here the version number of your client application',
                    type_label: 'Client type:',
                    url_auto: 'Your registration endpoint URL: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                }
            },
            contact: {
                link: 'Contact',
                message: 'Your message:',
                emailcc: 'Please, send me a copy by email',
                emailaddress: 'My email address:',
                send: 'Send',
                res_success: 'Your message has been successfully sent. Thanks',
                res_error: 'Due to a temporary error, we are unfortunately unable to send your message. Please be kind enough to try later.',
                email_subject: 'Web Contact'
            },
            cookies: {
                illimited: 'Illimited',
                language: 'Record the preferred language',
                teswitch: 'Keep last editor switch state'
            },
            definitions: {
                auth_rfc: {
                    none: 'None',
                    oauth: 'OAuth 2.0 [RFC6749]',
                    oid: 'OpenID 1.0 on top of OAuth 2.0',
                    select_text: 'Choose the protocol for the client type'
                },
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
                client_nature: {
                    conf_label: 'Trusted user-oriented',
                    conf_description: 'Your client application requires user authentification and needs user consent, but runs on a trusted server.',
                    generic_label: 'Generic',
                    generic_description: 'If your use case doesn\'t fall in any of the previous categories, then you will have to dive '
                        +'into the full set of configuration parameters.',
                    m2m_label: 'Machine-to-Machine',
                    m2m_description: 'Machine-to-machine scenarii are not runned on behalf a particular user, nor they need any sort of user consent. '
                        +'This gathers for example running automated tasks or background processes.',
                    public_label: 'User-device user-oriented',
                    public_description: 'A web single-page application as well as a mobile or a native desktop application which requires user authentication, '
                        +'as soon as it runs on a untrustable user device.',
                    select_text: 'Choose the nature of your client'
                },
                client_registration: {
                    mode_legend: 'Whether and how to allow dynamic registration',
                    none_label: 'Dynamic registration is not allowed',
                    none_sub: 'Not at all! All clients (<i>i.e.</i> applications as well as API) must be pre-registered.',
                    open_label: 'Dynamic registration is opened',
                    open_sub: 'Be warned that this may lead to important security weakness. Maybe this should be restricted via another way '
                        +'(<i>e.g.</i> set a proxy to filter on source IP addresses, or any other way which may be suitable to your use case)',
                    secret_label: 'Dynamic registration may be allowed requiring an initial access token',
                    secret_sub: 'In other words, this option let you offer to a pre-registered client the ability to define itself other applications and API clients '
                        +'using a Client Credentials Flow. This may be a mean term if you really need dynamic registration;'
                },
                client_type: {
                    conf_short: 'Confidential',
                    conf_label: 'Confidential client',
                    public_short: 'Public',
                    public_label: 'Public client',
                    select_text: 'Select the client type',
                },
                features: {
                    dyn_register_label: 'OAuth dynamic registration'
                },
                gender: {
                    female_label: 'Female',
                    male_label: 'Male',
                    none_label: 'None',
                    other_label: 'Other',
                    select_text: 'Select a gender',
                },
                grant_type: {
                    authcode_label: 'Authorization code grant',
                    authcode_description: 'The authorization server returns a single-use authorization code to the client. '
                        +'The client then exchanges the code for an access token.',
                    client_label: 'Client credentials grant',
                    client_description: 'A grant type suitable for machine-to-machine authentication.',
                    device_label: 'Device code grant',
                    device_description: 'Aimed at devices with limited input or display capabilities, such as game consoles or smart TVs.',
                    implicit_label: 'Implicit grant',
                    implicit_description: 'The client application receives the access token immediately after the user gives their consent. '
                        +'<b>This grant flow is deprecated in favor of Authorization code flow.</b>',
                    jwt_label: 'JWT Bearer token grant',
                    jwt_description: 'JSON Web Tokens encrypted and signed using JSON Web Key Sets.',
                    reftoken_label: 'Refresh token grant',
                    reftoken_description: 'Optional, may be exchanged for another access token when the first has expired.',
                    //saml_label: 'SAML 2.0 Bearer Assertion',
                    select_text: 'The grant types the client can use at the token endpoint'
                },
                hmac_alg: {
                    blake2s256_label: 'Blake2s 256',
                    blake2b512_label: 'Blake2b 512',
                    md4_label: 'MD4',
                    md5_label: 'MD5',
                    mdc2_label: 'MDC2',
                    rsamd4_label: 'RSA-MD4',
                    rsamd5_label: 'RSA-MD5',
                    rsamdc2_label: 'RSA-MDC2',
                    rsaripemd160_label: 'RSA-RIPEMD160',
                    rsasha1_label: 'RSA-SHA1',
                    rsasha12_label: 'RSA-SHA1-2',
                    rsasha224_label: 'RSA-SHA224',
                    rsasha256_label: 'RSA-SHA256',
                    rsasha3224_label: 'RSA-SHA3-224',
                    rsasha3256_label: 'RSA-SHA3-256',
                    rsasha3384_label: 'RSA-SHA3-384',
                    rsasha3512_label: 'RSA-SHA3-512',
                    rsasha384_label: 'RSA-SHA384',
                    rsasha512_label: 'RSA-SHA512',
                    rsasha512224_label: 'RSA-SHA512/224',
                    rsasha512256_label: 'RSA-SHA512/256',
                    rsasm3_label: 'RSA-SM3',
                    ripemd160_label: 'RMD160',
                    sha1_label: 'SHA-1',
                    sha224_label: 'SHA-224',
                    sha256_label: 'SHA-256',
                    sha384_label: 'SHA-384',
                    sha512_label: 'SHA-512',
                    sha512224_label: 'SHA-512-224',
                    sha512256_label: 'SHA-512-256',
                    sha3224_label: 'SHA3-224',
                    sha3256_label: 'SHA3-256',
                    sha3512_label: 'SHA3-512',
                    sm3_label: 'SM3',
                    whirlpool_label: 'Whirlpool',
                    select_text: 'Select an HMAC algorithm'
                },
                jwa_alg: {
                    es256_label: 'ECDSA using P-256 and SHA-256',
                    es384_label: 'ECDSA using P-384 and SHA-384',
                    es512_label: 'ECDSA using P-521 and SHA-512',
                    hs256_label: 'HMAC using SHA-256',
                    hs384_label: 'HMAC using SHA-384',
                    hs512_label: 'HMAC using SHA-512',
                    ps256_label: 'RSASSA-PSS using SHA-256 and MGF1 with SHA-256',
                    ps384_label: 'RSASSA-PSS using SHA-384 and MGF1 with SHA-384',
                    ps512_label: 'RSASSA-PSS using SHA-512 and MGF1 with SHA-512',
                    rs256_label: 'RSASSA-PKCS1-v1_5 using SHA-256',
                    rs384_label: 'RSASSA-PKCS1-v1_5 using SHA-384',
                    rs512_label: 'RSASSA-PKCS1-v1_5 using SHA-512',
                    select_text: 'Select your JSON Web Algorithm (JWA)'
                },
                jwk_ope: {
                    decrypt_content_label: 'Decrypt content and validate decryption, if applicable',
                    decrypt_key_label: 'Decrypt key and validate decryption, if applicable',
                    derive_bits_label: 'Derive bits not to be used as a key',
                    derive_key_label: 'Derive key',
                    encrypt_content_label: 'Encrypt content',
                    encrypt_key_label: 'Encrypt key',
                    sign_label: 'Compute digital signature or MAC',
                    verify_label: 'Verify digital signature or MAC',
                    select_text: 'Select optional planned operations'
                },
                jwk_use: {
                    sig_label: 'Signature',
                    enc_label: 'Encryption',
                    select_text: 'Select the JWK usage'
                },
                jwt_private: {
                    jwk_label: 'JSON Public Web Key',
                    jwk_description: 'JSON Public Web Key',
                    x509_label: 'X509 public certificate in PEM format',
                    x509_description: 'X509 public certificate in PEM format',
                    uri_label: 'JSON Web Key Set URI',
                    uri_description: 'JSON Web Key Set URI',
                    select_text: 'Select a source to validate the JWT token'
                },
                locale: {
                    select_text: 'Choose the user\'s locale'
                },
                nodejs_encoding: {
                    utf8_label: 'UTF-8',
                    utf16le_label: 'UTF-16 LE',
                    latin1_label: 'Latin1 (aka ISO-8859-1)',
                    base64_label: 'Base64',
                    base64url_label: 'Base64-URL (RFC4648)',
                    hex_label: 'Hexadecimal',
                    ascii_label: 'Ascii (legacy)',
                    binary_label: 'Binary (legacy)',
                    ucs2_label: 'UCS-2 (legacy)',
                    select_text: 'Select an encoding method'
                },
                response_type: {
                    code_label: 'Authorization Code Grant Flow',
                    none_label: 'None',
                    select_text: 'The response types the client can use in its requests',
                    token_label: 'Implicit Grant Flow'
                },
                yesno: {
                    no_short: 'No',
                    yes_short: 'Yes',
                    select_text: ''
                },
                zoneinfo: {
                    select_text: 'Choose the user\'s zoneinfo'
                }
            },
            ext_notes: {
                list: {
                    head_title: 'Notes'
                },
                panel: {
                    label_label: 'Notes:',
                    label_ph: 'Some notes left to your convenience',
                    tab_title: 'Notes'
                }
            },
            fieldset: {
                api_allowed_dt_title: 'Is API allowed'
            },
            header: {
                available_pages: 'The available pages',
                menu: {
                    managers: 'Managers',
                    configuration: 'Organization configuration',
                    properties: 'Main properties',
                    settings: 'Application settings'
                },
                my_roles: 'My roles',
                switch_label: 'Edit',
                switch_title: 'Activate Edition mode'
            },
            groups: {
                check: {
                    name_empty: 'Name is empty',
                    name_exists: 'Name already exists'
                },
                manager: {
                    btn_plus_label: 'New group',
                    btn_plus_title: 'Define a new group',
                    delete_btn_title: 'Delete "%s" group',
                    delete_confirm: 'You are about to delete the "%s" group. Are you sure ?',
                    delete_success: 'The group "%s" has been successfully deleted',
                    delete_title: 'Delete a group',
                    edit_btn_title: 'Edit "%s" group',
                    export_btn: 'Export...',
                    import_btn: 'Import...',
                    list_tab: 'Groups list',
                    list_unallowed: 'You are unfortunately not allowed to see the list of available groups. Please contact your organization manager.',
                    members_th: 'Members',
                    membership_th: 'Membership',
                    name_th: 'Name',
                    preamble: 'Manage here the groups to be attached to your identities.',
                    total_count: '%s registered group(s)',
                },
                panel: {
                    edit_error: 'An error has occurred. Please retry later.',
                    edit_success: 'The group "%s" has been successfully updated',
                    edit_title: 'Editing the group',
                    groups_tab: 'Group members',
                    identities_th: 'Identities',
                    identities_tab: 'Identity members',
                    name_label: 'Name:',
                    name_ph: 'Group',
                    new_success: 'The group "%s" has been successfully created',
                    new_title: 'Defining a group',
                    properties_tab: 'Properties'
                },
                select: {
                    select_text: 'Select groups'
                }
            },
            identities: {
                check: {
                    emailaddress_empty: 'Email address is empty',
                    emailaddress_exists: 'Email address is already registered',
                    emailaddress_invalid: 'Email address is invalid',
                    family_empty: 'Neither family name nor given name or full name are set, but at least one should',
                    given_empty: 'Neither given name nor family name or full name are set, but at least one should',
                    name_empty: 'Neither full name nor given name or family name are set, but at least one should',
                    phonenumber_empty: 'Phone number is empty',
                    username_empty: 'Username is empty',
                    username_exists: 'Username is already registered',
                },
                manager: {
                    btn_plus_label: 'New identity',
                    btn_plus_title: 'Define a new identity',
                    delete_btn_title: 'Delete "%s" identity',
                    delete_confirm: 'You are about to delete the "%s" identity. Are you sure ?',
                    delete_success: 'The identity "%s" has been successfully deleted',
                    delete_title: 'Delete an identity',
                    edit_btn_title: 'Edit "%s" identity',
                    email_th: 'Email addresses',
                    export_btn: 'Export...',
                    group_plus_label: 'New group',
                    group_plus_title: 'Define a new group',
                    import_btn: 'Import...',
                    list_tab: 'Identities list',
                    list_unallowed: 'You are unfortunately not allowed to see the list of available identities. Please contact your organization manager.',
                    locale_th: 'Localization',
                    membership_th: 'Membership',
                    name_th: 'Name',
                    preamble: 'Manage here the identities that your organization is planning to provide.',
                    tab_title: 'Identities Management',
                    total_count: '%s registered identity(ies)',
                    usernames_th: 'Usernames',
                    zoneinfo_th: 'Timezone'
                },
                panel: {
                    addressline1_th: 'Address line 1',
                    addressline2_th: 'Address line 2',
                    addressline3_th: 'Address line 3',
                    address_delete: 'Remove the "%s" phone number',
                    addresslabel_th: 'Label',
                    addresslabel_ph: 'A label',
                    addresslabel_title: 'A label which qualifies the address',
                    addresspreferred_th: 'Preferred',
                    addresses_tab: 'Addresses',
                    birthdate_label: 'Birth date:',
                    birthdate_title: 'Birth date',
                    edit_error: 'An error has occurred. Please retry later.',
                    edit_success: 'Identity "%s" successfully saved',
                    edit_title: 'Editing %s',
                    emailaddress_th: 'Email address',
                    email_delete: 'Remove the "%s" email address',
                    emaillabel_th: 'Label',
                    emaillabel_ph: 'A label',
                    emaillabel_title: 'A label which qualifies the email address',
                    emailpreferred_th: 'Preferred',
                    emailverified_th: 'Verified',
                    emails_tab: 'Emails',
                    family_label: 'Family name:',
                    family_ph: 'Doe',
                    family_title: 'Family name',
                    gender_label: 'Gender:',
                    given_label: 'Given name:',
                    given_ph: 'John',
                    given_title: 'Given name',
                    groups_tab: 'Groups',
                    locale_label: 'Locale:',
                    middle_label: 'Middle name:',
                    middle_ph: 'X.',
                    middle_title: 'Middle name',
                    name_label: 'Name:',
                    name_ph: 'John X. Doe',
                    new_success: 'Identity "%s" successfully saved',
                    new_title: 'Defining a new identity',
                    name_title: 'Full name',
                    nickname_label: 'Nickname:',
                    nickname_ph: 'Nickname',
                    nickname_title: 'Nickname',
                    phonenumber_th: 'Phone number',
                    phone_delete: 'Remove the "%s" phone number',
                    phonelabel_th: 'Label',
                    phonelabel_ph: 'A label',
                    phonelabel_title: 'A label which qualifies the phone number',
                    phonepreferred_th: 'Preferred',
                    phoneverified_th: 'Verified',
                    phones_tab: 'Phones',
                    picture_label: 'Picture:',
                    picture_ph: 'https://me.example.com',
                    picture_title: 'the URL of the user\'s picture',
                    profile_label: 'Profile:',
                    profile_ph: 'https://me.example.com',
                    profile_tab: 'Profile',
                    profile_title: 'the URL of the user\'s profile page',
                    userlabel_th: 'Label',
                    username_delete: 'Remove the "%s" username',
                    username_th: 'Username',
                    usernames_tab: 'Usernames',
                    userpreferred_th: 'Preferred',
                    website_label: 'Website:',
                    website_ph: 'https://me.example.com',
                    website_title: 'the URL of the user\'s web page or blog',
                    zoneinfo_label: 'Zoneinfo:'
                },
                select: {
                    select_text: 'Select members identities'
                }
            },
            image_includer: {
                panel: {
                    url_label: 'Image URL:',
                    url_ph: 'https://ww.example.com/picture'
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
                        +'Do not omit to define at least one manager per organization so that this later can be autonomous.<br />',
                    tab_title: 'Organizations Management'
                }
            },
            memberships: {
                check: {
                    //name_empty: 'Name is empty',
                    //name_exists: 'Name already exists'
                },
                manager: {
                    btn_plus_label: 'New group',
                    btn_plus_title: 'Define a new group',
                    //delete_btn_title: 'Delete "%s" group',
                    //delete_confirm: 'You are about to delete the "%s" group. Are you sure ?',
                    //delete_success: 'The group "%s" has been successfully deleted',
                    //delete_title: 'Delete a group',
                    //edit_btn_title: 'Edit "%s" group',
                    export_btn: 'Export...',
                    import_btn: 'Import...',
                    hierarchy_tab: 'Groups and Identities memberships',
                    list_unallowed: 'You are unfortunately not allowed to see the groups and identities hierarchy. Please contact your organization manager.',
                    //members_th: 'Members',
                    //name_th: 'Name',
                    preamble: 'Manage here the groups and identities hierarchy.',
                    //total_count: '%s registered group(s)',
                },
                panel: {
                    edit_error: 'An error has occurred. Please retry later.',
                    edit_success: 'The group "%s" has been successfully updated',
                    edit_title: 'Editing the group',
                    identities_th: 'Identities',
                    members_tab: 'Members',
                    name_label: 'Name:',
                    name_ph: 'Group',
                    new_success: 'The group "%s" has been successfully created',
                    new_title: 'Defining a group',
                    properties_tab: 'Properties'
                },
                select: {
                    select_text: 'Select groups'
                }
            },
            modalinfo: {
                button_validity_title: 'Informations on the validity record',
                button_record_title: 'Informations on the record',
                dialog_title: 'Informations'
            },
            oauth: {
                dynamic_registration: {
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_success: 'The dynamic registration configuration has been successfully updated.',
                    main_tab: 'Availability',
                    modal_title: 'Configure Dynamic Registration'
                },
                endpoints: {
                    authep_label: 'Authorization Endpoint:',
                    authep_title: 'The Authorization Endpoint is used to interact with the resource owner and obtain an authorization grant.\n'
                        +'The Authorization Endpoint published to the clients will be the concatenation of your endpoints root URL and this endpoint path.\n'
                        +'This endpoint is mandatory to build a working OpenID/OAuth API.',
                    authep_url: 'Your Authorization Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_success: 'The "%s" endpoints have been successfully updated.',
                    endpoints_tab: 'Endpoints',
                    jwksep_label: 'JSON Web Key Set URI:',
                    jwksep_title: 'The JSON Web Key Set (JWKS) endpoint is a read-only endpoint that contains the public keys\'s information in the JWKS format.\n'
                        +'The public keys are the counterpart of private keys which are used to sign the tokens.'
                        +'The JWKS Endpoint published to the clients will be the concatenation of your endpoints root URL and this endpoint path.',
                    jwksep_url: 'Your JSON Web Key Set URI: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    logoutep_label: 'Logout Endpoint:',
                    logoutep_title: 'The Logout Endpoint is an optional endpoint that a client application (RP) can call to log out the user.\n'
                        +'Addtionally, this let the end-user a choice to log out of the OpenID provider as well.\n'
                        +'The Logout Endpoint published to the clients will be the concatenation of your endpoints root URL and this endpoint path.',
                    logoutep_url: 'Your Logout Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    modal_title: 'Edit Endpoints',
                    tokenep_label: 'Token Endpoint:',
                    tokenep_title: 'The Token Endpoint is used by the client to obtain an access token by presenting its authorization grant or a refresh token.\n'
                        +'The Token Endpoint is used with every authorization grant except for the implicit grant type.\n'
                        +'The Token Endpoint published to the clients will be the concatenation of your endpoints root URL and this endpoint path.\n'
                        +'This endpoint is mandatory to build a working OpenID/OAuth API.',
                    tokenep_url: 'Your Token Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    userep_label: 'Userinfo Endpoint:',
                    userep_title: 'The UserInfo Endpoint is an OpenID/OAuth protected resource where client applications (RP) can retrieve '
                        +'consented claims about the logged in end-user.\n'
                        +'Clients must present a valid access token (of type Bearer) to retrieve the UserInfo claims.\n'
                        +'Only those claims that are scoped by the token will be made available to the client.\n'
                        +'The UserInfo Endpoint published to the clients will be the concatenation of your endpoints root URL and this endpoint path.',
                    userep_url: 'Your Userinfo Endpoint: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;'
                },
                jwks: {
                    add_title: 'Add this new JWK to the list. It will only be saved when you validate the dialog',
                    alg_label: 'Algorithm:',
                    alg_th: 'Algorithm',
                    clear_title: 'Clear',
                    createdat_th: 'Created at',
                    createdby_th: 'Created by',
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_success: 'The "%s" JWKS has been successfully updated.',
                    id_th: 'Identifier',
                    jwks_tab: 'JSON Web Key Set',
                    label_label: 'JWK label:',
                    label_ph: 'A JSON Web Key friendly label',
                    label_th: 'Label',
                    label_title: 'This is not mandatory, but may help you in the future to identify this particular key',
                    modal_title: 'Edit JSON Web Key Set',
                    mi_title_btn: 'Informations on the JWK item',
                    mi_title_dialog: 'Informations',
                    none_text: 'There is not yet any registered JSON Web Key',
                    opes_label: 'Optional operations:',
                    opes_th: 'Operations',
                    remove_title: 'Remove this JSON Web Key from the list. This will only be saved when you validate the dialog',
                    trash_title: 'This "%s" JWK will be removed on next save',
                    use_label: 'Optional usage:',
                    use_th: 'Usage'
                },
                keygrips: {
                    add_title: 'Add this new JWK to the list. It will only be saved when you validate the dialog',
                    alg_label: 'Algorithm:',
                    alg_title: 'The algorithm to be used when encrypting secrets',
                    clear_title: 'Clear',
                    createdat_th: 'Created at',
                    createdby_th: 'Created by',
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_success: 'The "%s" Keygrips informations have been successfully updated.',
                    encoding_label: 'Encoding:',
                    encoding_title: 'The encoding to render hashes',
                    id_th: 'Identifier',
                    label_label: 'Label:',
                    label_ph: 'A friendly label',
                    label_th: 'Label',
                    label_title: 'This is not mandatory, but may help you in the future to identify this particular secret',
                    modal_title: 'Edit Keygrips',
                    none_text: 'There is not yet any registered Keygrip secret',
                    properties_tab: 'Properties',
                    remove_title: 'Remove this secret from the list. This will only be saved when you validate the dialog',
                    secrets_tab: 'Secrets',
                    trash_title: 'This "%s" secret will be removed on next save',
                },
                manager: {
                    summary_tab: 'Summary',
                    tab_title: 'Authorization Server Configuration',
                },
                summary: {
                    dynreg_label: 'Clients Dynamic Registration',
                    dynreg_sub: 'Whether and how do you want manage your clients dynamic registration.<br />'
                        +'Though this defaults to be disabled, you can decide to open it, either to anyone, or to accept an authentified client to define new clients...',
                    endpoints_label: 'Endpoints',
                    endpoints_sub: 'The endpoints of your authorization server API.<br />'
                        +'Please note that all your endpoints are derived from the base root path set in the Properties theme.',
                    jwks_label: 'JSON Web Key Set',
                    jwks_sub: 'You will need at least one JSON Web Key (JWK) in order to be able to sign your issued ID and Access tokens, or to issue signed JSON Web '
                        +'tokens (JWTs), or also to be able to handle such requests from your customers.',
                    keygrips_label: 'Keygrips',
                    keygrips_sub: 'As part of cookies security, use keygrips to sign your cookies and so improve tampering prevention. We recommend to rotate regularly '
                        +'(by prepending new keys) with a reasonable interval and keep a reasonable history of keys to allow for returning user session cookies to '
                        +'still be valid and re-signed.',
                    properties_label: 'Properties',
                    properties_sub: 'The organization main properties, as its unique name, the base path which determines all endpoints URLs, and also some relevant links '
                        +'to be displayed to your users, an organization logo and so on...<br />'
                        +'Also manage here the validity periods of your organization data sets.'
                }
            },
            openid: {
                manager: {
                    conf_title: 'Your OpenID Configuration',
                    meta_title: 'Your Published OpenID Metadata',
                    preamble: 'Manage here both the OpenID configuration of your organization, and the OpenID Metadata that you will want publish.<br />'
                        +'As you will see, and the same way we may want use some providers but not publish their scope, or publish only part of them, '
                        +'the publication of your configuration parameters may be mandatory, or recommended, or even only optional.<br />',
                    tab_title: 'OpenID Configuration'
                },
                panel: {
                    advtab_title: 'OpenID Advanced',
                    authep_title: 'The Authorization Endpoint performs Authentication of the End-User. '
                        +'This is done by sending the User Agent to the Authorization Server\'s Authorization Endpoint for Authentication and Authorization, '
                        +'using request parameters defined by OAuth 2.0 and additional parameters and parameter values defined by OpenID Connect. '
                        +'Communication with the Authorization Endpoint MUST utilize TLS. '
                        +'(from OpenID specifications)',
                    jwksuri_label: 'JWKS Document URI:',
                    jwksuri_title: 'URL of the OpenID Provider\'s JSON Web Key Set document. This contains the signing key(s) the RP uses to validate signatures '
                        +'from the OP. The JWK Set MAY also contain the Server\'s encryption key(s), which are used by RPs to encrypt requests to the Server. '
                        +'When both signing and encryption keys are made available, a use (Key Use) parameter value is REQUIRED for all keys in the referenced '
                        +'JWK Set to indicate each key\'s intended usage. (from OpenID specifications)',
                    mastertoken_legend: 'API Access Master Token',
                    mtdelete_title: 'Token deletion',
                    mtdelete_confirm: 'You are about to delete a Master access token.<br />Clients using this token will no more be able to access your APIs.<br />Are you sure ?',
                    mtlength_label: 'Token length:',
                    mtlength_title: 'The length of your master token. izIAM makes sure it is at least %s.',
                    mtdate_th: 'Generated on',
                    mtminus_title: 'Delete this token',
                    mtname_th: 'Name',
                    mtname_label: 'Name:',
                    mtname_title: 'in order to make your management easier, give a name to your newly generated master access token',
                    mtplus_title: 'Define a new master access token',
                    mtnew_label: 'New tokens:',
                    mtokens_label: 'Existing tokens:',
                    mttoken_th: 'Token',
                    mttoken_title: 'Your new master access token. We will NOT store it. Copy it and take care of keeping it secret.',
                    tab_title: 'OpenID',
                    registep_label: 'Registration Endpoint:',
                    registep_title: 'URL of the OP\'s Dynamic Client Registration Endpoint '
                        +'Communication with the Authorization Endpoint MUST utilize TLS. '
                        +'(from OpenID specifications)',
                    uinfoep_label: 'UserInfo Endpoint:',
                    uinfoep_title: 'The UserInfo Endpoint is an OAuth 2.0 Protected Resource that returns Claims about the authenticated End-User. '
                        +'To obtain the requested Claims about the End-User, the Client makes a request to the UserInfo Endpoint using an Access Token obtained '
                        +'through OpenID Connect Authentication. These Claims are normally represented by a JSON object that contains a collection of name and '
                        +'value pairs for the Claims.'
                        +'Communication with the Authorization Endpoint MUST utilize TLS. '
                        +'(from OpenID specifications)'
                },
                specs: {
                    acr_values_supported: 'JSON array containing a list of the Authentication Context Class References that this OP supports.',
                    authorization_endpoint: 'URL of the OP\'s OAuth 2.0 Authorization Endpoint.',
                    claim_types_supported: 'JSON array containing a list of the Claim Types that the OpenID Provider supports. '
                        +'These Claim Types are described in Section 5.6 of OpenID Connect Core 1.0. Values defined by this specification are normal, '
                        +'aggregated, and distributed. If omitted, the implementation supports only normal Claims.',
                    claims_locales_supported: 'Languages and scripts supported for values in Claims being returned, represented as a JSON array of BCP47 '
                        +'language tag values. Not all languages and scripts are necessarily supported for all Claim values.',
                    claims_parameter_supported: 'Boolean value specifying whether the OP supports use of the claims parameter, with true indicating support. '
                        +'If omitted, the default value is false.',
                    claims_supported: 'JSON array containing a list of the Claim Names of the Claims that the OpenID Provider MAY be able to supply values for. '
                        +'Note that for privacy or other reasons, this might not be an exhaustive list.',
                    display_values_supported: 'JSON array containing a list of the display parameter values that the OpenID Provider supports. '
                        +'These values are described in Section 3.1.2.1 of OpenID Connect Core 1.0.',
                    grant_types_supported: 'JSON array containing a list of the OAuth 2.0 Grant Type values that this OP supports. '
                        +'Dynamic OpenID Providers MUST support the authorization_code and implicit Grant Type values and MAY support other Grant Types. '
                        +'If omitted, the default value is ["authorization_code", "implicit"].',
                    id_token_encryption_alg_values_supported: 'JSON array containing a list of the JWE encryption algorithms (alg values) supported by the '
                        +'OP for the ID Token to encode the Claims in a JWT.',
                    id_token_encryption_enc_values_supported: 'JSON array containing a list of the JWE encryption algorithms (enc values) supported by the OP '
                        +'for the ID Token to encode the Claims in a JWT.',
                    id_token_signing_alg_values_supported: 'JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for '
                        +'the ID Token to encode the Claims in a JWT. The algorithm RS256 MUST be included. '
                        +'The value none MAY be supported, but MUST NOT be used unless the Response Type used returns no ID Token from the Authorization Endpoint '
                        +'(such as when using the Authorization Code Flow).',
                    issuer: 'URL using the https scheme with no query or fragment component that the OP asserts as its Issuer Identifier. '
                        +'If Issuer discovery is supported (see Section 2), this value MUST be identical to the issuer value returned by WebFinger. '
                        +'This also MUST be identical to the iss Claim value in ID Tokens issued from this Issuer.',
                    jwks_uri: 'URL of the OP\'s JSON Web Key Set document. This contains the signing key(s) the RP uses to validate signatures from the OP. '
                        +'The JWK Set MAY also contain the Server\'s encryption key(s), which are used by RPs to encrypt requests to the Server. '
                        +'When both signing and encryption keys are made available, a use (Key Use) parameter value is REQUIRED for all keys in the '
                        +'referenced JWK Set to indicate each key\'s intended usage. '
                        +'Although some algorithms allow the same key to be used for both signatures and encryption, doing so is NOT RECOMMENDED, as it is less secure. '
                        +'The JWK x5c parameter MAY be used to provide X.509 representations of keys provided. '
                        +'When used, the bare key values MUST still be present and MUST match those in the certificate.',
                    op_policy_uri: 'URL that the OpenID Provider provides to the person registering the Client to read about the OP\'s requirements on how the Relying Party '
                        +'can use the data provided by the OP. The registration process SHOULD display this URL to the person registering the Client if it is given.',
                    op_tos_uri: 'URL that the OpenID Provider provides to the person registering the Client to read about OpenID Provider\'s terms of service. '
                        +'The registration process SHOULD display this URL to the person registering the Client if it is given.',
                    registration_endpoint: 'URL of the OP\'s Dynamic Client Registration Endpoint.',
                    request_object_encryption_alg_values_supported: 'JSON array containing a list of the JWE encryption algorithms (alg values) supported by the OP '
                        +'for Request Objects. These algorithms are used both when the Request Object is passed by value and when it is passed by reference.',
                    request_object_encryption_enc_values_supported: 'JSON array containing a list of the JWE encryption algorithms (enc values) supported by the OP '
                        +'for Request Objects. These algorithms are used both when the Request Object is passed by value and when it is passed by reference.',
                    request_object_signing_alg_values_supported: 'JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for '
                        +'Request Objects, which are described in Section 6.1 of OpenID Connect Core 1.0. These algorithms are used both when the Request Object '
                        +'is passed by value (using the request parameter) and when it is passed by reference (using the request_uri parameter). '
                        +'Servers SHOULD support none and RS256.',
                    request_parameter_supported: 'Boolean value specifying whether the OP supports use of the request parameter, with true indicating support. '
                        +'If omitted, the default value is false.',
                    request_uri_parameter_supported: 'Boolean value specifying whether the OP supports use of the request_uri parameter, with true indicating support. '
                        +'If omitted, the default value is true.',
                    require_request_uri_registration: 'Boolean value specifying whether the OP requires any request_uri values used to be pre-registered using '
                        +'the request_uris registration parameter. Pre-registration is REQUIRED when the value is true. If omitted, the default value is false.',
                    response_modes_supported: 'JSON array containing a list of the OAuth 2.0 response_mode values that this OP supports, as specified in OAuth 2.0 '
                        +'Multiple Response Type Encoding Practices. If omitted, the default for Dynamic OpenID Providers is ["query", "fragment"].',
                    response_types_supported: 'JSON array containing a list of the OAuth 2.0 response_type values that this OP supports. '
                        +'Dynamic OpenID Providers MUST support the code, id_token, and the "token id_token" Response Type values.',
                    scopes_supported: 'JSON array containing a list of the OAuth 2.0 scope values that this server supports. The server MUST support the openid scope value. '
                        +'Servers MAY choose not to advertise some supported scope values even when this parameter is used, '
                        +'although those defined in OpenID.Core SHOULD be listed, if supported.',
                    service_documentation: 'URL of a page containing human-readable information that developers might want or need to know when using the OpenID Provider. '
                        +'In particular, if the OpenID Provider does not support Dynamic Client Registration, then information on how to register Clients needs '
                        +'to be provided in this documentation.',
                    subject_types_supported: 'JSON array containing a list of the Subject Identifier types that this OP supports. Valid types include pairwise and public.',
                    token_endpoint: 'URL of the OP\'s OAuth 2.0 Token Endpoint. This is REQUIRED unless only the Implicit Flow is used.',
                    token_endpoint_auth_methods_supported: 'JSON array containing a list of Client Authentication methods supported by this Token Endpoint. '
                        +'The options are client_secret_post, client_secret_basic, client_secret_jwt, and private_key_jwt, as described in Section 9 of OpenID Connect Core 1.0. '
                        +'Other authentication methods MAY be defined by extensions. '
                        +'If omitted, the default is client_secret_basic -- the HTTP Basic Authentication Scheme specified in Section 2.3.1 of OAuth 2.0.',
                    token_endpoint_auth_signing_alg_values_supported: 'JSON array containing a list of the JWS signing algorithms (alg values) supported by the '
                        +'Token Endpoint for the signature on the JWT used to authenticate the Client at the Token Endpoint for the private_key_jwt and client_secret_jwt '
                        +'authentication methods. Servers SHOULD support RS256. The value none MUST NOT be used.',
                    ui_locales_supported: 'Languages and scripts supported for the user interface, represented as a JSON array of BCP47 language tag values.',
                    userinfo_endpoint: 'URL of the OP\'s UserInfo Endpoint. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.',
                    userinfo_encryption_alg_values_supported: 'JSON array containing a list of the JWE encryption algorithms (alg values) supported by the '
                        +'UserInfo Endpoint to encode the Claims in a JWT.',
                    userinfo_encryption_enc_values_supported: 'JSON array containing a list of the JWE encryption algorithms (enc values) supported by the '
                        +'UserInfo Endpoint to encode the Claims in a JWT.',
                    userinfo_signing_alg_values_supported: 'JSON array containing a list of the JWS signing algorithms (alg values) supported by the UserInfo '
                        +'Endpoint to encode the Claims in a JWT. The value none MAY be included.'
                }
            },
            organizations: {
                check: {
                    authep_mandatory: 'The Authorization Endpoint is mandatory for a working OpenID/OAuth API',
                    authep_short: 'The Authorization Endpoint must have at least one char',
                    authep_starts: 'The Authorization Endpoint must start with a "/"',
                    authrfc_empty: 'The Authorization protocol is not set',
                    authrfc_invalid: 'The Authorization protocol is not valid',
                    baseurl_exists: 'This base URL is already used',
                    baseurl_invalid: 'The base URL is not valid',
                    baseurl_mandatory: 'The base URL should be set to have a working API',
                    baseurl_onelevel: 'The base URL must be only one level',
                    baseurl_reserved: 'The used path happens to be a reserved word',
                    baseurl_short: 'The base URL must have at least one char',
                    baseurl_starts: 'The base URL must be absolute (start with a "/")',
                    boolean_expected: '%s boolean value is not valid',
                    confdynurl_mandatory: 'The registration URL should be set to allow confidential clients to dynamically register',
                    confdynurl_invalid: 'The registration URL is not valid',
                    confdynurl_short: 'The registration URL must have at least one char',
                    confdynurl_starts: 'The registration URL must be absolute (start with a "/")',
                    contactemail_invalid: 'Contact email address is not valid',
                    gdprurl_invalid: 'GDPR URL is not a valid web URI',
                    gtuurl_invalid: 'GTU URL is not a valid web URI',
                    homeurl_invalid: 'Home page URL is not a valid web URI',
                    jwks_empty: 'Must have at least one JSON Web Key',
                    keygrips_empty: 'Must have at least one Keygrip',
                    label_exists: 'This label already exists',
                    label_unset: 'The label is mandatory',
                    legalsurl_invalid: 'Legals URL is not a valid web URI',
                    logouri_invalid: 'Logo URI is not valid',
                    logoutep_short: 'The Logout Endpoint must have at least one char',
                    logoutep_starts: 'The Logout Endpoint must start with a "/"',
                    mastertokenlength_lessthan: 'Master access token length must be or equal to %s',
                    mastertokenlength_unset: 'Master access token length is mandatory',
                    pubdynurl_mandatory: 'The registration URL should be set to allow public clients to dynamically register',
                    pubdynurl_invalid: 'The registration URL is not valid',
                    pubdynurl_short: 'The registration URL must have at least one char',
                    pubdynurl_starts: 'The registration URL must be absolute (start with a "/")',
                    secret_type_invalid: 'The chosen %s credentials type is invalid',
                    secret_type_mandatory: 'A secret type must be selected for %s',
                    supportemail_invalid: 'Support email address is not valid',
                    supporturl_invalid: 'Support page URL is not a valid web URI',
                    tokenep_mandatory: 'The Token Endpoint is mandatory',
                    tokenep_short: 'The Token Endpoint must have at least one char',
                    tokenep_starts: 'The Token Endpoint must start with a "/"',
                    uinfoep_mandatory: 'The UserInfo Endpoint is mandatory',
                    uinfoep_short: 'The UserInfo Endpoint must have at least one char',
                    uinfoep_starts: 'The UserInfo Endpoint must start with a "/"',
                    unknown_client_registration: 'The dynamic registration mode is not known',
                    unknown_encoding: 'Encoding method is not known',
                    unknown_hmacalg: 'HMAC encryption algorithm is not known'
                },
                manager: {
                    api_th: 'API',
                    delete_btn_title: 'Delete the "%s" organization',
                    delete_confirm: 'You are about to delete the "%s" organization.<br />Are you sure ?',
                    delete_success: 'Organization "%s" successively deleted',
                    delete_title: 'Deleting an organization',
                    edit_btn_title: 'Edit the "%s" organization',
                    end_th: 'Validity end',
                    export_btn: 'Export...',
                    import_btn: 'Import...',
                    item_noatdate: 'No record is valid at date, so no possible REST API',
                    item_uncomplete: 'The configuration is not complete, so no working REST API ',
                    item_valid: 'Configuration is valid',
                    label_th: 'Label',
                    list_unallowed: 'You are unfortunately not allowed to consult this list. Please contact your administrator.',
                    managers_th: 'Managers',
                    start_th: 'Validity start',
                    total_count: '%s registered organization(s)',
                    validities_count: '%s validity periods'
                },
                panel: {
                    authent_label: 'Authentifications:',
                    authent_title: 'Choose your authentification providers.',
                    author_label: 'Authorizations:',
                    author_title: 'Choose your authorization providers.',
                    authrfc_title: 'Authentification protocol per client types',
                    create_btn: 'Create',
                    edit_error: 'An unexpected error has occurred. Please retry later.',
                    edit_title: 'Edit "%s" organization',
                    edit_success: 'The "%s" organization has been successfully updated.',
                    logo_tab: 'Logo',
                    new_success: 'The "%s" organization has been successfully created.',
                    properties_tab: 'Properties',
                    urls_tab: 'URLs of Interest'
                },
                properties: {
                    baseurl_label: 'Base URL:',
                    baseurl_ph: '/path',
                    baseurl_title: 'The base path which will prefix all REST requests for your organization. It must be unique.',
                    contactemail_label: 'Contact email:',
                    contactemail_ph: 'contact@example.com',
                    contactemail_title: 'An email address to contact the organization',
                    issuer_label: 'Your endpoints root URL: &laquo;&nbsp;<span class="url">%s</span>&nbsp;&raquo;',
                    label_label: 'Label:',
                    label_ph: 'A friendly unique label',
                    label_title: 'Choose a unique label for your organization.',
                    logo_label: 'Logo URL:',
                    logo_ph: 'https://www.example.com/logo',
                    logo_title: 'The URL to the logo of the organization',
                    managers_label: 'Managers:',
                    managers_modal: 'Organization managers',
                    managers_ph: 'Managers',
                    managers_title: 'This is an information field. To choose managers for your organization, please use the Accounts Manager.',
                    supportemail_label: 'Support email:',
                    supportemail_ph: 'support@example.com',
                    supportemail_title: 'An email address to contact the support',
                    supporturl_label: 'Support page:',
                    supporturl_ph: 'https://www.example.com/support',
                    supporturl_title: 'The URL to the support page of the organization'
                },
                select: {
                    go: 'Go',
                    preamble: '<p>You are allowed to work on several organizations.</p>'
                        +'<p>Please select below the organization you are going to work on now.</p>',
                    text: 'Please choose an organization to work on'
                },
                urls: {
                    gdprurl_label: 'GDPR URL:',
                    gdprurl_ph: 'https://www.example.com/gdpr',
                    gdprurl_title: 'The URL to a document which describes the General Data Protection Regulation policy of the organization',
                    gtuurl_label: 'GTU URL:',
                    gtuurl_ph: 'https://www.example.com/gtu',
                    gtuurl_title: 'The URL to a document which describes the General Terms of Use of the organization',
                    homeurl_label: 'Home page URL:',
                    homeurl_ph: 'https://www.example.com/',
                    homeurl_title: 'The URL to the home page of the organization site',
                    legalsurl_label: 'Legals URL:',
                    legalsurl_ph: 'https://www.example.com/legals',
                    legalsurl_title: 'The URL to a document which provide some legal informations about the organization',
                }
            },
            powered_by: {
                label: 'Powered by Meteor&trade;'
            },
            providers: {
                manager: {
                    adm_preamble: 'Most of these features are optional from the organization point of view, though at least an OpenID provider which provides an \'<code>openid</code>\' scope, '
                        +'should be used by the organization in order to have a workable REST API.<br />',
                    app_preamble: 'As a multi-tenants Identity Access Manager, izIAM aims to be able to meet all the needs of the organizations. '
                        +'As such, all the features are provided by... &laquo;&nbsp;<i>Providers</i>&nbsp;&raquo;. They are responsible to authentificate the users and clients, '
                        +'to authorize them or not depending of the resources they are serving, and more generally to fulfill all requirements needed by an organization which would '
                        +'want exhibit itself as an OpenID/OAuth 2.0 Identity Provider..<br />',
                    all_th: 'All/None',
                    allproviders_title: 'Select all providers / Unselect all providers',
                    allresources_title: 'Select all published resources / Unselect all published resources',
                    allscopes_title: 'Select all published scopes / Unselect all published scopes',
                    features_th: 'Features',
                    export_btn: 'Export...',
                    import_btn: 'Import...',
                    label_th: 'Label',
                    list_unallowed: 'You are unfortunately not allowed to consult this list. Please contact your administrator.',
                    org_title: 'Providers Management',
                    origin_th: 'Origin',
                    pubresources_th: 'Published resources',
                    pubscopes_th: 'Published scopes',
                    resources_th: 'Resources',
                    selected_th: 'Providers selection',
                    scoped_preamble: 'From your point of view as an organization manager, you should consider at least one provider for each feature you are searching to fullfill, '
                        +'and at least one provider with an \'<code>openid</code>\' scope in order to have a workable OpenID REST API.<br />'
                        +'Please also notes that <b>all</b> scopes defined by the providers you are choosing here will be available to you. '
                        +'The <i>Published scopes</i> only refers to the OAuth scopes publicly available in your OpenID Configuration Metadata.',
                    scopes_th: 'OAuth Scopes',
                    scopes_title: 'OAuth Scopes',
                    tab_title: 'Available Providers',
                    total_count: '%s defined provider(s)'
                },
                panel: {
                },
                select: {
                    authent_title: 'Choose your authentification providers:',
                    author_title: 'Choose your authorization providers:'
                }
            },
            resources: {
                check: {
                    claim_exists: 'This scope/claim already exists',
                    claim_hasspaces: 'Claim must not contain any space character',
                    claim_noscope: 'A claim mus tbe attached to a scope',
                    resource_exists: 'This resource already exists',
                    scope_exists: 'This scope already exists for this resource',
                    scope_hasspaces: 'Scope name must not contain any space character'
                },
                manager: {
                    btn_plus_label: 'New resource',
                    btn_plus_title: 'Define a new resource',
                    delete_btn_title: 'Delete the "%s" resource',
                    delete_confirm: 'You are about to delete the "%s" resource. Are you sure ?',
                    delete_success: 'Resource "%s" successfully deleted',
                    delete_title: 'Deleting a resource',
                    edit_btn_title: 'Edit the "%s" resource',
                    enabled_th: 'Enabled',
                    export_btn: 'Export...',
                    id_th: 'ClientId',
                    import_btn: 'Import...',
                    label_th: 'Label',
                    list_tab: 'Resources list',
                    list_unallowed: 'You are unfortunately not allowed to consult this list. Please contact your organization manager',
                    name_th: 'Name',
                    preamble: 'Manage here resources and scopes provided by the organization.<br/>'
                        +'<span class="iziam">izIAM</span> lets you define resources and scopes as single entities, as well as attach scopes to resources.<br />'
                        +'Scopes and claims SHOULD be lowercases, MUST be single words, without any space character.<br />'
                        +'We advise you to have resources named the same way.<br />',
                    scopes_th: 'Scopes',
                    tab_title: 'Resources <i>(aka &laquo;&nbsp;API&nbsp;&raquo;)</i> Management',
                    total_count: '%s registered resource(s)'
                },
                panel: {
                    edit_error: 'An error has unfortunately happened. Please retry later.',
                    edit_success: 'Resource "%s" successfully updated',
                    edit_title: 'Editing "%s"',
                    enabled_label: 'Enabled:',
                    enabled_title: 'Whether this resource/scope/claim is enabled',
                    label_label: 'Label:',
                    label_ph: 'A friendly name',
                    label_title: 'A friendly name for the resource',
                    name_label: 'Name:',
                    name_ph: 'https://resource.example.com, urn:resource.example.com, ...',
                    name_title: 'Define the unique name of the resource',
                    new_success: 'Resource "%s" successfully created',
                    new_title: 'New resource',
                    properties_tab: 'Properties'
                },
                select: {
                    select_text: 'Select a resource'
                }
            },
            scopes: {
                panel: {
                    add_title: 'Add this scope to the existing list',
                    clear_title: 'Reset the input',
                    description_label: 'Description:',
                    description_ph: 'A description of the scope',
                    description_th: 'Description',
                    description_title: 'A one-line description of the scope',
                    name_label: 'Name:',
                    name_ph: 'A scope unique name',
                    name_th: 'Name',
                    name_title: 'A scope managed by the resource, which can be later be requested by a client',
                    none_text: 'There is not yet any scope in the list',
                    remove_title: 'Remove this scope from the list',
                    scopes_tab: 'Scopes',
                    trash_title: 'Delete this "%s" scope'
                }
            },
            settings: {
                manager: {
                    tab_title: 'Global settings'
                }
            },
            status: {
                manager: {
                    tab_title: 'Status'
                }
            },
            validities: {
                band: {
                    free_from: 'Free from %s',
                    free_fromto: 'Free from %s until %s',
                    free_to: 'Free until %s',
                    used_from: 'Used from %s',
                    used_fromto: 'Used from %s until %s',
                    used_fromto_infinite: 'Used from infinite to infinite',
                    used_to: 'Used until %s'
                },
                check: {
                    end_incompatible: 'Ending date is incompatible with other validity periods',
                    invalid_date: 'Date is not valid',
                    invalid_period: 'Starting and ending dates do not make a valid interval',
                    start_incompatible: 'Starting date is incompatible with other validity periods'
                },
                panel: {
                    confirm_mergeleft: 'Merging with previous period means keeping these current data, consolidating the validity periods. Are you sure ?',
                    confirm_mergeright: 'Merging with next period means keeping these current data, consolidating the validity periods. Are you sure ?',
                    confirm_remove: 'You are about to remove the validity period. Are you sure ?',
                    end_legend: 'Valid until',
                    from: 'From %s',
                    fromto: 'From %s to %s',
                    infinite: 'infinite',
                    start_legend: 'Valid from',
                    text_empty: 'There is currently not any available validity period.<br />'
                        +'You can try to define a new one by decreasing some registered validity period(s).',
                    text_one: 'The following periods are not covered by any validity record.<br />'
                        +'If this is not what you want, you have to increase some validity periods.',
                    to: 'To %s'
                },
                plus: {
                    from: 'From %s',
                    fromto: 'From %s to %s',
                    upto: 'Up to %s'
                },
                select: {
                    def_label: 'Select the applying validity period',
                    from: 'From %s',
                    full: 'Full time',
                    fromto: 'From %s to %s',
                    to: 'Up to %s'
                },
                tab: {
                    from: 'From %s',
                    full: 'Full validity',
                    holes: 'Availabilities',
                    mergeleft: 'Merge with previous period',
                    mergeright: 'Merge with next period',
                    mi_info: 'Record informations',
                    mi_title: 'Informations',
                    remove: 'Remove the period',
                    to: 'To %s'
                }
            }
        }
    }
};
