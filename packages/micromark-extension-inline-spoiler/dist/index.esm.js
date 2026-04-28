import { splice as m } from "micromark-util-chunked";
import { classifyCharacter as h } from "micromark-util-classify-character";
import { resolveAll as T } from "micromark-util-resolve-all";
import { codes as A, types as d, constants as g } from "micromark-util-symbol";
function w(u) {
  const a = (u == null ? void 0 : u.code) ?? A.verticalBar, y = {
    name: "spoiler",
    tokenize: q,
    resolveAll: b
  };
  return {
    text: { [a]: y },
    insideSpan: { null: [y] },
    attentionMarkers: { null: [a] }
  };
  function q(e, i, r) {
    const t = this.events, p = this.previous;
    let l = 0;
    return n;
    function n(o) {
      return p === a && t[t.length - 1][1].type !== d.characterEscape ? r(o) : (e.enter("spoilerSequenceTemporary"), s(o));
    }
    function s(o) {
      const c = h(p);
      if (o === a)
        return l > 1 ? r(o) : (e.consume(o), l++, s);
      if (l !== 2)
        return r(o);
      const S = e.exit("spoilerSequenceTemporary"), f = h(o);
      return S._open = !f || f === g.attentionSideAfter && !!c, S._close = !c || c === g.attentionSideAfter && !!f, i(o);
    }
  }
  function b(e, i) {
    let r = -1;
    for (; ++r < e.length; )
      if (e[r][0] === "enter" && e[r][1].type === "spoilerSequenceTemporary" && e[r][1]._close) {
        let t = r;
        for (; t--; )
          if (e[t][0] === "exit" && e[t][1].type === "spoilerSequenceTemporary" && e[t][1]._open && // If the sizes are the same:
          e[r][1].end.offset - e[r][1].start.offset === e[t][1].end.offset - e[t][1].start.offset) {
            e[r][1].type = "spoilerSequence", e[t][1].type = "spoilerSequence";
            const p = {
              type: "spoiler",
              start: Object.assign({}, e[t][1].start),
              end: Object.assign({}, e[r][1].end)
            }, l = {
              type: "spoilerText",
              start: Object.assign({}, e[t][1].end),
              end: Object.assign({}, e[r][1].start)
            }, n = [
              ["enter", p, i],
              ["enter", e[t][1], i],
              ["exit", e[t][1], i],
              ["enter", l, i]
            ], s = i.parser.constructs.insideSpan.null;
            s && m(n, n.length, 0, T(s, e.slice(t + 1, r), i)), m(n, n.length, 0, [
              ["exit", l, i],
              ["enter", e[r][1], i],
              ["exit", e[r][1], i],
              ["exit", p, i]
            ]), m(e, t - 1, r - t + 3, n), r = t + n.length - 2;
            break;
          }
      }
    for (r = -1; ++r < e.length; )
      e[r][1].type === "spoilerSequenceTemporary" && (e[r][1].type = d.data);
    return e;
  }
}
export {
  w as spoiler
};
//# sourceMappingURL=index.esm.js.map
