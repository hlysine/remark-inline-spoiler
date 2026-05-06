import { unified } from 'unified';
import { PhrasingContent, Root } from 'mdast';
import * as Uni from 'unist';
import markdown from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { describe, it, expect } from 'vitest';

// project imports
import { Spoiler } from 'mdast-util-inline-spoiler';
import { spoilerPlugin as remarkSpoilerPlugin } from '../src';

// re-use tests from mdast-util-inline-spoiler
import * as MdastUtilSpoilerTests from '../../mdast-util-inline-spoiler/test/test.spec';

////////////////////////////////////////////////////////////

export function unistIsParent(node: Uni.Node): node is Uni.Parent {
  return 'children' in node;
}

export function unistIsStringLiteral(node: Uni.Node): node is Uni.Literal & { value: string } {
  return 'value' in node && typeof node.value === 'string';
}

////////////////////////////////////////////////////////////

enum VisitorAction {
  /** Continue traversal as normal. */
  CONTINUE = 1,
  /** Do not traverse this node's children. */
  SKIP = 2,
  /** Stop traversal immediately. */
  EXIT = 3,
}

type Visitor<V extends Uni.Node = Uni.Node> = (node: V) => VisitorAction | void;

/**
 * Visit every node in the tree using a depth-first preorder traversal.
 */
export function visit(tree: Uni.Node, visitor: Visitor<Uni.Node>): void {
  recurse(tree);

  function recurse(node: Uni.Node): VisitorAction {
    // visit the node itself and handle the result
    let action = visitor(node) || VisitorAction.CONTINUE;
    if (action === VisitorAction.EXIT) {
      return VisitorAction.EXIT;
    }
    if (action === VisitorAction.SKIP) {
      return VisitorAction.SKIP;
    }
    if (!unistIsParent(node)) {
      return action;
    }

    // visit the node's children from first to last
    for (let childIdx = 0; childIdx < node.children.length; childIdx++) {
      // visit child and handle the subtree result
      let subresult = recurse(node.children[childIdx]);
      if (subresult === VisitorAction.EXIT) {
        return VisitorAction.EXIT;
      }

      // TODO: if visitor modified the tree, we might want to allow it
      // to return a new childIdx to continue iterating from
    }

    return action;
  }
}

/**
 * Visit a specific type of node.
 */
export function visitNodeType<S extends string, N extends Uni.Node & { type: S }>(
  tree: Uni.Node,
  type: S,
  visitor: Visitor<N>,
): void {
  // filter nodes by type
  function predicate(node: Uni.Node): node is N {
    return node.type === type;
  }

  // apply the provided visitor only if type predicate matches
  visit(tree, node => {
    if (predicate(node)) {
      return visitor(node);
    } else {
      return VisitorAction.CONTINUE;
    }
  });
}

////////////////////////////////////////////////////////////

function runTestSuite_fromMarkdown(
  contextMsg: string,
  descPrefix: string,
  testSuite: MdastUtilSpoilerTests.TestSuite<MdastUtilSpoilerTests.TestFromMd>,
): void {
  describe(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        // markdown -> ast
        const processor = unified().use(markdown).use(remarkSpoilerPlugin);

        let ast = processor.parse(testCase.markdown);
        ast = processor.runSync(ast) as Root;

        console.log(JSON.stringify(ast, null, 2));

        // accumulate citations
        let citations: PhrasingContent[][] = [];
        visitNodeType(ast, 'spoiler', (node: Spoiler) => {
          citations.push(node.children);
        });

        // check for match
        expect(citations).toEqual(testCase.expectValue);
      });
    }
  });
}

////////////////////////////////////////////////////////////

function runTestSuite_toMarkdown(
  contextMsg: string,
  descPrefix: string,
  testSuite: MdastUtilSpoilerTests.TestSuite<MdastUtilSpoilerTests.TestToMd>,
): void {
  describe(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        // markdown -> ast
        const processor = unified().use(markdown).use(remarkStringify).use(remarkSpoilerPlugin);

        var serialized = processor.stringify({ type: 'root', children: [testCase.ast] });

        // check for match
        expect(serialized.trim()).toBe(testCase.expected);
      });
    }
  });
}

////////////////////////////////////////////////////////////

// from markdown
describe('remark-inline-spoiler (fromMarkdown)', () => {
  runTestSuite_fromMarkdown('from markdown', 'spoiler', MdastUtilSpoilerTests.fromMarkdownTestSuite);
});

// to markdown
describe('remark-inline-spoiler (toMarkdown)', () => {
  runTestSuite_toMarkdown('to markdown', 'spoiler', MdastUtilSpoilerTests.toMarkdownTestSuite);
});
