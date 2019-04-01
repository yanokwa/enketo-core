// Extend native objects, aka monkey patching ..... really I see no harm!

import './date-extensions';

/**
 * Pads a string with prefixed zeros until the requested string length is achieved.
 * @param  {number} digits [description]
 * @return {String|string}        [description]
 */
String.prototype.pad = function( digits ) {
    let x = this;
    while ( x.length < digits ) {
        x = `0${x}`;
    }
    return x;
};



if ( typeof console.deprecate === 'undefined' ) {
    console.deprecate = ( bad, good ) => {
        console.warn( `${bad} is deprecated. Use ${good} instead.` );
    };
}
