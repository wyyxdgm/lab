
const jsBeautify = require('js-beautify').js;
const _beautifyHtml = require('js-beautify').html;
const _ = require('lodash');

const beautifyHtml = (str, opt) => {
  return _beautifyHtml(str);
}

const randomString = () => {
  
}

const beautify = (str, opt) => {
  return jsBeautify(str, _.extend({
    "indent_size": 4,
    "indent_char": " ",
    "indent_with_tabs": false,
    "editorconfig": false,
    "eol": "\n",
    "end_with_newline": false,
    "indent_level": 0,
    "preserve_newlines": true,
    "max_preserve_newlines": 2,
    "space_in_paren": false,
    "space_in_empty_paren": false,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "space_after_named_function": false,
    "brace_style": "collapse",
    "unindent_chained_methods": false,
    "break_chained_methods": false,
    "keep_array_indentation": false,
    "unescape_strings": false,
    "wrap_line_length": 150,
    "e4x": false,
    "comma_first": false,
    "operator_position": "before-newline"
  }, opt));
}

module.exports = {
  beautifyHtml,
  beautify
}