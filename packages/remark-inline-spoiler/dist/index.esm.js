import { spoiler as n } from "micromark-extension-inline-spoiler";
import { spoilerToMarkdown as p, spoilerFromMarkdown as t } from "mdast-util-inline-spoiler";
var s = !1;
function l(r) {
  return !s && (r.Parser && r.Parser.prototype && r.Parser.prototype.blockTokenizers || r.Compiler && r.Compiler.prototype && r.Compiler.prototype.visitors) && (s = !0, console.warn("[remark-inline-spoiler] Warning: please upgrade to remark 13 to use this plugin")), s;
}
function u(r = {}) {
  var o = this.data();
  l(this), e("micromarkExtensions", n(r.syntax || {})), e("fromMarkdownExtensions", t), e("toMarkdownExtensions", p(r.toMarkdown || {}));
  function e(i, a) {
    o[i] ? o[i].push(a) : o[i] = [a];
  }
}
export {
  u as default,
  u as spoilerPlugin
};
//# sourceMappingURL=index.esm.js.map
