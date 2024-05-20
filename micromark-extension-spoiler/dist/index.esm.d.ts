import * as MM from 'micromark/dist/shared-types';
import { Token } from "micromark/dist/shared-types";
type SpoilerHtmlOptions = {};
/**
 * Converts a token stream produced by the syntax extension
 * directly to HTML, with no intermediate AST.
 */
declare function spoilerHtml(this: any, opts?: SpoilerHtmlOptions): {
    enter: {
        spoilerText: (this: any) => void;
    };
    exit: {
        spoilerText: (this: any, token: Token) => void;
    };
};
interface SpoilerSyntaxOptions {
}
/**
 * Adds support for Discord-style spoilers to `micromark`.
 */
declare const spoilerSyntax: (options: Partial<SpoilerSyntaxOptions>) => MM.SyntaxExtension;
export { spoilerHtml, SpoilerSyntaxOptions, spoilerSyntax };
//# sourceMappingURL=index.esm.d.ts.map