'use strict';
var _ = require('underscore');
var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
  return new Command(opts);
};

module.exports.commandId = 'show';
module.exports.helpCommand = 'help show';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var Context = agent.getContext();
  var argvs = util.argsFilter(argv);
  var param = '';

  var user = msg.user || 'admin';

  client.request('msgCount', {
    comd: comd,
    param: param,
    context: Context
  }, function(err, data) {
    // console.log(err, data);

    if (err) console.log(err);
    else {

      var header = [['serverId', 'request', 'response', 'avg', 'avg[total]']];
      var rows = [];
      var totalReq = 0, totalResp = 0, totalAvg = 0, totalAvgTotal = 0,
          request, response, avg, avgTotal;
      for(var serverId in data){
        request = data[serverId].request || 0;
        response = data[serverId].response || 0;
        avg = data[serverId].avg || 0;
        avgTotal = data[serverId].avgTotal || 0;
        totalReq += request;
        totalResp += response;
        totalAvg += avg;
        totalAvgTotal += avgTotal;
        rows.push([serverId, request, response, avg, avgTotal]);
      }
      rows.push(['total', totalReq, totalResp, totalAvg, totalAvgTotal]);
      rows = _(rows).sortBy(function (row) {
        return row[0];
      });
      console.log('\n' + cliff.stringifyRows(header.concat(rows), ['red', 'green', 'green', 'yellow', 'yellow']) + '\n');
    }
    rl.prompt();
  });
}