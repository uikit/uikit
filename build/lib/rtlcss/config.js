/*
 * RTLCSS 2.0.5 https://github.com/MohammadYounes/rtlcss
 * Framework for transforming Cascading Style Sheets (CSS) from Left-To-Right (LTR) to Right-To-Left (RTL).
 * Copyright 2016 Mohammad Younes.
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>
 * */

'use strict'
var options
var config = {}
var corePlugin = require('./plugin.js')

function optionOrDefault (option, def) {
  return option in options ? options[option] : def
}

function addKey (key, def) {
  config[key] = optionOrDefault(key, def)
}

function main (opts, plugins) {
  options = opts || {}
  addKey('autoRename', false)
  addKey('autoRenameStrict', false)
  addKey('blacklist', {})
  addKey('clean', true)
  addKey('greedy', false)
  addKey('processUrls', false)
  addKey('stringMap', [])

  // default strings map
  if (Array.isArray(config.stringMap)) {
    var hasLeftRight, hasLtrRtl
    for (var x = 0; x < config.stringMap.length; x++) {
      var map = config.stringMap[x]
      if (hasLeftRight && hasLtrRtl) {
        break
      } else if (map.name === 'left-right') {
        hasLeftRight = true
      } else if (map.name === 'ltr-rtl') {
        hasLtrRtl = true
      }
    }
    if (!hasLeftRight) {
      config.stringMap.push({
        'name': 'left-right',
        'priority': 100,
        'exclusive': false,
        'search': ['left', 'Left', 'LEFT'],
        'replace': ['right', 'Right', 'RIGHT'],
        'options': { 'scope': '*', 'ignoreCase': false }
      })
    }
    if (!hasLtrRtl) {
      config.stringMap.push({
        'name': 'ltr-rtl',
        'priority': 100,
        'exclusive': false,
        'search': ['ltr', 'Ltr', 'LTR'],
        'replace': ['rtl', 'Rtl', 'RTL'],
        'options': { 'scope': '*', 'ignoreCase': false }
      })
    }
    config.stringMap.sort(function (a, b) { return a.priority - b.priority })
  }

  // plugins
  config.plugins = []

  if (Array.isArray(plugins)) {
    if (!plugins.some(function (plugin) { return plugin.name === 'rtlcss' })) {
      config.plugins.push(corePlugin)
    }
    config.plugins = config.plugins.concat(plugins)
  } else if (!plugins || plugins.name !== 'rtlcss') {
    config.plugins.push(corePlugin)
  }
  config.plugins.sort(function (a, b) { return a.priority - b.priority })
  return config
}
module.exports.configure = main
