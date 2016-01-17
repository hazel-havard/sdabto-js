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

      if(this.diseaseStage.timeWarp !== undefined
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

      if(this.diseaseStage.exitMessage !== undefined) {
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
          if(this.diseaseStage.nextStage === undefined) {
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

      if(this.diseaseStage.effect !== undefined
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
    }
  };

  return character;
}
