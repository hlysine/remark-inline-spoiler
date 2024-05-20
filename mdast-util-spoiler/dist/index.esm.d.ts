/// <reference types="unist" />
import * as Uni from "unist";
import { MdastExtension } from "mdast-util-from-markdown/types";
// mdast
import { Unsafe, Handle } from "mdast-util-to-markdown";
////////////////////////////////////////////////////////////
interface SpoilerNode extends Uni.Literal {
    type: "spoiler";
    value: string;
}
////////////////////////////////////////////////////////////
declare const spoilerFromMarkdown: MdastExtension;
////////////////////////////////////////////////////////////
interface SpoilerToMarkdownOptions {
}
////////////////////////////////////////////////////////////
/**
 * @warning Does no validation.  Garbage in, garbage out.
 */
declare function spoilerToMarkdown(options?: Partial<SpoilerToMarkdownOptions>): {
    unsafe: Unsafe[];
    handlers: {
        spoiler: Handle;
    };
};
export { spoilerFromMarkdown, SpoilerNode, spoilerToMarkdown, SpoilerToMarkdownOptions };
//# sourceMappingURL=index.esm.d.ts.map