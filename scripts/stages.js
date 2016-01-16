randomElement = function(list) {
  return list[Math.floor(Math.random()*list.length)];
};

// Side effects for medicated stages
var LOW_ENERGY = {
        message: "You feel sluggish for some reason",
        penalty: 30,
};
var LOW_CONCENTRATION = {
        message: "You're having a lot of trouble focusing right now",
        keys: ["workFailure", "leisureFailure"],
        penalty: 0.2,
};
var POOR_APPETITE = {
        message: "You haven't seemed to have much of an appetite lately",
        keys: ["hungerDelay"],
        penalty: 2,
};
var SHAKY_HANDS = {
        message: "Your hands have been shaking uncontrollably lately",
};
var POOR_MEMORY = {
        message: "You can't seem to remember the simplest things lately",
};
var NAUSEA = {
        message: "You keep feeling queasy lately",
        keys: ["eatFailure"],
        penalty: 0.2,
};
var SIDE_EFFECTS = [LOW_ENERGY, LOW_CONCENTRATION, POOR_APPETITE, SHAKY_HANDS, POOR_MEMORY, NAUSEA];
var SIDE_EFFECT = randomElement(SIDE_EFFECTS);
var MEDICATED_DEPRESSION = {};
var MEDICATED = {
  introMessage: "You can feel things again\n" +
      "Good work surviving that ordeal\n" +
      "You can carry on to experience living with medication, but after this point the game will loop",
  length: 21,
  nextStage: MEDICATED_DEPRESSION,
  cap: 100,
  thoughts: MESSAGES.thoughts.normal,
  thoughtFreq: 1/24,
  doctorMessage: "Everything seems okay.  Some side effects are to be expected",
  effect: SIDE_EFFECT
};
var MEDICATED_DEPRESSION = {
  introMessage: "You feel rough",
  length: 7,
  nextStage: MEDICATED,
  cap: 50,
  hungerDelay: 4,
  thoughts: MESSAGES.thoughts.minorSuicidalIdeation,
  thoughtFreq: 4/24,
  socializeFailure: 0.5,
  eatFailure: 0.2,
  workFailure: 0.5,
  leisureFailure: 0.2,
  wakeupDelay: 2,
  doctorMessage: "Your symptoms haven't been going on long enough.  Come back in a week",
  psychologistMessage: "The psychologist says to make sure you are eating, sleeping, and exercising",
  effect: SIDE_EFFECT
};
var MANIA = {
  introMessage: "You feel good",
  length: 7,
  nextStage: MEDICATED_DEPRESSION,
  cap: 200,
  hungerDelay: 12,
  thoughts: MESSAGES.thoughts.manic,
  thoughtFreq: 12/24,
  eatFailure: 0.5,
  wageMultiplier: 2,
  focusChance: 0.5,
  lossOfControlChance: 0.1,
  activities: ["SHOPPING", "DRIVING", "ART", "MUSIC"],
  socializingEffects: ["DRUNK", "INAPPROPRIATE", "PROMISCUOUS"],
  socializingMultiplier: 2,
  sleepCap: 4,
  sleepEnergy: 200,
  socializingCap: 12,
  gamingCap: 16,
  hosptialMessage: "The hosptial changes your medication plan to stabilize your mania",
  hosptialStage: MEDICATED_DEPRESSION,
  doctorMessage: "The doctor changes your medication plan to stabilize your mania",
  doctorStage: MEDICATED_DEPRESSION,
  psychologistMessage: "The psychologist thinks you are manic and should see a doctor"
};
var INITIAL_MEDICATION = {
  introMessage: "You can feel things again",
  length: 3,
  nextStage: MANIA,
  cap: 80,
  hungerDelay: 2,
  thoughts: MESSAGES.thoughts.normal,
  thoughtFreq: 2/24,
  socializeFailure: 0.1,
  workFailure: 0.2,
  leisureFailure: 0.1,
  wakeupDelay: 1,
  doctorMessage: "Give the medication some time to work",
  effect: SIDE_EFFECT
};
var HOSPITALIZED = {
  introMessage: "You are now in the psych ward.  You feel safe.  You have your laptop",
  exitMessage: "You are discharged.  You don't feel ready",
  length: 2,
  timeWarp: 1,
  nextStage: INITIAL_MEDICATION,
  cap: 60,
  hungerDelay: 2,
  thoughts: MESSAGES.thoughts.hospital,
  thoughtFreq: 4/24,
  mealTimes: [7, 12, 18],
  freeMeals: true,
  hospitalActivities: true,
  hospitalMessage: "You are already in the hosptial",
  doctorMessage: "The doctor will see you when you are discharged"
};
var DEPRESSION3 = {
  introMessage: "You feel worse than you ever have before",
  length: 2,
  cap: 30,
  hungerDelay: 24,
  thoughts: MESSAGES.thoughts.extremeSuicidalIdeation,
  thoughtFreq: 1,
  socializeFailure: 1,
  eatFailure: 0.5,
  workFailure: 1,
  leisureFailure: 1,
  wakeupDelay: 4,
  hosptialMessage: "You are admitted to the hosptial",
  hosptialStage: HOSPITALIZED,
  doctorMessage: "The doctor gets you admitted to the hosptial",
  doctorStage: HOSPITALIZED,
  psychologistMessage: "The psychologist gets you admitted to the hospital",
  psychologistStage: HOSPITALIZED
};
var DEPRESSION2 = {
  introMessage: "You feel rough",
  length: 7,
  timeWarp: 6,
  nextStage: DEPRESSION3,
  cap: 40,
  hungerDelay: 8,
  thoughts: MESSAGES.thoughts.majorSuicidalIdeation,
  thoughtFreq: 12/24,
  socializeFailure: 0.8,
  eatFailure: 0.1,
  workFailure: 0.5,
  leisureFailure: 0.3,
  wakeupDelay: 2,
  doctorMessage: "The doctor puts you on medication for your depression",
  doctorStage: INITIAL_MEDICATION,
  psychologistMessage: "The psychologist recommends you call a doctor and make sure you are staying healthy"
};
var DEPRESSION1 = {
  introMessage: "You feel a little off",
  length: 7,
  nextStage: DEPRESSION2,
  cap: 80,
  hungerDelay: 2,
  thoughts: MESSAGES.thoughts.minorSuicidalIdeation,
  thoughtFreq: 1/24,
  socializeFailure: 0.2,
  eatFailure: 0,
  workFailure: 0.1,
  leisureFailure: 0.1,
  wakeupDelay: 1,
  doctorMessage: "Your symptoms haven't been going on for long enough.  Come back in a week",
  psychologistMessage: "Make sure you are eating, sleeping, exercising, and staying social"
};
var NORMAL = {
  length: 3,
  nextStage: DEPRESSION1,
  cap: 100,
  thoughts: MESSAGES.thoughts.normal,
  thoughtFreq: 1/24
};

// Set the side effects if present
var STAGES = [NORMAL, DEPRESSION1, DEPRESSION2, DEPRESSION3, HOSPITALIZED, INITIAL_MEDICATION, MANIA, MEDICATED, MEDICATED_DEPRESSION]
for(var i = 0; i < STAGES.length; i++) {
  if(STAGES[i].effect !== undefined && STAGES[i].effect.keys !== undefined) {
    for(var j = 0; j < STAGES[i].effect.keys; j++) {
      key = STAGES[i].effect.keys[j];
      if(STAGES[i][key] !== undefined) {
        STAGES[i][key] += STAGES[i].effect.penalty;
      } else {
        STAGES[i][key] = STAGES[i].effect.penalty;
      }
    }
  }
};
