function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * Converts a token stream produced by the syntax extension
 * directly to HTML, with no intermediate AST.
 */
function spoilerHtml() {

  function enterSpoiler() {}

  function exitSpoiler(token) {
    this.tag("<span class=\"spoiler\">");
    this.raw(this.sliceSerialize(token));
    this.tag('</span>');
  }

  return {
    enter: {
      spoilerText: enterSpoiler
    },
    exit: {
      spoilerText: exitSpoiler
    }
  };
}

/**
 * Adds support for Discord-style spoilers to `micromark`.
 */

var spoilerSyntax = function spoilerSyntax(options) {
  return {
    text: _defineProperty({}, 124, {
      tokenize: spoilerTokenize
    })
  };
};
var lookaheadConstruct = {
  partial: true,

  /** If the next two characters are `||`, run `ok`, else `nok`. */
  tokenize: function tokenize(effects, ok, nok) {
    return start;

    function start(code) {
      // match first symbol `|`
      if (code !== 124) {
        return nok(code);
      }

      effects.consume(code);
      return lookaheadAt;
    }

    function lookaheadAt(code) {
      // match second symbol `|`
      if (code !== 124) {
        return nok(code);
      }

      effects.consume(code);
      return ok(code);
    }
  }
};
/**
 * Entry-point for the spoiler tokenizer.
 */

var spoilerTokenize = function spoilerTokenize(effects, ok, nok) {
  // typos in strings manually passed to enter() / exit() have been
  // a source of bugs, so let TypeScript error-check for us
  effects = effects;
  return firstSpoilerStart;

  function firstSpoilerStart(code) {
    // match first starting '|'
    if (code === 124) {
      effects.enter("spoiler"
      /* spoiler */
      );
      effects.enter("spoilerMarker"
      /* spoilerMarker */
      );
      effects.consume(code);
      return secondSpoilerStart;
    } // invalid starting character
    else {
        return nok(code);
      }
  }

  function secondSpoilerStart(code) {
    // match second starting '|'
    if (code === 124) {
      effects.consume(code);
      effects.exit("spoilerMarker"
      /* spoilerMarker */
      );
      effects.enter("spoilerText"
      /* spoilerText */
      );
      return consumeSpoilerText;
    } // invalid character
    else {
        return nok(code);
      }
  }

  function consumeSpoilerText(code) {
    // match first ending '|'
    if (code === 124) {
      return effects.check(lookaheadConstruct, firstSpoilerEnd, consumeAsText)(code);
    }

    if (code === null) {
      return nok(code);
    } // otherwise, continue consuming characters


    effects.consume(code);
    return consumeSpoilerText;
  }

  function consumeAsText(code) {
    if (code === null) {
      return nok(code);
    }

    effects.consume(code);
    return consumeSpoilerText;
  }

  function firstSpoilerEnd(code) {
    // match first ending '|'
    if (code === 124) {
      effects.exit("spoilerText"
      /* spoilerText */
      );
      effects.enter("spoilerMarker"
      /* spoilerMarker */
      );
      effects.consume(code);
      return secondSpoilerEnd;
    } // invalid character
    else {
        return nok(code);
      }
  }

  function secondSpoilerEnd(code) {
    // match second ending '|'
    if (code === 124) {
      effects.consume(code);
      effects.exit("spoilerMarker"
      /* spoilerMarker */
      );
      effects.exit("spoiler"
      /* spoiler */
      );
      return ok;
    } // invalid character
    else {
        return nok(code);
      }
  }
};

export { spoilerHtml, spoilerSyntax };
//# sourceMappingURL=index.umd.js.map
