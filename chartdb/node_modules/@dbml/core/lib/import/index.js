"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _databaseGenerator = require("../parse/databaseGenerator");
var _Parser = _interopRequireDefault(require("../parse/Parser"));
var _ModelExporter = _interopRequireDefault(require("../export/ModelExporter"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _import(str, format) {
  var database = new _Parser["default"]().parse(str, format);
  var dbml = _ModelExporter["default"]["export"](database.normalize(), 'dbml');
  return dbml;
}
function generateDbml(schemaJson) {
  var database = (0, _databaseGenerator.generateDatabase)(schemaJson);
  var dbml = _ModelExporter["default"]["export"](database.normalize(), 'dbml');
  return dbml;
}
var _default = exports["default"] = {
  "import": _import,
  generateDbml: generateDbml
};