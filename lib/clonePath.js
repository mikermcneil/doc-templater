// var run = require('comandante').run;
// var git = _.partial(run, 'git');
// var cloneRepo = _.partial(git, ['clone']);

var _ = require('lodash');
var fsx = require('fs-extra');
var path = require('path');

var CWD = require('./CWD');

module.exports = function clonePath (options) {
  options = _.defaults(options || {}, {
    pathToTmp: path.resolve(process.cwd(), '/.tmp/doc-templater/')
  });

  // Make sure the tmp directory exists
  if (!fsx.existsSync(pathToTmp)) {
    fsx.mkdirsSync(pathToTmp);
  }
  else {

    // Determine whether the repo has already been cloned
    // (then we only need to `git pull` it- which is faster)
    var pathToGitFiles = path.join(pathToTmp, repoName, '.git/');
    console.log(pathToGitFiles);
  }



  cwd = new CWD();
  cwd.cd(options.pathToTmp);




  cwd.goBack();
};


// process.chdir('../sails');
// git.read('master', 'README.md').pipe(process.stdout);


function cloneRepo (currentDocsObject) {

  // Make sure the .tmp directory exists so we can clone the repo in it
  var tmpDir = process.cwd() + '/.tmp/doc-templater/';
  if (!fs.existsSync(tmpDir))
    fs.mkdirsSync(tmpDir);

  process.chdir(tmpDir);


  path.join(tmpDir, repoName);

  // Find the base git repo on disk then delete it and reclone.
  var __docsRepoOnDisk;
  if (currentDocsObject.config.__baseDocsRepoOnDisk) {
    __docsRepoOnDisk = currentDocsObject.config.__baseDocsRepoOnDisk;
  }
  else {
    __docsRepoOnDisk = currentDocsObject.config.__docsRepoOnDisk;
  }

  var fullGitPathOnDisk = tmpDir + currentDocsObject.config.__derivenRepoName;
  if (fs.existsSync(fullGitPathOnDisk)) {
    // console.log(fullGitPathOnDisk, ' exists!  Lets pull down any new changes.');
    process.chdir(currentDocsObject.config.__derivenRepoName);
    doClone(['pull']);
  }
  else {
    // console.log(fullGitPathOnDisk, 'hasnt been cloned yet.  I\'ll do that now!');
    doClone(['clone', currentDocsObject.config.docsGitRepo]);
  }

}


function doClone (operationAndAruments) {

  var gitOperation = spawn('git', operationAndAruments);
  process.chdir(tmpDir);
  gitOperation.stdout.on('data', function(d) {
    // console.log('\nInfo:' + d);
  });
  gitOperation.stderr.on('data', function(d) {
    // console.log('\nStderr:' + d);
  });
  gitOperation.on('close', function(code) {
    process.chdir('../..');
    if (code === 0) {
      return afterEachStep(null, currentDocsObject);
    } else {
      // console.log('Sorry Homie.  The building collapsed and i\'m left holding exit code ' + code);
      return afterEachStep(new Error('git clone exited with code' + code), currentDocsObject);
    }
  });
}
