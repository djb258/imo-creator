"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOriginalText = getOriginalText;
var _lodash = require("lodash");
function getOriginalText(ctx) {
  var a = ctx.start.start;
  var b = ctx.stop.stop;
  if ((0, _lodash.isNil)(a) || (0, _lodash.isNil)(b)) return undefined;
  var input = ctx.start.getInputStream();
  return input.getText(a, b);
}