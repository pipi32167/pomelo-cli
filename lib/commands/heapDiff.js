'use strict';

module.exports = function(opts) {
  return new Command(opts);
};

module.exports.commandId = 'heapDiff';
module.exports.helpCommand = 'help heapDiff';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var Context = agent.getContext();
  // var argvs = util.argsFilter(argv);
  var param = '';

  client.request('heapDiff', {
    comd: comd,
    param: param,
    context: Context
  }, function(err, data) {
    // console.log(err, data);

    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
    rl.prompt();
  });
}