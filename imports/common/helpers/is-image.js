/*
 * /imports/common/helpers/is-image.js
 */

import sharp from 'sharp';

export const isImage = async function( url ){
    if( url ){
        try {
            const resp = await fetch( url );
            if( resp.ok ){
                const blob = await resp.blob();
                const bytes = await blob.bytes();
                const metadata = await sharp( bytes ).metadata();
                //console.debug( url, metadata );
                return true;
            }
        } catch( e ){
            //console.debug( 'fetch.err', e );
        }
    }
    return false;
};
