import { splice as m } from "micromark-util-chunked";
import { classifyCharacter as h } from "micromark-util-classify-character";
import { resolveAll as A } from "micromark-util-resolve-all";
import { codes as j, types as S, constants as d } from "micromark-util-symbol";
function _(n) {
  const o = (n == null ? void 0 : n.openingTag) ?? '<span class="spoiler">', u = (n == null ? void 0 : n.closingTag) ?? "</span>";
  return {
    enter: {
      spoiler() {
        this.tag(o);
      }
    },
    exit: {
      spoiler() {
        this.tag(u);
      }
    }
  };
}
function w(n) {
  const o = (n == null ? void 0 : n.code) ?? j.verticalBar, u = {
    name: "spoiler",
    tokenize: q,
    resolveAll: b
  };
  return {
    text: { [o]: u },
    insideSpan: { null: [u] },
    attentionMarkers: { null: [o] }
  };
  function q(e, i, r) {
    const t = this.events, p = this.previous;
    let s = 0;
    return a;
    function a(l) {
      return p === o && t[t.length - 1][1].type !== S.characterEscape ? r(l) : (e.enter("spoilerSequenceTemporary"), c(l));
    }
    function c(l) {
      const f = h(p);
      if (l === o)
        return s > 1 ? r(l) : (e.consume(l), s++, c);
      if (s !== 2)
        return r(l);
      const y = e.exit("spoilerSequenceTemporary"), g = h(l);
      return y._open = !g || g === d.attentionSideAfter && !!f, y._close = !f || f === d.attentionSideAfter && !!g, i(l);
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
            }, s = {
              type: "spoilerText",
              start: Object.assign({}, e[t][1].end),
              end: Object.assign({}, e[r][1].start)
            }, a = [
              ["enter", p, i],
              ["enter", e[t][1], i],
              ["exit", e[t][1], i],
              ["enter", s, i]
            ], c = i.parser.constructs.insideSpan.null;
            c && m(a, a.length, 0, A(c, e.slice(t + 1, r), i)), m(a, a.length, 0, [
              ["exit", s, i],
              ["enter", e[r][1], i],
              ["exit", e[r][1], i],
              ["exit", p, i]
            ]), m(e, t - 1, r - t + 3, a), r = t + a.length - 2;
            break;
          }
      }
    for (r = -1; ++r < e.length; )
      e[r][1].type === "spoilerSequenceTemporary" && (e[r][1].type = S.data);
    return e;
  }
}
export {
  w as spoiler,
  _ as spoilerHtml
};
//# sourceMappingURL=index.esm.js.map
