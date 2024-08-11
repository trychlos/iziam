/*
 * /imports/common/init/providers.js
 */

import { Providers } from '/imports/common/collections/providers/index.js';

import { OAuth20Provider } from '/imports/common/providers/oauth20-provider.class.js';
import { OAuth21Provider } from '/imports/common/providers/oauth21-provider.class.js';
import { OpenIDProvider } from '/imports/common/providers/openid-provider.class.js';

//Meteor.APP.Providers._p.push( new IdentityProvider());
//Meteor.APP.Providers._p.push( new LooseDynRegistrar());
Providers.register( new OAuth20Provider());
Providers.register( new OAuth21Provider());
Providers.register( new OpenIDProvider());
//Meteor.APP.Providers._p.push( new UserResourceProvider());
