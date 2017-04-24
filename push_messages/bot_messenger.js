var bot_singleton = undefined;
var incoming_message = undefined;

exports.set_bot = function(bot, message) {
  bot_singleton = bot;
  incoming_message = message;
}

exports.send_message = function(msg) {
  if(bot_singleton != undefined && incoming_message != undefined) {
    bot_singleton.reply(incoming_message, msg);
  } else {
    console.log('bot or incoming message not defined');
  }
}
