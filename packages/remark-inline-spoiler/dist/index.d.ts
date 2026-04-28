import { SpoilerOptions as SpoilerSyntaxOptions } from 'micromark-extension-inline-spoiler';
import { SpoilerToMarkdownOptions } from 'mdast-util-inline-spoiler';
export interface SpoilerPluginOptions {
    syntax: Partial<SpoilerSyntaxOptions>;
    toMarkdown: Partial<SpoilerToMarkdownOptions>;
}
export declare function spoilerPlugin(this: any, options?: Partial<SpoilerPluginOptions>): void;
export default spoilerPlugin;
