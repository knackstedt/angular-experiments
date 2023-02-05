var Choice, Comment, Diagram, Group, NonTerminal, OneOrMore, Optional, Sequence, Terminal, ZeroOrMore, doSpace, get_flag_name, makeLiteral, parse, parseRegex, quantifiedComment, rx2rr, Skip;

parse = require("./regexp.js");

({Diagram, Sequence, Choice, Optional, OneOrMore, ZeroOrMore, Terminal, NonTerminal, Comment, Skip, Group} = require('./railroad-diagrams'));


const SP_GROUP_NAME = '__GROUP';
const SP_GROUP_LABEL = 'from zone name';
const SP_GROUP_CLASS = 'sp_group';

const SP_ZONE_NAME = '__ZONE';
const SP_ZONE_LABEL = 'from group name';
const SP_ZONE_CLASS = 'sp_zone';


doSpace = function() {
  return NonTerminal("SP", {
    title: "Space character",
    class: "literal whitespace"
  });
};

makeLiteral = function(text) {
  var j, len, part, parts, sequence;
  if (text === " ") {
    return doSpace();
  } else {
    parts = text.split(/(^ +| {2,}| +$)/);
    sequence = [];
    for (j = 0, len = parts.length; j < len; j++) {
      part = parts[j];
      if (!part.length) {
        continue;
      }
      if (/^ +$/.test(part)) {
        if (part.length === 1) {
          sequence.push(doSpace());
        } else {
          sequence.push(OneOrMore(doSpace(), Comment(`${part.length}x`, {
            title: `repeat ${part.length} times`
          })));
        }
      } else {
        sequence.push(Terminal(part, {
          class: "literal"
        }));
      }
    }
    if (sequence.length === 1) {
      return sequence[0];
    } else {
      return new Sequence(sequence);
    }
  }
};

get_flag_name = function(flag) {
  var flag_names;
  flag_names = {
    A: 'pcre:anchored',
    D: 'pcre:dollar-endonly',
    S: 'pcre:study',
    U: 'pcre:ungreedy',
    X: 'pcre:extra',
    J: 'pcre:extra',
    i: 'case-insensitive',
    m: 'multi-line',
    s: 'dotall',
    e: 'evaluate',
    o: 'compile-once',
    x: 'extended-legilibility',
    g: 'global',
    c: 'current-position',
    p: 'preserve',
    d: 'no-unicode-rules',
    u: 'unicode-rules',
    a: 'ascii-rules',
    l: 'current-locale'
  };
  if (flag in flag_names) {
    return flag_names[flag];
  } else {
    return `unknown:${flag}`;
  }
};


rx2rr = function(node, options) {
  var _class, _text, _title, alternatives, body, char, charset, doEndOfString, doStartOfString, extra, f, flags, i, isSingleString, j, k, l, len, len1, len2, len3, list, literal, m, max, min, min_width, n, opts, plural, ref, ref1, ref2, sequence, text, turn_off, turn_off_long, turn_on, turn_on_long, x;
  opts = options.options;
  isSingleString = function() {
    return opts.match(/s/);
  };
  doStartOfString = function() {
    var title;
    if (opts.match(/m/)) {
      title = "Beginning of line";
    } else {
      title = "Beginning of string";
    }
    return NonTerminal("START", {
      title: title,
      class: 'zero-width-assertion'
    });
  };
  doEndOfString = function() {
    var title;
    if (opts.match(/m/)) {
      title = "End of line";
    } else {
      title = "End of string";
    }
    return NonTerminal("END", {
      title: title,
      class: 'zero-width-assertion'
    });
  };
  //  debugger
  switch (node.type) {
    case "match":
      literal = '';
      sequence = [];
      ref = node.body;
      for (j = 0, len = ref.length; j < len; j++) {
        n = ref[j];
        if (n.type === "literal" && n.escaped) {
          if (n.body === "A") {
            sequence.push(doStartOfString());
          } else if (n.body === "Z") {
            sequence.push(doEndOfString());
          } else {
            literal += n.body;
          }
        } else if (n.type === "literal") { // and not n.escaped
          literal += n.body;
        } else {
          if (literal) {
            sequence.push(makeLiteral(literal));
            literal = '';
          }
          sequence.push(rx2rr(n, options));
        }
      }
      if (literal) {
        sequence.push(makeLiteral(literal));
      }
      if (sequence.length === 1) {
        return sequence[0];
      } else {
        return new Sequence(sequence);
      }
      break;
    case "alternate":
      alternatives = [];
      while (node.type === "alternate") {
        alternatives.push(rx2rr(node.left, options));
        node = node.right;
      }
      alternatives.push(rx2rr(node, options));
      return new Choice(Math.floor(alternatives.length / 2) - 1, alternatives);
    case "quantified":
      let quantifier = node.quantifier;
      // console.log(node.quantifier);
      let max = quantifier.max;
      let min = quantifier.min;
      let lazy = quantifier.lazy;
      let possessive = quantifier.possessive;
      // ({min, max, lazy, possessive} = node.quantifier);
      // console.log(node.quantifier);
      body = rx2rr(node.body, options);
      if (!(min <= max)) {
        throw new Error(`Minimum quantifier (${min}) must be lower than maximum quantifier (${max})`);
      }
      plural = function(x) {
        if (x !== 1) {
          return "s";
        } else {
          return "";
        }
      };
      switch (min) {
        case 0:
          if (max === 1) {
            return Optional(body);
          } else {
            if (max === 0) {
              return ZeroOrMore(body, quantifiedComment("0x", lazy, possessive, {
                title: "exact 0 times repitition does not make sense"
              }));
            } else if (max !== 2e308) {
              return ZeroOrMore(body, quantifiedComment(`0-${max}x`, lazy, possessive, {
                title: `repeat 0 to ${max} time` + plural(max)
              }));
            } else {
              return ZeroOrMore(body, quantifiedComment("*", lazy, possessive, {
                title: "repeat zero or more times"
              }));
            }
          }
          break;
        case 1:
          if (max === 1) {
            return OneOrMore(body, Comment("1", {
              title: "once"
            }));
          } else if (max !== 2e308) {
            return OneOrMore(body, quantifiedComment(`1-${max}x`, lazy, possessive, {
              title: `repeat 1 to ${max} times`
            }));
          } else {
            return OneOrMore(body, quantifiedComment("+", lazy, possessive, {
              title: "repeat at least one time"
            }));
          }
          break;
        default:
          if (max === min) {
            return OneOrMore(body, Comment(`${max}x`, {
              title: `repeat ${max} times`
            }));
          } else if (max !== 2e308) {
            return OneOrMore(body, quantifiedComment(`${min}-${max}x`, lazy, possessive, {
              title: `repeat ${min} to ${max} times`
            }));
          } else {
            return OneOrMore(body, quantifiedComment(`>= ${min}x`, lazy, possessive, {
              title: `repeat at least ${min} time` + plural(min)
            }));
          }
      }
      break;
    case "capture-group":
      // console.trace(node);
      text = `capture ${node.index}`;
      min_width = 55;
      let cssClass = `capture-group group cgNum-${node.index}`;

      if (node.name == SP_GROUP_NAME) { // Override Text.
        text = ` (${SP_GROUP_LABEL})`;
        min_width += (SP_GROUP_LABEL.split('').length + 3) * 7;
        cssClass += ' ' + SP_GROUP_CLASS;
      }
      else if (node.name == SP_ZONE_NAME) { // Override Text.
        text = ` (${SP_ZONE_LABEL})`;
        min_width += (SP_ZONE_LABEL.split('').length + 3) * 7;
        cssClass += ' ' + SP_ZONE_CLASS;
      }
      else if (node.name) {
        text += ` (${node.name})`;
        min_width += (node.name.split('').length + 3) * 7;
      }
      return Group(rx2rr(node.body, options), Comment(text, {
        class: "caption"
      }), {
        minWidth: min_width,
        attrs: {
          class: cssClass
        }
      });
    case "flags":
      turn_on_long = [];
      turn_off_long = [];
      flags = node.body.join('');
      [turn_on, turn_off] = flags.split('-');
      if (turn_on == null) {
        turn_on = '';
      }
      if (turn_off == null) {
        turn_off = '';
      }
      ref1 = turn_on.split('');
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        f = ref1[k];
        turn_on_long.push(get_flag_name(f));
      }
      ref2 = turn_off.split('');
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        f = ref2[l];
        if (f === 'i') {
          turn_on_long.push('case-sensitive');
        } else {
          turn_off_long.push(get_flag_name(f));
        }
      }
      _title = [];
      if (turn_on) {
        _title.push("Turn on: " + turn_on_long.join(', '));
      }
      if (turn_off) {
        _title.push("Turn off: " + turn_off_long.join(', '));
      }
      return NonTerminal("SET: " + node.body.join(''), {
        title: _title.join("\n"),
        class: 'zero-width-assertion'
      });
    //NonTerminal("WORD", title: "Word character A-Z, 0-9, _", class: 'character-class')
    case "non-capture-group":
      // Group rx2rr(node.body, options), null, attrs: {class: 'group'}
      return rx2rr(node.body, options);
    case "positive-lookahead":
      return Group(rx2rr(node.body, options), Comment("=> ?", {
        title: "Positive lookahead",
        class: "caption"
      }), {
        attrs: {
          class: "lookahead positive zero-width-assertion group"
        }
      });
    case "negative-lookahead":
      return Group(rx2rr(node.body, options), Comment("!> ?", {
        title: "Negative lookahead",
        class: "caption"
      }), {
        attrs: {
          class: "lookahead negative zero-width-assertion group"
        }
      });
    case "positive-lookbehind":
      return Group(rx2rr(node.body, options), Comment("<= ?", {
        title: "Positive lookbehind",
        class: "caption"
      }), {
        attrs: {
          class: "lookbehind positive zero-width-assertion group"
        }
      });
    case "atomic-group":
      return Group(rx2rr(node.body, options), Comment("Atomic", {
        title: "Atomic Group",
        class: "caption"
      }), {
        attrs: {
          class: "rr-atomic-group group positive"
        }
      });
    case "negative-lookbehind":
      return Group(rx2rr(node.body, options), Comment("<! ?", {
        title: "Negative lookbehind",
        class: "caption"
      }), {
        attrs: {
          class: "lookbehind negative zero-width-assertion group"
        }
      });
    case "back-reference": //Dynatrace does not allow back references. Sorry.
      return NonTerminal(`${node.code}`, {
        title: `Match capture ${node.code} (Back Reference)`,
        class: 'back-reference'
      });
    case "literal":
      if (node.escaped) {
        if (node.body === "A") {
          return doStartOfString();
        } else if (node.body === "Z") {
          return doEndOfString();
        } else {
          //Terminal("\\"+node.body)
          return Terminal(node.body, {
            class: "literal"
          });
        }
      } else {
        return makeLiteral(node.body);
      }
      break;
    case "start":
      return doStartOfString();
    case "end":
      return doEndOfString();
    case "word":
      return NonTerminal("WORD", {
        title: "Word character A-Z, 0-9, _",
        class: 'character-class'
      });
    case "non-word":
      return NonTerminal("NON-WORD", {
        title: "Non-word character, all except A-Z, 0-9, _",
        class: 'character-class invert'
      });
    case "line-feed":
      return NonTerminal("LF", {
        title: "Line feed '\\n'",
        class: 'literal whitespace'
      });
    case "carriage-return":
      return NonTerminal("CR", {
        title: "Carriage Return '\\r'",
        class: 'literal whitespace'
      });
    case "vertical-tab":
      return NonTerminal("VTAB", {
        title: "Vertical tab '\\v'",
        class: 'literal whitespace'
      });
    case "tab":
      return NonTerminal("TAB", {
        title: "Tab stop '\\t'",
        class: 'literal whitespace'
      });
    case "form-feed":
      return NonTerminal("FF", {
        title: "Form feed",
        class: 'literal whitespace'
      });
    case "back-space":
      return NonTerminal("BS", {
        title: "Backspace",
        class: 'literal'
      });
    case "digit":
      return NonTerminal("0-9", {
        class: 'character-class'
      });
    case "null-character":
      return NonTerminal("NULL", {
        title: "Null character '\\0'",
        class: 'literal'
      });
    case "non-digit":
      return NonTerminal("not 0-9", {
        title: "All except digits",
        class: 'character-class invert'
      });
    case "white-space":
      return NonTerminal("WS", {
        title: "Whitespace: space, tabstop, linefeed, carriage-return, etc.",
        class: 'character-class whitespace'
      });
    case "non-white-space":
      return NonTerminal("NON-WS", {
        title: "Not whitespace: all except space, tabstop, line-feed, carriage-return, etc.",
        class: 'character-class invert'
      });
    case "range":
      return NonTerminal(node.text, {
        class: "character-class"
      });
    case "charset":
      charset = (function() {
        var len3, m, ref3, results;
        ref3 = node.body;
        results = [];
        for (m = 0, len3 = ref3.length; m < len3; m++) {
          x = ref3[m];
          results.push(x.text);
        }
        return results;
      })();
      if (charset.length === 1) {
        char = charset[0];
        if (char === " ") {
          if (node.invert) {
            return doSpace();
          }
        }
        if (node.invert) {
          return NonTerminal(`not ${char}`, {
            title: `Match all except ${char}`,
            class: 'character-class invert'
          });
        } 
        else {
          if (char === "SP") {
            return doSpace();
          } 
          else {
            return Terminal(char, {
              class: "literal"
            });
          }
        }
      } 
      else {
        list = charset.slice(0, -1).join(", ");
        for (i = m = 0, len3 = list.length; m < len3; i = ++m) {
          x = list[i];
          // if (x === " ") {
          //   list = list.slice(0, i) + " " + list.slice(i+1);
          //   // console.trace(list);
          // }
        }
        if (node.invert) {
          return NonTerminal(`not ${list} and ${charset.slice(-1)}`, {
            class: 'character-class invert'
          });
        } else {
          return NonTerminal(`${list} or ${charset.slice(-1)}`, {
            class: 'character-class'
          });
        }
      }
      break;
    case "hex":
    case "octal":
    case "unicode":
      return Terminal(node.text, {
        class: 'literal charachter-code'
      });
    case "unicode-category":
      _text = node.code;
      _class = 'unicode-category character-class';
      if (node.invert) {
        _class += ' invert';
        _text = `NON-${_text}`;
      }
      return NonTerminal(_text, {
        title: `Unicode Category ${node.code}`,
        class: _class
      });
    case "any-character":
      extra = !isSingleString() ? " except newline" : "";
      return NonTerminal("ANY", {
        title: `Any character${extra}`,
        class: 'character-class'
      });
    case "word-boundary":
      return NonTerminal("WB", {
        title: "Word-boundary",
        class: 'zero-width-assertion'
      });
    case "non-word-boundary":
      return NonTerminal("NON-WB", {
        title: "Non-word-boundary (match if in a word)",
        class: 'zero-width-assertion invert'
      });
    default:
      return NonTerminal(node.type);
  }
};

quantifiedComment = function(comment, lazy, possessive, attrs) {
  // console.log(comment, lazy, possessive, attrs);
  if(!comment)
    comment = '';
  if (!lazy && !possessive) {
    attrs.title += ', longest possible match';
    attrs.class = 'quantified greedy';
    return Comment(`${comment} (greedy)`, attrs);
  } else if (lazy) {
    attrs.title = 'shortest possible match';
    attrs.class = 'quantified lazy';
    return Comment(`${comment} (lazy)`, attrs);
  } else if (possessive){
    attrs.title = 'longest possible match, releasing no tokens';
    attrs.class = 'quantified possessive';
    return Comment(`${comment} (possessive)`, attrs);
  } else { //This shouldn't ever execute...
    attrs.title += ', longest possible match';
    attrs.class = 'quantified greedy';
    return Comment(`${comment} (greedy)`, attrs);
  }
};

parseRegex = function(regex) {
  if (regex instanceof RegExp) {
    regex = regex.source;
  }
  return parse(regex);
};

const timings = false;
export function Regex2RailRoadDiagram(regex, opts) {

  timings && console.time('Parse Regex String.');
  let parsed = parseRegex(regex);
  timings && console.timeEnd('Parse Regex String.');

  timings && console.time('Render rx2rr.');
  let railroadInput = rx2rr(parsed, opts);
  timings && console.timeEnd('Render rx2rr.');

  timings && console.time('Generate SVG Diagram');
  let diagram = Diagram(railroadInput);
  timings && console.timeEnd('Generate SVG Diagram');

  return diagram;

  // console.log(parsed, railroadInput, diagram);
  return Diagram(rx2rr(parseRegex(regex), opts));
  // return diagram;
}
