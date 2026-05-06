const s = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
function f() {
  return {
    canContainEols: ["spoiler"],
    enter: { spoiler: l },
    exit: { spoiler: a }
  };
}
function h() {
  return {
    unsafe: [
      {
        character: "|",
        inConstruct: "phrasing",
        notInConstruct: s
      }
    ],
    handlers: { spoiler: o }
  };
}
const l = function(e) {
  this.enter({ type: "spoiler", children: [] }, e);
}, a = function(e) {
  this.exit(e);
}, o = function(e, u, n, i) {
  const r = n.createTracker(i), c = n.enter("spoiler");
  let t = r.move("||");
  return t += n.containerPhrasing(e, {
    ...r.current(),
    before: t,
    after: "|"
  }), t += r.move("||"), c(), t;
}, p = function() {
  return "|";
};
o.peek = p;
export {
  f as spoilerFromMarkdown,
  h as spoilerToMarkdown
};
//# sourceMappingURL=index.esm.js.map
