var sdabto = sdabto || {};

sdabto.character = new Character();

sdabto.intCommands = ['game', 'read', 'sleep', 'socialize', 'work'];

sdabto.validateIntArg = function(value) {
  // Since NaN != NaN
  return parseInt(value, 10) === parseInt(value, 10);
}

sdabto.initInfo = {
  name: 'sdabto',
  prompt: 'What would you like to do? ',
  greetings: MESSAGES.introMessage,
  onCommandNotFound: function(command, terminal) {
    terminal.echo('Command "' + command + '" not found.');
    terminal.exec('help');
  },
  onBeforeCommand: function(terminal, command) {
    command = command.split(' ');

    var intCommand = false;
    for(var i = 0; i < sdabto.intCommands.length; i++) {
      if(command[0] == sdabto.intCommands[i]) {
        intCommand = true;
        break;
      }
    }

    if(intCommand
       && (command.length != 2 || !sdabto.validateIntArg(command[1]))) {
      terminal.echo(
        'This command takes a single number of hours (eg "sleep 8")');
      terminal.echo(' ');
      return false;
    } else if (command[0] == 'watch'
               && (command.length != 3
               || (command[1] != 'tv' && command[1] != 'movie')
               || !sdabto.validateIntArg(command[2]))) {
      terminal.echo(
        'You can watch either tv or a movie for a certain number of hours ' +
        '(eg "watch movie 2")');
      terminal.echo(' ');
      return false;
    } else if(command[0] == 'call') {
      if(command.length != 2) {
        terminal.echo(
          'This command takes a single recipient (eg "call parents")');
        terminal.echo(' ');
        return false;
      } else {
        var recipientKnown = false;

        for(recipient in CALL_DICT) {
          for(var i = 0; i < CALL_DICT[recipient].length; i++) {
            if(command[1] == CALL_DICT[recipient][i]) {
              recipientKnown = true;
              break;
            }
          }
          if(recipientKnown) {
            break;
          }
        }

        if(!recipientKnown) {
          terminal.echo('Sorry, you do not know that number');
          terminal.echo(' ');
          return false;
        }
      }
    }
    return true;
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
  call: function(recipient) {},
  clean: function() {},
  eat: function() {},
  exercise: function() {},
  game: function(hours) {},
  read: function(hours) {},
  shop: function() {},
  sleep: function(hours) {},
  socialize: function(hours) {},
  watch: function(type, hours) {},
  work: function(hours) {}
};

sdabto.init = function() {
  $('#terminal').terminal(
    sdabto.commands,
    sdabto.initInfo
  );
};

window.onload = sdabto.init;
