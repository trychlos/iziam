/*
 * /imports/common/init/providers.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Providers } from '/imports/common/tables/providers/index.js';

//import { AuthorizationScopesProvider } from '/imports/common/providers/authorization-scopes-provider.class.js';
import { DeviceProvider } from '/imports/common/providers/device-provider.class.js';
import { IdentityAuthPasswordProvider } from '/imports/common/providers/identity-auth-password-provider.class.js';
import { IdentityScopesProvider } from '/imports/common/providers/identity-scopes-provider.class.js';
import { JwtBearerProvider } from '/imports/common/providers/jwt-bearer-provider.class.js';
import { JwtProfileProvider } from '/imports/common/providers/jwt-profile-provider.class.js';
import { OAuth2DynamicRegistrer } from '/imports/common/providers/oauth2-dyn-registrer.class.js';
import { OAuth20Provider } from '/imports/common/providers/oauth20-provider.class.js';
import { OAuth21Provider } from '/imports/common/providers/oauth21-provider.class.js';
import { OpenIDProvider } from '/imports/common/providers/openid-provider.class.js';
import { PkceProvider } from '/imports/common/providers/pkce-provider.class.js';
import { RefreshProvider } from '/imports/common/providers/refresh-provider.class.js';

//Providers.register( new AuthorizationScopesProvider());
Providers.register( new DeviceProvider());
Providers.register( new IdentityAuthPasswordProvider());
Providers.register( new IdentityScopesProvider());
Providers.register( new JwtBearerProvider());
Providers.register( new JwtProfileProvider());
Providers.register( new OAuth2DynamicRegistrer());
Providers.register( new OAuth20Provider());
Providers.register( new OAuth21Provider());
Providers.register( new OpenIDProvider());
Providers.register( new PkceProvider());
Providers.register( new RefreshProvider());
