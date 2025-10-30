"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ModelExporter = _interopRequireDefault(require("./ModelExporter"));
var _Parser = _interopRequireDefault(require("../parse/Parser"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _export(str, format) {
  var database = new _Parser["default"]().parse(str, 'dbmlv2');
  return _ModelExporter["default"]["export"](database.normalize(), format);
}
var _default = exports["default"] = {
  "export": _export
};