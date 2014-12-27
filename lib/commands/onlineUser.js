'use strict';
var _ = require('underscore');
var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
  return new Command(opts);
};

module.exports.commandId = 'onlineUser';
module.exports.helpCommand = 'help onlineUser';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var Context = agent.getContext();
  var argvs = util.argsFilter(argv);
  var param = '';

  var user = msg['user'] || 'admin';

  client.request('onlineUser', {
    comd: comd,
    param: param,
    context: Context
  }, function(err, data) {
    // console.log(err, data);

    if (err) console.log(err);
    else {
      var header = [['serverId', 'userCount']];
      var rows = [];
      var total = 0, count;
      for(var serverId in data){
        count = data[serverId];
        total += count;
        rows.push([serverId, count]);
      }
      rows.push(['total', total]);
      rows = _(rows).sortBy(function (row) {
        return row[0];
      });
      console.log('\n' + cliff.stringifyRows(header.concat(rows), ['red', 'green']) + '\n');
    }
    rl.prompt();
  });
}