import { spoiler as t } from "micromark-extension-inline-spoiler";
import { spoilerFromMarkdown as a, spoilerToMarkdown as e } from "mdast-util-inline-spoiler";
function d(i = {}) {
  var o = this.data();
  r("micromarkExtensions", t(i || {})), r("fromMarkdownExtensions", a()), r("toMarkdownExtensions", e());
  function r(n, s) {
    o[n] ? o[n].push(s) : o[n] = [s];
  }
}
export {
  d as default,
  d as spoilerPlugin
};
//# sourceMappingURL=index.esm.js.map
