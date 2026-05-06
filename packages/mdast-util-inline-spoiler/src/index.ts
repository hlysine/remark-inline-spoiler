import { Parent, PhrasingContent, Data } from 'mdast';
import {
  CompileContext,
  Extension as FromMarkdownExtension,
  Handle as FromMarkdownHandle,
} from 'mdast-util-from-markdown';
import { ConstructName, Handle as ToMarkdownHandle, Options as ToMarkdownExtension } from 'mdast-util-to-markdown';

/**
 * Markdown spoiler.
 */
export interface Spoiler extends Parent {
  /**
   * Node type of spoiler.
   */
  type: 'spoiler';
  /**
   * Children of the spoiler.
   */
  children: PhrasingContent[];
  /**
   * Data associated with the spoiler.
   */
  data?: SpoilerData | undefined;
}

/**
 * Info associated with spoiler nodes by the ecosystem.
 */
export interface SpoilerData extends Data {}

declare module 'mdast' {
  interface RootContentMap {
    spoiler: Spoiler;
  }
  interface PhrasingContentMap {
    spoiler: Spoiler;
  }
}

declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    spoiler: 'spoiler';
  }
}

/**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain spoilers.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 *
 * Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
 */
const constructsWithoutSpoiler: ConstructName[] = [
  'autolink',
  'destinationLiteral',
  'destinationRaw',
  'reference',
  'titleQuote',
  'titleApostrophe',
];

/**
 * Create an extension for `mdast-util-from-markdown` to enable spoilers in markdown.
 */
export function spoilerFromMarkdown(): FromMarkdownExtension {
  return {
    canContainEols: ['spoiler'],
    enter: { spoiler: enterSpoiler },
    exit: { spoiler: exitSpoiler },
  };
}

/**
 * Create an extension for `mdast-util-to-markdown` to enable spoilers in markdown.
 */
export function spoilerToMarkdown(): ToMarkdownExtension {
  return {
    unsafe: [
      {
        character: '|',
        inConstruct: 'phrasing',
        notInConstruct: constructsWithoutSpoiler,
      },
    ],
    handlers: { spoiler: handleSpoiler },
  };
}

const enterSpoiler: FromMarkdownHandle = function (token) {
  this.enter({ type: 'spoiler', children: [] }, token);
};

const exitSpoiler: FromMarkdownHandle = function (token) {
  this.exit(token);
};

const handleSpoiler: ToMarkdownHandle & { peek: ToMarkdownHandle } = function (node: Spoiler, _, state, info) {
  const tracker = state.createTracker(info);
  const exit = state.enter('spoiler');
  let value = tracker.move('||');
  value += state.containerPhrasing(node, {
    ...tracker.current(),
    before: value,
    after: '|',
  });
  value += tracker.move('||');
  exit();
  return value;
};

const peekSpoiler: ToMarkdownHandle = function () {
  return '|';
};

handleSpoiler.peek = peekSpoiler;
