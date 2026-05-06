// // testing
import { describe, it, expect } from 'vitest';

// mdast / unist
import * as Uni from 'unist';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';

////////////////////////////////////////////////////////////

// project imports
import { spoiler as spoilerSyntax } from 'micromark-extension-inline-spoiler';
import { spoilerFromMarkdown, spoilerToMarkdown, Spoiler } from '../src';
import { Paragraph, PhrasingContent, Root } from 'mdast';

////////////////////////////////////////////////////////////////////////////////

export function unistIsParent(node: Uni.Node): node is Uni.Parent {
  return 'children' in node;
}

export function unistIsStringLiteral(node: Uni.Node): node is Uni.Literal & { value: string } {
  return 'value' in node && typeof node.value === 'string';
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

export interface TestCase {
  description?: string;
}

export interface TestFromMd extends TestCase {
  markdown: string; // markdown input
  expectValue: Spoiler['children'][]; // one per expected citation in the input
}

export interface TestToMd extends TestCase {
  ast: Spoiler; // citation node
  expected: string; // expected markdown output
}

export interface TestSuite<T extends TestCase> {
  cases: T[];
}

////////////////////////////////////////////////////////////

export const fromMarkdownTestCases: TestFromMd[] = [
  {
    markdown: '||abc||',
    expectValue: [
      [
        {
          type: 'text',
          value: 'abc',
          position: {
            start: {
              line: 1,
              column: 3,
              offset: 2,
            },
            end: {
              line: 1,
              column: 6,
              offset: 5,
            },
          },
        },
      ],
    ],
  },
  {
    markdown: 'foo||abc||bar',
    expectValue: [
      [
        {
          type: 'text',
          value: 'abc',
          position: {
            start: {
              line: 1,
              column: 6,
              offset: 5,
            },
            end: {
              line: 1,
              column: 9,
              offset: 8,
            },
          },
        },
      ],
    ],
  },
  {
    markdown: '||foo||abc||bar||',
    expectValue: [
      [
        {
          type: 'text',
          value: 'foo',
          position: {
            start: {
              line: 1,
              column: 3,
              offset: 2,
            },
            end: {
              line: 1,
              column: 6,
              offset: 5,
            },
          },
        },
      ],
      [
        {
          type: 'text',
          value: 'bar',
          position: {
            start: {
              line: 1,
              column: 13,
              offset: 12,
            },
            end: {
              line: 1,
              column: 16,
              offset: 15,
            },
          },
        },
      ],
    ],
  },
  {
    markdown: '||foo|abc|bar||',
    expectValue: [
      [
        {
          type: 'text',
          value: 'foo|abc|bar',
          position: {
            start: {
              line: 1,
              column: 3,
              offset: 2,
            },
            end: {
              line: 1,
              column: 14,
              offset: 13,
            },
          },
        },
      ],
    ],
  },
  {
    markdown: '||abcde\nabcde\nabcde\nabcde\nabcde||',
    expectValue: [
      [
        {
          type: 'text',
          value: 'abcde\nabcde\nabcde\nabcde\nabcde',
          position: {
            start: {
              line: 1,
              column: 3,
              offset: 2,
            },
            end: {
              line: 5,
              column: 6,
              offset: 31,
            },
          },
        },
      ],
    ],
  },
  {
    markdown: '||abc **def** ghi||',
    expectValue: [
      [
        {
          type: 'text',
          value: 'abc ',
          position: {
            start: {
              line: 1,
              column: 3,
              offset: 2,
            },
            end: {
              line: 1,
              column: 7,
              offset: 6,
            },
          },
        },
        {
          type: 'strong',
          children: [
            {
              type: 'text',
              value: 'def',
              position: {
                start: {
                  line: 1,
                  column: 9,
                  offset: 8,
                },
                end: {
                  line: 1,
                  column: 12,
                  offset: 11,
                },
              },
            },
          ],
          position: {
            start: {
              line: 1,
              column: 7,
              offset: 6,
            },
            end: {
              line: 1,
              column: 14,
              offset: 13,
            },
          },
        },
        {
          type: 'text',
          value: ' ghi',
          position: {
            start: {
              line: 1,
              column: 14,
              offset: 13,
            },
            end: {
              line: 1,
              column: 18,
              offset: 17,
            },
          },
        },
      ],
    ],
  },
];

export const fromMarkdownTestSuite: TestSuite<TestFromMd> = {
  cases: fromMarkdownTestCases,
};

//// TOMARKDOWN ////////////////////////////////////////////

export const toMarkdownTestCases: TestToMd[] = [
  {
    ast: {
      type: 'spoiler',
      children: [
        {
          type: 'text',
          value: 'abc',
        },
      ],
    },
    expected: '||abc||',
  },
];

export const toMarkdownTestSuite: TestSuite<TestToMd> = {
  cases: toMarkdownTestCases,
};

////////////////////////////////////////////////////////////

function runTestSuite_fromMarkdown(contextMsg: string, descPrefix: string, testSuite: TestSuite<TestFromMd>): void {
  describe(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        // markdown -> ast
        const ast = fromMarkdown(testCase.markdown, {
          extensions: [spoilerSyntax()],
          mdastExtensions: [spoilerFromMarkdown()],
        });

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

function runTestSuite_toMarkdown(contextMsg: string, descPrefix: string, testSuite: TestSuite<TestToMd>): void {
  describe(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        // ast nodes will normally appear in paragraph
        // context, which can affect symbol escaping
        const paragraph: Paragraph = {
          type: 'paragraph',
          children: [testCase.ast],
        };

        const root: Root = {
          type: 'root',
          children: [paragraph],
        };

        // markdown -> ast
        const serialized = toMarkdown(root, {
          extensions: [spoilerToMarkdown()],
        });

        // check for match
        expect(serialized.trim()).toBe(testCase.expected);
      });
    }
  });
}

////////////////////////////////////////////////////////////

// from markdown
describe('mdast-util-inline-spoiler (fromMarkdown)', () => {
  runTestSuite_fromMarkdown('from markdown', 'spoiler', fromMarkdownTestSuite);
});

// to markdown
describe('mdast-util-inline-spoiler (toMarkdown)', () => {
  runTestSuite_toMarkdown('to markdown', 'spoiler', toMarkdownTestSuite);
});
