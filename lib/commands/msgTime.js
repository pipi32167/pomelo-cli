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

var sum = function(arr) {
  return _.reduce(arr, function(memo, num) {
    return memo + num;
  }, 0);
}

var max = function(arr) {
  var res = 0;
  for (var i = i; i < arr.length; i++) {
    if (res < arr[i]) {
      res = arr[i];
    }
  }
  return res;
}

var min = function(arr) {
  var res = 0;
  for (var i = i; i < arr.length; i++) {
    if (res > arr[i]) {
      res = arr[i];
    }
  }
  return res;
}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var Context = agent.getContext();
  var param = '';

  client.request('msgTime', {
    comd: comd,
    param: param,
    context: Context
  }, function(err, data) {
    // console.log(err, data);

    if (err) console.log(err);
    else {
      // console.log(data);
      var res = {};
      var sid, route, msgStat, rpcStat;
      for (sid in data) {
        msgStat = data[sid].msgStat;
        // console.log(msgStat);
        for (route in msgStat) {
          res[route] = res[route] || [];
          res[route] = res[route].concat(msgStat[route]);
        }
        rpcStat = data[sid].rpcStat;
        // console.log(rpcStat);
        for (route in rpcStat) {
          res[route] = res[route] || [];
          res[route] = res[route].concat(rpcStat[route]);
        }
      }

      var stat = {};
      for (route in res) {
        stat[route] = {};
        stat[route].route = route;
        stat[route].count = res[route].length;
        stat[route].max = max(res[route]);
        stat[route].min = min(res[route]);
        stat[route].total = sum(res[route]);
        stat[route].avg = parseFloat((stat[route].total / stat[route].count).toFixed(2), 10);
        stat[route].qps = parseInt((1000 / stat[route].avg).toFixed(0));
      }

      stat.all = getStatAll(res);

      var header = [
        ['route', 'count', 'max', 'min', 'avg', 'qps', 'total']
      ];
      var rows = [],
        row;
      for (route in stat) {
        row = [];
        header[0].forEach(function(elem) {
          row.push(stat[route][elem]);
        });
        rows.push(row);
      }
      rows = _(rows).sortBy(function(row) {
        return -row[6];
      });
      // console.log(stat);
      console.log('\n' + cliff.stringifyRows(header.concat(rows), ['green', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow']) + '\n');
    }
    rl.prompt();
  });
}

var getStatAll = function(costs) {
  costs = _(costs).chain().values().flatten().value();
  var res = {};
  res.route = 'all';
  res.count = costs.length;
  res.max = 'N/A';
  res.min = 'N/A';
  res.total = sum(costs);
  res.avg = parseFloat((res.total / res.count).toFixed(2), 10);
  res.qps = parseInt((1000 / res.avg).toFixed(0));
  return res;
}