const p = {
  enter: {
    spoiler: i
  },
  exit: {
    spoiler: s,
    spoilerText: l
  }
};
function r(e) {
  return e[e.length - 1];
}
function i(e) {
  this.enter(
    {
      type: "spoiler",
      value: ""
    },
    e
  ), this.buffer();
}
function s(e) {
  const t = this.resume(), n = r(this.stack);
  n.value = t, this.exit(e);
}
function l(e) {
}
function a(e = {}) {
  const t = [{ character: "|", inConstruct: ["spoilerText"] }];
  function n(o, u, c) {
    return `||${o.value}||`;
  }
  return {
    unsafe: t,
    handlers: {
      // as of (2021-05-07), the typings for Handle do not reflect
      // that the handler will be passed nodes of a specific type
      spoiler: n
    }
  };
}
export {
  p as spoilerFromMarkdown,
  a as spoilerToMarkdown
};
//# sourceMappingURL=index.esm.js.map
