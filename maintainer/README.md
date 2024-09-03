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

    - applications which are the softwares which are able to authenticate their users with izIAM

    - users which can authenticate with izIAM

    - permissions which say which user can authenticate against which application

## Bibliography

### RFC

- [The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
- [OAuth 2.0 Threat Model and Security Considerations](https://datatracker.ietf.org/doc/rfc6819/)
- [OAuth 2.0 Token Revocation](https://datatracker.ietf.org/doc/html/rfc7009)
- [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://datatracker.ietf.org/doc/rfc7523/)
- [OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591)
- [OAuth 2.0 Dynamic Client Registration Management Protocol](https://datatracker.ietf.org/doc/html/rfc7592)
- [Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)
- [OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)
- [OAuth 2.0 Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/rfc8628/)
- [OAuth 2.0 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693)
- [JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens](https://datatracker.ietf.org/doc/rfc9068/)

### OpenID

- [OpenID Connect Dynamic Client Registration](https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata)

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

- Authorization grant

    - from: resource owner
    - to: client
    - in response to: Authorization request

    - from: client
    - to: authorization server

    The OAuth core spec (RFC 6749) defines four grant types: Authorization Code, Implicit, Password, and Client Credentials.

    PKCE (RFC 7636) provides a way to use the Authorization Code flow without a client secret.

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

- Protected resource

    - from: resource server
    - to: client
    - in response to: Access token
