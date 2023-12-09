"use strict";

const testlib = require('./testlib.js');

let current_input = {
    data_count : {}, // stores count for each pattern e.g. {"AA" : 2, "CCA": 6}
    pattern_buff : {}, // stores the pattern sized buffer e.g. { "AA": [], "CCA": [] }
    position : 0,
    updateBufs : function(data) {
        Object.keys(this.pattern_buff).forEach((key) => {
    
            if(key.length > this.pattern_buff[key].length) // buffer size is not exceeded
                this.pattern_buff[key].push(data);
            else{  // buffer full
                this.pattern_buff[key].shift(); // remove data at the front
                this.pattern_buff[key].push(data); // add data to the back
            }
            // check for match
            if(key === this.pattern_buff[key].join('')){
                this.data_count[key]++;
                testlib.foundMatch(this.pattern_buff[key], this.position-this.pattern_buff[key].length);
            }
        });
    },
    resetBufs : function() {
        Object.values(this.pattern_buff).forEach((value) => value.length = 0);
        Object.values(this.data_count).forEach((value) => value = 0);
        this.position = 0;
    }
};

testlib.on( 'ready', function( patterns ) {
    // creates an array of counts for each pattern
    current_input.data_count = patterns.reduce((a, x) => {
        a[x] = 0;
        return a;
    }, 
    {}
    );

    // creates buffers for each pattern
    current_input.pattern_buff = patterns.reduce((a, x) => {
        a[x] = [];
        return a;
    },
    {}
    );

	console.log( "Patterns:", patterns );
	testlib.runTests();
} );

testlib.on( 'data', function( data ) {

    console.log( "<<<", data );
    current_input.position++;
    current_input.updateBufs(data);

} );

testlib.on( 'reset', function () {

    testlib.frequencyTable(current_input.data_count);
    current_input.resetBufs();
    
} );

testlib.on( 'end', function() {

    console.log( "End" );

} );

testlib.setup(2); // Runs test 1 (task1.data and task1.seq)
