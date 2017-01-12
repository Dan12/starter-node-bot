const messenger = require('./fcm.js');
const classFinder = require('./findclass.js');

exports.testPush = () => {
  var rand = Math.floor(Math.random() * 50);

  messenger.sendMessageToUser('This is a test message ' + rand);

  return rand;
}

exports.classOpening = (lookFor) => {
  classFinder.testforopening(lookFor);
}
