const fs = require('fs');

exports.log = (message) => {
  fs.appendFile('log.log', (new Date().toLocaleString()) + ' : ' + message + '\n', (err) => {
    if(err) throw err;

    // success
  });
}
