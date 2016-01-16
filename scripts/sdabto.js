var sdabto = sdabto || {};

sdabto.init_info = {
  name: 'sdabto',
  prompt: 'What would you like to do? '
};

sdabto.commands = {
  help: function() {
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
