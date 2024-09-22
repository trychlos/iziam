# izIAM - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    6 | 2023- 9- 6 | feat: have a default tenant |
|    7 | 2023- 9- 6 | feat: have a demo tenant |
|    8 | 2023- 9- 6 | feat: manage authentification providers |
|    9 | 2023- 9- 6 | feat: manage authorization providers |
|   17 | 2023-11-30 | have user settings |
|   26 | 2023-12-20 | oidc-provider NOTICE: default ttl.ClientCredentials function called, you SHOULD change it in order to define the expiration for ClientCredentials artifacts |
|   27 | 2024- 1- 4 | have an option to restart the OIDC server (reload the updated clients) |
|   28 | 2024- 1- 4 | have optional introspection endpoint and only enable instospection if this endpoint is set |
|   29 | 2024- 1- 4 | have end_session_endpoint |
|      | 2024- 1-11 | defined and editable as logoutEndpoint, not used at the moment |
|   33 | 2024- 1- 5 | have a waiting cursor when calling a server method |
|   38 | 2024- 1- 5 | Have a way to provide values to user-defined resources/scopes/claims (or only claims ?) |
|   39 | 2024- 1- 5 | default renderError function called, you SHOULD change it in order to customize the look of the error page. |
|   40 | 2024- 1- 5 | default ttl.AccessToken function called, you SHOULD change it in order to define the expiration for AccessToken artifacts |
|   41 | 2024- 1- 5 | default ttl.Grant function called, you SHOULD change it in order to define the expiration for Grant artifacts. |
|   42 | 2024- 1- 5 | default ttl.IdToken function called, you SHOULD change it in order to define the expiration for IdToken artifacts. |
|   43 | 2024- 1- 5 | default ttl.Interaction function called, you SHOULD change it in order to define the expiration for Interaction artifacts. |
|   44 | 2024- 1- 5 | default ttl.Session function called, you SHOULD change it in order to define the expiration for Session artifacts |
|   45 | 2024- 1- 5 | default features.introspection.allowedPolicy function called, you SHOULD change it in order to to check whether the caller is authorized to receive the introspection response. |
|   46 | 2024- 1- 5 | Build oidc interaction |
|   47 | 2024- 1- 5 | Build oidc adapter |
|   49 | 2024- 1- 6 | on all methods/publications on server-side, have to re-check the user permissions vs his roles |
|      | 2024- 1-10 | see also #60 to throw our own exceptions |
|      | 2024- 9-13 | architecture is done with pwix:permissions - Have to distinguish client/user-capable callable code to the code stricyly usable by our server |
|   54 | 2024- 1- 7 | in group_edit modal, replace two tabs groups_panel and identities_panel with a tab members_panel with two subtabs groups and identities |
|   55 | 2024- 1- 8 | Identities.name should have an extension which includes the preferred email address (to distinguish homonymous) |
|   56 | 2024- 1- 8 | membership.hierarchy: have a right-click context menu with new/insert group/identity |
|   59 | 2024- 1- 9 | resources, scopes and claims should not be identified by their label, but with an identifier (for example a random id) |
|   61 | 2024- 1-10 | identities: add titre, titre post-nominal |
|   64 | 2024- 1-10 | display the picture in organizations list, identities list |
|   66 | 2024- 1-11 | auth server: have a button to display the .well-known/openid-configuration |
|   72 | 2024- 1-12 | use image_includer component in the identity properties |
|   77 | 2024- 1-12 | multiple-select: review the select box size to align with standard bootstrap select boxes |
|   81 | 2024- 1-12 | providers_tab: display available resources and scopes when isAdmin |
|   86 | 2024- 1-13 | keygrip_secret: ask for user confirmation when removing an item and also when validating the dialog |
|   89 | 2024- 1-14 | have a tool to identify unused strings from i18n/en.js |
|   96 | 2024- 1-17 | client_new_assistant: implement JWT authentification per private key |
|   97 | 2024- 1-17 | client_new_assistant: implement JWT authentification per shared secret |
|   99 | 2024- 1-18 | organization_edit / edit managers: the list of accounts doesnt show and so no available selection |
|  105 | 2024- 1-18 | client_new_assistant: have client shared secret when needed one the done page |
|  106 | 2024- 1-18 | client_new_assistant: have scopes |
|  109 | 2024- 1-20 | set removeUnsetValues be a collection behavior (item timestampable) |
|  112 | 2024- 6-24 | customize the new account mail to verify the address |
|  115 | 2024- 9-22 | move Jwks.fn.generateKeys() to server-side, using a method to address it from the client |
|  116 |  |  |

---
## Done

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    1 | 2023- 5-29 | change 'meteor-app-template' package name |
|      | 2023- 9- 4 | done |
|    2 | 2023- 5-29 | change 'AppTemplate' application name |
|      | 2023- 9- 4 | done |
|    3 | 2023- 6- 8 | should have x-layout x-page and x-component classes instead of only x-component |
|      | 2023- 9- 4 | x-layout done |
|      | 2023-11-30 | also have x-page, x-tab and x-panel |
|    4 | 2023- 9- 6 | improvement: have and install images/startup-app-admin-icon.svg besides of saa panel on MD displays |
|      | 2023-11-30 | done |
|    5 | 2023- 9- 6 | improvement: have a better site logo |
|      | 2023-11-30 | done |
|   10 | 2023- 9- 6 | feat: accounts provisionning |
|      | 2024- 1- 4 | done (began at least) |
|   11 | 2023- 9- 6 | feat: account management |
|      | 2023-11-30 | done for internal accounts |
|   12 | 2023- 9- 7 | fix menu_button vs pages data |
|      | 2023-11-30 | done |
|   13 | 2023- 9- 7 | have global settings |
|      | 2023-11-30 | cancelled: there may a global configuration but it is harcoded - the rest is user settings |
|   14 | 2023- 9- 7 | have tenant settings |
|      | 2023-11-30 | this is the organization configuration |
|   15 | 2023- 9- 7 | manage tenants |
|      | 2023-12-16 | done |
|   16 | 2023-11-30 | Validity.atDate() to be done |
|      | 2023-12- 1 | this is the organization configuration |
|   17 | 2023-12- 1 | bug: when a scoped user with only one organization connect the first time of a new incognito chrome tab, the home page doesn't display |
|      |            | refreshing the page display the home content - account is aaa@aaa.aa (org_scoped_manager with only one organization) |
|      | 2023-12- 3 | fixed |
|   18 | 2023-12- 1 | bug: when user chooses the Organization menu item, there is an error and content is not displayed |
|      |            | again, refreshing the page fixes the issue - account is aaa@aaa.aa (org_scoped_manager with only one organization) |
|      | 2023-12- 3 | fixed |
|   19 | 2023-12- 3 | Scope organizations.byEntity handle never becomes ready |
|      | 2023-12-16 | fixed |
|   20 | 2023-12-16 | Organization.Properties modal menu item for an organization manager should only be displayed when there is a current scope |
|      | 2024- 1-14 | obsolete |
|   21 | 2023-12-16 | Review the roles per account edition, replacing the not suitable prEdit relatively to scopes |
|      | 2024- 9-13 | obsoleted by new scope management |
|   22 | 2023-12-16 | local accounts management shoud be packaged |
|      | 2024- 6-24 | in work with pwix:accounts-manager |
|   23 | 2023-12-16 | organizations/clients management shoud be derived from a 'validity-oriented' collection package class |
|      | 2024- 9-13 | done |
|   24 | 2023-12-19 | obsolete field_check_indicator and field_type_indicator components |
|      | 2024- 1- 8 | field_check_indicator is removed |
|      | 2024- 1- 8 | field_type_indicator is removed |
|   25 | 2023-12-19 | different panes (e.g. clients management) are not reactive between them, but should |
|      | 2024- 9-14 | dohne with pwix:tabbed |
|   29 | 2024- 1- 4 | have a client option to authorize to issue a refresh_token when asked scope has offline_access |
|      | 2024- 1-18 | this is the role of the refresh token grant type |
|   30 | 2024- 1- 4 | FormChecker error when updating client grant types (multiple select) |
|      | 2024- 1- 5 | fixed |
|   31 | 2024- 1- 4 | probably to be rechecked, but seems that using client-credentials flow should be only allowed flow for a client |
|      | 2024- 1-18 | not at all unless the client is a machine-to-machine |
|   32 | 2024- 1- 4 | when grant type include 'refresh token', must not be alone (because refresh implies another one) |
|      | 2024- 1-18 | actually refresh_token is only allowed with authorization_code |
|   34 | 2024- 1- 5 | obsolete error_msg |
|      | 2024- 1- 8 | done |
|   35 | 2024- 1- 5 | review organization_page panes to have error message on the bottom right |
|      | 2024- 1- 5 | fixed |
|   36 | 2024- 1- 5 | identities_tab should be renamed identities_management_tabbed |
|      | 2024- 1- 6 | done |
|   37 | 2024- 1- 5 | resources_tab should be renamed resources_management_tabbed |
|      | 2024- 1- 8 | done |
|   48 | 2024- 1- 6 | Have groups hierarchy |
|      | 2024- 1- 7 | Memberships collection is defined, and can be updated - so fine |
|   50 | 2024- 1- 7 | Review membership tree and its reactivity (happens that children is undefined on the client) |
|      | 2024- 1- 8 | membership.hierarchy is displayed but has fake items (exactly twice) |
|      | 2024- 1- 8 | fixed |
|   51 | 2024- 1- 7 | Obsolete and remove GroupIdentLinks collection |
|      | 2024- 1- 8 | done |
|   52 | 2024- 1- 7 | Have authorizations |
|      | 2024- 1- 8 | closed as duplicate of #9 |
|   53 | 2024- 1- 7 | Have user authentification (password) |
|      | 2024- 1- 8 | closed as duplicate of #8 |
|   57 | 2024- 1- 8 | review the select components naming: singular when select is single, plural when select is (resp. can be) multiple |
|      | 2024- 1-19 | done |
|   60 | 2024- 1-10 | have a Error-derived class to throw our own exceptions |
|      | 2024- 6-24 | what is the added value or the use case ? |
|      | 2024- 9-22 | none: cancelled |
|   62 | 2024- 1-10 | organization: add suport email, support url, home url |
|      | 2024- 1-12 | done |
|   63 | 2024- 1-10 | have a picture component to be used both in organization and identities |
|      | 2024- 1-12 | done |
|   65 | 2024- 1-11 | oauth_jwks_pane: have a button to display the JWK |
|      | 2024- 9-13 | done |
|   67 | 2024- 1-11 | organization_properties_pane should be on two columns |
|      | 2024- 1-12 | cancelled: one column, more panes, and a dialog per big theme |
|   68 | 2024- 1-11 | in organization_page the vertical line should be the same color than the header iziam logo (rather than orange)  |
|      | 2024- 9-13 | obsoleted by new UI |
|   69 | 2024- 1-11 | move back the oauth_jwks_pane to authserver configuration (and rename that!) because it is too large for the dialog |
|      | 2024- 1-12 | done - will have a jwks dialog, callable from organization edit |
|   70 | 2024- 1-11 | review the categories of the components: x-component vs. x-tab vs. x-pane s. x-panel and so on |
|      | 2024- 9-13 | obsoleted in new UI |
|   71 | 2024- 1-11 | obsolete tabbed_template in profit of coreTabbedTemplate |
|      | 2024- 1-16 | note that events have been renamed to tabbed-do-xxx, tabbed-pane-xxx and also the data field names to tabbedId and tabbedName.. |
|      | 2024- 1-19 | done |
|   73 | 2024- 1-12 | bug: all organizations have notes and no more centered in the column |
|      | 2024- 1-13 | fixed |
|   74 | 2024- 1-12 | have a jwks edit dialog, including the jwks pane without validities (i.e. for current org record) |
|      | 2024- 1-13 | done |
|   75 | 2024- 1-12 | have a keygrips pane and a keygrips dialog on the jwks model - note that this may be rather a cookies pane/dialog |
|      | 2024- 1-13 | done |
|   76 | 2024- 1-12 | display properties for the current validity (current org record) from organization summary pane |
|      | 2024- 1-13 | done |
|   78 | 2024- 1-12 | oauth_jwks_pane: review the buttons size and alignment (better visible with zoom=200%) |
|      |            | most probably other panes are also concerned |
|   78 | 2024- 9-13 | obsoleted in new UI |
|   79 | 2024- 1-12 | obsolete Meteor.APP.ExtOpenID.upsert_helper() server function |
|      | 2024- 9-22 | no more relevant in new architecture |
|   80 | 2024- 1-12 | organization_check: a JWK is only needed if a client requires a JWT auth method - and this client will just cannot be connect|
|      |            | not a reason to not have a REST API |
|      | 2024- 1-18 | not at all: if the client wants authentify with a JWT, it will provide its own public key or will share a secret with the server |
|      |            | organizations have JWKS for being able to handle customers requests to receive JWT |
|      | 2024- 9-22 | done: both clients and organizations have their own jwks |
|   82 | 2024- 1-12 | resource_props_panel should be renamed resource_properties_panel |
|      | 2024- 1-19 | done |
|   83 | 2024- 1-12 | clients_management_tabbed should be renamed clients_tabbed (or renamed accordingly identities_tabbed, authorizations__tabbed, resources_tabbed) |
|      | 2024- 1-18 | all of these should definitively be renamed xxx_manager_tabbed |
|      | 2024- 1-19 | all of these is definitively renamed xxx_management_tabbed - so done anyway |
|   84 | 2024- 1-12 | rename 'organizations-jwks-1' document to 'oauth-jwks-1', updating accordingly oauth_jwks_pane.html |
|      | 2024- 9-13 | obsoleted as new UI doesn't use documents |
|   85 | 2024- 1-13 | jwks_pane: ask for user confirmation when removing an item and also when validating the dialog |
|      | 2024- 9-22 | done in new architecture |
|   87 | 2024- 1-13 | seems that acUserLogin used when creating a new local account doesn't check for existing email address ? |
|      | 2024- 9-13 | has been fixed in accounts-ui |
|   88 | 2024- 1-14 | app-scope is not a good name. Maybe validity context or running context ? -> OrganizationContext ? |
|      | 2024- 1-19 | done as OrganizationContext |
|   90 | 2024- 1-14 | replace IIDGenerator and ISecretGenerator interfaces with a Generator object with two functions |
|      | 2024- 1-18 | obsolete also izId and izSecret classes |
|      | 2024- 1-18 | done with Meteor.APP.Helpers - have to generalize |
|      | 2024- 1-19 | done |
|   91 | 2024- 1-14 | why does FormChecker need a ReactiveVar !? try without on Organization Properties.. |
|      | 2024- 1-18 | FormChecker gets some of its data from data context which is reactive |
|      |            | - so instanctiation must be inside of an autorun (to be reactive to the changes of the datacontext) |
|      |            | - but FormChecker class doesn't provide primitives to update the instanciation configuration |
|      |            | - but a new instance must be allocated on each change |
|   92 | 2024- 1-14 | each inputHandler clears the errorsSet but this later contains errors from every panels, and the subsequent check only checks the current one |
|      |            | so Formchecker should register against the EntityChecker (if any) and this later re-check every panel |
|      | 2024- 1-19 | FormChecker now registers against EntityChecker, and delegates its globals checks |
|      |            | so closing |
|   93 | 2024- 1-15 | rename 'client-chooser-introduction' document to 'client-new-introduction', updating accordingly client_new_assistant_introduction.html |
|      | 2024- 1-18 | done |
|   94 | 2024- 1-17 | assistant panes should be able to use FormChecker but the form of arguments is very different (with a DataDict) - have to find a common form |
|      | 2024- 1-18 | an item RV seems the most adapted |
|      | 2024- 9-13 | obsoleted with new pwix:forms |
|   95 | 2024- 1-17 | seems that having content documents inside of panels only for some sentences be a false good idea - or not ?? |
|      | 2024- 9-13 | obsoleted in new UI |
|   98 | 2024- 1-18 | organization_edit: the overflow_x bottom bar is always shown but shouln't |
|      | 2024- 1-18 | resource_edit idem |
|      | 2024- 1-19 | but not client_edit |
|      | 2024- 9-13 | bug is no more present in new UI with pwix:tabbed |
|  100 | 2024- 1-18 | resource_edit: idem than #98 |
|      | 2024- 1-19 | closed as a duplicate of #98 |
|  101 | 2024- 1-18 | client_edit: add software_id, software_version, clientId |
|      | 2024- 1-19 | done |
|  102 | 2024- 1-18 | client_contacts and client_endpoints: review the HTML to have the same than in client_new_assistant (a top row to add and the list below) |
|      | 2024- 9-13 | done |
|  103 | 2024- 1-18 | remove clients_registration, clients_credentials and clients_checks from clients manager |
|      | 2024- 1-19 | done |
|  104 | 2024- 1-18 | clients_checks use rather editedrv, while we have seen with organization that itemrv is more useable |
|      |            | so update client_edit to rather used itemRV, editedRV being only required when checking effect dates |
|      | 2024- 1-19 | done in all client_edit tabs and in client-checks |
|  107 | 2024- 1-19 | in .def.js definitions, .C should be reserved to constants - rename as .K for Knowns() |
|      | 2024- 9-13 | cancelled: keep C |
|  108 | 2024- 1-20 | set notes be a collection behavior (item timestampable) |
|      | 2024- 9-13 | obsoleted by pwix:notes |
|  110 | 2024- 1-20 | client_edit: when erasing a notes, dmbs write is ok (notes is removed) but reactive reload is not (note is still here) |
|      | 2024- 9-13 | to be re-checked on all collections |
|      | 2024- 9-13 | done - OK |
|  111 | 2024- 1-20 | account_edit should have an account_tabbed |
|      | 2024- 9-13 | done in pwix:accounts-manager |
|  113 | 2024- 9-13 | client_new_assistant keept the data of the previous run when re-run |
|      | 2024- 9-13 | fixed |
|  114 | 2024- 9-22 | weird bug jwk_new_button on checker instanciation - see comment in code |
|      | 2024- 9-22 | not reproductible after some changes :( |

---
P. Wieser
- Last updated on 2023, Sept. 4th
