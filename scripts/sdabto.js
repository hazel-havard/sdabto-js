var sdabto = sdabto || {};

sdabto.character = new Character();

sdabto.initInfo = {
  name: 'sdabto',
  prompt: 'What would you like to do? ',
  greetings: MESSAGES.introMessage,
  onCommandNotFound: function(command, terminal) {
    terminal.echo('Command "' + command + '" not found.');
    terminal.exec('help');
  }
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
    sdabto.initInfo
  );
};

window.onload = sdabto.init;
