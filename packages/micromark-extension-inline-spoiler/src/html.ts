// Modified from https://jsr.io/@qz/micromark-extension-spoiler
import { HtmlExtension } from 'micromark-util-types';

export { spoilerHtml };
export type { SpoilerHtmlOptions };

/** Options for {@linkcode spoilerHtml}. */
interface SpoilerHtmlOptions {
  /**
   * HTML tag used at the start of a spoiler.
   *
   * @default '<span class="spoiler">'
   */
  openingTag?: string;
  /**
   * HTML tag used at the end of a spoiler.
   *
   * @default "</span>"
   */
  closingTag?: string;
}

/**
 * Creates an HTML extension for [micromark][1] to support spoiler when
 * converting Markdown to HTML.
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
function spoilerHtml(options?: SpoilerHtmlOptions): HtmlExtension {
  const openingTag = options?.openingTag ?? '<span class="spoiler">';
  const closingTag = options?.closingTag ?? '</span>';

  return {
    enter: {
      spoiler() {
        this.tag(openingTag);
      },
    },
    exit: {
      spoiler() {
        this.tag(closingTag);
      },
    },
  };
}
