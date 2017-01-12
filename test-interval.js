var intVal = undefined;

var intValSecs = 60;

exports.testInterval = (message, bot) => {
  if(intVal === undefined) {
    bot.reply(message, (new Date().toLocaleString()) + ' : interval every '+intValSecs+' seconds');

    intVal = setInterval(() => {
      bot.reply(message, (new Date().toLocaleString()) + ' : interval every '+intValSecs+' seconds');
    }, intValSecs*1000);
  } else {
    bot.reply(message, 'Interval already running');
  }
}

exports.stopInterval = (message, bot) => {
  if(intVal === undefined) {
    bot.reply(message, 'Interval not running');
  } else {
    bot.reply(message, 'Stopping interval');
    clearInterval(intVal);
    intVal = undefined;
  }
}
