"use strict";

const testlib = require('./testlib.js');

const possibilities = {
    // pattern character : what it matches with
    A : ["A"],
    G : ["G"],
    T : ["T"],
    C : ["C"],
    R : ["R", "G", "A"],
    Y : ["Y", "T", "C"],
    K : ["K", "G", "T"],
    M : ["M", "A", "C"], 
    S : ["S", "G", "C"],
    W : ["W", "A", "T"],
    B : ["B", "G", "T", "C"],
    D : ["D", "G", "A", "T"],
    H : ["H", "A", "C", "T"],
    V : ["V", "G", "C", "A"],
    N : ["N", "A", "G", "C", "T"]
}

let current_input = {
    data_count : {}, // stores count for each pattern e.g. {"AA" : 2, "CCA": 6}
    pattern_buff : {}, // stores the pattern sized buffer e.g. { "AA": [], "CCA": [] }
    position : 0,
    init : function(patterns) {
        // creates an array of counts for each pattern
        this.data_count = patterns.reduce((a, x) => {
            a[x] = 0;
            return a;
    }, 
    {}
    );

    // creates buffers for each pattern
    this.pattern_buff = patterns.reduce((a, x) => {
        a[x] = [];
        return a;
    },
    {}
    );
    },
    updateBufs : function(data) { // adds new data to each buffer appropriately and checks for match
        Object.keys(this.pattern_buff).forEach((key) => {
    
            if(key.length > this.pattern_buff[key].length) // buffer size is not exceeded
                this.pattern_buff[key].push(data);
            else{  // buffer full
                this.pattern_buff[key].shift(); // remove data at the front
                this.pattern_buff[key].push(data); // add data to the back
            }
            // check for match
            if(this.isMatch(key)){
                this.data_count[key]++;
                testlib.foundMatch(key, this.position-this.pattern_buff[key].length);
            }
        });
    },
    isMatch: function(key) { // checks a single pattern
        // current pattern in characters
        let current_pattern = key.split("");
        let current_buf = this.pattern_buff[key];
        if(current_buf.length !== current_pattern.length) // buffer is not at the same size as pattern 
            return false;

        let index = 0;
        return current_buf.reduce((flag, current_char) => { // looks at each character in the buffer
            let pat_char = current_pattern[index]; // current pattern character that is at the same index
            index++;
            if(possibilities[pat_char].indexOf(current_char) === -1){  // buffer character not found in possibilities array for pattern character
                return false;
            }else{
                return flag;
            }
        },
        true
            )
    },
 
    resetBufs : function() {
        Object.values(this.pattern_buff).forEach((value) => value.length = 0); // buffer is emptied
        Object.keys(this.data_count).forEach((key) => this.data_count[key] = 0); // counts reset to 0
        this.position = 0;
    }
};

testlib.on( 'ready', function( patterns ) {
    
    current_input.init(patterns);
	//console.log( "Patterns:", patterns );
	testlib.runTests();
} );

testlib.on( 'data', function( data ) {

    //console.log( "<<<", data );
    current_input.position++;
    current_input.updateBufs(data);

} );

testlib.on( 'reset', function () {

    testlib.frequencyTable(current_input.data_count);    
    current_input.resetBufs();
    
} );

testlib.on( 'end', function() {
    
    testlib.frequencyTable(current_input.data_count);

} );

testlib.setup(3, 0); // Runs test 1 (task1.data and task1.seq)
