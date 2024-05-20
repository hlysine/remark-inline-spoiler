////////////////////////////////////////////////////////////
var spoilerFromMarkdown = {
  enter: {
    spoiler: enterSpoiler
  },
  exit: {
    spoiler: exitSpoiler,
    spoilerText: exitSpoilerText
  }
}; ////////////////////////////////////////////////////////////

function top(stack) {
  return stack[stack.length - 1];
}

function enterSpoiler(token) {
  this.enter({
    type: 'spoiler',
    value: null
  }, token);
}

function exitSpoiler(token) {
  this.exit(token);
}

function exitSpoilerText(token) {
  var currentNode = top(this.stack);
  currentNode.value = this.sliceSerialize(token);
}

////////////////////////////////////////////////////////////

/**
 * @warning Does no validation.  Garbage in, garbage out.
 */
function spoilerToMarkdown() {
  var unsafe = [{
    character: '|',
    inConstruct: ['spoilerText']
  }];
  /** Replaces the spoiler node with `node.value`, without escaping. */

  function handler(node, _, context) {
    return "||".concat(node.value, "||");
  }

  return {
    unsafe: unsafe,
    handlers: {
      // as of (2021-05-07), the typings for Handle do not reflect
      // that the handler will be passed nodes of a specific type
      spoiler: handler
    }
  };
}

export { spoilerFromMarkdown, spoilerToMarkdown };
//# sourceMappingURL=index.umd.js.map
