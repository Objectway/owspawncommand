'use strict';

const Q = require('q');
const spawnCommand = require('spawn-command');
const gutil = require('gulp-util');

/**
 * Available options:
 *  - pipeOutput [default: false]: If true, the output of the command is redirected to the standard output/error.
 */
module.exports = function (command, directory, opts) {
  const options = opts || {};
  const deferred = Q.defer();
  const cmd = spawnCommand(command, {cwd: directory || process.cwd()});
  let cmdOutput = '';

  if (options.pipeOutput) {
    // http://stackoverflow.com/questions/10232192/exec-display-stdout-live
    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);    
  } else {
    cmd.stdout.on('data', function (data) {
      cmdOutput += data.toString('utf8');
    });

    cmd.stderr.on('data', function (data) {
      gutil.log(data.toString('utf8'));
      // deferred.reject(data.toString('utf8'));
    });
  }

  cmd.on('close', function () {
    deferred.resolve(cmdOutput);
  });

  return deferred.promise;
};