const http = require('http');
const querystring = require('querystring');
const log = require('./log');
const envVars = require('./envVar');

var miniLength = 20;

exports.sendMessageToUser = (message, smallmsg) => {
  if(smallmsg === undefined) {
    if(message.length > miniLength)
      smallmsg = message.substring(0,miniLength) + '...';
    else
      smallmsg = message;
  }

  var data = JSON.stringify(
    { "data": {
        "message": message
      },
      "notification": {
        "body" : smallmsg,
        "title" : "Notification",
        "sound":"default",
        "tag":"ppn-notification",
        "color":"#0000b7"
      },
      "registration_ids" : envVars.devices,
    }
  );

  log.log('Data: '+data);

  // An object of options to indicate where to post to
  var options = {
      host: 'fcm.googleapis.com',
      path: '/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Authorization': 'key='+envVars.api_key
      }
  };

  // Set up the request
  var req = http.request(options, function(res) {
      res.setEncoding('utf8');

      if (res.statusCode >= 400) {
        console.error('HTTP Error: '+res.statusCode+' - '+res.statusMessage+'\n');
      }
      else {
        console.log('Message was a success');
      }

      res.on('data', function (chunk) {
        log.log('Response: ' + chunk)
      });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  // post the data
  req.write(data);
  req.end();
};
