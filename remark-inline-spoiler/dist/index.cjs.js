'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var micromarkExtensionInlineSpoiler = require('micromark-extension-inline-spoiler');
var mdastUtilInlineSpoiler = require('mdast-util-inline-spoiler');

var warningIssued = false;

function remarkV13Warning(context) {
  if (!warningIssued && (context.Parser && context.Parser.prototype && context.Parser.prototype.blockTokenizers || context.Compiler && context.Compiler.prototype && context.Compiler.prototype.visitors)) {
    warningIssued = true;
    console.warn('[remark-inline-spoiler] Warning: please upgrade to remark 13 to use this plugin');
  }

  return warningIssued;
}

function spoilerPlugin(options) {
  var data = this.data(); // warn for earlier versions

  remarkV13Warning(this);
  add('micromarkExtensions', micromarkExtensionInlineSpoiler.spoilerSyntax(options.syntax || {}));
  add('fromMarkdownExtensions', mdastUtilInlineSpoiler.spoilerFromMarkdown);
  add('toMarkdownExtensions', mdastUtilInlineSpoiler.spoilerToMarkdown(options.toMarkdown || {}));

  function add(field, value) {
    if (data[field]) data[field].push(value);else data[field] = [value];
  }
}

exports.spoilerPlugin = spoilerPlugin;
//# sourceMappingURL=index.cjs.js.map
