// forked from: https://github.com/BeepBoopHQ/starter-node-bot/blob/master/index.js

const Botkit = require('botkit');

const PushUtils = require('./push_messages/push-utils');

const scriptManager = require('./push_messages/script-manager');

const intTester = require('./test-interval');

const token = process.env.SLACK_TOKEN

const controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.hears(['start script'], ['direct_mention', 'direct_message'], function (bot, message) {
  var lookFor = message.text.substring('start script'.length);
  if(lookFor.startsWith(' ')) {
    lookFor = lookFor.substring(1);
  }

  var scripts = scriptManager.getScripts();

  if(scripts[lookFor] === undefined) {
    bot.reply(message, 'Starting Class Listener Script with class: `'+lookFor+'`');

    PushUtils.classOpening(lookFor);
  } else {
    bot.reply(message, 'Script already running for: `'+lookFor+'`');
  }
})

controller.hears(['status'], ['direct_mention', 'direct_message'], function (bot, message) {
  var scriptPP = '';

  var scripts = scriptManager.getScripts();

  for(var lookFor in scripts) {
    scriptPP+=lookFor+'\n';
  }

  bot.reply(message, 'Current Scripts:\n'+scriptPP);
})

controller.hears(['stop script'], ['direct_mention', 'direct_message'], function (bot, message) {
  var lookFor = message.text.substring('start script'.length);
  if(lookFor.startsWith(' ')) {
    lookFor = lookFor.substring(1);
  }

  var scripts = scriptManager.getScripts();

  if(scripts[lookFor] === undefined) {
    bot.reply(message, 'No script running for: `'+lookFor+'`');
  } else {
    bot.reply(message, 'Stopping script: `'+lookFor+'`');

    scriptManager.endScript(lookFor);
  }
})

controller.hears(['test interval'], ['direct_mention', 'direct_message'], function (bot, message) {
  intTester.testInterval(message, bot);
})

controller.hears(['stop interval'], ['direct_mention', 'direct_message'], function (bot, message) {
  intTester.stopInterval(message, bot);
})

controller.hears(['test push'], ['direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'Testing push message with random value: '+PushUtils.testPush());
})

controller.hears(['help'], ['direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'Help Table:\n`test interval` : start running an interval test\n`stop interval` : stop the interval tests\n`start script <class code, e.g. MATH 2930-203>` : start the class listener\n`test push` : send a test message\n`status` : see the current script status\n`stop script <class code>` : stop the script');
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n');
})
