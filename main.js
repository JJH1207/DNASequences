"use strict";

const testlib = require('./testlib.js');

const possibilities = {
    A : ["A"],
    G : ["G"],
    T : ["T"],
    C : ["C"],
    R : ["R", "G", "A"],
    Y : ["Y", "T", "C"],
    K : ["K", "G", "T"],
    M : ["M", "A", "C"], 
    S : ["S","G", "C"],
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
    updateBufs : function(data) { // adds new data to each buffer appropriately
        Object.keys(this.pattern_buff).forEach((key) => {
    
            if(key.length > this.pattern_buff[key].length) // buffer size is not exceeded
                this.pattern_buff[key].push(data);
            else{  // buffer full
                this.pattern_buff[key].shift(); // remove data at the front
                this.pattern_buff[key].push(data); // add data to the back
            }
            // check for match
            if(this.isMatch(key)){
            //if(key === this.pattern_buff[key].join('')){
                this.data_count[key]++;
                testlib.foundMatch(key, this.position-this.pattern_buff[key].length);
            }
        });
    },
    isMatch: function(key) {
        // current pattern in characters
        let current_pattern = key.split("");
        let current_buf = this.pattern_buff[key];
        if(current_buf.length !== current_pattern.length)
            return false;
        //console.log("==================================");
        //console.log("Current buf:", current_buf);
        //console.log("Current pattern:", current_pattern);

        let index = 0;
        return current_buf.reduce((flag, current_char) => { // looks at each character in the buffer
            let pat_char = current_pattern[index]; // current pattern character that is at the same index
            //console.log(current_char, possibilities[pat_char]);
            index++;
            //let char_match = possiblities[pat_char].reduce((flag2, ))
            //let buf_char = current_buf[index];
            if(possibilities[pat_char].indexOf(current_char) === -1){  // buffer character not found in possibilities array for pattern character
                //console.log(false);
                return false;
            }else{
                //console.log(true);
                return flag;
            }
            
            /*
            let char_match = current_buf.reduce((matched) => { // compares all possibilities of buffer character to possibilities of pattern character
                let found = possiblities[pat_char].indexOf(buf_char);
                console.log("Current buf char:", buf_char);
                console.log("Current pat char:", pat_char);
                console.log("Possibilities for pat:", possiblities[pat_char]);
                console.log(possiblities[pat_char], buf_char, found);
                if(found !== -1){
                    //console.log("true");
                    matched = true;
                }
                else{
                    //console.log("false");
                }    
                },
                false  // character match assumes false unless we find a matching possibility
            )
            let char_match = 
            if(char_match === false) // if one character match is false the there is no match in general
            flag = false;
            */
        },
        true
            )
    },

    resetBufs : function() {
        Object.values(this.pattern_buff).forEach((value) => value.length = 0); // buffer is emptied
        Object.values(this.data_count).forEach((value) => value = 0); // counts reset to 0
        this.position = 0;
    }
};

testlib.on( 'ready', function( patterns ) {
    
    current_input.init(patterns);
	console.log( "Patterns:", patterns );
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

testlib.setup(3); // Runs test 1 (task1.data and task1.seq)
