var sdabto = sdabto || {};

sdabto.character = new Character();

sdabto.intCommands = ['game', 'read', 'sleep', 'socialize', 'work'];

sdabto.validateIntArg = function(value) {
  // Since NaN != NaN
  return parseInt(value, 10) === parseInt(value, 10);
}

sdabto.getStatus = function() {
  var messages = [];

  var hungerTime = MEAL_INTERVAL;
  if(sdabto.character.diseaseStage.hungerDelay) {
    hungerTime = sdabto.character.diseaseStage.hungerDelay;
  }

  if(sdabto.character.lastMeal > hungerTime) {
    messages.push('You feel hungry.');
  }
  if(sdabto.character.lastSleep > SLEEP_INTERVAL) {
    messages.push('You feel sleepy.');
  }
  if(sdabto.character.lastExercise > EXERCISE_INTERVAL) {
    messages.push('You feel lethargic.');
  }
  if(sdabto.character.lastSocial > SOCIAL_INTERVAL) {
    messages.push('You feel lonely.');
  }
  if(sdabto.character.lastCleaned > CLEANING_INTERVAL) {
    messages.push('Your house is a mess.');
  }

  var mood = sdabto.character.displayMood();
  var energy = sdabto.character.displayEnergy();
  var day = Math.floor(sdabto.character.hoursPlayed / 24) + 1;
  var hour = sdabto.character.hoursPlayed % 24;

  var statusLine =
    'Day: ' + day + ' Hour: ' + hour + ' Mood: ' + mood + ' Energy: ' +
    energy + ' Money: $' + sdabto.character.money +
    ' Food: ' + sdabto.character.groceries + ' meals';

  return {
    messages: messages,
    statusLine: statusLine
  };
}

sdabto.getGreetings = function() {
  greetings = MESSAGES.introMessage;
  var statusMessages = sdabto.getStatus();
  greetings += '\n';
  for(var i = 0; i < statusMessages.messages.length; i++) {
    greetings += '\t' + statusMessages.messages[i] + '\n';
  }
  greetings += '\n';
  greetings += statusMessages.statusLine;
  greetings += '\n';

  return greetings;
};

sdabto.printMessages = function(terminal, messages) {
  for(var i = 0; i < messages.length; i++) {
    terminal.echo('\t' + messages[i]);
  }
}

sdabto.postCommand = function(terminal) {
  if(sdabto.character.dead) {
    terminal.echo(' ');
    terminal.echo('You have died. Game over.');
    sdabto.endTerminal(terminal);
  }

  if(sdabto.character.diseaseStage.lossOfControlChance
     && Math.random() < sdabto.character.diseaseStage.lossOfControlChance) {
    terminal.echo(' ');
    terminal.echo('You lose control for about 8 hours.');
    terminal.echo(' ');
    sdabto.printMessages(terminal, sdabto.character.addHours(8));
    switch(randomElement(sdabto.character.diseaseStage.activities)) {
      case 'SHOPPING':
        terminal.echo(
          'You go shopping and spend all of your money on extravagant home ' +
          'furnishings.');
        sdabto.character.money -= 500;
        break;
      case 'DRIVING':
        terminal.echo(
          'You rent a car and go for a drive. You find yourself driving ' +
          'much too fast.');
        if(Math.random() < SPEEDING_RISK) {
          terminal.echo(
            'You get into a terrible car accident. You and the driver are ' +
            'both killed.');
          terminal.echo(' ');
          terminal.echo('You have died. Game over.');
          sdabto.endTerminal(terminal);
        }
        break;
      case 'ART':
        terminal.echo(
          'You start creating an elaborate calligraphy project.');
        break;
      case 'MUSIC':
        terminal.echo(
          'You find yourself thinking in rhymes and start writing songs.');
        break;
    }
  }

  terminal.echo(' ');
  statusMessages = sdabto.getStatus();
  sdabto.printMessages(terminal,statusMessages.messages);
  terminal.echo(' ');
  terminal.echo(statusMessages.statusLine);
  terminal.echo(' ');
};

sdabto.endTerminal = function(terminal) {
  terminal.echo(' ');
  terminal.echo("This game was based on my own experiences.");
  terminal.echo("All the thoughts are thoughts I've had,");
  terminal.echo(
    "and all the situations are based on things I've experienced.");
  terminal.echo(
    "This may be different from your experiences with mental illness.");
  terminal.echo("I don't mean to imply that this is everyone's reality,");
  terminal.echo("but I wanted to give you a glimpse of mine.");
  terminal.echo("Thanks for playing along.");
  terminal.echo(' ');
  terminal.echo("Goodbye");
  terminal.echo(' ');
  terminal.echo('(Refresh page to play again)');
  terminal.pause();
}

sdabto.initInfo = {
  name: 'sdabto',
  prompt: 'What would you like to do? ',
  greetings: sdabto.getGreetings(),
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
    } else if(command.length != 1) {
      terminal.echo('Type this command on its own (eg. "eat")');
      terminal.echo(' ');
      return false;
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
  call: function(recipient) {
    sdabto.postCommand(this);
  },
  clean: function() {
    if(sdabto.character.diseaseStage.hospitalActivities) {
      this.echo(' ');
      this.echo('\tYou are not at home right now.');
    } else if(Math.random() < sdabto.character.diseaseStage.workFailure) {
      this.echo(' ');
      this.echo('\tYou cannot be bothered to clean anything right now.');
    } else if(sdabto.character.displayEnergy() < 20) {
      this.echo(' ');
      this.echo('\tYou are too tired to face cleaning right now.');
    } else {
      var messages = sdabto.character.clean();
      messages.push('You clean your house.');
      this.echo(' ');
      sdabto.printMessages(this, messages);
    }
    sdabto.postCommand(this);
  },
  eat: function() {
    sdabto.postCommand(this);
  },
  exercise: function() {
    sdabto.postCommand(this);
  },
  game: function(hours) {
    sdabto.postCommand(this);
  },
  read: function(hours) {
    sdabto.postCommand(this);
  },
  shop: function() {
    sdabto.postCommand(this);
  },
  sleep: function(hours) {
    sdabto.postCommand(this);
  },
  socialize: function(hours) {
    sdabto.postCommand(this);
  },
  watch: function(type, hours) {
    sdabto.postCommand(this);
  },
  work: function(hours) {
    sdabto.postCommand(this);
  },
  quit: function() {
    sdabto.endTerminal(this);
  }
};

sdabto.init = function() {
  $('#terminal').terminal(
    sdabto.commands,
    sdabto.initInfo
  );
};

window.onload = sdabto.init;
