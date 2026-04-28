// Modified from https://jsr.io/@qz/micromark-extension-spoiler

import type { Code, Construct, Effects, Event, Extension, State, Token, TokenizeContext } from 'micromark-util-types';
import { splice } from 'micromark-util-chunked';
import { classifyCharacter } from 'micromark-util-classify-character';
import { resolveAll } from 'micromark-util-resolve-all';
import { codes, constants, types } from 'micromark-util-symbol';
import { SyntaxExtension } from 'micromark/dist/shared-types';

export { spoiler };
export type { SpoilerOptions };

declare module 'micromark-util-types' {
  export interface TokenTypeMap {
    spoilerSequenceTemporary: Token;
    spoilerSequence: Token;
    spoilerText: Token;
    spoiler: Token;
  }
}

/** Options for {@linkcode spoiler}. */
interface SpoilerOptions {
  /**
   * Character code for the spoiler marker.
   *
   * You can use the [micromark-util-symbol][1] to get the correct code.
   *
   * Defaults to `124`, which is a character code for vertical bar (`|`).
   *
   * [1]: https://www.npmjs.com/package/micromark-util-symbol
   *
   * @default 124
   *
   * @example
   * ```ts
   * import { micromark } from "micromark";
   * import { codes } from "micromark-util-symbol";
   * import { spoiler, spoilerHtml } from "micromark-extension-inline-spoiler";
   *
   * const result = micromark("!!SECRET!!", {
   *   extensions: [spoiler({ code: codes.exclamationMark })],
   *   htmlExtensions: [spoilerHtml()],
   * });
   *
   * console.log(result); // <p><span class="spoiler">SECRET</span></p>
   * ```
   */
  code: number;
}

/**
 * Create an extension for [micromark][1] to support spoiler syntax.
 *
 * [1]: https://www.npmjs.com/package/micromark
 *
 * @example
 * ```ts
 * import { micromark } from "micromark";
 * import { spoiler, spoilerHtml } from "micromark-extension-inline-spoiler";
 *
 * const result = micromark("A ||B||", {
 *   extensions: [spoiler()],
 *   htmlExtensions: [spoilerHtml()],
 * });
 *
 * console.log(result) // <p>A <span class="spoiler">B</span></p>
 * ```
 */
function spoiler(options?: Partial<SpoilerOptions>): SyntaxExtension {
  const spoilerCode = options?.code ?? codes.verticalBar;

  const tokenizer: Construct = {
    name: 'spoiler',
    tokenize: tokenizeSpoiler,
    resolveAll: resolveAllSpoiler,
  };

  const ret: Extension = {
    text: { [spoilerCode]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [spoilerCode] },
  };
  return ret as SyntaxExtension;

  function tokenizeSpoiler(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    const events = this.events;
    const previousCode = this.previous;
    /** Counts how many markers have been consumed so far. */
    let size = 0;

    return start;

    function start(code: Code): State | undefined {
      // If the previous character is the same marker and not escaped.
      if (previousCode === spoilerCode && events[events.length - 1][1].type !== types.characterEscape) {
        return nok(code);
      }

      effects.enter('spoilerSequenceTemporary');
      return more(code);
    }

    function more(code: Code): State | undefined {
      const before = classifyCharacter(previousCode);

      if (code === spoilerCode) {
        // If this is the third marker, fail this tokenizer.
        if (size > 1) return nok(code);
        effects.consume(code);
        size++;
        return more;
      }

      // Must have exactly two markers (`||`).
      // A single marker (`|a|`) is invalid.
      if (size !== 2) {
        return nok(code);
      }

      const token = effects.exit('spoilerSequenceTemporary');

      /**
       * `1` means [whitespace],
       * `2` means [punctuation],
       * `undefined` means something else (letters, digits, etc.).
       *
       * [whitespace]: https://spec.commonmark.org/0.31.2/#unicode-whitespace-character
       * [punctuation]: https://spec.commonmark.org/0.31.2/#ascii-punctuation-character
       */
      const after: 1 | 2 | undefined = classifyCharacter(code);

      /**
       * ## CommonMark rules (left-flanking)
       *
       * A [left-flanking] [delimiter run] is a run that:
       *   1. is not followed by [whitespace], and
       *   2. is either
       *      (a) not followed by [punctuation], or
       *      (b) followed by [punctuation] and preceded by [whitespace] or
       *          [punctuation].
       *
       * Source: https://spec.commonmark.org/0.31.2/#left-flanking-delimiter-run
       *
       * ## `!after`
       *
       * This checks rule (1) and (2a): not followed by whitespace or
       * punctuation. Since `after` can be `1` (whitespace), `2` (punctuation),
       * or `undefined` (letter/digit), only `undefined` makes `!after` true.
       *
       * Example:
       * `||hello||` – `||` is followed by `h` => OK
       * `|| hello||` – `||` is followed by space => NOT OK
       *
       * ## after === constants.attentionSideAfter && Boolean(before)
       *
       * Even if `after` is falsey (whitespace/punctuation), there is another
       * valid case (rule 2b): if the character **after** is punctuation, the
       * character **before** must be whitespace or punctuation.
       *
       * `constants.attentionSideAfter` equals `2` (punctuation).
       * `Boolean(before)` is true for `1` or `2` (whitespace/punctuation).
       *
       * Example:
       * `Hello ||!` – after `||` is `!`, before `||` is space => OK
       * `Hello||!` – after `||` is `!`, before `||` is letter => NOT OK
       *
       * [left-flanking]:https://spec.commonmark.org/0.31.2/#left-flanking-delimiter-run
       * [delimiter run]: https://spec.commonmark.org/0.31.2/#delimiter-run
       * [whitespace]: https://spec.commonmark.org/0.31.2/#unicode-whitespace
       * [punctuation]:
       * https://spec.commonmark.org/0.31.2/#unicode-punctuation-character
       */
      token._open = !after || (after === constants.attentionSideAfter && Boolean(before));

      /**
       * Similar logic applies to [right-flanking] delimiters.
       *
       * A right-flanking delimiter run is a delimiter run that:
       *   1. is not preceded by whitespace, and
       *   2. is either
       *      (a) not preceded by punctuation,
       *      (b) preceded by punctuation and followed by whitespace or
       *          punctuation.
       *
       * [right-flanking]: https://spec.commonmark.org/0.31.2/#right-flanking-delimiter-run
       */
      token._close = !before || (before === constants.attentionSideAfter && Boolean(after));

      return ok(code);
    }
  }

  /** Process all events and resolve spoiler tokens. */
  function resolveAllSpoiler(events: Event[], context: TokenizeContext): Event[] {
    let index = -1;

    // Walk through all events.
    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === 'enter' &&
        events[index][1].type === 'spoilerSequenceTemporary' &&
        events[index][1]._close
      ) {
        let open = index;

        // Now walk back to find an opener.
        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === 'exit' &&
            events[open][1].type === 'spoilerSequenceTemporary' &&
            events[open][1]._open &&
            // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
              events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = 'spoilerSequence';
            events[open][1].type = 'spoilerSequence';

            const spoiler: Token = {
              type: 'spoiler',
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end),
            };

            const text: Token = {
              type: 'spoilerText',
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start),
            };

            // Opening.
            const nextEvents: Event[] = [
              ['enter', spoiler, context],
              ['enter', events[open][1], context],
              ['exit', events[open][1], context],
              ['enter', text, context],
            ];

            const insideSpan = context.parser.constructs.insideSpan.null;

            if (insideSpan) {
              // Between.
              splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan, events.slice(open + 1, index), context));
            }

            // Closing.
            splice(nextEvents, nextEvents.length, 0, [
              ['exit', text, context],
              ['enter', events[index][1], context],
              ['exit', events[index][1], context],
              ['exit', spoiler, context],
            ]);

            splice(events, open - 1, index - open + 3, nextEvents);

            index = open + nextEvents.length - 2;
            break;
          }
        }
      }
    }

    index = -1;

    while (++index < events.length) {
      if (events[index][1].type === 'spoilerSequenceTemporary') {
        events[index][1].type = types.data;
      }
    }

    return events;
  }
}
