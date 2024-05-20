import { SpoilerSyntaxOptions } from 'micromark-extension-spoiler';
import { SpoilerToMarkdownOptions } from 'mdast-util-spoiler';
interface SpoilerPluginOptions {
    syntax: Partial<SpoilerSyntaxOptions>;
    toMarkdown: Partial<SpoilerToMarkdownOptions>;
}
declare function spoilerPlugin(this: any, options: Partial<SpoilerPluginOptions>): void;
export { SpoilerPluginOptions, spoilerPlugin };
//# sourceMappingURL=index.cjs.d.ts.map