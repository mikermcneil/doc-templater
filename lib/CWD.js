
/**
 * process.cwd() w/ history
 */
function CWD () {
  this._stack = [];
}
CWD.prototype.cd = function (_newCwd) {
  this._stack.push(process.cwd());
  process.chdir(_newCwd);
};
CWD.prototype.goBack = function () {
  process.chdir(this._stack.pop());
};

module.exports = CWD;
