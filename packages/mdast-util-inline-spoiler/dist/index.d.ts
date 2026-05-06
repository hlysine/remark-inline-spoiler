import { Parent, PhrasingContent, Data } from 'mdast';
import { Extension as FromMarkdownExtension } from 'mdast-util-from-markdown';
import { Options as ToMarkdownExtension } from 'mdast-util-to-markdown';
/**
 * Markdown spoiler.
 */
export interface Spoiler extends Parent {
    /**
     * Node type of spoiler.
     */
    type: 'spoiler';
    /**
     * Children of the spoiler.
     */
    children: PhrasingContent[];
    /**
     * Data associated with the spoiler.
     */
    data?: SpoilerData | undefined;
}
/**
 * Info associated with spoiler nodes by the ecosystem.
 */
export interface SpoilerData extends Data {
}
declare module 'mdast' {
    interface RootContentMap {
        spoiler: Spoiler;
    }
    interface PhrasingContentMap {
        spoiler: Spoiler;
    }
}
declare module 'mdast-util-to-markdown' {
    interface ConstructNameMap {
        spoiler: 'spoiler';
    }
}
/**
 * Create an extension for `mdast-util-from-markdown` to enable spoilers in markdown.
 */
export declare function spoilerFromMarkdown(): FromMarkdownExtension;
/**
 * Create an extension for `mdast-util-to-markdown` to enable spoilers in markdown.
 */
export declare function spoilerToMarkdown(): ToMarkdownExtension;
