import { SpoilerSyntaxOptions } from 'micromark-extension-inline-spoiler';
import { SpoilerToMarkdownOptions } from 'mdast-util-inline-spoiler';
interface SpoilerPluginOptions {
  syntax: Partial<SpoilerSyntaxOptions>;
  toMarkdown: Partial<SpoilerToMarkdownOptions>;
}
declare function spoilerPlugin(this: any, options: Partial<SpoilerPluginOptions>): void;
export { SpoilerPluginOptions, spoilerPlugin };
//# sourceMappingURL=index.esm.d.ts.map
