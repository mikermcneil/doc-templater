/* 
 * This code was adapted from:
 * ----------------------------------------
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */


/**
 * Module dependencies
 */

var Marked = require('marked');
var hljs = require('highlight.js');
var _ = require('lodash');
var switchback = require('node-switchback');



/**
 * @input  {String} src
 * @input  {Object} options
 * @input  {String} template
 * @switchback [optional]
 * 
 * @return {String} compiled HTML
 */
module.exports = function (inputs, cb) {
  var src = inputs.src;
  var options = inputs.options;
  var template = inputs.template;

  var html = null;
  var templateContext = null;
  var codeLines = options.codeLines;
  var shouldWrap = codeLines && codeLines.before && codeLines.after;

  function wrapLines(code) {
    var out = [];
    var before = codeLines.before;
    var after = codeLines.after;
    code = code.split('\n');
    code.forEach(function(line) {
      out.push(before+line+after);
    });
    return out.join('\n');
  }

  if(options.markdownOptions && typeof options.markdownOptions === 'object'){
    if(typeof options.markdownOptions.highlight === 'string') {
      if(options.markdownOptions.highlight === 'auto') {
        options.markdownOptions.highlight = function(code) {
          var out = hljs.highlightAuto(code).value;
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };
      } else if (options.markdownOptions.highlight === 'manual') {
        options.markdownOptions.highlight = function(code, lang) {
          var out = code;
          try {
            out = hljs.highlight(lang, code).value;
          } catch(e) {
            out = hljs.highlightAuto(code).value;
          }
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };
      }

    }
  }

  // Ensure markdown options is an object
  options.markdownOptions = options.markdownOptions || {};


  if(_.isFunction(options.templateContext)) {
    templateContext = options.templateContext();
  } else {
    templateContext = options.templateContext;
  }

  src = options.preCompile(src, templateContext) || src;

  // If callback was defined, run Marked asynchronously
  if (cb) {
    html = Marked(src, options.markdownOptions, function (err, html) {
      if (err) return switchback(cb).error(err);
      html = postProcessHTML(html, templateContext, options.postCompile);
      switchback(cb).success(null, html);
    });
  }
  // Otherwise, run Marked synchronously
  else {
    html = Marked(src, options.markdownOptions);
    html = postProcessHTML(html, templateContext, options.postCompile);
    return html;
  }

};




/**
 * postProcessHTML()
 * 
 * @param  {[type]} html            [description]
 * @param  {[type]} templateContext [description]
 * @param  {[type]} postCompileFn   [description]
 * @return {String}
 *
 * @api private
 */

function postProcessHTML (html, templateContext, postCompileFn) {
  html = postCompileFn(html, templateContext) || html;
  templateContext.content = html;
  src = _.template(template, templateContext);
  return src;
}
