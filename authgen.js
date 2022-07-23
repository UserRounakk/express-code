const fs = require('fs');
const content = require('./content');
const { appendPos, appendEndPos } = require('./functions');
const inflect = require('i')();

function authgen() {
    if (process.argv[2] == "auth") {
        console.log('test successful');
    }
}

authgen();
module.exports = authgen;