import * as Uni from 'unist';
import { MdastExtension } from 'mdast-util-from-markdown/types';

////////////////////////////////////////////////////////////

export interface SpoilerNode extends Uni.Literal {
  type: 'spoiler';
  value: string;
}

////////////////////////////////////////////////////////////

export const spoilerFromMarkdown: MdastExtension = {
  enter: {
    spoiler: enterSpoiler,
  },
  exit: {
    spoiler: exitSpoiler,
    spoilerText: exitSpoilerText,
  },
} as MdastExtension;

////////////////////////////////////////////////////////////

function top<T>(stack: T[]) {
  return stack[stack.length - 1];
}

function enterSpoiler(this: any, token: unknown) {
  this.enter(
    {
      type: 'spoiler',
      value: null,
    },
    token
  );
}

function exitSpoiler(this: any, token: unknown) {
  this.exit(token);
}

function exitSpoilerText(this: any, token: unknown) {
  const currentNode = top(this.stack) as SpoilerNode;
  currentNode.value = this.sliceSerialize(token);
}
