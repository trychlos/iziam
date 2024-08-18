/*
 * /imports/common/init/providers.js
 */

import { Providers } from '/imports/common/collections/providers/index.js';

import { JwtBearerProvider } from '/imports/common/providers/jwt-bearer-provider.class.js';
import { JwtProfileProvider } from '/imports/common/providers/jwt-profile-provider.class.js';
import { OAuth20Provider } from '/imports/common/providers/oauth20-provider.class.js';
import { OAuth21Provider } from '/imports/common/providers/oauth21-provider.class.js';
import { OpenIDProvider } from '/imports/common/providers/openid-provider.class.js';
import { RefreshProvider } from '/imports/common/providers/refresh-provider.class.js';

Providers.register( new JwtBearerProvider());
Providers.register( new JwtProfileProvider());
Providers.register( new OAuth20Provider());
Providers.register( new OAuth21Provider());
Providers.register( new OpenIDProvider());
Providers.register( new RefreshProvider());
