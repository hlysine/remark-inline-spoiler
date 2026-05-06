import { spoiler as spoilerSyntax, SpoilerOptions as SpoilerSyntaxOptions } from 'micromark-extension-inline-spoiler';
import { spoilerFromMarkdown, spoilerToMarkdown } from 'mdast-util-inline-spoiler';

export function spoilerPlugin(this: any, options: Partial<SpoilerSyntaxOptions> = {}) {
  var data = this.data();

  add('micromarkExtensions', spoilerSyntax(options || {}));
  add('fromMarkdownExtensions', spoilerFromMarkdown());
  add('toMarkdownExtensions', spoilerToMarkdown());

  function add(field: string, value: any) {
    if (data[field]) data[field].push(value);
    else data[field] = [value];
  }
}

export default spoilerPlugin;
