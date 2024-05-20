import { Token } from 'micromark/dist/shared-types';

export type SpoilerHtmlOptions = {};

/**
 * Converts a token stream produced by the syntax extension
 * directly to HTML, with no intermediate AST.
 */
export function spoilerHtml(this: any, opts: SpoilerHtmlOptions = {}) {
  function enterSpoiler(this: any): void {}

  function exitSpoiler(this: any, token: Token): void {
    this.tag(`<span class="spoiler">`);
    this.raw(this.sliceSerialize(token));
    this.tag('</span>');
  }

  return {
    enter: {
      spoilerText: enterSpoiler,
    },
    exit: {
      spoilerText: exitSpoiler,
    },
  };
}
