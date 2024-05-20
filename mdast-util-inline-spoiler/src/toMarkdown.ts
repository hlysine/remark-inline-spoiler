// mdast
import { Unsafe, Handle, Context } from 'mdast-util-to-markdown';

// unist
import * as Uni from 'unist';

// project imports
import { SpoilerNode } from './fromMarkdown';

////////////////////////////////////////////////////////////

export interface SpoilerToMarkdownOptions {}

////////////////////////////////////////////////////////////

/**
 * @warning Does no validation.  Garbage in, garbage out.
 */
export function spoilerToMarkdown(options: Partial<SpoilerToMarkdownOptions> = {}) {
  const unsafe: Unsafe[] = [{ character: '|', inConstruct: ['spoilerText'] }];

  /** Replaces the spoiler node with `node.value`, without escaping. */
  function handler(node: SpoilerNode, _: Uni.Parent | null | undefined, context: Context): string {
    return `||${node.value}||`;
  }

  return {
    unsafe: unsafe,
    handlers: {
      // as of (2021-05-07), the typings for Handle do not reflect
      // that the handler will be passed nodes of a specific type
      spoiler: handler as unknown as Handle,
    },
  };
}
