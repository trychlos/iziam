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
            app: {
                label: 'The Easy Identity and Access Manager'
            },
            assistant: {
                confirm_btn: 'Confirm',
                confirm_title: 'Confirm your choices',
                next_btn: 'Next',
                next_title: 'Go to the next page'
            },
            auth: {
                error: {
                    title: 'Oops! Something went wrong'
                }
            },
            clients: {
                checks: {
                    application_type_invalid: 'The application type is unknown or not valid',
                    client_type_invalid: 'The client type is unknown or not valid',
                    client_type_unset: 'The client type is not set',
                    clientid_unset: 'The client identifier is not set',
                    contact_invalid: 'The contact email address is not valid',
                    contact_unset: 'An email address must be provided',
                    enabled_invalid: 'The enabled status is invalid',
                    home_host: 'The home URI wants a hostname',
                    home_https: 'The home URI wants only HTTPS scheme',
                    home_invalid: 'The home URI is not valid',
                    grant_types_invalid: 'The current authorization flow and grant types selection is not valid',
                    grant_types_unset: 'The current authorization flow and grant types selection is not set',
                    label_exists: 'The label is already used by another client',
                    label_unset: 'The label is not set',
                    logo_host: 'The logo URI wants a hostname',
                    logo_https: 'The logo URI wants only HTTPS scheme',
                    logo_invalid: 'The logo URI is not valid',
                    privacy_host: 'The privacy policy URI wants a hostname',
                    privacy_https: 'The privacy policy URI wants only HTTPS scheme',
                    privacy_invalid: 'The privacy policy URI is not valid',
                    profile_invalid: 'The chosen profile is unknown or not valid',
                    redirect_fragment: 'The redirect URL contains a fragment component, which is forbidden',
                    redirect_host: 'Redirect URLs want a hostname',
                    redirect_http: 'Redirect URLs cannot use HTTP scheme for security reasons',
                    redirect_invalid: 'The redirect URL is not a valid URI',
                    redirect_needed: 'The defined grant flow wants at least one redirection URI',
                    redirect_unset: 'The redirect URL is not set',
                    tos_host: 'The terms of service URI wants a hostname',
                    tos_https: 'The terms of service URI wants only HTTPS scheme',
                    tos_invalid: 'The terms of service URI is not valid'
                },
                contacts: {
                    add_title: 'Add a new contact email address',
                    contact_ph: 'me@example.com',
                    contact_th: 'Email',
                    remove_title: 'Remove this contact address'
                },
                delete: {
                    confirmation_text: 'You are about to delete the "%s" client.<br />Are you sure ?',
                    confirmation_title: 'Deleting a client'
                },
                edit: {
                    application_type_label: 'Application type :',
                    auth_flow_tab_title: 'Authorization flow',
                    auth_method_tab_title: 'Authentication method',
                    client_type_label: 'Client type :',
                    config_tab_title: 'Configuration',
                    contacts_tab_title: 'Contacts',
                    contacts_text: 'You are allowed to defined here the contacts of the client to your organization.<br />'
                        +'These contacts may be displayed to end-users.',
                    description_label: 'Description :',
                    description_ph: 'The client description',
                    description_title: 'A not too long description (which are not notes)',
                    edit_success: 'The client "%s" has been successfully updated',
                    enabled_label: 'Client is enabled',
                    entity_notes_tab_title: 'Common notes',
                    entity_validities_tab_title: 'By validity period(s)',
                    error: 'Unfortunately, an error has been detected./ Please retry later',
                    home_label: 'Home page URI :',
                    home_ph: 'https://my.example.com/',
                    home_title: 'The URI of a web site',
                    jwks_tab_title: 'JSON Web Key Set',
                    label_label: 'Label :',
                    label_ph: 'My unique label',
                    label_title: 'The mandatory, unique, name of your client application',
                    logo_label: 'Logo URI :',
                    logo_ph: 'https://my.example.com/logo.png',
                    logo_title: 'The URI of a logo displayable to an end-user',
                    modal_title: 'Edit the "%s" client',
                    new_success: 'The client "%s" has been successfully created',
                    privacy_label: 'Privacy policy page URI :',
                    privacy_ph: 'https://my.example.com/privacy',
                    privacy_title: 'The URI of a page which describes the privacy policy of the client',
                    profile_label: 'Profile :',
                    properties_tab_title: 'Properties',
                    providers_tab_title: 'Providers',
                    record_notes_tab_title: 'Notes',
                    redirects_tab_title: 'Redirect URLs',
                    redirects_text: 'The authorization flow you have chosen implies to predefine at least one redirection URI.<br />'
                        +'The Authorization Server will restrict the grant flow redirections to one of below URIs.',
                    secrets_tab_title: 'Secrets',
                    softid_label: 'Software identifier :',
                    softid_ph: 'MySoftware',
                    softid_title: 'How the client software identifies itself',
                    softver_label: 'Software version :',
                    softver_ph: 'vx.yy.zzz-aaaa',
                    softver_title: 'The client software version which distinguish it from other registered clients',
                    tos_label: 'Terms of Service page URI :',
                    tos_ph: 'https://my.example.com/tos',
                    tos_title: 'The URI of a page which describes the terms of service of the client'
                },
                jwks: {
                    preamble: 'The JSON Web Key Set (JWKS) is a set of keys containing the public keys used to sign and encrypt any JSON Web Token (JWT) '
                        +'issued by the client.<br />'
                        +'Each JSON Web Key targets either signature or encryption role. Keys can be easily rotated using starting and ending dates.<br />'
                        +'Active JSON Web Key Set is exposed to the Authorization Server either through a <code>JWKS URI</code> or via a whole <code>JWKS document</code>.',
                    tab_title: 'JSON Web Keys Set'
                },
                new: {
                    assistant_title: 'Defining a new client',
                    button_label: 'New client',
                    button_title: 'Define a new client in the organization'
                },
                metadata: {
                    client_name: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">client_name</p>'
                        +'<p class="text">Human-readable string name of the client to be presented to the end-user during authorization.<br />'
                        +'If omitted, the authorization server MAY display the raw "client_id" value to the end-user instead.<br />'
                        +'It is RECOMMENDED that clients always send this field.</p>',
                    client_type: '<p class="source">https://datatracker.ietf.org/doc/html/rfc6749</p>'
                        +'<p class="name">client_type</p>'
                        +'<p class="text">OAuth defines two client types, based on their ability to authenticate securely with the authorization server '
                        +'(i.e., ability to maintain the confidentiality of their client credentials):<br />'
                        +'<ul><li><em>Confidential</em> clients are expected capable of maintaining the confidentiality of their credentials (e.g., client implemented '
                        +'on a secure server with restricted access to the client credentials), or capable of secure client authentication using other means.</li>'
                        +'<li><em>Public</em> clients incapable of maintaining the confidentiality of their credentials (e.g., clients executing on the device used by the '
                        +'resource owner, such as an installed native application or a web browser-based application), and incapable of secure client authentication via '
                        +'any other means./<li></ul></p>',
                    client_uri: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">client_uri</p>'
                        +'<p class="text">URL string of a web page providing information about the client.<br />'
                        +'If present, the server SHOULD display this URL to the end-user in a clickable fashion.<br />'
                        +'It is RECOMMENDED that clients always send this field. The value of this field MUST point to a valid web page.</p>',
                    contacts: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">contacts</p>'
                        +'<p class="text">Array of strings representing ways to contact people responsible for this client, typically email addresses.<br />'
                        +'The authorization server MAY make these contact addresses available to end-users for support requests for the client.<br />'
                        +'See Section 6 for information on Privacy Considerations.</p>',
                    grant_types: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">grant_types</p>'
                        +'<p class="text">Array of OAuth 2.0 grant type strings that the client can use at the token endpoint.<br >'
                        +'These grant types are defined as follows:<br />'
                        +'<ul><li><em>authorization_code</em>: The authorization code grant type defined in OAuth 2.0, Section 4.1.</li>'
                        +'<li><em>implicit</em>: The implicit grant type defined in OAuth 2.0, Section 4.2.</li>'
                        +'<li><em>password</em>: The resource owner password credentials grant type defined in OAuth 2.0, Section 4.3.</li>'
                        +'<li><em>client_credentials</em>: The client credentials grant type defined in OAuth 2.0, Section 4.4.</li>'
                        +'<li><em>refresh_token</em>: The refresh token grant type defined in OAuth 2.0, Section 6.</li>'
                        +'<li><em>urn:ietf:params:oauth:grant-type:jwt-bearer</em>: The JWT Bearer Token Grant Type defined in OAuth JWT Bearer Token Profiles [RFC7523].</li>'
                        +'<li><em>urn:ietf:params:oauth:grant-type:saml2-bearer</em>: The SAML 2.0 Bearer Assertion Grant defined in OAuth SAML 2 Bearer Token Profiles [RFC7522].</li>'
                        +'</ul>'
                        +'If the token endpoint is used in the grant type, the value of this parameter MUST be the same as the value of the "grant_type" '
                        +'parameter passed to the token endpoint defined in the grant type definition.  Authorization servers MAY allow for other values as '
                        +'defined in the grant type extension process described in OAuth 2.0, Section 4.5.  If omitted, the default behavior is that the '
                        +'client will use only the "authorization_code" Grant Type</p>',
                    jwks: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">jwks</p>'
                        +'<p class="text">Client\'s JSON Web Key Set [RFC7517] document value, which contains the client\'s public keys.<br />'
                        +'The value of this field MUST be a JSON object containing a valid JWK Set.<br />'
                        +'These keys can be used by higher-level protocols that use signing or encryption.<br />'
                        +'This parameter is intended to be used by clients that cannot use the "jwks_uri" parameter, such as native clients that cannot host public URLs.<br />'
                        +'The "jwks_uri" and "jwks" parameters MUST NOT both be present in the same request or response.</p>',
                    jwks_uri: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">jwks_uri</p>'
                        +'<p class="text">URL string referencing the client\'s JSON Web Key (JWK) Set [RFC7517] document, which contains the client\'s public keys.<br />'
                        +'The value of this field MUST point to a valid JWK Set document.<br />'
                        +'These keys can be used by higher-level protocols that use signing or encryption. For instance, these keys might be used by some '
                        +'applications for validating signed requests made to the token endpoint when using JWTs for client authentication [RFC7523].<br />'
                        +'Use of this parameter is preferred over the "jwks" parameter, as it allows for easier key rotation.<br />'
                        +'The "jwks_uri" and "jwks" parameters MUST NOT both be present in the same request or response.</p>',
                    logo_uri: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">logo_uri</p>'
                        +'<p class="text">URL string that references a logo for the client.<br />'
                        +'If present, the server SHOULD display this image to the end-user during approval.<br />'
                        +'The value of this field MUST point to a valid image file.</p>',
                    policy_uri: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">policy_uri</p>'
                        +'<p class="text">URL string that points to a human-readable privacy policy document that describes how the deployment organization '
                        +'collects, uses, retains, and discloses personal data. The authorization server SHOULD display this URL to the end-user if it is provided.<br />'
                        +'The value of this field MUST point to a valid web page.</p>',
                    redirect_uris: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">redirect_uris</p>'
                        +'<p class="text">Array of redirection URI strings for use in redirect-based flows such as the authorization code and implicit flows.<br />'
                        +'As required by Section 2 of OAuth 2.0 [RFC6749], clients using flows with redirection MUST register their redirection URI values.<br />'
                        +'Authorization servers that support dynamic registration for redirect-based flows MUST implement support for this metadata value.</p>',
                    response_types: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">response_types</p>'
                        +'<p class="text">Array of the OAuth 2.0 response type strings that the client can use at the authorization endpoint.<br />'
                        +'These response types are defined as follows:<br />'
                        +'<ul><li><em>code</em>: The authorization code response type defined in OAuth 2.0, Section 4.1.</li>'
                        +'<li><em>token</em>: The implicit response type defined in OAuth 2.0, Section 4.2.</li></ul>'
                        +'If the authorization endpoint is used by the grant type, the value of this parameter MUST be the same as the value '
                        +'of the "response_type" parameter passed to the authorization endpoint defined in the grant type definition.<br >'
                        +'Authorization servers MAY allow for other values as defined in the grant type extension process is described in OAuth 2.0, Section 4.5.<br />'
                        +'If omitted, the default is that the client will use only the "code" response type.</p>',
                    scopes: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">scopes</p>'
                        +'<p class="text">Array of scope values (as described in Section 3.3 of OAuth 2.0 [RFC6749]) that the client can use when requesting access tokens.<br />'
                        +'The semantics of values in this list are service specific.<br />'
                        +'If omitted, an authorization server MAY register a client with a default set of scopes.</p>',
                    software_id: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">software_id</p>'
                        +'<p class="text">A unique identifier string (e.g., a Universally Unique Identifier (UUID)) assigned by the client developer or software publisher '
                        +'used by registration endpoints to identify the client software to be dynamically registered.<br />'
                        +'Unlike "client_id", which is issued by the authorization server and SHOULD vary between instances, the "software_id" SHOULD remain the same for '
                        +'all instances of the client software. The "software_id" SHOULD remain the same across multiple updates or versions of the same piece of software.<br />'
                        +'The value of this field is not intended to be human readable and is usually opaque to the client and authorization server.</p>',
                    software_version: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">software_version</p>'
                        +'<p class="text">A version identifier string for the client software identified by "software_id".<br />'
                        +'The value of the "software_version" SHOULD change on any update to the client software identified by the same "software_id".<br />'
                        +'The value of this field is intended to be compared using string equality matching and no other comparison semantics are defined by this specification. '
                        +'The value of this field is outside the scope of this specification, but it is not intended to be human readable and is usually opaque to the client and '
                        +'authorization server. The definition of what constitutes an update to client software that would trigger a change to this value is specific to the '
                        +'software itself and is outside the scope of this specification.</p>',
                    token_endpoint_auth_method: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">token_endpoint_auth_method</p>'
                        +'<p class="text">String indicator of the requested authentication method for the token endpoint.<br />'
                        +'Values defined by the specification are:<br />'
                        +'<ul><li><em>none</em>: The client is a public client as defined in OAuth 2.0, Section 2.1, and does not have a client secret.</li>'
                        +'<li><em>client_secret_post</em>: The client uses the HTTP POST parameters as defined in OAuth 2.0, Section 2.3.1.</li>'
                        +'<li><em>client_secret_basic</em>: The client uses HTTP Basic as defined in OAuth 2.0, Section 2.3.1.</li></ul></p>',
                    tos_uri: '<p class="source">https://datatracker.ietf.org/doc/html/rfc7591</p>'
                        +'<p class="name">tos_uri</p>'
                        +'<p class="text">URL string that points to a human-readable terms of service document for the client that describes a '
                        +'contractual relationship between the end-user and the client that the end-user accepts when authorizing the client.<br />'
                        +'The authorization server SHOULD display this URL to the end-user if it is provided.<br />'
                        +'The value of this field MUST point to a valid web page.</p>'
                },
                new_assistant: {
                    application_nav: 'Application type',
                    application_text: 'The application type is an optional parameter defined in the OpenID Connect 1.0 specification.<br />'
                        +'At the moment, it is only used as a hint when checking the allowed redirect URIs.',
                    assistant_title: 'Defining a new client application',
                    auth_method_nav: 'Authentication method',
                    auth_method_choose_text: 'Please choose below your desired authentication method.',
                    auth_method_confidential_text: 'Confidential clients must authenticate against the Authorization Server token endpoint.',
                    auth_method_public_text: 'Public clients are not expected to be able to authenticate.',
                    client_nav: 'Client type',
                    client_text: 'The client type, in the sense of OAuth specifications, is automatically determined from your chosen client profile. '
                        +'You shouldn\'t need to change it, unless you are really sure of what you are doing, but just in case...',
                    clientid_label: 'Your new client Id. :',
                    contacts_nav: 'Contacts',
                    done_nav: 'Done',
                    grant_type_nav: 'Authorization Grant Flow',
                    grant_type_text: 'For each available grant nature, please choose below the authorization grant flow your client will use, and so the corresponding grant type.',
                    introduction_nav: 'Introduction',
                    introduction_text: 'This assistant will guide you through the process of defining a new client to your Authorization Server.<br/><br />'
                        +'Please be beware that, to make your life easier, this assistant will let you define a client which may be not fully operational. '
                        +'Nonetheless, you always be able to update it later.',
                    jwks_nav: 'JWK Signature and Encryption',
                    jwks_text: 'Want sign and/or encrypt your JSON Web Tokens ? Define here the keys your client will need.',
                    profile_nav: 'Profile',
                    profile_text: 'Choose the application profile which corresponds best to your use case.<br />'
                        +'This will define many other parameters, but you still will be able to modify each of them at your convenience.<br />'
                        +'If none of the proposed profiles suit your needs, just choose the "Generic" one, and set each parameter to your taste.',
                    properties_nav: 'Properties',
                    properties_text: 'Define some properties specific to your client application.',
                    providers_nav: 'Providers',
                    redirects_nav: 'Redirect URLs',
                    secrets_nav: 'Secrets',
                    success_label: 'Congratulations !<br />'
                        +'Your new client has been successfully created.',
                    summary_application_label: 'Application type :',
                    summary_auth_label: 'Authentication method :',
                    summary_client_label: 'Client type :',
                    summary_contacts_label: 'Contacts :',
                    summary_contacts_none: 'None',
                    summary_formaters_label: 'Token extensions :',
                    summary_grant_label: 'Grant types :',
                    summary_jwks_label: 'JSON Web Keys :',
                    summary_legend: 'Summary',
                    summary_name_label: 'Label :',
                    summary_nav: 'Summary',
                    summary_profile_client_label: 'Suggested client type :',
                    summary_profile_features_label: 'Required features :',
                    summary_profile_label: 'Profile :',
                    summary_providers_label: 'Providers :',
                    summary_providers_none: 'None',
                    summary_redirects_label: 'Redirection URIs :',
                    summary_redirects_none: 'None',
                    summary_text: 'You have successfully completed this assistant, at least enough to actually create a new client.<br />'
                        +'The client will be created when you will click on the "Next" button below.<br />'
                        +'The client identifier will be then displayed.',
                    token_extensions_nav: 'Token extensions',
                    token_extensions_text: 'Choose optional tokens extensions, as a specific format or a security add-on.'
                },
                providers: {
                    list_preamble: 'Select here the providers among those allowed by your organization to satisfy the features needed by the client profile you have chosen.'
                },
                redirects: {
                    add_title: 'Add a new redirect URL',
                    remove_title: 'Remove this redirect URL',
                    url_ph: 'https://myapp/redirect?q=a',
                    url_th: 'URL'
                },
                secrets: {
                    checks: {
                        secret_alg_invalid: 'The secret algorithm is invalid',
                        secret_alg_unset: 'The secret algorithm is not set',
                        secret_encoding_invalid: 'The secret encoding is invalid',
                        secret_encoding_unset: 'The secret encoding is not set',
                        secret_size_invalid: 'The secret size is invalid (must be a positive integer)',
                        secret_size_mini: 'The secret size must be greater than %s',
                        secret_size_unset: 'The secret size is not set'
                    },
                    edit: {
                        alg_label: 'Algorithm :',
                        alg_title: 'The algorithm to be chosen to generate the hash',
                        binary_label: 'The chosen encoding produces binary output, thus preventing the hash to be displayed.',
                        clear_label: 'Clear secret :',
                        clear_title: 'The base64-encoded clear secret',
                        edit_dialog_title: 'Editing the "%s" secret',
                        encoding_label: 'Encoding :',
                        encoding_title: 'How to encode the resulting hash ?',
                        expire_label: 'Expire at :',
                        expire_ph: 'yyyy-mm-dd',
                        expire_title: 'An optional date of the secret expiration',
                        hash_label: 'Hash :',
                        hash_title: 'The generated hash',
                        hash_tab_title: 'Secret',
                        label_label: 'Label :',
                        label_title: 'An optional label to this secret',
                        label_ph: 'My label',
                        new_button_label: 'New secret',
                        new_button_title: 'Define a new secret',
                        new_dialog_title: 'Define a new secret',
                        preamble: 'Unless it uses the Implicit flow or is a public client without any authentication mechanism, your client will '
                            +'need to authenticate against the token endpoint.<br />'
                            +'Manage your set or secrets here.',
                        properties_tab_title: 'Properties',
                        size_label: 'Secret size :',
                        size_title: 'The size of the generated secret'
                    },
                    list: {
                        add_title: 'Add a new secret to your list',
                        alg_th: 'Algorithm',
                        created_at_th: 'Created at',
                        created_by_th: 'Created by',
                        delete_confirm_text: 'You are about to delete the "%s" secret.<br />Are you sure ?',
                        delete_confirm_title: 'Delete the "%s" secret',
                        delete_title: 'Delete the "%s" secret',
                        edit_title: 'Edit the "%s" secret',
                        encoding_th: 'Encoding',
                        expire_at_th: 'Expire at',
                        label_th: 'Label',
                        last_created_th: 'Last created',
                        last_expiration_th: 'Last expiration',
                        preamble: 'See below the defined client secrets.'
                    }
                },
                tabular: {
                    application_type_th: 'Application type',
                    authorization_flow_th: 'Grant flow',
                    client_type_th: 'Client type',
                    delete_button_title: 'Delete the "%s" client',
                    edit_button_title: 'Edit the "%s" client',
                    enabled_th: 'Enabled',
                    entity_notes_th: 'Client notes',
                    info_button_title: 'Informations about the "%s" client',
                    info_modal_title: 'Informations about the "%s" client',
                    label_th: 'Label',
                    operational_title: 'Operational status of the client'
                }
            },
            definitions: {
                application_type: {
                    native_description: 'Native clients can only register redirect URIs using a custom or a http loopback scheme. '
                        +'This is most often only possible on mobile applications.',
                    native_label: 'A native application',
                    select_text: 'Select the application type',
                    web_description: 'Web clients can only register redirect URIs using the https non-loopback scheme. '
                        +'This is the most common case, and the OpenID Connect 1.0 default.',
                    web_label: 'A web client, e.g. a Single Page Application'
                },
                auth_flow: {
                    auth_label: 'Authorization code',
                    client_label: 'Client credentials',
                    device_label: 'Device code',
                    hybrid_label: 'Hybrid flow',
                    implicit_label: 'Implicit flow',
                    password_label: 'Resource owner password',
                    select_text: 'Select the authentication flow your client will use'
                },
                auth_method: {
                    private_jwt_desc: 'Uses a client-generated JSON Web Token (JWT) signed with a RSA or ECDSA algorithm to confirm the client\'s identity.',
                    private_jwt_label: 'Private Key JWT Client Authentication',
                    private_jwt_short: 'JWT by private key',
                    secret_jwt_desc: 'Uses a client-generated JSON Web Token (JWT) signed with a HMAC SHA algorithm to confirm the client\'s identity.',
                    secret_jwt_label: 'Shared Secret JWT Client Authentication',
                    secret_jwt_short: 'JWT by shared secret',
                    none_desc: 'No authentication against the token endpoint',
                    none_label: 'None',
                    none_short: 'None',
                    select_text: 'Select the client authentication method',
                    shared_desc: 'A shared secret generated by the authorization server at registration time; the client must use Basic HTTP authentication scheme',
                    shared_label: 'Shared secret - Basic HTTP scheme',
                    shared_short: 'Shared / Basic',
                    post_desc: 'A shared secret generated by the authorization server at registration time; the client uses HTTP POST parameters',
                    post_label: 'Shared secret - HTTP POST parms',
                    post_short: 'Shared / POST'
                },
                client_profile: {
                    confidential_label: 'Trusted user-oriented',
                    confidential_description: 'Your client application requires user authentication and needs user consent, but runs on a trusted server.',
                    generic_label: 'Generic',
                    generic_description: 'If your use case doesn\'t fall in any of the previous categories, then you will have to dive '
                        +'into the full set of configuration parameters.',
                    m2m_label: 'Machine-to-Machine',
                    m2m_description: 'Machine-to-machine scenarii are not runned on behalf a particular user, nor they need any sort of user consent. '
                        +'This gathers for example running automated tasks, background processes or server services or apis.',
                    public_label: 'User-device user-oriented',
                    public_description: 'A web single-page application as well as any desktop application which requires user authentication, '
                        +'as soon as it runs on an (untrustable by nature) user device.',
                    select_text: 'Choose the profile of your client application'
                },
                client_type: {
                    confidential_description: 'The \'confidential\' type should be reserved to server-based code, and only when the Authorization Server '
                        +'considers this server-based code as capable of maintaining the security of the allocated credentials.',
                    confidential_label: 'Confidential client',
                    confidential_short: 'Confidential',
                    confidential_text_oauth20: 'Clients which are considered as capable of maintaining the confidentiality of their credentials '
                        +'(e.g., client implemented on a secure server with restricted access to the client credentials), or capable of secure '
                        +'client authentication using other means.',
                    confidential_text_oauth21: 'Clients that have credentials with the Authorization Server are designated as "confidential clients".',
                    public_description: 'The \'public\' type should be chosen for any code whose security cannot be guaranted, and, in particular, '
                        +'for any code running on a user-accessible device.',
                    public_label: 'Public client',
                    public_short: 'Public',
                    public_text_oauth20: 'Clients which are incapable of maintaining the confidentiality of their credentials '
                        +'(e.g., clients executing on the device used by the resource owner, such as an installed native application or a web '
                        +'browser-based application), and incapable of secure client authentication via any other means.',
                    public_text_oauth21: 'Clients without credentials are called "public clients".',
                    select_text: 'Select the client application type',
                },
                grant_nature: {
                    access_label: 'Access token',
                    refresh_label: 'Refresh token',
                },
                grant_type: {
                    authcode_description: 'The authorization server returns a single-use authorization code to the client. '
                        +'The client then exchanges the code for an access token.',
                    authcode_label: 'Authorization code grant',
                    client_description: 'A grant type suitable for machine-to-machine authentication.',
                    client_label: 'Client credentials grant',
                    device_description: 'Aimed at devices with limited input or display capabilities, such as game consoles or smart TVs.',
                    device_label: 'Device code grant',
                    hybrid_description: 'An OpenID authorization flow which enables clients to obtain some tokens straight from the Authorization Endpoint, '
                        +'while still having the possibility to get others from the Token Endpoint.',
                    hybrid_label: 'Hybrid authorization flow',
                    implicit_description: 'The client application receives the access token immediately after the user gives their consent. '
                        +'<b>This grant flow is deprecated in favor of Authorization code flow.</b>',
                    implicit_label: 'Implicit grant',
                    password_description: 'This grant type should only be used when there is a high degree of trust between the resource owner and the client. '
                        +'<b>This grant flow is deprecated in favor of Authorization code flow.</b>',
                    password_label: 'Resource owner password credentials grant',
                    reftoken_description: 'Optional, may be exchanged for another access token when this later has expired.',
                    reftoken_label: 'Refresh token grant',
                    select_text: 'Select the grant type your client will use at the token endpoint'
                },
                hmac_alg: {
                    blake2b512_label: 'Blake2b 512',
                    blake2s256_label: 'Blake2s 256',
                    md5sha1_label: 'MD5-SHA1',
                    rmd160_label: 'RMD160',
                    shake256_label: 'SHAKE-256',
                    sha2224_label: 'SHA2-224',
                    sha2256_label: 'SHA2-256',
                    sha2256192_label: 'SHA2-256/192',
                    sha2384_label: 'SHA2-384',
                    sha256_label: 'SHA-256',
                    sha2512_label: 'SHA2-512',
                    sha2512224_label: 'SHA2-512/224',
                    sha2512256_label: 'SHA2-512/256',
                    sha3224_label: 'SHA3-224',
                    sha3256_label: 'SHA3-256',
                    sha3384_label: 'SHA3-384',
                    sha3512_label: 'SHA3-512',
                    sha384_label: 'SHA-384',
                    sha512_label: 'SHA-512',
                    shake128_label: 'SHAKE-128',
                    sm3_label: 'SM3',
                    ssl3md5_label: 'SSL3-MD5',
                    ssl3sha1_label: 'SSL3-SHA1',
                    select_text: 'Select an HMAC algorithm'
                },
                hmac_encoding: {
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
                jwa_alg: {
                    a128cbc_hs256_label: 'AES_128_CBC_HMAC_SHA_256 authenticated encryption algorithm',
                    a192cbc_hs384_label: 'AES_192_CBC_HMAC_SHA_384 authenticated encryption algorithm',
                    a256cbc_hs512_label: 'AES_256_CBC_HMAC_SHA_512 authenticated encryption algorithm',
                    a128gcm_label: 'AES GCM using 128-bit key',
                    a192gcm_label: 'AES GCM using 192-bit key',
                    a256gcm_label: 'AES GCM using 256-bit key',
                    ecdh_128kw_label: 'ECDH-ES using Concat KDF and CEK wrapped with 128 bits AES Key Wrap',
                    ecdh_192kw_label: 'ECDH-ES using Concat KDF and CEK wrapped with 192 bits AES Key Wrap',
                    ecdh_256kw_label: 'ECDH-ES using Concat KDF and CEK wrapped with 256 bits AES Key Wrap',
                    ecdh_es_label: 'Elliptic Curve Diffie-Hellman Ephemeral Static',
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
                    rsa_oaep_label: 'RSAES OAEP using default parameters',
                    rsa_oaep256_label: 'RSAES OAEP using SHA-256 and MGF1 with SHA-256',
                    rsa_oaep384_label: 'RSAES OAEP using SHA-384 and MGF1 with SHA-384',
                    rsa_oaep512_label: 'RSAES OAEP using SHA-512 and MGF1 with SHA-512',
                    select_text: 'Select the JSON Web Algorithm (JWA)'
                },
                jwk_kty: {
                    ec_label: 'Elliptic Curve (asymmetric)',
                    oct_label: 'Octets Sequence (symmetric)',
                    rsa_label: 'RSA (asymmetric)',
                    select_text: 'Select the JWK crypto family'
                },
                jwk_use: {
                    sig_label: 'Signature',
                    enc_label: 'Encryption',
                    select_text: 'Select your JWK usage'
                },
                token_extension: {
                    jwt_bearer_description: 'JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants.',
                    jwt_bearer_label: 'Bearer JWT as an authorization grant',
                    jwt_profile_description: 'JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens.',
                    jwt_profile_label: 'JWT Profile token',
                    none: 'None',
                    pkce_description: 'A standard way of mitigating the attacks against Authorization Code grant flow.',
                    pkce_label: 'Proof Key of Code Exchange (RFC 7636)',
                    //saml_label: 'SAML 2.0 Bearer Assertion',
                    select_text: 'Select optional token extensions'
                },
                yesno: {
                    no: 'No',
                    yes: 'Yes'
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
                        +' <span class="label">the Easy Identity and Access Manager</span>'
                        +'</span>'
                }
            },
            jwks: {
                checks: {
                    jwk_alg_invalid: 'JWK algorithm "%s" is not valid',
                    jwk_alg_unset: 'JWK algorithm is not set',
                    jwk_ending_before: 'Ending date must be equal or after starting date',
                    jwk_kid_empty: 'An existing JSON Web Key without Key Identifier prevents from being able to create a new key',
                    jwk_kid_exists: 'The Key identifier already exists',
                    jwk_kid_unset: 'The Key identifier is not set. This is only accepted as long as your set has a single key',
                    jwk_kty_invalid: 'JWK type "%s" is not valid',
                    jwk_kty_unset: 'JWK type is not set',
                    jwk_not_permitted: 'Creating a new JSON Web Key is not allowed. Please contact your administrator',
                    jwk_starting_after: 'Starting date must be equal or before ending date',
                    jwk_use_invalid: 'JWK usage "%s" is not valid',
                    jwk_use_unset: 'JWK usage is not set'
                },
                edit: {
                    alg_label: 'Algorithm :',
                    alg_title: 'The algorithm to be chosen to sign or encrypt the key',
                    edit_dialog_title: 'Edit the "%s" JSON Web Key',
                    ending_label: 'Ending on :',
                    ending_ph: 'yyyy-mm-dd',
                    ending_title: 'An optional date of the JSON Web Key activation end',
                    generate_below_text: 'The desired key(s) may be generated just now by clicking on the above button.<br />'
                        +'Or they will anyway be generated at least when validating this dialog box.',
                    generate_button_text: 'Generate',
                    generate_button_title: 'Generate the secret or private/public keys pair',
                    generate_tab_title: 'Auto-generation',
                    generated: 'Keys successfully generated',
                    keyspair_tab_title: 'Asymmetric keys pair',
                    kid_label: 'Key Identifier :',
                    kid_ph: 'Key-Id',
                    kid_title: 'The "kid" (key ID) parameter is used to match a specific key. This is used, for instance, to choose among a set of keys within a JWK Set '
                        +'during key rollover.  The structure of the "kid" value is unspecified.',
                    kty_label: 'Cryptographic Family :',
                    kty_title: 'This key type (kty) identifies the cryptographic algorithm family used with the key',
                    label_label: 'Label :',
                    label_ph: 'My label',
                    label_title: 'A descriptive label which describes usage or validity or perimeter of your key',
                    new_button_label: 'New JWK',
                    new_button_title: 'Define a new JSON Web Key',
                    new_dialog_title: 'Define a new JSON Web Key',
                    private_jwk_tab_title: 'Private JSON Web Key',
                    private_pkcs8_tab_title: 'Private PKCS8 Export',
                    properties_tab_title: 'Properties',
                    public_jwk_tab_title: 'Public JSON Web Key',
                    public_spki_tab_title: 'Public SPKI Export',
                    secret_tab_title: 'Symmetric secret',
                    starting_label: 'Starting on :',
                    starting_ph: 'yyyy-mm-dd',
                    starting_title: 'An optional date of the JSON Web Key activation start',
                    use_label: 'Usage :',
                    use_title: 'The usage of this JSON Web Key'
                },
                list: {
                    add_title: 'Add a new JSON Web Key to your set',
                    alg_th: 'Algorithm',
                    created_at_th: 'Created at',
                    created_by_th: 'Created by',
                    delete_confirm_text: 'You are about to delete the "%s" key.<br />Are you sure ?',
                    delete_confirm_title: 'Delete the "%s" key',
                    delete_title: 'Delete the "%s" key',
                    edit_title: 'Edit the "%s" key content',
                    ending_th: 'Ending on',
                    kid_th: 'Key Id',
                    label_th: 'Label',
                    starting_th: 'Starting on',
                    use_th: 'Usage'
                }
            },
            keygrips: {
                checks: {
                    keygrip_alg_invalid: 'The keygrip algorithm is invalid',
                    keygrip_alg_unset: 'The keygrip algorithm is not set',
                    keygrip_encoding_invalid: 'The keygrip encoding is invalid',
                    keygrip_encoding_unset: 'The keygrip encoding is not set',
                    keygrip_size_invalid: 'The keygrip secret size is invalid (must be a positive integer)',
                    keygrip_size_mini: 'The keygrip secret size must be greater than %s',
                    keygrip_size_unset: 'The keygrip secret size is not set'
                },
                edit: {
                    alg_label: 'Algorithm :',
                    alg_title: 'The algorithm to be chosen to sign or validate the cookies',
                    binary_label: 'The chosen encoding produces binary output, thus preventing the hash to be displayed.',
                    edit_dialog_title: 'Editing the "%s" keygrip',
                    encoding_label: 'Encoding :',
                    encoding_title: 'How to encode the resulting hash ?',
                    expire_label: 'Expire at :',
                    expire_ph: 'yyyy-mm-dd',
                    expire_title: 'An optional date of the secret expiration',
                    hash_label: 'Hash :',
                    hash_title: 'The generated hash',
                    label_label: 'Label :',
                    label_title: 'An optional label to this keygrip set',
                    label_ph: 'My label',
                    new_button_label: 'New Keygrip',
                    new_button_title: 'Define a new Keygrip set',
                    new_dialog_title: 'Define a new Keygrip set',
                    properties_tab_title: 'Properties',
                    secret_edit_dialog_title: 'Edit the "%s" keygrip key',
                    secret_label: 'Secret :',
                    secret_label_title: 'Provide an optional label to this keygrip set',
                    secret_new_button_label: 'New Secret',
                    secret_new_button_title: 'Define a new Keygrip secret',
                    secret_new_dialog_title: 'Define a new Keygrip secret',
                    secret_properties_tab_title: 'Secret properties',
                    secret_title: 'An optional label to this keygrip secret',
                    secrets_label: 'Secrets :',
                    secrets_title: 'The secrets used to sign and verify the sent cookies',
                    size_label: 'Secret size :',
                    size_title: 'The size of the generated secret'
                    },
                list: {
                    add_title: 'Add a new secret to your list',
                    alg_th: 'Algorithm',
                    count_th: 'Keylist count',
                    created_at_th: 'Created at',
                    created_by_th: 'Created by',
                    encoding_th: 'Encoding',
                    expire_at_th: 'Expire at',
                    keygrip_delete_confirm_text: 'You are about to delete the "%s" whole keygrip.<br />Are you sure ?',
                    keygrip_delete_confirm_title: 'Delete the "%s" keygrip',
                    keygrip_delete_title: 'Delete the "%s" keygrip',
                    keygrip_edit_title: 'Edit the "%s" keygrip',
                    label_th: 'Label',
                    last_created_th: 'Last created',
                    last_expiration_th: 'Last expiration',
                    secret_delete_title: 'Delete the "%s" keygrip key',
                    secret_delete_confirm_text: 'You are about to delete the "%s" key of this keygrip.<br />Are you sure ?',
                    secret_delete_confirm_title: 'Deleting the "%s" keygrip key',
                    secret_edit_title: 'Editing the "%s" keygrip key'
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
                    authorization_absolute: 'The authorization endpoint must be provided as an absolute path',
                    authorization_unset: 'The authorization endpoint is not set',
                    baseurl_exists: 'The candidate REST Base URL is already used by another organization',
                    baseurl_onelevel: 'The REST Base URL must have a single level path',
                    baseurl_reserved: 'The candidate REST Base URL is a reserved path',
                    baseurl_short: 'The REST Base URL is too short',
                    baseurl_starts: 'The REST Base URL must be an absolute path (must start with \'/\')',
                    end_session_absolute: 'The introspection endpoint must be provided as an absolute path',
                    introspection_absolute: 'The introspection endpoint must be provided as an absolute path',
                    issuer_hostname: 'The issuer hostname is malformed',
                    issuer_https: 'The issuer must use a HTTPS schema',
                    issuer_invalid: 'The issuer URL is not valid',
                    issuer_unset: 'The issuer is not set though should have at least a settings value',
                    jwks_absolute: 'The JWKS document URI must be provided as an absolute path',
                    jwks_no_but_jwk: 'No JWKS URI is yet defined while at least one JWK exists',
                    jwks_uri_wo_jwk: 'A JWKS URI is specified, but no JWK is defined (yet ?)',
                    registration_absolute: 'The registration endpoint must be provided as an absolute path',
                    revocation_absolute: 'The revocation endpoint must be provided as an absolute path',
                    token_absolute: 'The token endpoint must be provided as an absolute path',
                    token_unset: 'The token endpoint is not set',
                    userinfo_absolute: 'The userinfo endpoint must be provided as an absolute path',
                    userinfo_unset: 'The userinfo endpoint is not set'
                },
                clients: {
                    list_preamble: 'The list of clients defined by and for the organization.<br />'
                        +'Capabilities of the clients depend of their type and of the chozen authorization grant flow.',
                },
                edit: {
                    authorization_example: 'Authorization Server URL: &laquo; %s &raquo;',
                    authorization_label: 'Authorization endpoint :',
                    authorization_ph: '/authorization',
                    authorization_title: 'The endpoint path used to build the Authorization Server URL, to which the clients must address their authorization grant requests.',
                    baseurl_label: 'REST Base URL :',
                    baseurl_ph: '/base',
                    baseurl_title: 'The first level of all REST URL\'s managed by and available to this organization and its clients. '
                        +'It is mandatory to have access to the Authorization Server REST API. '
                        +'It must be unique.',
                    clients_tab_title: 'Clients',
                    config_preamble: 'Configure some common aspects of your OAuth organization.<br />'
                        +'At least, a unique base URL is mandatory here.',
                    config_tab_title: 'Configuration',
                    dynamic_example: 'Dynamic registration URL: &laquo; %s &raquo;',
                    dynamic_label: 'Dynamic registration endpoint :',
                    dynamic_ph: '/dynamic',
                    dynamic_title: 'The endpoint path used to build the Dynamic Registration Endpoint URL, to which the authorized clients must address their dynamic registration requests.',
                    dynconfidential_label: 'Accept dynamic registration from confidential client applications',
                    dynconfidential_title: 'Whether a confidential client can be configured to allow dynamic registration of other client applications',
                    dynpublic_label: 'Accept dynamic registration from public client applications',
                    dynpublic_title: 'Whether a public client can be configured to allow dynamic registration of other client applications (be cautious with that)',
                    dynregistration_preamble: 'Define here if the organization will allow some clients or users to perform dynamic registration.<br />'
                        +'Please be cautious with this feature as they can lead to unknown clients making fake requests to your authorization server.',
                    dynregistration_tab_title: 'Dynamic registration',
                    dynuser_label: 'Accept dynamic registration from allowed identified users',
                    dynuser_title: 'Whether an identified user can be allowed to perform dynamic registration of client applications',
                    endsession_example: 'End session URL: &laquo; %s &raquo;',
                    endsession_label: 'End session endpoint :',
                    endsession_ph: '/logout',
                    endsession_title: 'The endpoint path used to end a client session and/or to logout a connected user.',
                    introspection_example: 'Introspection endpoint URL: &laquo; %s &raquo;',
                    introspection_label: 'Introspection endpoint :',
                    introspection_ph: '/introspection',
                    introspection_title: 'The endpoint path used to get token introspection feature if your Authorization Server honors that.',
                    issuer_example: 'When applied to the OAuth server metadata discovery URL: &laquo; %s &raquo;',
                    issuer_label: 'Issuer :',
                    issuer_ph: 'https://iam.example.com',
                    issuer_title: 'The way this IAM identifies itself, which is a settings value. An organization may want have its own specific value, as soon as it is conscious of DNS prerequisites.',
                    jwks_example: 'JWKS page URL: &laquo; %s &raquo;',
                    jwks_label: 'JWKS page path :',
                    jwks_ph: '/jwks',
                    jwks_title: 'The URL of the authorization server\'s JWK Set document. '
                        +'The referenced document contains the signing key(s) the client uses to validate signatures from the authorization server.',
                    pkce_description: 'The RFC 7636 "Proof Key for Code Exchange by OAuth Public Clients" proposes a way to mitigate authorization code interception attacks '
                        +'to which public clients are exposed because they cannot securely authenticate. The extension utilizes a dynamically created cryptographically '
                        +'random key unique for every authorization request.',
                    pkce_label: 'Make mandatory the protection of the "authorization_code" grant type with PKCE for all public clients',
                    pkce_title: 'Make a proof key for code exchange mandatory for all public clients using "authorization_code" grant type, conforming with RFC 7636',
                    providers_tab_title: 'Providers',
                    revocation_example: 'Revocation endpoint URL: &laquo; %s &raquo;',
                    revocation_label: 'Revocation endpoint :',
                    revocation_ph: '/revocation',
                    revocation_title: 'The endpoint path used to revoke an access token.',
                    token_example: 'Token Server URL: &laquo; %s &raquo;',
                    token_label: 'Token endpoint :',
                    token_ph: '/token',
                    token_title: 'The endpoint path used to build the Access Token Server URL, to which the clients must address their authorization grants in order to get their access tokens.',
                    urls_tab_title: 'URL\'s',
                    userinfo_example: 'User informations URL: &laquo; %s &raquo;',
                    userinfo_label: 'Userinfo endpoint :',
                    userinfo_ph: '/userinfo',
                    userinfo_title: 'The endpoint path used to build the Userinfo URL, to which you can get informations about a user.',
                },
                jwks: {
                    preamble: 'The JSON Web Key Set (JWKS) is a set of keys containing the public keys used to sign and encrypt any JSON Web Token (JWT) '
                        +'issued by the Authorization Server.<br />'
                        +'Each JSON Web Key targets either signature or encryption role. Keys can be easily rotated using starting and ending dates.<br />'
                        +'Active JSON Web Key Set is exposed to your clients through the <code>JWKS page</code> document.',
                    tab_title: 'JSON Web Keys Set'
                },
                keygrips: {
                    preamble: 'Cookies keys are a critical way to detect and ignore tampered cookies. '
                        +'Keys are signed and verified with keygrips, through a rotating credential system, in which new server keys can be added and old ones removed regularly, '
                        +'without invalidating client credentials.<br />'
                        +'As a keygrip is characterized by its algorithm, encoding and list of secrets, we manage here a set of keygrips to let you change your algorithm '
                        +'and/or your encoding at your convenience.',
                    tab_title: 'Keygrips'
                    },
                providers: {
                    preamble: 'Select here, among all registered providers, those that your organization is willing to manage. <br />'
                        +'Selecting providers is the same as saying which protocol(s) and which feature(s) you want your Authorization Server exhibit, '
                        +' or you want your clients take advantage of, or you want your clients be forced to use.<br />'
                        +'Some are strongly needed, or even just required, while others may be freely chosen at your convenience.'
                },
                tabular: {
                    baseurl_th: 'Base URL',
                    operational_title: 'Operational status of the organization',
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
