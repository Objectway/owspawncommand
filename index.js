'use strict';

const Q = require('q');
const spawnCommand = require('spawn-command');
const gutil = require('gulp-util');

module.exports = function (command) {
  let deferred = Q.defer()
    , cmd
    , cmdOutput = ''
    ;

  cmd = spawnCommand(command);

  cmd.stdout.on('data', function (data) {
    cmdOutput += data.toString('utf8');
  });

  cmd.stderr.on('data', function (data) {
    gutil.log(data.toString('utf8'));
    // deferred.reject(data.toString('utf8'));
  });

  cmd.on('close', function () {
    deferred.resolve(cmdOutput);
  });

  return deferred.promise;
};
