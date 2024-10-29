# izIAM maintainer/README

## Run in development mode

```
    APP_ENV=dev:0 meteor run --port 3003
```

Port 3003 is not absolutely required. What MUST actually be set is another port than 3000. This is because it is expected that the client applications runs itself on port 3000, which is also the target of the local nginx which redirect https://slim14.trychlos.lan to localhost:3000.

## Software architecture

An APP_ADMIN account is created at the first startup in standard (local) Accounts collection.

Application user accounts are managed in Meteor standard 'users' collection through `pwix:accounts-manager`.

Organizations are managed as tenants with validities through `pwix:tenants-manager`.

## Data model

Each organization can define:

    - clients: applications which are the softwares which are able to authenticate their users with izIAM, or to authenticate themselves

        - clients have validity periods

        In order a client be operational, the current record, i.e. the record at date, must be itself operational AND the organization must be operational.

    - users which can authenticate with izIAM

    - permissions which say which user can authenticate against which application

Organizations have validity periods.

In order an organization be operational, the current record, i.e. the record at date, must be itself operational.

## Bibliography

### RFC

- [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
- [OAuth 2.0 Threat Model and Security Considerations](https://datatracker.ietf.org/doc/rfc6819/)
- [OAuth 2.0 Token Revocation](https://datatracker.ietf.org/doc/html/rfc7009)
- [JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515)
- [JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516)
- [JSON Web Key (JWK)](https://datatracker.ietf.org/doc/html/rfc7517)
- [JSON Web Algorithms (JWA)](https://datatracker.ietf.org/doc/html/rfc7518)
- [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Assertion Framework for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/html/rfc7521)
- [JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/rfc7523/)
- [OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591)
- [OAuth 2.0 Dynamic Client Registration Management Protocol](https://datatracker.ietf.org/doc/html/rfc7592)
- [Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)
- [OAuth 2.0 Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662)
- [OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)
- [OAuth 2.0 Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/rfc8628/)
- [OAuth 2.0 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693)
- [JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens](https://datatracker.ietf.org/doc/rfc9068/)

### OpenID

- [OpenID Connect Dynamic Client Registration](https://openid.net/specs/openid-connect-registration-1_0.html)

### And also

- [OAuth 2.0 client authentication](https://connect2id.com/products/server/docs/guides/oauth-client-authentication)
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [It's Time for OAuth 2.1](https://aaronparecki.com/2019/12/12/21/its-time-for-oauth-2-dot-1)
- [The OAuth 2.1 Authorization Framework](https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/)

### Extracts

#### Roles

OAuth defines four roles:

- resource owner

    An entity capable of granting access to a protected resource.
    When the resource owner is a person, it is referred to as an
    end-user.

- resource server

    The server hosting the protected resources, capable of accepting
    and responding to protected resource requests using access tokens.

- client

    An application making protected resource requests on behalf of the
    resource owner and with its authorization.  The term "client" does
    not imply any particular implementation characteristics (e.g.,
    whether the application executes on a server, a desktop, or other
    devices).

- authorization server

    The server issuing access tokens to the client after successfully
    authenticating the resource owner and obtaining authorization.

#### OAuth 2.0 protocol flow

- Authorization request

    - from: client
    - to: resource owner
    - in order to: get an authorization grant

- Authorization grant

    - from: resource owner
    - to: client
    - in response to: Authorization request

    - from: client
    - to: authorization server
    - in order to: get an access token

    The OAuth core spec (RFC 6749) defines four grant types: Authorization Code, Implicit, Password, and Client Credentials.

    OAuth 2.0 for Native Apps (RFC 8252) recommends that native apps use the Authorization Code flow **with** the PKCE extension.

    Device Grant is defined in RFC 8626.

    Which eventually leads up with three authorization grant types:

    - Authorization Code + PKCE
    - Client Crendentials
    - Device Grant

- Access Token

    - from: authorization server
    - to: client
    - in response to: Authorization grant

    - from: client
    - to: resource server
    - in order to: get a protected resource

- Protected resource

    - from: resource server
    - to: client
    - in response to: Access token

## Tests

## Notes

As of 2024-09-16, latest oidc-provider is 8.5.1
 but transpilation aborts with message "Error: cannot find module 'got'".
 While got is installed, any attempts to import it produces the same error.
 Adding a 'main' key in got/package.json doesn't improve.
 Have to get back to oidc-provider 7.14.3 (last 7.x version) to get a working installation.

## Authorizations management

Use case 1

    An application delegates its users management to izIAM.
    The application is the client.
    Users are registered at the organization level as identities.

    We so must have a link identity <-> client.

    We use groups of identities to group identities.
    The above assertion can be rewritten as a link group <-> client

    With OpenID:
    - the client connects and authenticates itself, then asks for a user permission
    - OpenID asks the user who authenticates and gives the permissions he wishes
    - Among the available scopes, we define 'org.trychlos.iziam:groups' which contains the list of groups of the (authenticated) identity
      Note that there is here some sort of leak of informations as the client application will then get the list of all groups of the user, even it does need only some of them.

    Two ways of doing that:
    1. Associates a group (or a list of groups) to the client
    2. Delegates to the client the task of accepting or refusing this identity

    This may be a client configuration option for this authentication grant flow which involves a user authentication:
    - application is allowed to asks for a list of scopes to be defined at the client level

    - the application decides to accept or deny an identity when it gets the identity 'org.trychlos.iziam:groups' groups list
    - the application wants only receive the identities which are member of such or such group(s)
      it may still (and always) deny or refuse the access

## Counts

[pierre@slim14 iziam] $ typeset -i c=0; for f in $(find ./imports/ -type f); do c+=$(wc -l "$f" | cut -d' ' -f1); done; echo $c
32544