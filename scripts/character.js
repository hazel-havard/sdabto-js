// Some globals
var RENT = 250;
var GROCERIES = 50;
// Allowable time between events.
var MEAL_INTERVAL = 6; //hours
var SLEEP_INTERVAL = 16; //hours
var EXERCISE_INTERVAL = 2; //days
var SOCIAL_INTERVAL = 2; //days
var CLEANING_INTERVAL = 2; //days
// Risks of death while out of control
var SPEEDING_RISK = 0.2;
var ALCOHOL_POISONING_CHANCE = 0.2;
// List of people you can call
var CALL_DICT = {
  parents: ["mom", "mother", "dad", "father", "parents", "home", "family"],
  friend: ["friend", "friends"],
  hospital: ["hospital", "police", "ambulance", "911"],
  doctor: ["doctor", "psychiatrist"],
  helpline: ["helpline", "suicide helpline", "hotline", "suicide hotline"],
  psychologist: ["therapist", "councellor", "psychologist"]
};

function Character() {
  character = {
    diseaseStage: NORMAL,

    _mood: 80,
    _energy: 80,

    get mood() {
      return this._mood;
    },
    set mood(value) {
      max = this.diseaseStage.cap;
      if(value > max) {
        value = max;
      } else if(value < 0) {
        value = 0;
      }
      this._mood = value;
    },

    get energy() {
      return this._energy;
    },
    set energy(value) {
      max = this.diseaseStage.cap;
      if(value > max) {
        value = max;
      } else if(value < 0) {
        value = 0;
      }
      this._energy = value;
    },

    money: 200,
    lastMeal: 14,
    lastSleep: 0,
    lastExercise: 1,
    lastSocial: 1,
    lastCleaned: 1,
    groceries: 21,
    hoursPlayed: 8,
    hoursGamed: 0,
    hoursSocialized: 0,
    hoursWatched: 0,
    calledParents: false,
    calledFriend: false,
    diseaseDays: 0,
    dead: false,

    changeStage: function(stage) {
      messages = [];

      if(this.diseaseStage.timeWarp
         && stage == this.diseaseStage.nextStage) {
        message = ' months pass ';
        if(this.timeWarp == 1) {
          message = ' month passes ';
        }
        messages.push(this.diseaseStage.timeWarp + message + 'this way.');
        this.lastExercise = 7;
        this.lastSocial = 7;
        this.lastCleaned = 7;
        this.hoursPlayed += 24 * 30 * this.diseaseStage.timeWarp;
      }

      if(this.diseaseStage.exitMessage) {
        messages.push(this.diseaseStage.exitMessage);
      }

      this.diseaseStage = stage;
      // Recheck using new disease stage caps
      this.mood += 0;
      this.energy += 0;
      this.diseaseDays = 0;
      messages.push(this.diseaseStage.introMessage);
      return messages;
    },

    addHours: function(hours) {
      messages = [];

      // If we crossed a day boundary
      if(Math.floor(this.hoursPlayed / 24)
         < Math.floor((this.hoursPlayed + hours) / 24)) {
        this.hoursGamed = 0;
        this.hoursSocialized = 0;
        this.hoursRead = 0;
        this.hoursWatched = 0;
        this.calledParents = false;
        this.calledFriend = false;
        this.lastExercise += 1;
        this.lastSocial += 1;
        this.lastCleaned += 1;
        this.diseaseDays += 1;

        if(this.diseaseDays >= this.diseaseStage.length) {
          if(!this.diseaseStage.nextStage) {
            this.dead = true;
            messages.push('You have committed suicide');
            return messages;
          }
          Array.prototype.push.apply(
            messages, this.changeStage(this.diseaseStage.nextStage));
        }

        if((Math.floor(this.hoursPlayed + hours) / 24) % 7 == 0) {
          this.money -= RENT;
          messages.push('Rent and bills due. $' + RENT + ' deducted.');
        }
      }

      this.lastMeal += hours;
      this.lastSleep += hours;
      this.hoursPlayed += hours;

      if(this.diseaseStage.effect
         && Math.random() < SIDE_EFFECT_FREQ * hours) {
        messages.push(this.diseaseStage.effect.message);
      }

      if(Math.random() < this.diseaseStage.thoughtFreq * hours) {
        messages.push(randomElement(this.diseaseStage.thoughts));
      }

      if(this.lastMeal > 24 * 7) {
        messages.push('You have starved to death');
        this.dead = true;
      }

      return messages;
    },

    displayMood: function() {
      var mood = this.mood;

      if(this.lastMeal > MEAL_INTERVAL) {
        mood -= Math.min(10 * (this.lastMeal - MEAL_INTERVAL), 30);
      }
      if(this.lastExercise > EXERCISE_INTERVAL) {
        mood -= Math.min(5 * (this.lastExercise - EXERCISE_INTERVAL), 20);
      }
      if(this.lastSocial > SOCIAL_INTERVAL) {
        mood -= Math.min(5 * (this.lastExercise - EXERCISE_INTERVAL), 20);
      }
      if(this.lastCleaned > CLEANING_INTERVAL) {
        mood -= 5;
      }

      if(mood < 0) {
        mood = 0;
      } else if(mood > this.diseaseStage.cap) {
        mood = this.diseaseStage.cap;
      }

      return mood;
    },

    displayEnergy: function() {
      var energy = this.energy;

      if(this.lastMeal > MEAL_INTERVAL) {
        energy -= Math.min(10 * (this.lastMeal - MEAL_INTERVAL), 30);
      }
      if(this.lastSleep > SLEEP_INTERVAL) {
        energy -= Math.min(5 * (this.lastSleep - SLEEP_INTERVAL), 20);
      }
      if(this.lastExercise > EXERCISE_INTERVAL) {
        energy -= Math.min(5 * (this.lastExercise - EXERCISE_INTERVAL), 20);
      }
      if(this.diseaseStage.effect == LOW_ENERGY) {
        energy -= this.diseaseStage.effect.penalty;
      }

      if(energy < 0) {
        energy = 0;
      } else if(energy > this.diseaseStage.cap) {
        energy = this.diseaseStage.cap;
      }

      return energy;
    },

    clean: function() {
      var messages = this.addHours(1);
      this.energy -= 5;
      this.lastCleaned = 0;
      return messages;
    },

    work: function(hours) {
      var messages = this.addHours(hours);
      var wages = 10 * hours;
      if(this.diseaseStage.wageMultiplier) {
        wages *= this.diseaseStage.wageMultiplier;
      }
      this.money += wages;
      this.energy -= 5 * hours;
      this.mood -= 5 * hours;
      return messages;
    },

    sleep: function(hours) {
      var messages = this.addHours(hours);

      if(hours < 4) {
        return messages;
      } else if (hours > 8) {
        hours = 8;
      }

      this.lastSleep = 0;

      if(this.diseaseStage.sleepEnergy) {
        this.energy = this.diseaseStage.sleepEnergy;
        return messages;
      }

      this.energy = (10 * hours);
      if(hours > 6) {
        this.energy += 20;
      }

      return messages;
    },

    eat: function() {
      var messages = this.addHours(1);
      this.lastMeal = 0;
      if(!this.diseaseStage.freeMeals) {
        this.groceries -= 1;
      }
      return messages;
    },

    exercise: function() {
      var messages = this.addHours(1);
      this.lastExercise = 0;
      this.mood += 5;
      this.energy -= 5;
      return messages;
    },

    shopping: function() {
      var messages = this.addHours(1);
      this.money -= GROCERIES;
      this.groceries += 21;
      if(this.groceries > 42) {
        messages.push('There is no more room in your fridge.');
        this.groceries = 42;
      }
      return messages;
    },

    game: function(hours) {
      var messages = this.addHours(hours);
      var dailyCap = 4;
      if(this.diseaseStage.gamingCap) {
        dailyCap = this.diseaseStage.gamingCap;
      }
      hours = Math.max(0, Math.min(hours, dailyCap - this.hoursGamed));
      this.hoursGamed += hours;
      this.mood += 5 * hours;
      return messages;
    },

    socialize: function(hours) {
      var messages = this.addHours(hours);
      this.money -= 10 * hours;
      this.energy -= 5 * hours;
      var dailyCap = 3;
      if(this.diseaseStage.socializingCap) {
        dailyCap = this.diseaseStage.socializingCap;
      }
      hours = Math.max(0, Math.min(hours, dailyCap - this.hoursSocialized));
      this.hoursSocialized += hours;
      var moodBonus = 10 * hours;
      if(this.diseaseStage.socializingMultiplier) {
        moodBonus *= this.diseaseStage.socializingMultiplier;
      }
      this.mood += moodBonus;
      this.lastSocial = 0;
      return messages;
    },

    call: function(recipient) {
      var messages = this.addHours(1);
      if($.inArray(recipient, CALL_DICT.parents) >= 0) {
        if(!this.calledParents) {
          this.calledParents = true;
          this.mood += 5;
        }

        if(this.displayMood() < 20) {
          messages.push('Your parents notice how rough you are feeling and are worried.');
        } else if(this.displayMood() < 50) {
          messages.push('Your parents notice you are feeling down and try to cheer you up.');
        } else if(this.displayMood() > 150) {
          messages.push('Your parents can barely understand you. They are seriously worried about you.');
        } else {
          messages.push('You have a lovely chat with your parents.');
        }

        if(this.money < 0) {
          messages.push('Your parents bail you out of your debt. You feel guilty');
          this.money = 0;
        }
      } else if($.inArray(recpieint, CALL_DICT.friend) >= 0) {
        if(!this.calledFriend) {
          this.calledFriend = true;
          this.mood += 5;
        }

        if(this.displayMood() < 20) {
          messages.push('Your friend notices how rough you are feeling and is worried.');
        } else if(this.displayMood() < 50) {
          messages.push('Your friend notices you are not very happy and tries to cheer you up');
        } else if(this.displayMood() > 150) {
          messages.push('You seriously freak out your friend, who can barely get a word in edgewise');
        } else {
          messages.push('You have a lovely chat with your friend.');
        }
      } else if($.inArray(recpieint, CALL_DICT.hospital) >= 0) {
        if(this.diseaseStage.hospitalMessage) {
          messages.push(this.diseaseStage.hospitalMessage);
        } else {
          messages.push('You are turned away. Try "call doctor"');
        }
      } else if($.inArray(recpieint, CALL_DICT.doctor) >= 0) {
        if(this.diseaseStage.doctorMessage) {
          messages.push(this.diseaseStage.doctorMessage);
        } else {
          messages.push('You seem to be in fine health');
        }

        if(this.diseaseStage.doctorStage) {
          Array.prototype.push.apply(
            messages, this.changeStage(this.diseaseStage.doctorStage));
        }
      } else if($.inArray(recpieint, CALL_DICT.helpline) >= 0) {
        messages.push('The helpline details resources available to you. Try "call pychologist", "call doctor", or "call hospital"');
      } else if($.inArray(recpieint, CALL_DICT.psychologist) >= 0) {
        if(this.diseaseStage.psychologistMessage) {
          messages.push(this.diseaseStage.psychologistMessage);
        } else {
          messages.push('The psychologist patiently listens to your problems');
        }

        if(this.diseaseStage.psychologistStage) {
          Array.prototype.push.apply(
            messages, this.changeStage(this.diseaseStage.psychologistStage));
        }
      }
      return messages;
    },

    read: function(hours){
      var messages = this.addHours(hours);
      hours = Math.max(0, Math.min(hours, 4 - this.hoursRead));
      this.hoursRead += hours;
      this.mood += 5 * hours;
      return messages;
    },

    watch: function(hours){
      var messages = this.addHours(hours);
      hours = Math.max(0, Math.min(hours, 4 - this.hoursWatched));
      this.hoursWatched += hours;
      this.mood += 5 * hours;
      return messages;
    }
  };

  return character;
}
