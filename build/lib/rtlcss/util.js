/*
 * RTLCSS 2.0.5 https://github.com/MohammadYounes/rtlcss
 * Framework for transforming Cascading Style Sheets (CSS) from Left-To-Right (LTR) to Right-To-Left (RTL).
 * Copyright 2016 Mohammad Younes.
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>
 * */

'use strict'
var config
var CHAR_COMMENT_REPLACEMENT = '\uFFFD' // �
var CHAR_TOKEN_REPLACEMENT = '\u00A4'// ¤
var CHAR_TOKEN_START = '\u00AB' // «
var CHAR_TOKEN_END = '\u00BB' // »

var REGEX_COMMENT_REPLACEMENT = new RegExp(CHAR_COMMENT_REPLACEMENT, 'ig')
var REGEX_TOKEN_REPLACEMENT = new RegExp(CHAR_TOKEN_REPLACEMENT, 'ig')

var PATTERN_NUMBER = '\\-?(\\d*?\\.\\d+|\\d+)'
var PATTERN_NUMBER_WITH_CALC = '(calc' + CHAR_TOKEN_REPLACEMENT + ')|(' + PATTERN_NUMBER + ')(?!d\\()'
var PATTERN_TOKEN = CHAR_TOKEN_START + '\\d+:\\d+' + CHAR_TOKEN_END // «offset:index»
var PATTERN_TOKEN_WITH_NAME = '\\w*?' + CHAR_TOKEN_START + '\\d+:\\d+' + CHAR_TOKEN_END // «offset:index»

var REGEX_COMMENT = /\/\*[^]*?\*\//igm // none-greedy
var REGEX_DIRECTIVE = /\/\*(?:!)?rtl:[^]*?\*\//img
var REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g
var REGEX_FUNCTION = /\([^\(\)]+\)/i
var REGEX_HEX_COLOR = /#[a-f0-9]{3,6}/ig
var REGEX_CALC = /calc/
var REGEX_TOKENS = new RegExp(PATTERN_TOKEN, 'ig')
var REGEX_TOKENS_WITH_NAME = new RegExp(PATTERN_TOKEN_WITH_NAME, 'ig')

var REGEX_COMPLEMENT = new RegExp(PATTERN_NUMBER_WITH_CALC, 'i')
var REGEX_NEGATE_ALL = new RegExp(PATTERN_NUMBER_WITH_CALC, 'ig')
var REGEX_NEGATE_ONE = new RegExp(PATTERN_NUMBER_WITH_CALC, 'i')

var DEFAULT_STRING_MAP_OPTIONS = { scope: '*', ignoreCase: true }
var TOKEN_ID = 0

function compare (what, to, ignoreCase) {
  if (ignoreCase) {
    return what.toLowerCase() === to.toLowerCase()
  }
  return what === to
}

function escapeRegExp (string) {
  return string.replace(REGEX_ESCAPE, '\\$&')
}

module.exports = {
  extend: function (dest, src) {
    if (typeof dest === 'undefined' || typeof dest !== 'object') {
      dest = {}
    }
    for (var prop in src) {
      if (!dest.hasOwnProperty(prop)) {
        dest[prop] = src[prop]
      }
    }
    return dest
  },
  swap: function (value, a, b, options) {
    var expr = escapeRegExp(a) + '|' + escapeRegExp(b)
    options = options || DEFAULT_STRING_MAP_OPTIONS
    var greedy = options.hasOwnProperty('greedy') ? options.greedy : config.greedy
    if (!greedy) {
      expr = '\\b(' + expr + ')\\b'
    }
    var flags = options.ignoreCase ? 'img' : 'mg'
    return value.replace(new RegExp(expr, flags), function (m) { return compare(m, a, options.ignoreCase) ? b : a })
  },
  swapLeftRight: function (value) {
    return this.swap(value, 'left', 'right')
  },
  swapLtrRtl: function (value) {
    return this.swap(value, 'ltr', 'rtl')
  },
  applyStringMap: function (value, isUrl) {
    var result = value
    for (var x = 0; x < config.stringMap.length; x++) {
      var map = config.stringMap[x]
      var options = this.extend(map.options, DEFAULT_STRING_MAP_OPTIONS)
      if (options.scope === '*' || (isUrl && options.scope === 'url') || (!isUrl && options.scope === 'selector')) {
        if (Array.isArray(map.search) && Array.isArray(map.replace)) {
          for (var mapIndex = 0; mapIndex < map.search.length; mapIndex++) {
            result = this.swap(result, map.search[mapIndex], map.replace[mapIndex % map.search.length], options)
          }
        } else {
          result = this.swap(result, map.search, map.replace, options)
        }
        if (map.exclusive === true) {
          break
        }
      }
    }
    return result
  },
  negate: function (value) {
    var state = this.saveTokens(value)
    state.value = state.value.replace(REGEX_NEGATE_ONE, function (num) {
      return REGEX_TOKEN_REPLACEMENT.test(num) ? num.replace(REGEX_TOKEN_REPLACEMENT, function (m) { return '(-1*' + m + ')' }) : parseFloat(num, 10) * -1
    })
    return this.restoreTokens(state)
  },
  negateAll: function (value) {
    var state = this.saveTokens(value)
    state.value = state.value.replace(REGEX_NEGATE_ALL, function (num) {
      return REGEX_TOKEN_REPLACEMENT.test(num) ? num.replace(REGEX_TOKEN_REPLACEMENT, function (m) { return '(-1*' + m + ')' }) : parseFloat(num, 10) * -1
    })
    return this.restoreTokens(state)
  },
  complement: function (value) {
    var state = this.saveTokens(value)
    state.value = state.value.replace(REGEX_COMPLEMENT, function (num) {
      return REGEX_TOKEN_REPLACEMENT.test(num) ? num.replace(REGEX_TOKEN_REPLACEMENT, function (m) { return '(100% - ' + m + ')' }) : 100 - parseFloat(num, 10)
    })
    return this.restoreTokens(state)
  },
  save: function (what, who, replacement, restorer, exclude) {
    var state = {
      value: who,
      store: [],
      replacement: replacement,
      restorer: restorer
    }
    state.value = state.value.replace(what, function (c) {
      if (exclude && c.match(exclude)) {
        return c
      } else {
        state.store.push(c); return state.replacement
      }
    })
    return state
  },
  restore: function (state) {
    var index = 0
    var result = state.value.replace(state.restorer, function () {
      return state.store[index++]
    })
    state.store.length = 0
    return result
  },
  saveComments: function (value) {
    return this.save(REGEX_COMMENT, value, CHAR_COMMENT_REPLACEMENT, REGEX_COMMENT_REPLACEMENT)
  },
  restoreComments: function (state) {
    return this.restore(state)
  },
  saveTokens: function (value, excludeCalc) {
    return excludeCalc === true
      ? this.save(REGEX_TOKENS_WITH_NAME, value, CHAR_TOKEN_REPLACEMENT, REGEX_TOKEN_REPLACEMENT, REGEX_CALC)
      : this.save(REGEX_TOKENS, value, CHAR_TOKEN_REPLACEMENT, REGEX_TOKEN_REPLACEMENT)
  },
  restoreTokens: function (state) {
    return this.restore(state)
  },
  guard: function (what, who, indexed) {
    var state = {
      value: who,
      store: [],
      offset: TOKEN_ID++,
      token: CHAR_TOKEN_START + TOKEN_ID,
      indexed: indexed === true
    }
    if (state.indexed === true) {
      while (what.test(state.value)) {
        state.value = state.value.replace(what, function (m) { state.store.push(m); return state.token + ':' + state.store.length + CHAR_TOKEN_END })
      }
    } else {
      state.value = state.value.replace(what, function (m) { state.store.push(m); return state.token + CHAR_TOKEN_END })
    }
    return state
  },
  unguard: function (state, callback) {
    if (state.indexed === true) {
      var detokenizer = new RegExp('(\\w*?)' + state.token + ':(\\d+)' + CHAR_TOKEN_END, 'i')
      while (detokenizer.test(state.value)) {
        state.value = state.value.replace(detokenizer, function (match, name, index) {
          var value = state.store[index - 1]
          if (typeof callback === 'function') {
            return name + callback(value, name)
          }
          return name + value
        })
      }
      return state.value
    } else {
      return state.value.replace(new RegExp('(\\w*?)' + state.token + CHAR_TOKEN_END, 'i'), function (match, name) {
        var value = state.store.shift()
        if (typeof callback === 'function') {
          return name + callback(value, name)
        }
        return name + value
      })
    }
  },
  guardHexColors: function (value) {
    return this.guard(REGEX_HEX_COLOR, value, true)
  },
  unguardHexColors: function (state, callback) {
    return this.unguard(state, callback)
  },
  guardFunctions: function (value) {
    return this.guard(REGEX_FUNCTION, value, true)
  },
  unguardFunctions: function (state, callback) {
    return this.unguard(state, callback)
  },
  trimDirective: function (value) {
    return value.replace(REGEX_DIRECTIVE, '')
  },
  regexCache: {},
  regexDirective: function (name) {
    // /(?:\/\*(?:!)?rtl:ignore(?::)?)([^]*?)(?:\*\/)/img
    this.regexCache[name] = this.regexCache[name] || new RegExp('(?:\\/\\*(?:!)?rtl:' + (name ? escapeRegExp(name) + '(?::)?' : '') + ')([^]*?)(?:\\*\\/)', 'img')
    return this.regexCache[name]
  },
  regex: function (what, options) {
    what = what || []
    var expression = ''
    for (var x = 0; x < what.length; x++) {
      switch (what[x]) {
        case 'percent':
          expression += '|(' + PATTERN_NUMBER + '%)'
          break
        case 'length':
          expression += '|(' + PATTERN_NUMBER + ')(?:ex|ch|r?em|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc)?'
          break
        case 'number':
          expression += '|(' + PATTERN_NUMBER + ')'
          break
        case 'position':
          expression += '|(left|center|right|top|bottom)'
          break
        case 'calc':
          expression += '|(calc' + PATTERN_TOKEN + ')'
          break
      }
    }
    return new RegExp(expression.slice(1), options)
  },
  isLastOfType: function (node) {
    var isLast = true
    var next = node.next()
    while (next) {
      if (next && next.type === node.type) {
        isLast = false
        break
      }
      next = next.next()
    }
    return isLast
  },
  /**
   * Simple breakable each: returning false in the callback will break the loop
   * returns false if the loop was broken, otherwise true
   */
  each: function (array, callback) {
    for (var len = 0; len < array.length; len++) {
      if (callback(array[len]) === false) {
        return false
      }
    }
    return true
  }
}

module.exports.configure = function (configuration) {
  config = configuration
  return this
}
