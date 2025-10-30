"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _TSqlParserVisitor2 = _interopRequireDefault(require("../../parsers/mssql/TSqlParserVisitor"));
var _constants = require("../constants");
var _helpers = require("../helpers");
var _AST = require("../AST");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } /* eslint-disable class-methods-use-this */
var ADD_DESCRIPTION_FUNCTION_NAME = 'sp_addextendedproperty';
var CHECK_CONSTRAINT_CONDITION_TYPE = {
  RAW: 'raw',
  ENUM: 'enum'
};
var getSchemaAndTableName = function getSchemaAndTableName(names) {
  var tableName = (0, _lodash.last)(names);
  var schemaName = names.length > 1 ? (0, _lodash.nth)(names, -2) : undefined;
  return {
    schemaName: schemaName,
    tableName: tableName
  };
};
var getStringFromRawString = function getStringFromRawString(rawString) {
  if (rawString.startsWith("N'")) {
    return rawString;
  }
  return rawString.slice(1, rawString.length - 1);
};

/**
 * @param {any[]} columnDefTableConstraints
 * @returns {{
 *  fieldsData: any[],
 *  indexes: any[],
 *  tableRefs: any[],
 *  columnDefaults: any[],
 *  checkConstraints: any[],
 * }}
 */
var splitColumnDefTableConstraints = function splitColumnDefTableConstraints(columnDefTableConstraints) {
  var _columnDefTableConstr = columnDefTableConstraints.reduce(function (acc, columnDefTableConstraint) {
      switch (columnDefTableConstraint.kind) {
        case _constants.TABLE_CONSTRAINT_KIND.FIELD:
          acc[0].push(columnDefTableConstraint.value);
          break;
        case _constants.TABLE_CONSTRAINT_KIND.INDEX:
        case _constants.TABLE_CONSTRAINT_KIND.PK:
        case _constants.TABLE_CONSTRAINT_KIND.UNIQUE:
          acc[1].push(columnDefTableConstraint.value);
          break;
        case _constants.TABLE_CONSTRAINT_KIND.FK:
          acc[2].push(columnDefTableConstraint.value);
          break;
        case _constants.TABLE_CONSTRAINT_KIND.DEFAULT:
          acc[3].push(columnDefTableConstraint.value);
          break;
        case _constants.TABLE_CONSTRAINT_KIND.CHECK:
          acc[4].push(columnDefTableConstraint.value);
          break;
        default:
          break;
      }
      return acc;
    }, [[], [], [], [], []]),
    _columnDefTableConstr2 = _slicedToArray(_columnDefTableConstr, 5),
    fieldsData = _columnDefTableConstr2[0],
    indexes = _columnDefTableConstr2[1],
    tableRefs = _columnDefTableConstr2[2],
    columnDefaults = _columnDefTableConstr2[3],
    checkConstraints = _columnDefTableConstr2[4];
  return {
    fieldsData: fieldsData,
    indexes: indexes,
    tableRefs: tableRefs,
    columnDefaults: columnDefaults,
    checkConstraints: checkConstraints
  };
};
var parseFieldsAndInlineRefsFromFieldsData = function parseFieldsAndInlineRefsFromFieldsData(fieldsData, tableName, schemaName) {
  var _fieldsData$reduce = fieldsData.reduce(function (acc, fieldData) {
      var _acc$;
      var inlineRefs = fieldData.inline_refs.map(function (inlineRef) {
        inlineRef.endpoints[0].tableName = tableName;
        inlineRef.endpoints[0].schemaName = schemaName;
        inlineRef.endpoints[0].fieldNames = [fieldData.field.name];
        return inlineRef;
      });
      acc[0].push(inlineRefs);
      acc[1].push(fieldData.field);
      (_acc$ = acc[2]).push.apply(_acc$, _toConsumableArray(fieldData.checkConstraints));
      return acc;
    }, [[], [], []]),
    _fieldsData$reduce2 = _slicedToArray(_fieldsData$reduce, 3),
    resInlineRefs = _fieldsData$reduce2[0],
    fields = _fieldsData$reduce2[1],
    checkConstraints = _fieldsData$reduce2[2];
  return {
    inlineRefs: resInlineRefs,
    fields: fields,
    checkConstraints: checkConstraints
  };
};
var MssqlASTGen = exports["default"] = /*#__PURE__*/function (_TSqlParserVisitor) {
  function MssqlASTGen() {
    var _this;
    _classCallCheck(this, MssqlASTGen);
    _this = _callSuper(this, MssqlASTGen);
    _this.data = {
      schemas: [],
      tables: [],
      refs: [],
      enums: [],
      tableGroups: [],
      aliases: [],
      project: {},
      records: []
    };
    return _this;
  }

  // tsql_file
  //   : batch* EOF
  //   | execute_body_batch go_statement* EOF
  //   ;
  _inherits(MssqlASTGen, _TSqlParserVisitor);
  return _createClass(MssqlASTGen, [{
    key: "visitTsql_file",
    value: function visitTsql_file(ctx) {
      var _this2 = this;
      ctx.batch().forEach(function (batch) {
        return batch.accept(_this2);
      });
      return this.data;
    }

    // batch
    //   : go_statement
    //   | execute_body_batch? (go_statement | sql_clauses+) go_statement*
    //   | batch_level_statement go_statement*
    //   ;
  }, {
    key: "visitBatch",
    value: function visitBatch(ctx) {
      var _this3 = this;
      if (ctx.sql_clauses()) {
        ctx.sql_clauses().forEach(function (sqlClause) {
          return sqlClause.accept(_this3);
        });
      }
    }

    // sql_clauses
    //   : dml_clause SEMI?
    //   | cfl_statement SEMI?
    //   | another_statement SEMI?
    //   | ddl_clause SEMI?
    //   | dbcc_clause SEMI?
    //   | backup_statement SEMI?
    //   | SEMI
    //   ;
  }, {
    key: "visitSql_clauses",
    value: function visitSql_clauses(ctx) {
      if (ctx.ddl_clause()) {
        ctx.ddl_clause().accept(this);
        return;
      }
      if (ctx.dml_clause()) {
        ctx.dml_clause().accept(this);
        return;
      }
      if (ctx.another_statement()) {
        ctx.another_statement().accept(this);
      }
    }

    // dml_clause
    //   : merge_statement
    //   | delete_statement
    //   | insert_statement
    //   | select_statement_standalone
    //   | update_statement
    //   ;
  }, {
    key: "visitDml_clause",
    value: function visitDml_clause(ctx) {
      if (ctx.insert_statement()) {
        ctx.insert_statement().accept(this);
      }
    }

    // insert_statement
    //   : with_expression? INSERT (TOP '(' expression ')' PERCENT?)? INTO? (
    //       ddl_object
    //       | rowset_function_limited
    //   ) with_table_hints? ('(' insert_column_name_list ')')? output_clause? insert_statement_value for_clause? option_clause? ';'?
    //   ;
  }, {
    key: "visitInsert_statement",
    value: function visitInsert_statement(ctx) {
      // [ 'users' ]
      // [ 'test', 'users' ]
      // [ 'db', 'test', 'users' ]
      // [ 'server', 'db', 'test', 'users' ]
      // The last: table name
      // The second-last: schema name
      var names = ctx.ddl_object().accept(this);
      var tableName = (0, _lodash.last)(names);
      var schemaName = names.length > 1 ? (0, _lodash.nth)(names, -2) : undefined;
      var columns = ctx.insert_column_name_list() ? ctx.insert_column_name_list().accept(this) : [];
      var values = ctx.insert_statement_value().accept(this);
      var record = new _AST.TableRecord({
        tableName: tableName,
        schemaName: schemaName,
        columns: columns,
        values: values
      });
      this.data.records.push(record);
    }

    // ddl_object
    //   : full_table_name
    //   | LOCAL_ID
    //   ;
  }, {
    key: "visitDdl_object",
    value: function visitDdl_object(ctx) {
      return ctx.full_table_name().accept(this);
    }

    // full_table_name
    //   : (
    //       linkedServer = id_ '.' '.' schema = id_ '.'
    //       | server = id_ '.' database = id_ '.' schema = id_ '.'
    //       | database = id_ '.' schema = id_? '.'
    //       | schema = id_ '.'
    //   )? table = id_
    //   ;
  }, {
    key: "visitFull_table_name",
    value: function visitFull_table_name(ctx) {
      var _this4 = this;
      return ctx.id_().map(function (id) {
        return id.accept(_this4);
      });
    }

    // id_
    //   : ID
    //   | TEMP_ID
    //   | DOUBLE_QUOTE_ID
    //   | DOUBLE_QUOTE_BLANK
    //   | SQUARE_BRACKET_ID
    //   | keyword
    //   | RAW
    //   ;
  }, {
    key: "visitId_",
    value: function visitId_(ctx) {
      if (ctx.DOUBLE_QUOTE_ID() || ctx.SQUARE_BRACKET_ID()) return (0, _helpers.getOriginalText)(ctx).slice(1, -1);
      return (0, _helpers.getOriginalText)(ctx);
    }

    // insert_column_name_list
    //   : col += insert_column_id (',' col += insert_column_id)*
    //   ;
  }, {
    key: "visitInsert_column_name_list",
    value: function visitInsert_column_name_list(ctx) {
      var _this5 = this;
      var columns = ctx.insert_column_id().map(function (column) {
        return column.accept(_this5);
      });
      return (0, _lodash.flattenDepth)(columns, 1);
    }

    // insert_column_id
    //   : (ignore += id_? '.')* id_
    //   ;

    // insert_statement_value
    //   : table_value_constructor
    //   | derived_table
    //   | execute_statement
    //   | DEFAULT VALUES
    //   ;
  }, {
    key: "visitInsert_statement_value",
    value: function visitInsert_statement_value(ctx) {
      if (!ctx.table_value_constructor()) return [];
      var rawValues = ctx.table_value_constructor().accept(this);
      return rawValues;
    }

    // table_value_constructor
    //   : VALUES '(' exps += expression_list_ ')' (',' '(' exps += expression_list_ ')')*
    //   ;
  }, {
    key: "visitTable_value_constructor",
    value: function visitTable_value_constructor(ctx) {
      var _this6 = this;
      return ctx.expression_list_().map(function (expression) {
        return expression.accept(_this6);
      });
    }

    // expression_list_
    //   : exp += expression (',' exp += expression)*
    //   ;
  }, {
    key: "visitExpression_list_",
    value: function visitExpression_list_(ctx) {
      var _this7 = this;
      return ctx.expression().map(function (expression) {
        return expression.accept(_this7);
      });
    }

    // expression
    //   : primitive_expression
    //   | function_call
    //   | expression '.' (value_call | query_call | exist_call | modify_call)
    //   | expression '.' hierarchyid_call
    //   | expression COLLATE id_
    //   | case_expression
    //   | full_column_name
    //   | bracket_expression
    //   | unary_operator_expression
    //   | expression op = ('*' | '/' | '%') expression
    //   | expression op = ('+' | '-' | '&' | '^' | '|' | '||') expression
    //   | expression time_zone
    //   | over_clause
    //   | DOLLAR_ACTION
    //   ;
  }, {
    key: "visitExpression",
    value: function visitExpression(ctx) {
      if (ctx.primitive_expression()) {
        return ctx.primitive_expression().accept(this);
      }
      if (ctx.function_call()) {
        return ctx.function_call().accept(this);
      }
      if (ctx.unary_operator_expression()) {
        return ctx.unary_operator_expression().accept(this);
      }
      if (ctx.bracket_expression()) {
        return ctx.bracket_expression().accept(this);
      }
      if (ctx.full_column_name()) {
        return ctx.full_column_name().accept(this);
      }

      // Default case for any other expression type
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // bracket_expression
    //   : '(' expression ')'
    //   | '(' subquery ')'
    //   ;
  }, {
    key: "visitBracket_expression",
    value: function visitBracket_expression(ctx) {
      return ctx.expression() ? ctx.expression().accept(this) : null;
    }

    // full_column_name
    //   : ((DELETED | INSERTED | full_table_name) '.')? (
    //       column_name = id_
    //       | ('$' (IDENTITY | ROWGUID))
    //   )
    //   ;
  }, {
    key: "visitFull_column_name",
    value: function visitFull_column_name(ctx) {
      var columnName = ctx.id_().accept(this);
      var fullTableName = ctx.full_table_name() ? ctx.full_table_name().accept(this) : [];
      return {
        value: [].concat(_toConsumableArray(fullTableName), [columnName]),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // primitive_constant
    //   : STRING // string, datetime or uniqueidentifier
    //   | BINARY
    //   | (DECIMAL | REAL | FLOAT)                    // float or decimal
    //   | dollar = '$' ('-' | '+')? (DECIMAL | FLOAT) // money
    //   | parameter
    //   ;
  }, {
    key: "visitPrimitive_constant",
    value: function visitPrimitive_constant(ctx) {
      if (ctx.STRING() || ctx.BINARY()) {
        var value = getStringFromRawString(ctx.getText());
        return {
          value: value,
          type: value.startsWith("N'") ? _constants.DATA_TYPE.EXPRESSION : _constants.DATA_TYPE.STRING
        };
      }
      if (ctx.DOLLAR()) {
        var dollar = (0, _lodash.first)(ctx.children).getText();
        var sign = ctx.children.length > 2 ? (0, _lodash.nth)(ctx.children, -2) : '';
        var _value = (0, _lodash.last)(ctx.children).getText();
        return {
          value: "".concat(dollar).concat(sign).concat(_value),
          type: _constants.DATA_TYPE.STRING
        };
      }
      if (ctx.REAL() || ctx.DECIMAL() || ctx.FLOAT()) {
        return {
          value: ctx.getText(),
          type: _constants.DATA_TYPE.NUMBER
        };
      }
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // function_call
    //   : ranking_windowed_function                      # RANKING_WINDOWED_FUNC
    //   | aggregate_windowed_function                    # AGGREGATE_WINDOWED_FUNC
    //   | analytic_windowed_function                     # ANALYTIC_WINDOWED_FUNC
    //   | built_in_functions                             # BUILT_IN_FUNC
    //   | scalar_function_name '(' expression_list_? ')' # SCALAR_FUNCTION
    //   | freetext_function                              # FREE_TEXT
    //   | partition_function                             # PARTITION_FUNC
    //   | hierarchyid_static_method                      # HIERARCHYID_METHOD
    //   ;

    // See packages/dbml-core/src/parse/ANTLR/parsers/mssql/TSqlParser.g4 at line 4338
  }, {
    key: "visitBUILT_IN_FUNC",
    value: function visitBUILT_IN_FUNC(ctx) {
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }
  }, {
    key: "visitSCALAR_FUNCTION",
    value: function visitSCALAR_FUNCTION(ctx) {
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // unary_operator_expression
    //   : '~' expression
    //   | op = ('+' | '-') expression
    //   ;
  }, {
    key: "visitUnary_operator_expression",
    value: function visitUnary_operator_expression(ctx) {
      var operator = ctx.children[0].getText();
      var expression = ctx.expression().accept(this);
      return {
        value: "".concat(operator).concat(expression.value),
        type: expression.type
      };
    }

    // data_type
    //   : scaled = (VARCHAR | NVARCHAR | BINARY_KEYWORD | VARBINARY_KEYWORD | SQUARE_BRACKET_ID) '(' MAX ')'
    //   | ext_type = id_ '(' scale = DECIMAL ',' prec = DECIMAL ')'
    //   | ext_type = id_ '(' scale = DECIMAL ')'
    //   | ext_type = id_ IDENTITY ('(' seed = DECIMAL ',' inc = DECIMAL ')')?
    //   | double_prec = DOUBLE PRECISION?
    //   | unscaled_type = id_
    //   ;
  }, {
    key: "visitData_type",
    value: function visitData_type(ctx) {
      if (ctx.MAX()) {
        var type = '';
        if (ctx.SQUARE_BRACKET_ID()) {
          type = ctx.SQUARE_BRACKET_ID().getText().slice(1, -1);
        } else {
          var typeNode = ctx.VARCHAR() || ctx.NVARCHAR() || ctx.BINARY_KEYWORD() || ctx.VARBINARY_KEYWORD() || ctx.SQUARE_BRACKET_ID();
          type = typeNode.getText();
        }
        return "".concat(type, "(MAX)");
      }
      if (ctx.DOUBLE()) {
        var _double = ctx.DOUBLE().getText();
        var precision = ctx.PRECISION() ? " ".concat(ctx.PRECISION().getText()) : '';
        return "".concat(_double).concat(precision);
      }
      var id = ctx.id_().accept(this);
      if (ctx.IDENTITY()) {
        if (ctx.DECIMAL().length) {
          var seedAndInc = ctx.DECIMAL().map(function (decimal) {
            return decimal.getText();
          });
          return "".concat(id, " IDENTITY(").concat(seedAndInc, ")");
        }
        return "".concat(id, " IDENTITY");
      }
      if (ctx.DECIMAL().length) {
        var scaleAndPrec = ctx.DECIMAL().map(function (decimal) {
          return decimal.getText();
        });
        return "".concat(id, "(").concat(scaleAndPrec.join(','), ")");
      }
      return id;
    }
  }, {
    key: "visitPrimitive_expression",
    value: function visitPrimitive_expression(ctx) {
      if (ctx.NULL_()) {
        return {
          value: ctx.getText(),
          type: _constants.DATA_TYPE.BOOLEAN
        };
      }
      if (ctx.primitive_constant()) {
        return ctx.primitive_constant().accept(this);
      }
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // ddl_clause
    //   | alter_table
    //   | create_index
    //   | create_table
    //   ;
    // more details at: packages/dbml-core/src/parse/ANTLR/parsers/mssql/TSqlParser.g4 line 73
  }, {
    key: "visitDdl_clause",
    value: function visitDdl_clause(ctx) {
      if (ctx.create_table()) {
        ctx.create_table().accept(this);
        return;
      }
      if (ctx.alter_table()) {
        ctx.alter_table().accept(this);
        return;
      }
      if (ctx.create_index()) {
        ctx.create_index().accept(this);
      }
    }

    // create_table
    //   : CREATE TABLE table_name '(' column_def_table_constraints (','? table_indices)* ','? ')' (
    //       LOCK simple_id
    //   )? table_options* (ON id_ | DEFAULT | on_partition_or_filegroup)? (TEXTIMAGE_ON id_ | DEFAULT)? ';'?
    //   ;
  }, {
    key: "visitCreate_table",
    value: function visitCreate_table(ctx) {
      var _this8 = this,
        _this$data$refs,
        _this$data$refs2;
      var _getSchemaAndTableNam = getSchemaAndTableName(ctx.table_name().accept(this)),
        schemaName = _getSchemaAndTableNam.schemaName,
        tableName = _getSchemaAndTableNam.tableName;
      var columnDefTableConstraints = ctx.column_def_table_constraints().accept(this);
      var tableIndices = ctx.table_indices().map(function (tableIndex) {
        return tableIndex.accept(_this8);
      });
      var _splitColumnDefTableC = splitColumnDefTableConstraints(columnDefTableConstraints),
        fieldsData = _splitColumnDefTableC.fieldsData,
        indexes = _splitColumnDefTableC.indexes,
        tableRefs = _splitColumnDefTableC.tableRefs,
        tableCheckConstraints = _splitColumnDefTableC.checkConstraints;
      var _parseFieldsAndInline = parseFieldsAndInlineRefsFromFieldsData(fieldsData, tableName, schemaName),
        inlineRefs = _parseFieldsAndInline.inlineRefs,
        fields = _parseFieldsAndInline.fields,
        columnCheckConstraints = _parseFieldsAndInline.checkConstraints;
      (_this$data$refs = this.data.refs).push.apply(_this$data$refs, _toConsumableArray((0, _lodash.flatten)(inlineRefs)));
      (_this$data$refs2 = this.data.refs).push.apply(_this$data$refs2, _toConsumableArray(tableRefs.map(function (tableRef) {
        tableRef.endpoints[0].tableName = tableName;
        tableRef.endpoints[0].schemaName = schemaName;
        return tableRef;
      })));

      // these check constraints represent enums
      var checkConstraints = columnCheckConstraints.concat(tableCheckConstraints);
      checkConstraints.forEach(function (checkConstraint) {
        var field = fields.find(function (fieldItem) {
          return fieldItem.name === checkConstraint.column;
        });
        if (!field) return;
        var enumObject = new _AST.Enum({
          name: "".concat(tableName, "_").concat(field.name, "_enum"),
          values: checkConstraint.columnValues.map(function (value) {
            return {
              name: value
            };
          }),
          schemaName: schemaName
        });
        _this8.data.enums.push(enumObject);
        // TODO: handle multiple enums for the same field
        field.type.type_name = enumObject.name;
        field.type.schemaName = enumObject.schemaName;
      });
      var table = new _AST.Table({
        name: tableName,
        schemaName: schemaName,
        fields: fields,
        indexes: tableIndices.concat(indexes)
      });
      this.data.tables.push(table);
    }

    // table_name
    //   : (database = id_ '.' schema = id_? '.' | schema = id_ '.')? (
    //       table = id_
    //       | blocking_hierarchy = BLOCKING_HIERARCHY
    //   )
    //   ;
  }, {
    key: "visitTable_name",
    value: function visitTable_name(ctx) {
      var _this9 = this;
      return ctx.id_().map(function (id) {
        return id.accept(_this9);
      });
    }

    // column_def_table_constraints
    //   : column_def_table_constraint (','? column_def_table_constraint)*
    //   ;
  }, {
    key: "visitColumn_def_table_constraints",
    value: function visitColumn_def_table_constraints(ctx) {
      var _this0 = this;
      return ctx.column_def_table_constraint().map(function (columnDef) {
        return columnDef.accept(_this0);
      }).filter(function (columnDef) {
        return columnDef;
      });
    }

    // column_def_table_constraint
    //   : column_definition
    //   | materialized_column_definition
    //   | table_constraint
    //   ;
  }, {
    key: "visitColumn_def_table_constraint",
    value: function visitColumn_def_table_constraint(ctx) {
      if (ctx.column_definition()) {
        return ctx.column_definition().accept(this);
      }
      if (ctx.table_constraint()) {
        return ctx.table_constraint().accept(this);
      }
      return null;
    }

    // column_definition
    // : id_ (data_type | AS expression PERSISTED?) column_definition_element* column_index?
    // ;
  }, {
    key: "visitColumn_definition",
    value: function visitColumn_definition(ctx) {
      var _this1 = this;
      var columnName = ctx.id_().accept(this);
      var type = '';
      if (ctx.data_type()) {
        type = ctx.data_type().accept(this);
      } else if (ctx.expression()) {
        // { value: "(first_name + ' ' + last_name)", type: 'expression' }
        var expression = ctx.expression().accept(this);
        var as = ctx.AS().getText();
        var persisted = ctx.PERSISTED() ? " ".concat(ctx.PERSISTED().getText()) : '';
        type = "".concat(as, " ").concat(expression.value).concat(persisted);
      }
      var field = new _AST.Field({
        name: columnName,
        type: {
          type_name: type,
          schemaName: null
        }
      });
      var definition = {
        kind: _constants.TABLE_CONSTRAINT_KIND.FIELD,
        value: {
          field: field,
          inline_refs: [],
          checkConstraints: []
        }
      };
      var columnDefinitions = ctx.column_definition_element().map(function (columnDef) {
        return columnDef.accept(_this1);
      });

      // e.g.
      // [
      //   { kind: 'not_null', value: true },
      //   { kind: 'dbdefault', value: { value: 'GETDATE()', type: 'expression' } }
      // ]
      columnDefinitions.filter(function (columnDef) {
        return columnDef;
      }).forEach(function (columnDef) {
        switch (columnDef.kind) {
          case _constants.COLUMN_CONSTRAINT_KIND.DEFAULT:
            field.dbdefault = columnDef.value;
            break;
          case _constants.COLUMN_CONSTRAINT_KIND.INCREMENT:
            field.increment = columnDef.value;
            break;
          case _constants.COLUMN_CONSTRAINT_KIND.NOT_NULL:
            field.not_null = columnDef.value;
            break;
          case _constants.COLUMN_CONSTRAINT_KIND.PK:
            field.pk = columnDef.value;
            break;
          case _constants.COLUMN_CONSTRAINT_KIND.UNIQUE:
            field.unique = columnDef.value;
            break;
          case _constants.COLUMN_CONSTRAINT_KIND.INLINE_REF:
            definition.value.inline_refs.push(columnDef.value);
            break;
          case _constants.COLUMN_CONSTRAINT_KIND.CHECK:
            {
              var _columnDef$value = columnDef.value,
                columnDefType = _columnDef$value.type,
                value = _columnDef$value.value;

              // we keep the current behavior: when a field has a check constraints cannot be converted to enum, we will ignore it
              if (columnDefType !== CHECK_CONSTRAINT_CONDITION_TYPE.ENUM) return;
              definition.value.checkConstraints.push(value);
              break;
            }
          default:
            break;
        }
      });

      // skip column index since it is just the name of the index that a column belongs to

      return definition;
    }

    // column_definition_element
    //   : FILESTREAM
    //   | COLLATE collation_name = id_
    //   | SPARSE
    //   | MASKED WITH '(' FUNCTION '=' mask_function = STRING ')'
    //   | (CONSTRAINT constraint = id_)? DEFAULT constant_expr = expression
    //   | IDENTITY ('(' seed = DECIMAL ',' increment = DECIMAL ')')?
    //   | NOT FOR REPLICATION
    //   | GENERATED ALWAYS AS (ROW | TRANSACTION_ID | SEQUENCE_NUMBER) (START | END) HIDDEN_KEYWORD?
    //   // NULL / NOT NULL is a constraint
    //   | ROWGUIDCOL
    //   | ENCRYPTED WITH '(' COLUMN_ENCRYPTION_KEY '=' key_name = STRING ',' ENCRYPTION_TYPE '=' (
    //       DETERMINISTIC
    //       | RANDOMIZED
    //   ) ',' ALGORITHM '=' algo = STRING ')'
    //   | column_constraint
    //   ;
  }, {
    key: "visitColumn_definition_element",
    value: function visitColumn_definition_element(ctx) {
      if (ctx.DEFAULT()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.DEFAULT,
          value: ctx.expression().accept(this)
        };
      }
      if (ctx.IDENTITY()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.INCREMENT,
          value: true
        };
      }
      if (ctx.column_constraint()) {
        return ctx.column_constraint().accept(this);
      }
      return null;
    }

    // column_constraint
    //   : (CONSTRAINT constraint = id_)? (
    //       null_notnull
    //       | ( (PRIMARY KEY | UNIQUE) clustered? primary_key_options)
    //       | ( (FOREIGN KEY)? foreign_key_options)
    //       | check_constraint
    //   )
    //   ;
  }, {
    key: "visitColumn_constraint",
    value: function visitColumn_constraint(ctx) {
      if (ctx.null_notnull()) {
        var notNull = false;
        var nullNotnull = ctx.null_notnull().accept(this);
        if (nullNotnull.includes('NOT')) notNull = true;
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.NOT_NULL,
          value: notNull
        };
      }
      if (ctx.UNIQUE()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.UNIQUE,
          value: true
        };
      }
      if (ctx.PRIMARY()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.PK,
          value: true
        };
      }
      if (ctx.foreign_key_options()) {
        var _ctx$foreign_key_opti = ctx.foreign_key_options().accept(this),
          refTableName = _ctx$foreign_key_opti.refTableName,
          refSchemaName = _ctx$foreign_key_opti.refSchemaName,
          fieldNames = _ctx$foreign_key_opti.fieldNames,
          onDelete = _ctx$foreign_key_opti.onDelete,
          onUpdate = _ctx$foreign_key_opti.onUpdate;
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.INLINE_REF,
          value: {
            endpoints: [{
              tableName: null,
              schemaName: null,
              fieldNames: null,
              relation: '*'
            }, {
              tableName: refTableName,
              schemaName: refSchemaName,
              fieldNames: fieldNames,
              relation: '1'
            }],
            onDelete: onDelete,
            onUpdate: onUpdate
          }
        };
      }

      // we do not handle check constraint since it is complicated and hard to extract enum from it
      if (ctx.check_constraint()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.CHECK,
          value: ctx.check_constraint().accept(this)
        };
      }
      return null;
    }

    // check_constraint
    //   : CHECK (NOT FOR REPLICATION)? '(' search_condition ')'
    //   ;
  }, {
    key: "visitCheck_constraint",
    value: function visitCheck_constraint(ctx) {
      return ctx.search_condition().accept(this);
    }

    // search_condition
    //   : NOT* (predicate | '(' search_condition ')')
    //   | search_condition AND search_condition // AND takes precedence over OR
    //   | search_condition OR search_condition
    //   ;
  }, {
    key: "visitSearch_condition",
    value: function visitSearch_condition(ctx) {
      // we will parse the enum from the most basic condition - map to the old behavior
      // others, we will get the check constraint to ensure the constraint is applied - enhance the old behavior
      if (!ctx.predicate() || ctx.NOT().length) {
        return {
          type: CHECK_CONSTRAINT_CONDITION_TYPE.RAW,
          value: (0, _helpers.getOriginalText)(ctx)
        };
      }
      var predicate = ctx.predicate().accept(this);
      if (!predicate) {
        return {
          type: CHECK_CONSTRAINT_CONDITION_TYPE.RAW,
          value: (0, _helpers.getOriginalText)(ctx)
        };
      }
      return {
        type: CHECK_CONSTRAINT_CONDITION_TYPE.ENUM,
        value: predicate
      };
    }

    // predicate
    //   : EXISTS '(' subquery ')'
    //   | freetext_predicate
    //   | expression comparison_operator expression
    //   | expression MULT_ASSIGN expression ////SQL-82 syntax for left outer joins; '*='. See https://stackoverflow.com/questions/40665/in-sybase-sql
    //   | expression comparison_operator (ALL | SOME | ANY) '(' subquery ')'
    //   | expression NOT* BETWEEN expression AND expression
    //   | expression NOT* IN '(' (subquery | expression_list_) ')'
    //   | expression NOT* LIKE expression (ESCAPE expression)?
    //   | expression IS null_notnull
    //   ;
  }, {
    key: "visitPredicate",
    value: function visitPredicate(ctx) {
      var _this10 = this;
      if (ctx.IN() && ctx.expression_list_() && ctx.NOT().length === 0) {
        var _expression$value;
        var _ctx$expression$map = ctx.expression().map(function (e) {
            return e.accept(_this10);
          }),
          _ctx$expression$map2 = _slicedToArray(_ctx$expression$map, 1),
          _ctx$expression$map2$ = _ctx$expression$map2[0],
          expression = _ctx$expression$map2$ === void 0 ? {} : _ctx$expression$map2$;

        // {
        //   value: [ 'myschema', 'sample_table', 'column_name' ],
        //   type: 'expression'
        // }
        var column = (0, _lodash.last)((_expression$value = expression.value) !== null && _expression$value !== void 0 ? _expression$value : []);
        var expressionList = ctx.expression_list_().accept(this).map(function (e) {
          return e.value;
        });
        return {
          column: column,
          columnValues: expressionList
        };
      }
      return null;
    }
  }, {
    key: "visitNull_notnull",
    value: function visitNull_notnull(ctx) {
      return (0, _helpers.getOriginalText)(ctx);
    }

    // foreign_key_options
    //   : REFERENCES table_name '(' pk = column_name_list ')' (on_delete | on_update)* (
    //       NOT FOR REPLICATION
    //   )?
    //   ;
  }, {
    key: "visitForeign_key_options",
    value: function visitForeign_key_options(ctx) {
      var _this11 = this;
      var names = ctx.table_name().accept(this);
      var _getSchemaAndTableNam2 = getSchemaAndTableName(names),
        refSchemaName = _getSchemaAndTableNam2.schemaName,
        refTableName = _getSchemaAndTableNam2.tableName;
      var fieldNames = ctx.column_name_list().accept(this);
      var onDelete = ctx.on_delete() ? ctx.on_delete().map(function (action) {
        return action.accept(_this11);
      })[0] : null;
      var onUpdate = ctx.on_update() ? ctx.on_update().map(function (action) {
        return action.accept(_this11);
      })[0] : null;
      return {
        refTableName: refTableName,
        refSchemaName: refSchemaName,
        onDelete: onDelete,
        onUpdate: onUpdate,
        fieldNames: fieldNames
      };
    }

    // column_name_list
    //   : col += id_ (',' col += id_)*
    //   ;
  }, {
    key: "visitColumn_name_list",
    value: function visitColumn_name_list(ctx) {
      var _this12 = this;
      return ctx.id_().map(function (id) {
        return id.accept(_this12);
      });
    }

    // on_delete
    //   : ON DELETE (NO ACTION | CASCADE | SET NULL_ | SET DEFAULT)
    //   ;
  }, {
    key: "visitOn_delete",
    value: function visitOn_delete(ctx) {
      if (ctx.NO()) {
        return 'NO ACTION';
      }
      if (ctx.CASCADE()) {
        return 'CASCADE';
      }
      if (ctx.NULL_()) {
        return 'SET NULL';
      }
      return 'SET DEFAULT';
    }

    // on_update
    //   : ON UPDATE (NO ACTION | CASCADE | SET NULL_ | SET DEFAULT)
    //   ;
  }, {
    key: "visitOn_update",
    value: function visitOn_update(ctx) {
      if (ctx.NO()) {
        return 'NO ACTION';
      }
      if (ctx.CASCADE()) {
        return 'CASCADE';
      }
      if (ctx.NULL_()) {
        return 'SET NULL';
      }
      return 'SET DEFAULT';
    }

    // table_constraint
    //   : (CONSTRAINT constraint = id_)? (
    //       ((PRIMARY KEY | UNIQUE) clustered? '(' column_name_list_with_order ')' primary_key_options)
    //       | ( FOREIGN KEY '(' fk = column_name_list ')' foreign_key_options)
    //       | ( CONNECTION '(' connection_node ( ',' connection_node)* ')')
    //       | ( DEFAULT constant_expr = expression FOR column = id_ (WITH VALUES)?)
    //       | check_constraint
    //   )
    //   ;
  }, {
    key: "visitTable_constraint",
    value: function visitTable_constraint(ctx) {
      var _this13 = this;
      var name = ctx.id_() ? ctx.id_().map(function (id) {
        return id.accept(_this13);
      })[0] : '';
      if (ctx.PRIMARY() || ctx.UNIQUE()) {
        var columns = ctx.column_name_list_with_order().accept(this);
        var index = new _AST.Index({
          name: name,
          columns: columns
        });
        if (ctx.PRIMARY()) {
          index.pk = true;
        }
        if (ctx.UNIQUE()) {
          index.unique = true;
        }
        return {
          kind: ctx.PRIMARY() ? _constants.TABLE_CONSTRAINT_KIND.PK : _constants.TABLE_CONSTRAINT_KIND.UNIQUE,
          value: index
        };
      }
      if (ctx.FOREIGN()) {
        var _columns = ctx.column_name_list().accept(this);
        var _ctx$foreign_key_opti2 = ctx.foreign_key_options().accept(this),
          refTableName = _ctx$foreign_key_opti2.refTableName,
          refSchemaName = _ctx$foreign_key_opti2.refSchemaName,
          fieldNames = _ctx$foreign_key_opti2.fieldNames,
          onDelete = _ctx$foreign_key_opti2.onDelete,
          onUpdate = _ctx$foreign_key_opti2.onUpdate;
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.FK,
          value: {
            name: name,
            endpoints: [{
              tableName: null,
              schemaName: null,
              fieldNames: _columns,
              relation: '*'
            }, {
              tableName: refTableName,
              schemaName: refSchemaName,
              fieldNames: fieldNames,
              relation: '1'
            }],
            onDelete: onDelete,
            onUpdate: onUpdate
          }
        };
      }
      if (ctx.DEFAULT()) {
        var column = ctx.column.accept(this);
        var expression = ctx.expression().accept(this);
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.DEFAULT,
          value: {
            column: column,
            defaultValue: expression
          }
        };
      }
      if (ctx.check_constraint()) {
        var checkConstraint = ctx.check_constraint().accept(this);
        if (checkConstraint.type !== CHECK_CONSTRAINT_CONDITION_TYPE.ENUM) return null;
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.CHECK,
          value: checkConstraint.value
        };
      }
      return null;
    }

    // column_name_list_with_order
    //   : id_ (ASC | DESC)? (',' id_ (ASC | DESC)?)*
    //   ;
  }, {
    key: "visitColumn_name_list_with_order",
    value: function visitColumn_name_list_with_order(ctx) {
      var _this14 = this;
      return ctx.id_().map(function (id) {
        return {
          value: id.accept(_this14),
          type: 'column'
        };
      });
    }

    // table_indices
    //   : INDEX id_ UNIQUE? clustered? '(' column_name_list_with_order ')'
    //   | INDEX id_ CLUSTERED COLUMNSTORE
    //   | INDEX id_ NONCLUSTERED? COLUMNSTORE '(' column_name_list ')' create_table_index_options? (
    //       ON id_
    //   )?
    //   ;
  }, {
    key: "visitTable_indices",
    value: function visitTable_indices(ctx) {
      var _this15 = this;
      var index = new _AST.Index({
        name: ctx.id_().map(function (id) {
          return id.accept(_this15);
        })[0],
        unique: !!ctx.UNIQUE(),
        columns: ctx.column_name_list_with_order().accept(this)
      });
      return index;
    }

    // alter_table
    //   : ALTER TABLE table_name (
    //       SET '(' LOCK_ESCALATION '=' (AUTO | TABLE | DISABLE) ')'
    //       | ADD column_def_table_constraints
    //       | ALTER COLUMN (column_definition | column_modifier)
    //       | DROP COLUMN id_ (',' id_)*
    //       | DROP CONSTRAINT constraint = id_
    //       | WITH (CHECK | NOCHECK) ADD (CONSTRAINT constraint = id_)? (
    //           FOREIGN KEY '(' fk = column_name_list ')' REFERENCES table_name (
    //               '(' pk = column_name_list ')'
    //           )? (on_delete | on_update)*
    //           | CHECK '(' search_condition ')'
    //       )
    //       | (NOCHECK | CHECK) CONSTRAINT constraint = id_
    //       | (ENABLE | DISABLE) TRIGGER id_?
    //       | REBUILD table_options
    //       | SWITCH switch_partition
    //   ) ';'?
    //   ;
  }, {
    key: "visitAlter_table",
    value: function visitAlter_table(ctx) {
      var _this$data$refs3,
        _this$data$refs4,
        _table$fields,
        _table$indexes,
        _this16 = this;
      // table_name() returns an array because there are multiple table_name in the clause (REFERENCES table_name ...)
      var names = ctx.table_name()[0].accept(this);
      var _getSchemaAndTableNam3 = getSchemaAndTableName(names),
        schemaName = _getSchemaAndTableNam3.schemaName,
        tableName = _getSchemaAndTableNam3.tableName;
      var table = this.data.tables.find(function (t) {
        return t.name === tableName && t.schemaName === schemaName;
      });
      if (!table) return; // ALTER TABLE should appear after CREATE TABLE, so skip if table is not created yet

      var columnDefTableConstraints = ctx.column_def_table_constraints() ? ctx.column_def_table_constraints().accept(this) : [];
      var _splitColumnDefTableC2 = splitColumnDefTableConstraints(columnDefTableConstraints),
        fieldsData = _splitColumnDefTableC2.fieldsData,
        indexes = _splitColumnDefTableC2.indexes,
        tableRefs = _splitColumnDefTableC2.tableRefs,
        columnDefaults = _splitColumnDefTableC2.columnDefaults,
        checkConstraints = _splitColumnDefTableC2.checkConstraints;
      var _parseFieldsAndInline2 = parseFieldsAndInlineRefsFromFieldsData(fieldsData, tableName, schemaName),
        inlineRefs = _parseFieldsAndInline2.inlineRefs,
        fields = _parseFieldsAndInline2.fields;
      (_this$data$refs3 = this.data.refs).push.apply(_this$data$refs3, _toConsumableArray((0, _lodash.flatten)(inlineRefs)));
      (_this$data$refs4 = this.data.refs).push.apply(_this$data$refs4, _toConsumableArray(tableRefs.map(function (tableRef) {
        tableRef.endpoints[0].tableName = tableName;
        tableRef.endpoints[0].schemaName = schemaName;
        return tableRef;
      })));
      (_table$fields = table.fields).push.apply(_table$fields, _toConsumableArray(fields));
      (_table$indexes = table.indexes).push.apply(_table$indexes, _toConsumableArray(indexes));
      columnDefaults.forEach(function (columnDefault) {
        var field = table.fields.find(function (f) {
          return f.name === columnDefault.column;
        });
        if (!field) return;
        field.dbdefault = columnDefault.defaultValue;
      });
      checkConstraints.forEach(function (checkConstraint) {
        var field = table.fields.find(function (fieldItem) {
          return fieldItem.name === checkConstraint.column;
        });
        if (!field) return;
        var enumObject = new _AST.Enum({
          name: "".concat(tableName, "_").concat(field.name, "_enum"),
          values: checkConstraint.columnValues.map(function (value) {
            return {
              name: value
            };
          }),
          schemaName: schemaName
        });
        _this16.data.enums.push(enumObject);
        // TODO: handle multiple enums for the same field
        field.type.type_name = enumObject.name;
        field.type.schemaName = enumObject.schemaName;
      });
    }

    // create_index
    //   : CREATE UNIQUE? clustered? INDEX id_ ON table_name '(' column_name_list_with_order ')' (
    //       INCLUDE '(' column_name_list ')'
    //   )? (WHERE where = search_condition)? (create_index_options)? (ON id_)? ';'?
    //   ;
  }, {
    key: "visitCreate_index",
    value: function visitCreate_index(ctx) {
      var _getSchemaAndTableNam4 = getSchemaAndTableName(ctx.table_name().accept(this)),
        schemaName = _getSchemaAndTableNam4.schemaName,
        tableName = _getSchemaAndTableNam4.tableName;
      var table = this.data.tables.find(function (t) {
        return t.name === tableName && t.schemaName === schemaName;
      });
      if (!table) return; // ALTER TABLE should appear after CREATE TABLE, so skip if table is not created yet

      var index = new _AST.Index({
        name: ctx.id_()[0].accept(this),
        unique: !!ctx.UNIQUE(),
        columns: ctx.column_name_list_with_order().accept(this)
      });
      table.indexes.push(index);
    }

    // another_statement
    //   : alter_queue
    //   | checkpoint_statement
    //   | conversation_statement
    //   | create_contract
    //   | create_queue
    //   | cursor_statement
    //   | declare_statement
    //   | execute_statement
    //   | kill_statement
    //   | message_statement
    //   | reconfigure_statement
    //   | security_statement
    //   | set_statement
    //   | setuser_statement
    //   | shutdown_statement
    //   | transaction_statement
    //   | use_statement
    //   ;
  }, {
    key: "visitAnother_statement",
    value: function visitAnother_statement(ctx) {
      if (ctx.execute_statement()) {
        ctx.execute_statement().accept(this);
      }
    }

    // execute_statement
    //   : EXECUTE execute_body ';'?
    //   ;
  }, {
    key: "visitExecute_statement",
    value: function visitExecute_statement(ctx) {
      ctx.execute_body().accept(this);
    }

    // execute_body
    //   : (return_status = LOCAL_ID '=')? (func_proc_name_server_database_schema | execute_var_string) execute_statement_arg?
    //   | '(' execute_var_string (',' execute_var_string)* ')' (AS (LOGIN | USER) '=' STRING)? (
    //       AT_KEYWORD linkedServer = id_
    //   )?
    //   | AS ( (LOGIN | USER) '=' STRING | CALLER)
    //   ;
  }, {
    key: "visitExecute_body",
    value: function visitExecute_body(ctx) {
      var funcNames = ctx.func_proc_name_server_database_schema() ? ctx.func_proc_name_server_database_schema().accept(this) : [];
      var funcName = (0, _lodash.last)(funcNames);
      if (funcName !== ADD_DESCRIPTION_FUNCTION_NAME) {
        return;
      }
      if (ctx.execute_statement_arg()) {
        // [
        //   { name: '@name', value: "N'Column_Description'", type: 'expression' },
        //   { name: '@value', value: '$-1', type: 'string' },
        //   { name: '@level0type', value: "N'Schema'", type: 'expression' },
        //   { name: '@level0name', value: 'dbo', type: 'string' },
        //   { name: '@level1type', value: "N'Table'", type: 'expression' },
        //   { name: '@level1name', value: 'orders', type: 'string' },
        //   { name: '@level2type', value: "N'Column'", type: 'expression' },
        //   { name: '@level2name', value: 'status', type: 'string' }
        // ]
        var args = ctx.execute_statement_arg().accept(this);

        // {
        //   name: "N'Table_Description'",
        //   value: 'This is a note in table "orders"',
        //   level0type: "N'Schema'",
        //   level0name: 'dbo',
        //   level1type: "N'Table'",
        //   level1name: 'orders'
        // }
        var argsObj = args.reduce(function (acc, arg) {
          var name = arg.name.slice(1);
          acc[name] = arg.value;
          return acc;
        }, {});
        if (!argsObj.name.includes('Description')) {
          return;
        }

        // https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-addextendedproperty-transact-sql?view=sql-server-ver16#----level0type
        var level0Type = argsObj.level0type.toLowerCase();
        if (!level0Type.includes('schema')) return;
        var schemaName = argsObj.level0name !== 'dbo' ? argsObj.level0name : undefined;
        var level1Type = argsObj.level1type.toLowerCase();
        var tableName = level1Type.includes('table') ? argsObj.level1name : null;
        var table = this.data.tables.find(function (t) {
          return t.name === tableName && t.schemaName === schemaName;
        });
        if (!table) return;
        if (!argsObj.level2type) {
          table.note = {
            value: argsObj.value
          };
          return;
        }
        var level2Type = argsObj.level2type.toLowerCase();
        var columnName = level2Type.includes('column') ? argsObj.level2name : null;
        var field = table.fields.find(function (f) {
          return f.name === columnName;
        });
        if (!field) return;
        field.note = {
          value: argsObj.value
        };
      }
    }

    // func_proc_name_server_database_schema
    //   : server = id_? '.' database = id_? '.' schema = id_? '.' procedure = id_
    //   | func_proc_name_database_schema
    //   ;
  }, {
    key: "visitFunc_proc_name_server_database_schema",
    value: function visitFunc_proc_name_server_database_schema(ctx) {
      var _this17 = this;
      if (ctx.func_proc_name_database_schema()) {
        return ctx.func_proc_name_database_schema().accept(this);
      }
      return ctx.id_().map(function (id) {
        return id.accept(_this17);
      });
    }

    // func_proc_name_database_schema
    //   : database = id_? '.' schema = id_? '.' procedure = id_
    //   | func_proc_name_schema
    //   ;
  }, {
    key: "visitFunc_proc_name_database_schema",
    value: function visitFunc_proc_name_database_schema(ctx) {
      var _this18 = this;
      if (ctx.func_proc_name_schema()) {
        return ctx.func_proc_name_schema().accept(this);
      }
      return ctx.id_().map(function (id) {
        return id.accept(_this18);
      });
    }

    // func_proc_name_schema
    //   : ((schema = id_) '.')? procedure = id_
    //   ;
  }, {
    key: "visitFunc_proc_name_schema",
    value: function visitFunc_proc_name_schema(ctx) {
      var _this19 = this;
      return ctx.id_().map(function (id) {
        return id.accept(_this19);
      });
    }

    // execute_statement_arg
    //   : execute_statement_arg_unnamed (',' execute_statement_arg)*     //Unnamed params can continue unnamed
    //   | execute_statement_arg_named (',' execute_statement_arg_named)* //Named can only be continued by unnamed
    //   ;
  }, {
    key: "visitExecute_statement_arg",
    value: function visitExecute_statement_arg(ctx) {
      var _this20 = this;
      if (ctx.execute_statement_arg_unnamed()) {
        return ctx.execute_statement_arg_unnamed().map(function (item) {
          return item.accept(_this20);
        });
      }
      return ctx.execute_statement_arg_named().map(function (item) {
        return item.accept(_this20);
      });
    }

    // execute_statement_arg_named
    //   : name = LOCAL_ID '=' value = execute_parameter
    //   ;
  }, {
    key: "visitExecute_statement_arg_named",
    value: function visitExecute_statement_arg_named(ctx) {
      var _ctx$execute_paramete = ctx.execute_parameter().accept(this),
        value = _ctx$execute_paramete.value,
        type = _ctx$execute_paramete.type;
      return {
        name: ctx.LOCAL_ID().getText(),
        value: value,
        type: type
      };
    }

    // execute_parameter
    //   : (constant | LOCAL_ID (OUTPUT | OUT)? | id_ | DEFAULT | NULL_)
    //   ;
  }, {
    key: "visitExecute_parameter",
    value: function visitExecute_parameter(ctx) {
      if (ctx.constant()) {
        return ctx.constant().accept(this);
      }
      return ctx.getText();
    }

    // constant
    //   : STRING // string, datetime or uniqueidentifier
    //   | BINARY
    //   | '-'? (DECIMAL | REAL | FLOAT)                    // float or decimal
    //   | '-'? dollar = '$' ('-' | '+')? (DECIMAL | FLOAT) // money
    //   | parameter
    //   ;
  }, {
    key: "visitConstant",
    value: function visitConstant(ctx) {
      if (ctx.STRING() || ctx.BINARY()) {
        var value = getStringFromRawString(ctx.getText());
        return {
          value: value,
          type: value.startsWith("N'") ? _constants.DATA_TYPE.EXPRESSION : _constants.DATA_TYPE.STRING
        };
      }
      if (ctx.DOLLAR()) {
        var _value2 = ctx.getText();
        return {
          value: _value2,
          type: _constants.DATA_TYPE.STRING
        };
      }
      if (ctx.REAL() || ctx.DECIMAL() || ctx.FLOAT()) {
        return {
          value: ctx.getText(),
          type: _constants.DATA_TYPE.NUMBER
        };
      }
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }
  }]);
}(_TSqlParserVisitor2["default"]);