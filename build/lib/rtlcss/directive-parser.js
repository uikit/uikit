/*
 * RTLCSS 2.0.5 https://github.com/MohammadYounes/rtlcss
 * Framework for transforming Cascading Style Sheets (CSS) from Left-To-Right (LTR) to Right-To-Left (RTL).
 * Copyright 2016 Mohammad Younes.
 * Licensed under MIT <http://opensource.org/licenses/mit-license.php>
 * */

module.exports = function (comment) {
  var pos = 0
  var value = comment.text
  var prefix = value.charAt(0) === '!' ? '!rtl:' : 'rtl:'
  var meta

  if (value.indexOf(prefix) === 0) {
    meta = {
      'source': comment,
      'name': '',
      'param': '',
      'begin': true,
      'end': true,
      'blacklist': false,
      'preserve': false
    }
    value = value.slice(prefix.length)
    pos = value.indexOf(':')

    if (pos > -1) {
      meta.name = value.slice(0, pos)
      // begin/end are always true, unless one of them actually exists.
      meta.begin = meta.name !== 'end'
      meta.end = meta.name !== 'begin'
      if (meta.name === 'begin' || meta.name === 'end') {
        value = value.slice(meta.name.length + 1)
        pos = value.indexOf(':')
        if (pos > -1) {
          meta.name = value.slice(0, pos)
          value = value.slice(pos)
          meta.param = value.slice(1)
        } else {
          meta.name = value
        }
      } else {
        meta.param = value.slice(pos + 1)
      }
    } else {
      meta.name = value
    }
  }
  return meta
}
