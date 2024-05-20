// // testing
import * as assert from 'assert';

// mdast / unist
import * as Uni from 'unist';
import * as Md from 'mdast';
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';

////////////////////////////////////////////////////////////

// project imports
import { spoilerSyntax, SpoilerSyntaxOptions } from 'micromark-extension-spoiler';
import { SpoilerToMarkdownOptions, SpoilerNode } from '..';
import * as mdastSpoilerExt from '..';

////////////////////////////////////////////////////////////////////////////////

export function unistIsParent(node: Uni.Node): node is Uni.Parent {
  return Boolean(node.children);
}

export function unistIsStringLiteral(node: Uni.Node): node is Uni.Literal & { value: string } {
  return typeof node.value === 'string';
}

////////////////////////////////////////////////////////////////////////////////

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
  visitor: Visitor<N>
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

export interface TestCase<Opts> {
  description?: string;
  options?: Partial<Opts>;
}

export interface TestFromMd extends TestCase<SpoilerSyntaxOptions> {
  markdown: string; // markdown input
  expectValue: SpoilerNode['value'][]; // one per expected citation in the input
}

export interface TestToMd extends TestCase<SpoilerToMarkdownOptions> {
  ast: SpoilerNode; // citation node
  expected: string; // expected markdown output
}

export interface TestSuite<T extends TestCase<any>, Opts = T['options']> {
  /** Default options for the entire test suite.  Can be overridden by individual cases. */
  options?: Opts;
  cases: T[];
}

////////////////////////////////////////////////////////////

export const fromMarkdownTestCases: TestFromMd[] = [
  {
    markdown: '||abc||',
    expectValue: ['abc'],
  },
  {
    markdown: 'foo||abc||bar',
    expectValue: ['abc'],
  },
  {
    markdown: '||foo||abc||bar||',
    expectValue: ['foo', 'bar'],
  },
  {
    markdown: '||foo|abc|bar||',
    expectValue: ['foo|abc|bar'],
  },
];

export const fromMarkdownTestSuite: TestSuite<TestFromMd> = {
  cases: fromMarkdownTestCases,
};

//// TOMARKDOWN ////////////////////////////////////////////

export const toMarkdownTestCases: TestToMd[] = [
  {
    expected: '||abc||',
    ast: {
      type: 'spoiler',
      value: 'abc',
    },
  },
];

export const toMarkdownTestSuite: TestSuite<TestToMd> = {
  cases: toMarkdownTestCases,
};

////////////////////////////////////////////////////////////

function runTestSuite_fromMarkdown(contextMsg: string, descPrefix: string, testSuite: TestSuite<TestFromMd>): void {
  context(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        // merge suite options with case options
        const options = Object.assign({}, testSuite.options, testCase.options);

        // markdown -> ast
        const ast = fromMarkdown(testCase.markdown, {
          extensions: [spoilerSyntax(options)],
          mdastExtensions: [mdastSpoilerExt.spoilerFromMarkdown],
        });

        // accumulate citations
        let citations: SpoilerNode[] = [];
        visitNodeType(ast, 'spoiler', (node: SpoilerNode) => {
          citations.push(node);
        });

        // check for match
        assert.strictEqual(citations.length, testCase.expectValue.length);
        for (let k = 0; k < citations.length; k++) {
          assert.strictEqual(citations[k].value, testCase.expectValue[k]);
        }
      });
    }
  });
}

////////////////////////////////////////////////////////////

function runTestSuite_toMarkdown(contextMsg: string, descPrefix: string, testSuite: TestSuite<TestToMd>): void {
  context(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        // merge suite options with case options
        const options = Object.assign({}, testSuite.options, testCase.options);

        // ast nodes will normally appear in paragraph
        // context, which can affect symbol escaping
        const paragraph: Uni.Parent = {
          type: 'paragraph',
          children: [testCase.ast],
        };

        const root = {
          type: 'root',
          children: [paragraph],
        };

        // markdown -> ast
        const serialized = toMarkdown(root, {
          extensions: [mdastSpoilerExt.spoilerToMarkdown(options)],
        });

        // check for match
        assert.strictEqual(serialized.trim(), testCase.expected);
      });
    }
  });
}

////////////////////////////////////////////////////////////

// from markdown
describe('mdast-util-spoiler (fromMarkdown)', () => {
  runTestSuite_fromMarkdown('from markdown', 'spoiler', fromMarkdownTestSuite);
});

// to markdown
describe('mdast-util-spoiler (toMarkdown)', () => {
  runTestSuite_toMarkdown('to markdown', 'spoiler', toMarkdownTestSuite);
});
