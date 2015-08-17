'use strict';
var _ = require('underscore');
var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
  return new Command(opts);
};

module.exports.commandId = 'user';
module.exports.helpCommand = 'help user';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var Context = agent.getContext();
  var param = '';

  client.request('user', {
    comd: comd,
    param: param,
    context: Context
  }, function(err, data) {
    // console.log(err, data);

    if (err) console.log(err);
    else {
      var header = [['serverId', 'online', 'total']];
      var rows = [];
      var totalOnline = 0, totalTotal = 0, online, total;
      for(var serverId in data){
        online = data[serverId].onlineCount;
        total = data[serverId].totalCount;
        totalOnline += online;
        totalTotal += total;
        rows.push([serverId, online, total]);
      }
      rows.push(['total', totalOnline, totalTotal]);
      rows = _(rows).sortBy(function (row) {
        return row[0];
      });
      console.log('\n' + cliff.stringifyRows(header.concat(rows), ['red', 'green', 'blue']) + '\n');
    }
    rl.prompt();
  });
}