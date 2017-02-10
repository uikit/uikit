/*
 * RTLCSS 2.0.5 https://github.com/MohammadYounes/rtlcss
 * Framework for transforming Cascading Style Sheets (CSS) from Left-To-Right (LTR) to Right-To-Left (RTL).
 * Copyright 2016 Mohammad Younes.
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>
 * */

'use strict'
var config = require('./config.js')
var util = require('./util.js')
module.exports = {
  'name': 'rtlcss',
  'priority': 100,
  'directives': {
    'control': {
      'ignore': {
        'expect': { 'atrule': true, 'comment': true, 'decl': true, 'rule': true },
        'endNode': null,
        'begin': function (node, metadata, context) {

          // find the ending node in case of self closing directive
          if (!this.endNode && metadata.begin && metadata.end) {
            var n = node
            while (n && n.nodes) {
              n = n.nodes[n.nodes.length - 1]
            }
            this.endNode = n
          }
          var prevent = true

          if (node.type === 'comment' && (node.text === '!rtl:end:ignore' || node.text === 'rtl:end:ignore')) {
            prevent = false
          }
          return prevent
        },
        'end': function (node, metadata, context) {
          // end if:
          //  1. block directive and the node is comment
          //  2. self closing directive and node is endNode
          if (metadata.begin !== metadata.end && node.type === 'comment' || metadata.begin && metadata.end && node === this.endNode) {
            // clear ending node
            this.endNode = null
            return true
          }
          return false
        }
      },
      'rename': {
        'expect': {'rule': true},
        'begin': function (node, metadata, context) {
          node.selector = context.util.applyStringMap(node.selector, false)
          return false
        },
        'end': function (node, context) {
          return true
        }
      },
      'raw': {
        'expect': {'self': true},
        'begin': function (node, metadata, context) {
          var nodes = context.postcss.parse(metadata.param)
          node.parent.insertBefore(node, nodes)
          return true
        },
        'end': function (node, context) {
          return true
        }
      },
      'remove': {
        'expect': {'atrule': true, 'rule': true, 'decl': true},
        'begin': function (node, metadata, context) {
          var prevent = false
          switch (node.type) {
            case 'atrule':
            case 'rule':
            case 'decl':
              prevent = true
              node.remove()
          }
          return prevent
        },
        'end': function (node, metadata, context) {
          return true
        }
      },
      'options': {
        'expect': {'self': true},
        'stack': [],
        'begin': function (node, metadata, context) {
          this.stack.push(util.extend({}, context.config))
          var options
          try {
            options = JSON.parse(metadata.param)
          } catch (e) {
            throw node.error('Invlaid options object', { 'details': e })
          }
          context.config = config.configure(options, context.config.plugins)
          context.util = util.configure(context.config)
          return true
        },
        'end': function (node, metadata, context) {
          var config = this.stack.pop()
          if (config && !metadata.begin) {
            context.config = config
            context.util = util.configure(context.config)
          }
          return true
        }
      },
      'config': {
        'expect': {'self': true},
        'expr': {
          'fn': /function([^\(]*)\(([^\(\)]*?)\)[^\{]*\{([^]*)\}/ig,
          'rx': /\/([^\/]*)\/(.*)/ig
        },
        'stack': [],
        'begin': function (node, metadata, context) {
          this.stack.push(util.extend({}, context.config))
          var configuration
          try {
            configuration = eval('(' + metadata.param + ')') // eslint-disable-line no-eval
          } catch (e) {
            throw node.error('Invlaid config object', { 'details': e })
          }
          context.config = config.configure(configuration.options, configuration.plugins)
          context.util = util.configure(context.config)
          return true
        },
        'end': function (node, metadata, context) {
          var config = this.stack.pop()
          if (config && !metadata.begin) {
            context.config = config
            context.util = util.configure(context.config)
          }
          return true
        }
      }
    },
    'value': [
      {
        'name': 'ignore',
        'action': function (decl, expr, context) {
          return true
        }
      },
      {
        'name': 'prepend',
        'action': function (decl, expr, context) {
          var prefix = ''
          decl.raws.value.raw.replace(expr, function (m, v) {
            prefix += v
          })
          decl.value = decl.raws.value.raw = prefix + decl.raws.value.raw
          return true
        }
      },
      {
        'name': 'append',
        'action': function (decl, expr, context) {
          decl.value = decl.raws.value.raw = decl.raws.value.raw.replace(expr, function (match, value) {
            return match + value
          })
          return true
        }
      },
      {
        'name': 'insert',
        'action': function (decl, expr, context) {
          decl.value = decl.raws.value.raw = decl.raws.value.raw.replace(expr, function (match, value) {
            return value + match
          })
          return true
        }
      },
      {
        'name': '',
        'action': function (decl, expr, context) {
          decl.raws.value.raw.replace(expr, function (match, value) {
            decl.value = decl.raws.value.raw = value + match
          })
          return true
        }
      }
    ]
  },
  'processors': [
    {
      'name': 'direction',
      'expr': /direction/im,
      'action': function (prop, value, context) {
        return { 'prop': prop, 'value': context.util.swapLtrRtl(value) }
      }
    },
    {
      'name': 'left',
      'expr': /left/im,
      'action': function (prop, value, context) {
        return { 'prop': prop.replace(this.expr, function () { return 'right' }), 'value': value }
      }
    },
    {
      'name': 'right',
      'expr': /right/im,
      'action': function (prop, value, context) {
        return { 'prop': prop.replace(this.expr, function () { return 'left' }), 'value': value }
      }
    },
    {
      'name': 'four-value syntax',
      'expr': /^(margin|padding|border-(color|style|width))$/ig,
      'cache': null,
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'match': /[^\s\uFFFD]+/g
          }
        }
        var state = context.util.guardFunctions(value)
        var result = state.value.match(this.cache.match)
        if (result && result.length === 4 && (state.store.length > 0 || result[1] !== result[3])) {
          var i = 0
          state.value = state.value.replace(this.cache.match, function () {
            return result[(4 - i++) % 4]
          })
        }
        return { 'prop': prop, 'value': context.util.unguardFunctions(state) }
      }
    },
    {
      'name': 'border radius',
      'expr': /border-radius/ig,
      'cache': null,
      'flip': function (value) {
        var parts = value.match(this.cache.match)
        var i
        if (parts) {
          switch (parts.length) {
            case 2:
              i = 1
              if (parts[0] !== parts[1]) {
                value = value.replace(this.cache.match, function () {
                  return parts[i--]
                })
              }
              break
            case 3:
              // preserve leading whitespace.
              value = value.replace(this.cache.white, function (m) {
                return m + parts[1] + ' '
              })
              break
            case 4:
              i = 0
              if (parts[0] !== parts[1] || parts[2] !== parts[3]) {
                value = value.replace(this.cache.match, function () {
                  return parts[(5 - i++) % 4]
                })
              }
              break
          }
        }
        return value
      },
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'match': /[^\s\uFFFD]+/g,
            'slash': /[^\/]+/g,
            'white': /(^\s*)/
          }
        }
        var state = context.util.guardFunctions(value)
        state.value = state.value.replace(this.cache.slash, function (m) {
          return this.flip(m)
        }.bind(this))
        return { 'prop': prop, 'value': context.util.unguardFunctions(state) }
      }
    },
    {
      'name': 'shadow',
      'expr': /shadow/ig,
      'cache': null,
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'replace': /[^,]+/g
          }
        }
        var colorSafe = context.util.guardHexColors(value)
        var funcSafe = context.util.guardFunctions(colorSafe.value)
        funcSafe.value = funcSafe.value.replace(this.cache.replace, function (m) { return context.util.negate(m) })
        colorSafe.value = context.util.unguardFunctions(funcSafe)
        return { 'prop': prop, 'value': context.util.unguardHexColors(colorSafe) }
      }
    },
    {
      'name': 'transform origin',
      'expr': /transform-origin/ig,
      'cache': null,
      'flip': function (value, context) {
        if (value === '0') {
          value = '100%'
        } else if (value.match(this.cache.percent)) {
          value = context.util.complement(value)
        }
        return value
      },
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'match': context.util.regex(['calc', 'percent', 'length'], 'g'),
            'percent': context.util.regex(['calc', 'percent'], 'i'),
            'xKeyword': /(left|right)/i
          }
        }
        if (value.match(this.cache.xKeyword)) {
          value = context.util.swapLeftRight(value)
        } else {
          var state = context.util.guardFunctions(value)
          var parts = state.value.match(this.cache.match)
          if (parts && parts.length > 0) {
            parts[0] = this.flip(parts[0], context)
            state.value = state.value.replace(this.cache.match, function () { return parts.shift() })
            value = context.util.unguardFunctions(state)
          }
        }
        return { 'prop': prop, 'value': value }
      }
    },
    {
      'name': 'transform',
      'expr': /^(?!text\-).*?transform$/ig,
      'cache': null,
      'flip': function (value, process, context) {
        var i = 0
        return value.replace(this.cache.unit, function (num) {
          return process(++i, num)
        })
      },
      'flipMatrix': function (value, context) {
        return this.flip(value, function (i, num) {
          if (i === 2 || i === 3 || i === 5) {
            return context.util.negate(num)
          }
          return num
        }, context)
      },
      'flipMatrix3D': function (value, context) {
        return this.flip(value, function (i, num) {
          if (i === 2 || i === 4 || i === 5 || i === 13) {
            return context.util.negate(num)
          }
          return num
        }, context)
      },
      'flipRotate3D': function (value, context) {
        return this.flip(value, function (i, num) {
          if (i === 2 || i === 4) {
            return context.util.negate(num)
          }
          return num
        }, context)
      },
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'negatable': /((translate)(x|3d)?|rotate(z)?)$/ig,
            'unit': context.util.regex(['calc', 'number'], 'g'),
            'matrix': /matrix$/i,
            'matrix3D': /matrix3d$/i,
            'skewXY': /skew(x|y)?$/i,
            'rotate3D': /rotate3d$/i
          }
        }
        var state = context.util.guardFunctions(value)
        return {
          'prop': prop,
          'value': context.util.unguardFunctions(state, function (v, n) {
            if (n.length) {
              if (n.match(this.cache.matrix3D)) {
                v = this.flipMatrix3D(v, context)
              } else if (n.match(this.cache.matrix)) {
                v = this.flipMatrix(v, context)
              } else if (n.match(this.cache.rotate3D)) {
                v = this.flipRotate3D(v, context)
              } else if (n.match(this.cache.skewXY)) {
                v = context.util.negateAll(v)
              } else if (n.match(this.cache.negatable)) {
                v = context.util.negate(v)
              }
            }
            return v
          }.bind(this))
        }
      }
    },
    {
      'name': 'transition',
      'expr': /transition(-property)?$/i,
      'action': function (prop, value, context) {
        return { 'prop': prop, 'value': context.util.swapLeftRight(value) }
      }
    },
    {
      'name': 'background',
      'expr': /background(-position(-x)?|-image)?$/i,
      'cache': null,
      'flip': function (value, context, isPosition) {
        var state = util.saveTokens(value, true)
        var parts = state.value.match(this.cache.match)
        if (parts && parts.length > 0) {
          if (isPosition && parts.length >= 3) {
            state.value = util.swapLeftRight(state.value)
          } else {
            parts[0] = parts[0] === '0'
              ? '100%'
              : (parts[0].match(this.cache.percent)
                ? context.util.complement(parts[0])
                : context.util.swapLeftRight(parts[0]))
            state.value = state.value.replace(this.cache.match, function () { return parts.shift() })
          }
        }
        return util.restoreTokens(state)
      },
      'update': function (context, value, name) {
        if (name.match(this.cache.gradient)) {
          value = context.util.swapLeftRight(value)
          if (value.match(this.cache.angle)) {
            value = context.util.negate(value)
          }
        } else if (context.config.processUrls === true || context.config.processUrls.decl === true && name.match(this.cache.url)) {
          value = context.util.applyStringMap(value, true)
        }
        return value
      },
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'match': context.util.regex(['position', 'percent', 'length', 'calc'], 'ig'),
            'percent': context.util.regex(['calc', 'percent'], 'i'),
            'gradient': /gradient$/i,
            'angle': /\d+(deg|g?rad|turn)/i,
            'url': /^url/i
          }
        }
        var colorSafe = context.util.guardHexColors(value)
        var funcSafe = context.util.guardFunctions(colorSafe.value)
        var parts = funcSafe.value.split(',')
        var lprop = prop.toLowerCase()
        if (lprop !== 'background-image') {
          var isPosition = lprop === 'background-position'
          for (var x = 0; x < parts.length; x++) {
            parts[x] = this.flip(parts[x], context, isPosition)
          }
        }
        funcSafe.value = parts.join(',')
        colorSafe.value = context.util.unguardFunctions(funcSafe, this.update.bind(this, context))
        return {
          'prop': prop,
          'value': context.util.unguardHexColors(colorSafe)
        }
      }
    },
    {
      'name': 'keyword',
      'expr': /float|clear|text-align/i,
      'action': function (prop, value, context) {
        return { 'prop': prop, 'value': context.util.swapLeftRight(value) }
      }
    },
    {
      'name': 'cursor',
      'expr': /cursor/i,
      'cache': null,
      'update': function (context, value, name) {
        if (context.config.processUrls === true || context.config.processUrls.decl === true && name.match(this.cache.url)) {
          value = context.util.applyStringMap(value, true)
        }
        return value
      },
      'flip': function (value) {
        return value.replace(this.cache.replace, function (s, m) {
          return s.replace(m, m.replace(this.cache.e, '*').replace(this.cache.w, 'e').replace(this.cache.star, 'w'))
        }.bind(this))
      },
      'action': function (prop, value, context) {
        if (this.cache === null) {
          this.cache = {
            'replace': /\b(ne|nw|se|sw|nesw|nwse)-resize/ig,
            'url': /^url/i,
            'e': /e/i,
            'w': /w/i,
            'star': /\*/i
          }
        }
        var state = context.util.guardFunctions(value)
        var parts = state.value.split(',')
        for (var x = 0; x < parts.length; x++) {
          parts[x] = this.flip(parts[x])
        }
        state.value = parts.join(',')
        return {
          'prop': prop,
          'value': context.util.unguardFunctions(state, this.update.bind(this, context))
        }
      }
    }
  ]
}
