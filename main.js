"use strict";

const testlib = require('./testlib.js');

let possiblities = {
    A : ["A"],
    G : ["G"],
    T : ["T"],
    C : ["C"],
    R : ["G", "A"],
    Y : ["T", "C"],
    K : ["G", "T"],
    M : ["A", "C"], 
    S : ["G", "C"],
    W : ["A", "T"],
    B : ["G", "T", "C"],
    D : ["G", "A", "T"],
    H : ["A", "C", "T"],
    V : ["G", "C", "A"],
    N : ["A", "G", "C", "T"]
}

let current_input = {
    data_count : {}, // stores count for each pattern e.g. {"AA" : 2, "CCA": 6}
    pattern_buff : {}, // stores the pattern sized buffer e.g. { "AA": [], "CCA": [] }
    possible : possiblities,
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
    updateBufs : function(data) { // adds new data to each buffer appropriately
        Object.keys(this.pattern_buff).forEach((key) => {
    
            if(key.length > this.pattern_buff[key].length) // buffer size is not exceeded
                this.pattern_buff[key].push(data);
            else{  // buffer full
                this.pattern_buff[key].shift(); // remove data at the front
                this.pattern_buff[key].push(data); // add data to the back
            }
            // check for match
            this.isMatch(key)
            if(key === this.pattern_buff[key].join('')){
                this.data_count[key]++;
                testlib.foundMatch(this.pattern_buff[key], this.position-this.pattern_buff[key].length);
            }
        });
    },
    isMatch: function(key) {
        // current pattern in characters
        let current_pattern = key.split("");
        let current_buf = this.pattern_buff[key];
        if(current_buf.length !== current_pattern.length)
            return false;

        let index = 0;
        current_buf.reduce((flag) => { // looks at each character in the buffer
            let buf_char = current_buf[index];
            let pat_char = current_pattern[index];
            let char_match = possiblities[buf_char].reduce((matched) => { // compares all possibilities of buffer character to possibilities of pattern character
                let found = possiblities[pat_char].indexOf(buf_char);
                //console.log(possiblities[pat_char], buf_char, found);
                if(found !== -1)
                    return true;
                else    
                    return matched;
            },
            false  // character match assumes false unless we find a matching possibility
            )
            if(char_match === false) // if one character match is false the there is no match in general
                return false;
            else
                return flag;
            },
            true
            )

    },
    resetBufs : function() {
        Object.values(this.pattern_buff).forEach((value) => value.length = 0); // buffer is emptied
        //Object.values(this.data_count).forEach((value) => value = 0); // counts reset to 0
        this.position = 0;
    }
};

testlib.on( 'ready', function( patterns ) {
    
    current_input.init(patterns);
	console.log( "Patterns:", patterns );
	testlib.runTests();
} );

testlib.on( 'data', function( data ) {

    console.log( "<<<", data );
    current_input.position++;
    current_input.updateBufs(data);

} );

testlib.on( 'reset', function () {

    current_input.resetBufs();
    
} );

testlib.on( 'end', function() {
    
    testlib.frequencyTable(current_input.data_count);

} );

testlib.setup(3); // Runs test 1 (task1.data and task1.seq)
