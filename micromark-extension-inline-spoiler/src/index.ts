import { State, Effects, Resolve, Tokenizer, Event, Token } from 'micromark/dist/shared-types';
import * as MM from 'micromark/dist/shared-types';
import { CodeAsKey } from 'micromark/lib/shared-types';

export { spoilerHtml } from './html';

/**
 * As of (2021/05/05), the typings exported by `remark` do not
 * accurately reflect their usage, so we patch them here.
 *
 * When exporting functions, we need to be careful to cast back to
 * the built-in types, to be compatible with the current typings for remark.
 */

type SyntaxExtensionHook = { [key: number]: Construct | Construct[]; null?: Construct | Construct[] };

interface SyntaxExtension {
  document?: SyntaxExtensionHook;
  contentInitial?: SyntaxExtensionHook;
  flowInitial?: SyntaxExtensionHook;
  flow?: SyntaxExtensionHook;
  string?: SyntaxExtensionHook;
  text?: SyntaxExtensionHook;
}

type Tokenize = (this: Tokenizer, effects: Effects, ok: State, nok: State) => State;

interface Construct {
  name?: string;
  tokenize: Tokenize;
  partial?: boolean;
  resolve?: Resolve;
  resolveTo?: Resolve;
  resolveAll?: Resolve;
  concrete?: boolean;
  interruptible?: boolean;
  lazy?: boolean;
  // typically extensions will want to get precedence over existing markdown
  // constructs. after can be used to invert that
  // https://github.com/micromark/micromark/discussions/54#discussioncomment-693151
  add?: 'after' | 'before';
}

interface TypeSafeEffects<T extends string> {
  /**
   * Enter and exit define where tokens start and end
   */
  enter: (type: T) => Token;

  /**
   * Enter and exit define where tokens start and end
   */
  exit: (type: T) => Token;

  /**
   * Consume deals with a character, and moves to the next
   */
  consume: (code: number) => void;

  /**
   * Attempt deals with several values, and tries to parse according to those values.
   * If a value resulted in `ok`, it worked, the tokens that were made are used,
   * and `returnState` is switched to.
   * If the result is `nok`, the attempt failed,
   * so we revert to the original state, and `bogusState` is used.
   */
  attempt: (
    constructInfo: Construct | Construct[] | Record<CodeAsKey, Construct | Construct[]>,
    returnState: State,
    bogusState?: State
  ) => (code: number | null) => void;

  /**
   * Interrupt is used for stuff right after a line of content.
   */
  interrupt: (
    constructInfo: Construct | Construct[] | Record<CodeAsKey, Construct | Construct[]>,
    ok: MM.Okay,
    nok?: MM.NotOkay
  ) => (code: number | null) => void;

  check: (
    constructInfo: Construct | Construct[] | Record<CodeAsKey, Construct | Construct[]>,
    ok: MM.Okay,
    nok?: MM.NotOkay
  ) => (code: number | null) => void;

  /**
   * Lazy is used for lines that were not properly preceded by the container.
   */
  lazy: (
    constructInfo: Construct | Construct[] | Record<CodeAsKey, Construct | Construct[]>,
    ok: MM.Okay,
    nok?: MM.NotOkay
  ) => void;
}

export interface SpoilerSyntaxOptions {}

/**
 * Adds support for Discord-style spoilers to `micromark`.
 */
export const spoilerSyntax = function (options?: Partial<SpoilerSyntaxOptions>): SyntaxExtension {
  return {
    text: {
      [124]: { tokenize: spoilerTokenize },
    } as unknown as SyntaxExtension['text'],
  };
} as (options: Partial<SpoilerSyntaxOptions>) => MM.SyntaxExtension;

const lookaheadConstruct = {
  partial: true,
  /** If the next two characters are `||`, run `ok`, else `nok`. */
  tokenize(effects: Effects, ok: State, nok: State): State {
    return start;

    function start(code: number) {
      // match first symbol `|`
      if (code !== 124) {
        return nok(code);
      }
      effects.consume(code);
      return lookaheadAt;
    }

    function lookaheadAt(code: number) {
      // match second symbol `|`
      if (code !== 124) {
        return nok(code);
      }
      effects.consume(code);
      return ok(code);
    }
  },
};

const enum SpoilerToken {
  spoiler = 'spoiler',
  spoilerMarker = 'spoilerMarker',
  spoilerText = 'spoilerText',
}

/**
 * Entry-point for the spoiler tokenizer.
 */
const spoilerTokenize: Tokenize = function (
  this: Tokenizer,
  effects: Effects | TypeSafeEffects<SpoilerToken>,
  ok: State,
  nok: State
): State {
  // typos in strings manually passed to enter() / exit() have been
  // a source of bugs, so let TypeScript error-check for us
  effects = effects as unknown as TypeSafeEffects<SpoilerToken>;

  return firstSpoilerStart;

  function firstSpoilerStart(code: number): State | void {
    // match first starting '|'
    if (code === 124) {
      effects.enter(SpoilerToken.spoiler);
      effects.enter(SpoilerToken.spoilerMarker);
      effects.consume(code);
      return secondSpoilerStart;
    }
    // invalid starting character
    else {
      return nok(code);
    }
  }

  function secondSpoilerStart(code: number): State | void {
    // match second starting '|'
    if (code === 124) {
      effects.consume(code);
      effects.exit(SpoilerToken.spoilerMarker);
      effects.enter(SpoilerToken.spoilerText);
      return consumeSpoilerText;
    }
    // invalid character
    else {
      return nok(code);
    }
  }

  function consumeSpoilerText(code: number): State | void {
    // match first ending '|'
    if (code === 124) {
      return effects.check(lookaheadConstruct as any, firstSpoilerEnd, consumeAsText)(code);
    }
    if (code === null) {
      return nok(code);
    }

    // otherwise, continue consuming characters
    effects.consume(code);
    return consumeSpoilerText;
  }

  function consumeAsText(code: number): State | void {
    if (code === null) {
      return nok(code);
    }

    effects.consume(code);
    return consumeSpoilerText;
  }

  function firstSpoilerEnd(code: number): State | void {
    // match first ending '|'
    if (code === 124) {
      effects.exit(SpoilerToken.spoilerText);
      effects.enter(SpoilerToken.spoilerMarker);
      effects.consume(code);
      return secondSpoilerEnd;
    }
    // invalid character
    else {
      return nok(code);
    }
  }

  function secondSpoilerEnd(code: number): State | void {
    // match second ending '|'
    if (code === 124) {
      effects.consume(code);
      effects.exit(SpoilerToken.spoilerMarker);
      effects.exit(SpoilerToken.spoiler);
      return ok;
    }
    // invalid character
    else {
      return nok(code);
    }
  }
};
