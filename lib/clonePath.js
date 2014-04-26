var _ = require('lodash');
var run = require('comandante').run;
var git = _.partial(run, 'git');
var cloneRepo = _.partial(git, ['clone']);



module.exports = function clonePath (repourl, path) {

  process.chdir('../sails');
  git.read('master', 'README.md').pipe(process.stdout);
};

