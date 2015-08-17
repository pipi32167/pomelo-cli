'use strict';

module.exports = function(opts) {
  return new Command(opts);
};

module.exports.commandId = 'gc';
module.exports.helpCommand = 'help gc';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var Context = agent.getContext();
  var param = '';

  client.request('gc', {
    comd: comd,
    param: param,
    context: Context
  }, function(err, data) {
    // console.log(err, data);

    if (err) console.log(err);
    rl.prompt();
  });
}