// testing
import assert from 'assert';

console.log('hello, mocha!');

// micromark
import micromark from 'micromark/lib';

// project imports
import { spoilerSyntax, SpoilerSyntaxOptions, spoilerHtml } from '..';

////////////////////////////////////////////////////////////

interface TestCaseSimple {
  options?: Partial<SpoilerSyntaxOptions>;
  description?: string;
  markdown: string;
  html: string;
}

interface TestSuite {
  /** Default options for the entire test suite.  Can be overridden by individual cases. */
  options?: Partial<SpoilerSyntaxOptions>;
  cases: TestCaseSimple[];
}

const spoilerCases: TestCaseSimple[] = [
  {
    markdown: '||abc||',
    html: '<p><span class="spoiler">abc</span></p>',
  },
  {
    markdown: 'foo||abc||bar',
    html: '<p>foo<span class="spoiler">abc</span>bar</p>',
  },
  {
    markdown: '||foo||abc||bar||',
    html: '<p><span class="spoiler">foo</span>abc<span class="spoiler">bar</span></p>',
  },
];

const spoilerSuite: TestSuite = {
  cases: spoilerCases,
};

////////////////////////////////////////////////////////////

function runTestSuite(contextMsg: string, descPrefix: string, testSuite: TestSuite): void {
  context(contextMsg, () => {
    let idx = 0;
    for (let testCase of testSuite.cases) {
      let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
      it(desc, () => {
        let options = Object.assign({}, testSuite.options, testCase.options);
        let serialized = micromark(testCase.markdown, {
          extensions: [spoilerSyntax(options)],
          htmlExtensions: [spoilerHtml()],
        });
        assert.strictEqual(serialized, testCase.html);
      });
    }
  });
}

////////////////////////////////////////////////////////////

describe('micromark-extension-spoiler', () => {
  runTestSuite('Spoilers', 'spoiler', spoilerSuite);
});
