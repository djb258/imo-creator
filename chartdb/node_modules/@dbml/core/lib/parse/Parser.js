"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _parse = require("@dbml/parse");
var _database = _interopRequireDefault(require("../model_structure/database"));
var _mysqlParser = _interopRequireDefault(require("./mysqlParser"));
var _postgresParser = _interopRequireDefault(require("./postgresParser"));
var _dbmlParser = _interopRequireDefault(require("./dbmlParser"));
var _schemarbParser = _interopRequireDefault(require("./schemarbParser"));
var _mssqlParser = _interopRequireDefault(require("./mssqlParser"));
var _ASTGeneration = require("./ANTLR/ASTGeneration");
var _error = require("./error");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Parser = /*#__PURE__*/function () {
  function Parser(dbmlCompiler) {
    _classCallCheck(this, Parser);
    this.DBMLCompiler = dbmlCompiler || new _parse.Compiler();
  }
  return _createClass(Parser, [{
    key: "parse",
    value: function parse(str, format) {
      try {
        var rawDatabase = {};
        switch (format) {
          case 'mysql':
            rawDatabase = Parser.parseMySQLToJSONv2(str);
            break;
          case 'mysqlLegacy':
            rawDatabase = Parser.parseMySQLToJSON(str);
            break;
          case 'postgres':
            rawDatabase = Parser.parsePostgresToJSONv2(str);
            break;
          case 'snowflake':
            rawDatabase = Parser.parseSnowflakeToJSON(str);
            break;
          case 'postgresLegacy':
            rawDatabase = Parser.parsePostgresToJSON(str);
            break;
          case 'dbml':
            rawDatabase = Parser.parseDBMLToJSON(str);
            break;
          case 'dbmlv2':
            rawDatabase = Parser.parseDBMLToJSONv2(str, this.DBMLCompiler);
            break;
          case 'schemarb':
            rawDatabase = Parser.parseSchemaRbToJSON(str);
            break;
          case 'mssqlLegacy':
            rawDatabase = Parser.parseMSSQLToJSON(str);
            break;
          case 'mssql':
            rawDatabase = Parser.parseMSSQLToJSONv2(str);
            break;
          case 'json':
            if (_typeof(str) === 'object') {
              rawDatabase = str;
            } else {
              rawDatabase = JSON.parse(str);
            }
            break;
          default:
            break;
        }
        var schema = Parser.parseJSONToDatabase(rawDatabase);
        return schema;
      } catch (diags) {
        throw _error.CompilerError.create(diags);
      }
    }
  }], [{
    key: "parseJSONToDatabase",
    value: function parseJSONToDatabase(rawDatabase) {
      var database = new _database["default"](rawDatabase);
      return database;
    }
  }, {
    key: "parseMySQLToJSONv2",
    value: function parseMySQLToJSONv2(str) {
      return (0, _ASTGeneration.parse)(str, 'mysql');
    }
  }, {
    key: "parseMySQLToJSON",
    value: function parseMySQLToJSON(str) {
      return _mysqlParser["default"].parse(str);
    }
  }, {
    key: "parsePostgresToJSONv2",
    value: function parsePostgresToJSONv2(str) {
      return (0, _ASTGeneration.parse)(str, 'postgres');
    }
  }, {
    key: "parsePostgresToJSON",
    value: function parsePostgresToJSON(str) {
      return _postgresParser["default"].parse(str);
    }
  }, {
    key: "parseDBMLToJSONv2",
    value: function parseDBMLToJSONv2(str, dbmlCompiler) {
      var compiler = dbmlCompiler || new _parse.Compiler();
      compiler.setSource(str);
      var diags = compiler.parse.errors().map(function (error) {
        return {
          message: error.diagnostic,
          location: {
            start: {
              line: error.nodeOrToken.startPos.line + 1,
              column: error.nodeOrToken.startPos.column + 1
            },
            end: {
              line: error.nodeOrToken.endPos.line + 1,
              column: error.nodeOrToken.endPos.column + 1
            }
          },
          code: error.code
        };
      });
      if (diags.length > 0) throw _error.CompilerError.create(diags);
      return compiler.parse.rawDb();
    }
  }, {
    key: "parseDBMLToJSON",
    value: function parseDBMLToJSON(str) {
      return _dbmlParser["default"].parse(str);
    }
  }, {
    key: "parseSchemaRbToJSON",
    value: function parseSchemaRbToJSON(str) {
      return _schemarbParser["default"].parse(str);
    }
  }, {
    key: "parseMSSQLToJSON",
    value: function parseMSSQLToJSON(str) {
      return _mssqlParser["default"].parseWithPegError(str);
    }
  }, {
    key: "parseMSSQLToJSONv2",
    value: function parseMSSQLToJSONv2(str) {
      return (0, _ASTGeneration.parse)(str, 'mssql');
    }
  }, {
    key: "parseSnowflakeToJSON",
    value: function parseSnowflakeToJSON(str) {
      return (0, _ASTGeneration.parse)(str, 'snowflake');
    }
  }, {
    key: "parse",
    value: function parse(str, format) {
      return new Parser().parse(str, format);
    }
  }]);
}();
var _default = exports["default"] = Parser;