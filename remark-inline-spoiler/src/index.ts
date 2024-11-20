import { spoilerSyntax, SpoilerSyntaxOptions } from 'micromark-extension-inline-spoiler';
import { spoilerFromMarkdown, spoilerToMarkdown, SpoilerToMarkdownOptions } from 'mdast-util-inline-spoiler';

////////////////////////////////////////////////////////////

var warningIssued: boolean = false;

function remarkV13Warning(context: any): boolean {
  if (
    !warningIssued &&
    ((context.Parser && context.Parser.prototype && context.Parser.prototype.blockTokenizers) ||
      (context.Compiler && context.Compiler.prototype && context.Compiler.prototype.visitors))
  ) {
    warningIssued = true;
    console.warn('[remark-inline-spoiler] Warning: please upgrade to remark 13 to use this plugin');
  }

  return warningIssued;
}

export interface SpoilerPluginOptions {
  syntax: Partial<SpoilerSyntaxOptions>;
  toMarkdown: Partial<SpoilerToMarkdownOptions>;
  // add extra options here, in addition to those for the syntax extension
}

export function spoilerPlugin(this: any, options: Partial<SpoilerPluginOptions> = {}) {
  var data = this.data();

  // warn for earlier versions
  remarkV13Warning(this);

  add('micromarkExtensions', spoilerSyntax(options.syntax || {}));
  add('fromMarkdownExtensions', spoilerFromMarkdown);
  add('toMarkdownExtensions', spoilerToMarkdown(options.toMarkdown || {}));

  function add(field: string, value: any) {
    if (data[field]) data[field].push(value);
    else data[field] = [value];
  }
}

export default spoilerPlugin;