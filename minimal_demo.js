"use strict";

const testlib = require( './testlib.js' );

testlib.on( 'ready', function( patterns ) {

	console.log( "Patterns:", patterns );

	testlib.runTests();
} );

testlib.on( 'data', function( data ) {
	console.log( "<<<", data );
} );

testlib.setup( 1 ); // Runs test 1 (task1.data and task1.seq)
