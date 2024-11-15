/*
 * /imports/server/classes/oid-mongo-adapter.class.js
 *
 * A MongoDB adapter for OpenID Authorization Server.
 * See https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#adapter
 * and https://github.com/panva/node-oidc-provider/blob/main/example/my_adapter.js for the API specification
 * and https://github.com/panva/node-oidc-provider/blob/main/example/adapters/mongodb.js for a MongoDB example
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { izObject } from '/imports/common/classes/iz-object.class.js';

import { OIDAuthServer } from '/imports/server/classes/oid-auth-server.class.js';

let DB;

const grantable = new Set([
    'access_token',
    'authorization_code',
    'refresh_token',
    'device_code',
    'backchannel_authentication_request',
]);

class CollectionSet extends Set {
    add( name ) {
        const nu = this.has( name );
        super.add( name );
        if( !nu ){
            DB.collection( name ).createIndexes([
                ...( grantable.has( name )
                ? [{
                    key: { 'payload.grantId': 1 },
                }] : []),
                ...(name === 'device_code'
                ? [{
                    key: { 'payload.userCode': 1 },
                    unique: true,
                }] : []),
                ...(name === 'session'
                ? [{
                    key: { 'payload.uid': 1 },
                    unique: true,
                }] : []),
                {
                key: { expiresAt: 1 },
                expireAfterSeconds: 0,
                },
            ]).catch( console.error ); // eslint-disable-line no-console
        }
    }
}

const collections = new CollectionSet();

export class OIDMongoAdapter extends izObject {

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @param {String} name
     * @returns {OIDMongoAdapter}
     */
    constructor( name ){
        super( ...arguments );
        console.debug( 'instanciating OIDMongoAdapter', name );

        this.name = _.snakeCase( name );

        // NOTE: you should never be creating indexes at runtime in production, the following is in
        //   place just for demonstration purposes of the indexes required
        //collections.add( this.name );

        return this;
    }

    // NOTE: the payload for Session model may contain client_id as keys, make sure you do not use
    //   dots (".") in your client_id value charset.
    async upsert( _id, payload, expiresIn ){
        //console.debug( 'upsert', this.name, arguments );
        let expiresAt;
        if( expiresIn ){
          expiresAt = new Date( Date.now() + ( expiresIn * 1000 ));
        }
        await this.coll().updateAsync(
            { _id },
            { $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
            { upsert: true },
        );
    }

    // this method is called with the client_id
    // extends it to search also in our clients collection
    async find( _id ){
        console.debug( 'find', this.name, arguments );
        let result = await this.coll().findOneAsync(
            { _id },
            { payload: 1 },
        );
        // search in Clients model
        if( !result ){
            result = await OIDAuthServer.byClientId( _id );
        }
        //console.debug( 'result', result );
        if( !result ) return undefined;
        return result.payload;
    }

    async findByUserCode( userCode ){
        console.debug( 'findByUserCode', arguments );
        const result = await this.coll().findOneAsync(
            { 'payload.userCode': userCode },
            { payload: 1 },
        );
    
        if( !result ) return undefined;
        return result.payload;
    }

    async findByUid( uid ){
        console.debug( 'findByUid', arguments );
        const result = await this.coll().findOneAsync(
            { 'payload.uid': uid },
            { payload: 1 },
        );
        if( !result ) return undefined;
        return result.payload;
    }

    async consume( _id ){
        console.debug( 'consume', arguments );
        await this.coll().upsertAsync(
            { _id },
            { $set: { 'payload.consumed': Math.floor(Date.now() / 1000) } },
        );
    }

    async destroy( _id ){
        console.debug( 'destroy', arguments );
        await this.coll().removeAsync({ _id });
    }

    async revokeByGrantId( grantId ){
        console.debug( 'revokeByGrantId', arguments );
        await this.coll().removeAsync({ 'payload.grantId': grantId });
    }

    coll( name ){
        return this.constructor.coll( name || this.name );
    }

    static coll( name ){
        //return DB.collection( name );
        DB.collections = DB.collections || {};
        if( !DB.collections[name] ){
            DB.collections[name] = new Mongo.Collection( DB.prefix+name );
        }
        return DB.collections[name];
    }

    // This is not part of the required or supported API, all initialization should happen before
    // you pass the adapter to `new Provider`
    static async connect0( collectionName ){
        //const connection = await MongoClient.connect(process.env.MONGODB_URI);
        //DB = connection.db(connection.s.options.dbName);
        DB = new Mongo.Collection( collectionName );
        console.debug( 'DB', DB );
        console.debug( 'DB.collection', DB.collection );
    }
    static async connect( prefix ){
        //const connection = await MongoClient.connect(process.env.MONGODB_URI);
        //DB = connection.db(connection.s.options.dbName);
        DB = { prefix: prefix };
    }
}
