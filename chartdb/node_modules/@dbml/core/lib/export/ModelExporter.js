"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _DbmlExporter = _interopRequireDefault(require("./DbmlExporter"));
var _MysqlExporter = _interopRequireDefault(require("./MysqlExporter"));
var _PostgresExporter = _interopRequireDefault(require("./PostgresExporter"));
var _JsonExporter = _interopRequireDefault(require("./JsonExporter"));
var _SqlServerExporter = _interopRequireDefault(require("./SqlServerExporter"));
var _OracleExporter = _interopRequireDefault(require("./OracleExporter"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ModelExporter = /*#__PURE__*/function () {
  function ModelExporter() {
    _classCallCheck(this, ModelExporter);
  }
  return _createClass(ModelExporter, null, [{
    key: "export",
    value: function _export() {
      var model = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var isNormalized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var res = '';
      var normalizedModel = isNormalized ? model : model.normalize();
      switch (format) {
        case 'dbml':
          res = _DbmlExporter["default"]["export"](normalizedModel);
          break;
        case 'mysql':
          res = _MysqlExporter["default"]["export"](normalizedModel);
          break;
        case 'postgres':
          res = _PostgresExporter["default"]["export"](normalizedModel);
          break;
        case 'json':
          res = _JsonExporter["default"]["export"](model, isNormalized);
          break;
        case 'mssql':
          res = _SqlServerExporter["default"]["export"](normalizedModel);
          break;
        case 'oracle':
          res = _OracleExporter["default"]["export"](normalizedModel);
          break;
        default:
          break;
      }
      return res;
    }
  }]);
}();
var _default = exports["default"] = ModelExporter;