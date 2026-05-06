import { Unsafe, Handle } from 'mdast-util-to-markdown';
export interface SpoilerToMarkdownOptions {
}
/**
 * @warning Does no validation.  Garbage in, garbage out.
 */
export declare function spoilerToMarkdown(options?: Partial<SpoilerToMarkdownOptions>): {
    unsafe: Unsafe[];
    handlers: {
        spoiler: Handle;
    };
};
