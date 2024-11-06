# izIAM

## What is it?

izIAM - for Easy Identity Access Management - aims to be a multi-tenants identity and access manager, and the core of your identity management system.

izIAM relies on openID Connect standard, itself relying on OAuth 2.0. So we are able to offer a wide interoperability.

From [OpenID](https://ext-openid.net/): OpenID Connect is a simple identity layer on top of the OAuth 2.0 protocol. It enables Clients to verify the identity of the End-User based on the authentication performed by an Authorization Server, as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner.

With izIAM, each organization is able to present itself as an OpenID provider, and an identity and access manager, to its client applications and end-users.

Most frequent use cases could be:

- You built an awesome app and you want to add user authentication and authorization. Your users should be able to log in either with a username/password or with their social accounts (such as Facebook or Twitter). You want to retrieve the user's profile after the login so you can customize the UI and apply your authorization policies.

- You built an API and you want to secure it with OAuth 2.0.

- You have more than one app, and you want to implement Single Sign-on (SSO).

- You built a JavaScript front-end app and a mobile app, and you want them both to securely access your API.

- You believe passwords are broken and you want your users to log in with one-time codes delivered by email (or SMS in the future).

- If one of your user's email addresses is compromised in some site's public data breach, you want to be notified, and you want to notify the users and/or block them from logging in to your app until they reset their password.

- You want to act proactively to block suspicious IP addresses if they make consecutive failed login attempts, in order to avoid DDoS attacks.

- You are part of a large organization that wants to federate your existing enterprise directory service to allow employees to log in to the various internal and third-party applications using their existing enterprise credentials.

- You don't want (or you don't know how) to implement your own user management solution. Password resets, creating, provisioning, blocking, and deleting users, and the UI to manage all these. You just want to focus on your app.

- You want to enforce multi-factor authentication (MFA) when your users want to access sensitive data.

- You are looking for an identity solution that will help you stay on top of the constantly growing compliance requirements of SOC2, GDPR, PCI DSS, HIPAA, and others.

- You want to monitor users on your site or application. You plan on using this data to create funnels, measure user retention, and improve your sign-up flow.

Or future izIAM versions will also provide solutions for:

- You have a web app that needs to authenticate users using Security Assertion Markup Language (SAML).

---
P. Wieser
- Last updated on 2023, May 29th
