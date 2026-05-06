import { SpoilerOptions, spoiler } from '../src/index';
import { spoilerHtml } from '../src/html';
import { describe, it, expect } from 'vitest';
import { Extension, HtmlExtension } from 'micromark-util-types';
import { micromark } from 'micromark';

interface TestCaseSimple {
  options?: Partial<SpoilerOptions>;
  description?: string;
  markdown: string;
  html: string;
}

interface TestSuite {
  /** Default options for the entire test suite.  Can be overridden by individual cases. */
  options?: Partial<SpoilerOptions>;
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
  {
    markdown: '||foo|abc|bar||',
    html: '<p><span class="spoiler">foo|abc|bar</span></p>',
  },
  {
    markdown: '||abcde\nabcde\babcde\nabcde\nabcde||',
    html: '<p><span class="spoiler">abcde\nabcde\babcde\nabcde\nabcde</span></p>',
  },
  {
    markdown: '||abc **def** ghi||',
    html: '<p><span class="spoiler">abc <strong>def</strong> ghi</span></p>',
  },
];

const spoilerSuite: TestSuite = {
  cases: spoilerCases,
};

////////////////////////////////////////////////////////////

function runTestSuite(descPrefix: string, testSuite: TestSuite): void {
  let idx = 0;
  for (let testCase of testSuite.cases) {
    let desc = `[${descPrefix} ${('00' + ++idx).slice(-3)}] ` + (testCase.description || '');
    it(desc, () => {
      let options = Object.assign({}, testSuite.options, testCase.options);
      let serialized = micromark(testCase.markdown, {
        extensions: [spoiler(options) as Extension],
        htmlExtensions: [spoilerHtml() as HtmlExtension],
      });
      expect(serialized).toBe(testCase.html);
    });
  }
}

////////////////////////////////////////////////////////////

describe('micromark-extension-inline-spoiler', () => {
  runTestSuite('spoiler', spoilerSuite);
});
