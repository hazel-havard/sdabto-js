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
      this.disesaseDays = 0;
      messages.push(this.diseaseStage.introMessage);
      return messages;
    }
  };

  return character;
}
