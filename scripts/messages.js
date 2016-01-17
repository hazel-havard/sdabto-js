var MESSAGES = {
  helpMessages: [
    {
      command: 'call [recipient]',
      message: 'Call someone on the phone (eg "call friend")'
    },
    {
      command: 'clean',
      message: 'Clean your house'
    },
    {
      command: 'eat',
      message: 'Eat a meal'
    },
    {
      command: 'exercise',
      message: 'Go for a run'
    },
    {
      command: 'game [hours]',
      message: 'Play computer games for a number of hours (eg "game 4")'
    },
    {
      command: 'read [hours]',
      message: 'Read a book for a number of hours (eg "read 4")'
    },
    {
      command: 'shop',
      message: 'Buy a week of groceries'
    },
    {
      command: 'sleep [hours]',
      message: 'Sleep for a number of hours (eg "sleep 8")'
    },
    {
      command: 'socialize [hours]',
      message: 'Hang out with friends for a number of hours (eg "socialize 1")'
    },
    {
      command: 'watch [tv|movie] [hours]',
      message: 'Watch tv or a movie for a number of hours (eg "watch tv 4")'
    },
    {
      command: 'work [hours]',
      message: 'Work from home for a number of hours (eg "work 4")'
    },
    {
      command: 'quit',
      message: 'Stop the game'
    }
  ],
  introMessage:
    "Welcome to Some Days Are Better Than Others\n" +
    "Content Warning: Suicide\n\n" +
    "You live alone and do freelance work from your computer.\n" +
    "You enjoy gaming, watching movies, and hanging out with friends.\n" +
    "You'd like to save up some money and go to university one day.\n" +
    "Take life one day at a time.\n\n" +
    "Type 'help' for some ideas of what to do\n",
  thoughts: {
    normal: [
      "You daydream about saving a baby from a fire",
      "You imagine what you would do if you were fabulously wealthy",
      "You fondly remember an old friend",
      "You think about changing careers",
      "You wonder if you could invent something simple and get rich",
      "You wonder if you have any new email",
      "Your mind strays to the book you are reading",
      "You plan your next move in the video game you're playing",
      "You think you have a pretty good idea for a video game",
      "You make a shopping list in your head",
      "You replay the last argument you had in your head, adding better retorts",
      "You have an imaginary conversation in your head with someone you admire",
      "You test several new routes to the grocery store in your head for efficiency",
      "You think lots of kind thoughts in case someone nearby can read minds",
      "You try to decide what super power you would most like to have",
      "You imagine winning an Olympic medal",
      "You have a pretend conversation with a talk show host",
      "You remember a weird dream you had last night",
      "You get a series of increasingly terrible songs stuck in your head",
      "You ponder a problem you've been stuck on in your work",
      "You wonder what the curiosity rover is up to right now",
      "You wonder who writes terms of service agreements and if they hate their job"
    ],
    minorSuicidalIdeation: [
      "You wonder how many advil you would have to take before you died",
      "You wonder if your pen knife is sharp enough to cut your throat",
      "You suddenly imagine shooting yourself",
      "Every time you are outside you imagine stepping in front of traffic",
      "You think of how grateful you'd be if someone randomly shot you",
      "You day dream about falling asleep and never waking up",
      "You feel like you'll never feel rested again",
      "You wonder if your friends actually like you or if they're just being polite",
      "You wonder if there are things in your house you could combine to make a painless poison for yourself",
      "You wonder if you are fast enough to step in front of a bus before the driver could stop",
      "Last time you were on a train platform you kept imagining jumping onto the tracks",
      "You wonder where people get lethal doses of hard drugs",
      "You imagine what your funeral would be like if you killed yourself",
      "You realize all your problems would go away if you were dead",
      "You wonder if hanging yourself would be a relatively painless way to die"
    ],
    majorSuicidalIdeation: [
      "You look up the LD50 of advil and figure out how much you'd need to kill yourself",
      "You make a plan to kill yourself by cutting your throat in a running shower so there'd be no mess",
      "You wish you had an extra day in the week to catch up",
      "You make a game out of trying to come up with ways to kill yourself using only things in this room",
      "You concoct increasingly elaborate ways to kill yourself.",
      "You imagine drowning yourself in your bathtub by weighing down your head",
      "You imagine drowning duct taped to the underside of a mattress in a pool, and laugh at yourself",
      "You make a plan to kill yourself by hanging yourself with some chain you have lying around",
      "You research lethal doses of draino and decide dying that way would take too long",
      "You look up the local gun laws and wonder if you could pass for sane long enough to buy one",
      "You practice tying hangman's knots",
      "You think about shooting yourself so that the bullet would go into the ground and not hurt anyone else",
      "You wish someone would ask you what was wrong, but realize you probably wouldn't tell them",
      "You try to figure out the best way to shoot yourself in the head and hit your brainstem"
    ],
    extremeSuicidalIdeation: [
      "You hold a pillow over your head until you pass out to see what suffocating is like",
      "You dig out some T3s left over from your wisdom teeth surgery",
      "You decide to buy a lethal dose of advil",
      "You regret not having killed yourself earlier",
      "You start packing your things so they will be easier to take care of when you're gone",
      "You compose an email to the coroner so that no one you know would have to find your body",
      "You pick a spot to swim out into the ocean until you get tired and drown",
      "You put a knife on your bedside table",
      "You decide to hike out into the wilderness until you die of exposure",
      "You pick a park to OD in",
      "You lie on the floor for a little while"
    ],
    manic: [
      "You plan a cross-country rail trip",
      "You decide to landscape your back yard",
      "You decide to become a bike mechanic",
      "You realize you can easily do math in your head that you didn't used to be able to",
      "You start picturing moving objects in four dimensions",
      "You decide to start a hiking club",
      "You decide to create a wiki",
      "You decide to clean up some local trails",
      "You start picking out colours to paint your house",
      "You decide to learn to pick locks",
      "You realize you know all the words to a song you thought you'd forgotten",
      "You decide to start going to church",
      "You decide to build a mountain-top shrine",
      "You feel like you can feel the presence of God",
      "You feel like God is communicating with you personally",
      "You pick up a project you had long-since abandoned",
      "You decide to learn Elvish and have an internal crisis over whether to learn Quenya or Sindarin",
      "You wonder if you could make a living as a con-artist",
      "You feel more powerful than you ever have before",
      "You feel like you could do anything",
      "Your thoughts are racing so fast you wonder you can keep up",
      "You wonder how much shoplifting you could get away with",
      "You plan a hitch-hiking vacation",
      "You decide to learn to play an instrument"
    ],
    hospital: [
      "You feel bored but safe",
      "Everyone else in here seems crazy",
      "You realize the shower curtain bar isn't bolted on so you can't hang yourself from it.  You feel safer",
      "You wish you cared that the food is so bad.  Seriously though, was this milk frozen?",
      "You feel numb",
      "You don't think anything at all for a while",
      "You hear a strange banging and realize it is another patient kicking his radiator",
      "You have a new respect for psych ward nurses",
      "You wish you could live the rest of your life in here",
      "You wonder why you don't miss home"
    ]
  }
};
