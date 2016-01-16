var sdabto = sdabto || {};

sdabto.init_info = {
  name: 'sdabto',
  prompt: 'What would you like to do? '
};

sdabto.commands = {
  help: function() {
    this.echo('Available commands:');
    this.echo('===================');
    var maxCommandLength = 0;
    for(var i = 0; i < MESSAGES.helpMessages.length; i++) {
      var commandLength = MESSAGES.helpMessages[i]['command'].length;
      if (commandLength > maxCommandLength) {
        maxCommandLength = commandLength;
      }
    }
    for(var i = 0; i < MESSAGES.helpMessages.length; i++) {
      var message = MESSAGES.helpMessages[i]
      var commandLength = message['command'].length;
      var lengthDifference = maxCommandLength - commandLength;
      var helpString = message['command'].concat(
        ' '.repeat(lengthDifference),
        ' - ',
        message['message']
      );
      this.echo(helpString);
    }
  },
  call: function() {},
  clean: function() {},
  eat: function() {},
  exercise: function() {},
  game: function() {},
  read: function() {},
  shop: function() {},
  sleep: function() {},
  socialize: function() {},
  watch: function() {},
  work: function() {}
};

sdabto.init = function() {
  $('#terminal').terminal(
    sdabto.commands,
    sdabto.init_info
  );
};

window.onload = sdabto.init;
