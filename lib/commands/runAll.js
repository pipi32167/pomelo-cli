'use strict';
var async = require('async');
var _ = require('underscore');
var logger = require('pomelo-logger').getLogger(__filename);
var util = require('../util');
var consts = require('../consts');
var cliff = require('cliff');

module.exports = function(opts) {
  return new Command(opts);
};

module.exports.commandId = 'runAll';
module.exports.helpCommand = 'help runAll';

var Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {

  var argvs = util.argsFilter(argv);

  if (argvs.length < 2) {
    agent.handle(module.exports.helpCommand, msg, rl, client);
    return;
  }

  var Context = agent.getContext();
  var param = '';
  var serverIds;

  async.series({
      getServerIds: function(cb) {

        client.request('watchServer', {
          comd: 'servers',
          param: '',
          context: Context
        }, function(err, data) {
          if (err) cb(err)
          else {
            serverIds = _(data.msg).map(function(elem) {
              return elem.serverId;
            })

            // console.log(serverIds);
            cb()
          }
        });
      },

      reload: function(cb) {

        async.mapSeries(
          serverIds,
          function(elem, cb) {

            client.request('watchServer', {
              comd: 'run',
              param: argvs[1],
              context: elem
            }, function(err, data) {
              cb(err, {
                serverId: elem,
                data: data,
              });
            });
          },
          function(err, datas) {
            if (!err) {
              util.formatOutput(module.exports.commandId, JSON.stringify(datas, null, ' '));
            }
            cb(err);
          });
      },
    },
    function(err, data) {
      // console.log(err, data);
      if (err) console.log(err);
      rl.prompt();
    });
}