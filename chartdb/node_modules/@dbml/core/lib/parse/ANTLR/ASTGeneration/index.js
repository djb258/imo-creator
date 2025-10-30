"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
var _antlr = _interopRequireDefault(require("antlr4"));
var _PostgreSQLLexer = _interopRequireDefault(require("../parsers/postgresql/PostgreSQLLexer"));
var _PostgreSQLParser = _interopRequireDefault(require("../parsers/postgresql/PostgreSQLParser"));
var _PostgresASTGen = _interopRequireDefault(require("./postgres/PostgresASTGen"));
var _MySqlLexer = _interopRequireDefault(require("../parsers/mysql/MySqlLexer"));
var _MySqlParser = _interopRequireDefault(require("../parsers/mysql/MySqlParser"));
var _MySQLASTGen = _interopRequireDefault(require("./mysql/MySQLASTGen"));
var _SnowflakeLexer = _interopRequireDefault(require("../parsers/snowflake/SnowflakeLexer"));
var _SnowflakeParser = _interopRequireDefault(require("../parsers/snowflake/SnowflakeParser"));
var _SnowflakeASTGen = _interopRequireDefault(require("./snowflake/SnowflakeASTGen"));
var _ParserErrorListener = _interopRequireDefault(require("./ParserErrorListener"));
var _TSqlLexer = _interopRequireDefault(require("../parsers/mssql/TSqlLexer"));
var _TSqlParser = _interopRequireDefault(require("../parsers/mssql/TSqlParser"));
var _MssqlASTGen = _interopRequireDefault(require("./mssql/MssqlASTGen"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */

function parse(input, format) {
  var chars = new _antlr["default"].InputStream(input);
  var database = null;
  var errorListener = new _ParserErrorListener["default"]();
  switch (format) {
    case 'postgres':
      {
        var lexer = new _PostgreSQLLexer["default"](chars);
        var tokens = new _antlr["default"].CommonTokenStream(lexer);
        var parser = new _PostgreSQLParser["default"](tokens);
        parser.buildParseTrees = true;
        parser.removeErrorListeners();
        parser.addErrorListener(errorListener);
        var parseTree = parser.root();
        database = parseTree.accept(new _PostgresASTGen["default"]());
        if (errorListener.errors.length) throw errorListener.errors;
        break;
      }
    case 'mysql':
      {
        var _lexer = new _MySqlLexer["default"](chars);
        var _tokens = new _antlr["default"].CommonTokenStream(_lexer);
        var _parser = new _MySqlParser["default"](_tokens);
        _parser.buildParseTrees = true;
        _parser.removeErrorListeners();
        _parser.addErrorListener(errorListener);
        var _parseTree = _parser.root();
        database = _parseTree.accept(new _MySQLASTGen["default"]());
        if (errorListener.errors.length) throw errorListener.errors;
        break;
      }
    case 'mssql':
      {
        var _lexer2 = new _TSqlLexer["default"](chars);
        var _tokens2 = new _antlr["default"].CommonTokenStream(_lexer2);
        var _parser2 = new _TSqlParser["default"](_tokens2);
        _parser2.buildParseTrees = true;
        _parser2.removeErrorListeners();
        _parser2.addErrorListener(errorListener);
        var _parseTree2 = _parser2.tsql_file();
        database = _parseTree2.accept(new _MssqlASTGen["default"]());
        if (errorListener.errors.length) throw errorListener.errors;
        break;
      }
    case 'snowflake':
      {
        var _lexer3 = new _SnowflakeLexer["default"](chars);
        var _tokens3 = new _antlr["default"].CommonTokenStream(_lexer3);
        var _parser3 = new _SnowflakeParser["default"](_tokens3);
        _parser3.buildParseTrees = true;
        _parser3.removeErrorListeners();
        _parser3.addErrorListener(errorListener);
        var _parseTree3 = _parser3.snowflake_file();
        database = _parseTree3.accept(new _SnowflakeASTGen["default"]());
        if (errorListener.errors.length) throw errorListener.errors;
        break;
      }
    default:
      throw new Error("Format not supported: ".concat(format));
  }
  return database;
}