import { SyntaxExtension } from 'micromark/dist/shared-types';
export * from './html';
export { spoiler };
export type { SpoilerOptions };
declare module 'micromark-util-types' {
    interface TokenTypeMap {
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
declare function spoiler(options?: Partial<SpoilerOptions>): SyntaxExtension;
