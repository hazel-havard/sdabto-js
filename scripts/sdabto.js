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
  var money = sdabto.character.money;

  if(mood < 30 || mood > 145) {
    mood = '[[;red;]' + mood + ']';
  }
  if(energy < 30 || energy > 145) {
    energy = '[[;red;]' + energy + ']';
  }
  if(money < 0) {
    money = '[[;red;]' + money + ']';
  }

  var statusLine =
    'Day: ' + day + ' Hour: ' + hour + ' Mood: ' + mood + ' Energy: ' +
    energy + ' Money: $' + money +
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
    terminal.echo('[[;red;]You have died. Game over.]');
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
          terminal.echo('[[;red;]You have died. Game over.]');
          sdabto.character.dead = true;
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

  if(!sdabto.character.dead) {
    statusMessages = sdabto.getStatus();
    sdabto.printMessages(terminal,statusMessages.messages);
    terminal.echo(' ');
    terminal.echo(statusMessages.statusLine);
    terminal.echo(' ');
  }
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
    } else if(!intCommand && command.length != 1) {
      terminal.echo('Type this command on its own (eg. "eat")');
      terminal.echo(' ');
      return false;
    }
    return true;
  },
  width: window.innerWidth - 50,
  height: window.innerHeight - 50
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
    this.echo(' ');
    sdabto.postCommand(this);
  },
  clean: function() {
    this.echo(' ');
    if(sdabto.character.diseaseStage.hospitalActivities) {
      this.echo('\tYou are not at home right now.');
    } else if(Math.random() < sdabto.character.diseaseStage.workFailure) {
      this.echo('\tYou cannot be bothered to clean anything right now.');
    } else if(sdabto.character.displayEnergy() < 20) {
      this.echo('\tYou are too tired to face cleaning right now.');
    } else {
      var messages = sdabto.character.clean();
      messages.push('You clean your house.');
      sdabto.printMessages(this, messages);
    }
    sdabto.postCommand(this);
  },
  eat: function() {
    this.echo(' ');
    if(sdabto.character.diseaseStage.mealTimes
       && $.inArray(
         sdabto.character.hoursPlayed % 24,
         sdabto.character.diseaseStage.mealTimes) < 0) {
      this.echo('\tIt is not meal time yet.');
    } else if(sdabto.character.lastMeal < 4
              || Math.random() < sdabto.character.diseaseStage.eatFailure) {
      this.echo('\tYou do not feel like eating right now.');
    } else if(sdabto.character.groceries <= 0) {
      this.echo('\tYou are out of food. Try "shop" to get more.');
    } else {
      var messages = sdabto.character.eat();
      messages.push('You eat a meal.');
      sdabto.printMessages(this, messages);
    }
    sdabto.postCommand(this);
  },
  exercise: function() {
    this.echo(' ');
    if(sdabto.character.hospitalActivities) {
      this.echo('\tYou are not allowed outside yet.');
    } else if(sdabto.character.mealTimes
              && $.inArray(
                sdabto.character.hoursPlayed % 24,
                sdabto.character.diseaseStage.mealTimes) >= 0) {
      this.echo('\tA nurse stops you to tell you it is meal time.');
    } else if(sdabto.character.displayEnergy() < 20) {
      this.echo(
        '\tContemplayting a run makes you feel exhausted. ' +
        'Maybe tomorrow.');
    } else {
      var messages = sdabto.character.exercise();
      messages.push('You go for a run.');
      sdabto.printMessages(this, messages);
    }
    sdabto.postCommand(this);
  },
  game: function(hours) {
    this.echo(' ');
    if(hours > 8) {
      this.echo('\tAfter 8 hours you lose interest.');
      hours = 8;
    } else if(math.Random() < sdabto.character.diseaseStage.focusChance) {
      this.echo('\tYou lose track of time and game for 8 hours.');
      hours = 8;
    }

    var messages = sdabto.character.game(hours);
    messages.append('You play on your computer.');
    sdabto.printMessages(this, messages);
    sdabto.postCommand(this);
  },
  read: function(hours) {
    this.echo(' ');
    sdabto.postCommand(this);
  },
  shop: function() {
    this.echo(' ');
    if(sdabto.character.hospitalActivities) {
      this.echo('\tYou are not allowed outside yet.');
    } else if(sdabto.character.mealTimes
              && $.inArray(
                sdabto.character.hoursPlayed % 24,
                sdabto.character.diseaseStage.mealTimes) >= 0) {
      this.echo('\tA nurse stops you to tell you it is meal time.');
    } else if(sdabto.character.displayEnergy() < 10) {
      this.echo(
        '\tYou are too tired to haul home food. ' +
        'There must be something in the fridge...');
    } else if(sdabto.character.groceries > 21) {
      this.echo('\tYour fridge is too full for more groceries.');
    } else {
      var messages = sdabto.character.shopping();
      messages.push('You buy another week of groceries.');
      sdabto.printMessages(this, messages);
    }
    sdabto.postCommand(this);
  },
  sleep: function(hours) {
    this.echo(' ');
    if(hours > sdabto.character.diseaseStage.sleepCap) {
      this.echo(
        '\tYou have trouble sleeping. You wake up early feeling fully ' +
        'rested.');
      hours = sdabto.character.diseaseStage.sleepCap;
    } else if(hours > 12) {
      this.echo('\tAfter 12 hours you wake up.');
      hours = 12;
    }
    var messages = sdabto.character.sleep(hours);
    messages.push('You sleep for ' + hours + ' hours.');
    if(sdabto.character.wakeupDelay > 0) {
      var hourStr = ' hour';
      if(sdabto.character.wakeupDelay > 1) {
        hourStr = ' hours';
      }
      messages.push(
        'You stay in bed for ' + sdabto.character.wakeupDelay + hourStr);
      Array.prototype.push.apply(
        messages, sdabto.character.addHours(sdabto.character.wakeupDelay));
    }
    sdabto.printMessages(this, messages);
    sdabto.postCommand(this);
  },
  socialize: function(hours) {
    this.echo(' ');
    if(sdabto.character.hospitalActivities) {
      this.echo('\tYou are not allowed outside yet.');
    } else if(sdabto.character.displayEnergy() < 20) {
      this.echo(
        '\tYou cannot summon the energy to face people right now. ' +
        'How about a quiet night in?');
    } else if(Math.random() < sdabto.character.diseaseStage.socializeFailure) {
      this.echo(
        '\tYou get too anxious thinking about people right now. ' +
        'How about a quiet night in?');
    } else {
      if (Math.random() < sdabto.character.diseaseStage.focusChance) {
        this.echo('\tYou lose track of time and stay out for 6 hours.');
        hours = 6;
        switch(randomElement(sdabto.character.diseaseStage.socializingEffects)) {
          case 'DRUNK':
            this.echo(
              '\tYou have a drink, then another and another and another. ' +
              'You black out.');
            if(Math.random() < ALCOHOL_POISONING_CHANCE) {
              this.echo('\tYou get severe alcohol poisoning.');
              terminal.echo(' ');
              terminal.echo('[[;red;]You have died. Game over.]');
              sdabto.character.dead = true;
              sdabto.endTerminal(terminal);
              return;
            }
            break;
          case 'INAPPROPRIATE':
            this.echo(
              '\tYou start making more and more inappropriate jokes. ' +
              'Some people laugh rioutously, but an old friend looks ' +
              'disgusted.');
            break;
          case 'PROMISCUOUS':
            this.echo(
              '\tYou hook up with someone you just met.');
            break;
        }
      } else if(hours > 6) {
        this.echo('\tNone of your friends are free for more than 6 hours.');
        hours = 6;
      }

      var messages = sdabto.character.socialize(hours);
      messages.push('You hang out with friends and spend $' + (10 * hours));
      sdabto.printMessages(this, messages);
    }

    sdabto.postCommand(this);
  },
  watch: function(type, hours) {
    this.echo(' ');
    sdabto.postCommand(this);
  },
  work: function(hours) {
    this.echo(' ');
    if(sdabto.character.diseaseStage.hospitalActivities) {
      this.echo(
        '\tYour doctor does not want you to work while you are in the ' +
        'hospital.');
    } else if(Math.random() < self.character.diseaseStage.workFailure) {
      this.echo(
        '\tYou sit down to work but end up playing video games instead.');
      sdabto.printMessages(this, sdabto.character.game(hours));
    } else if(self.character.displayEnergy() < 20) {
      this.echo('\tYou try to work but your eyes cannot focus on the screen.');
    } else {
      if(hours > 8) {
        this.echo('\tAfter 8 hours your mind starts to wander...');
        hours = 8;
      } else if(Math.random() < sdabto.character.diseaseStage.focusChance) {
        this.echo(
          '\tYou get in the zone and lose track of time. ' +
          'You work for 8 hours.');
        hours = 8;
      }
      var messages = sdabto.character.work(hours);
      messages.push('You go to your computer and work.');
      sdabto.printMessages(this, messages);
    }
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
