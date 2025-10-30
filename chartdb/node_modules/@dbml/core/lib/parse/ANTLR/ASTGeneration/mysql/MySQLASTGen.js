"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _MySqlParserVisitor = _interopRequireDefault(require("../../parsers/mysql/MySqlParserVisitor"));
var _AST = require("../AST");
var _constants = require("../constants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /* eslint-disable class-methods-use-this */
var TABLE_OPTIONS_KIND = {
  NOTE: 'note'
};
var ALTER_KIND = {
  ADD_PK: 'add_pk',
  ADD_FK: 'add_fk'
};
var INDEX_OPTION_KIND = {
  TYPE: 'type'
};
var getTableNames = function getTableNames(names) {
  var tableName = (0, _lodash.last)(names);
  var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
  return {
    tableName: tableName,
    schemaName: schemaName
  };
};
var getFieldNames = function getFieldNames(names) {
  var fieldName = (0, _lodash.last)(names);
  var tableName = names.length > 1 ? names[names.length - 2] : undefined;
  var schemaName = names.length > 2 ? names[names.length - 3] : undefined;
  return {
    fieldName: fieldName,
    tableName: tableName,
    schemaName: schemaName
  };
};
var MySQLASTGen = exports["default"] = /*#__PURE__*/function (_MySQLParserVisitor) {
  function MySQLASTGen() {
    var _this;
    _classCallCheck(this, MySQLASTGen);
    _this = _callSuper(this, MySQLASTGen);
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

  // TODO: support configurable default schema name other than 'public'
  _inherits(MySQLASTGen, _MySQLParserVisitor);
  return _createClass(MySQLASTGen, [{
    key: "findTable",
    value: function findTable(schemaName, tableName) {
      var realSchemaName = schemaName || 'public';
      var table = this.data.tables.find(function (t) {
        var targetSchemaName = t.schemaName || 'public';
        return targetSchemaName === realSchemaName && t.name === tableName;
      });
      return table;
    }

    // sqlStatements? (MINUS MINUS)? EOF
  }, {
    key: "visitRoot",
    value: function visitRoot(ctx) {
      var _ctx$sqlStatements;
      (_ctx$sqlStatements = ctx.sqlStatements()) === null || _ctx$sqlStatements === void 0 || _ctx$sqlStatements.accept(this);
      return this.data;
    }

    // (sqlStatement (MINUS MINUS)? SEMI? | emptyStatement_)* (sqlStatement ((MINUS MINUS)? SEMI)? | emptyStatement_)
  }, {
    key: "visitSqlStatements",
    value: function visitSqlStatements(ctx) {
      var _this2 = this;
      ctx.sqlStatement().forEach(function (statement) {
        statement.accept(_this2);
      });
    }

    // ddlStatement | dmlStatement | transactionStatement | replicationStatement | preparedStatement | administrationStatement | utilityStatement
  }, {
    key: "visitSqlStatement",
    value: function visitSqlStatement(ctx) {
      if (ctx.ddlStatement()) {
        ctx.ddlStatement().accept(this);
        return;
      }
      if (ctx.dmlStatement()) {
        ctx.dmlStatement().accept(this);
      }
    }

    // createDatabase | createEvent | createIndex | createLogfileGroup | createProcedure | createFunction | createServer | createTable | createTablespaceInnodb | createTablespaceNdb | createTrigger | createView | createRole
    // | alterDatabase | alterEvent | alterFunction | alterInstance | alterLogfileGroup | alterProcedure | alterServer | alterTable | alterTablespace | alterView
    // | dropDatabase | dropEvent | dropIndex | dropLogfileGroup | dropProcedure | dropFunction | dropServer | dropTable | dropTablespace | dropTrigger | dropView | dropRole
    // | setRole| renameTable | truncateTable
  }, {
    key: "visitDdlStatement",
    value: function visitDdlStatement(ctx) {
      var _this3 = this;
      if (ctx.createTable()) {
        var _this$data$refs, _this$data$refs2;
        var createTableResult = ctx.createTable().accept(this);
        if (!createTableResult) return;
        var tableName = createTableResult.tableName,
          schemaName = createTableResult.schemaName,
          definitions = createTableResult.definitions,
          options = createTableResult.options;
        var _definitions$reduce = definitions.reduce(function (acc, ele) {
            if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.FIELD) acc[0].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.INDEX) acc[1].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.UNIQUE) acc[1].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.FK) acc[2].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.PK) {
              /** @type {Index} */
              var index = ele.value;
              if (index.columns.length > 1) acc[1].push(ele.value);else acc[3] = index;
            }
            return acc;
          }, [[], [], [], null]),
          _definitions$reduce2 = _slicedToArray(_definitions$reduce, 4),
          fieldsData = _definitions$reduce2[0],
          indexes = _definitions$reduce2[1],
          tableRefs = _definitions$reduce2[2],
          singlePkIndex = _definitions$reduce2[3];
        var inlineRefsOfFields = fieldsData.map(function (fieldData) {
          var _field$type$type_name;
          var field = fieldData.field,
            inlineRefs = fieldData.inlineRefs;
          if (((_field$type$type_name = field.type.type_name) === null || _field$type$type_name === void 0 ? void 0 : _field$type$type_name.toLowerCase()) === 'enum') {
            var values = field.type.args.map(function (arg) {
              var newValue = arg.replace(/'|"|`/g, '').trim();
              return {
                name: newValue
              };
            });
            var _enum = new _AST.Enum({
              name: "".concat(tableName, "_").concat(field.name, "_enum"),
              schemaName: schemaName,
              values: values
            });
            field.type.type_name = _enum.name;
            field.type.schemaName = _enum.schemaName;
            _this3.data.enums.push(_enum);
          }
          inlineRefs.forEach(function (inlineRef) {
            inlineRef.endpoints[0].tableName = tableName;
            inlineRef.endpoints[0].schemaName = schemaName;
            inlineRef.endpoints[0].fieldNames = [field.name];
          });
          return inlineRefs;
        });
        (_this$data$refs = this.data.refs).push.apply(_this$data$refs, _toConsumableArray((0, _lodash.flatten)(inlineRefsOfFields)));
        (_this$data$refs2 = this.data.refs).push.apply(_this$data$refs2, _toConsumableArray(tableRefs.map(function (tableRef) {
          tableRef.endpoints[0].tableName = tableName;
          tableRef.endpoints[0].schemaName = schemaName;
          return tableRef;
        })));
        var tableOptions = options.reduce(function (acc, option) {
          acc[option.kind] = option.value;
          return acc;
        }, {});
        var table = new _AST.Table(_objectSpread({
          name: tableName,
          schemaName: schemaName,
          fields: fieldsData.map(function (fd) {
            return fd.field;
          }),
          indexes: indexes
        }, tableOptions));
        if (singlePkIndex) {
          var field = table.fields.find(function (f) {
            return f.name === singlePkIndex.columns[0].value;
          });
          if (field) field.pk = true;
        }
        this.data.tables.push(table.toJSON());
      } else if (ctx.alterTable()) {
        ctx.alterTable().accept(this);
      } else if (ctx.createIndex()) {
        ctx.createIndex().accept(this);
      }
    }

    // createTable:
    // CREATE TEMPORARY? TABLE ifNotExists? tableName (LIKE tableName | '(' LIKE parenthesisTable = tableName ')') # copyCreateTable
    // | CREATE TEMPORARY? TABLE ifNotExists? tableName createDefinitions? (tableOption (','? tableOption)*)? partitionDefinitions? keyViolate = (IGNORE | REPLACE)? AS? selectStatement # queryCreateTable
    // | CREATE TEMPORARY? TABLE ifNotExists? tableName createDefinitions (tableOption (','? tableOption)*)? partitionDefinitions? # columnCreateTable
  }, {
    key: "visitCopyCreateTable",
    value: function visitCopyCreateTable() {
      // not supported
    }
  }, {
    key: "visitQueryCreateTable",
    value: function visitQueryCreateTable(ctx) {
      var _ctx$tableOption,
        _this4 = this;
      var names = ctx.tableName().accept(this);
      var _getTableNames = getTableNames(names),
        tableName = _getTableNames.tableName,
        schemaName = _getTableNames.schemaName;
      if (!ctx.createDefinitions()) return null;
      var definitions = ctx.createDefinitions().accept(this).filter(function (d) {
        return d === null || d === void 0 ? void 0 : d.kind;
      });
      var options = ((_ctx$tableOption = ctx.tableOption()) === null || _ctx$tableOption === void 0 ? void 0 : _ctx$tableOption.map(function (to) {
        return to.accept(_this4);
      }).filter(function (o) {
        return o === null || o === void 0 ? void 0 : o.kind;
      })) || [];
      return {
        tableName: tableName,
        schemaName: schemaName,
        definitions: definitions,
        options: options
      };
    }
  }, {
    key: "visitColumnCreateTable",
    value: function visitColumnCreateTable(ctx) {
      var _this5 = this;
      var names = ctx.tableName().accept(this);
      var _getTableNames2 = getTableNames(names),
        tableName = _getTableNames2.tableName,
        schemaName = _getTableNames2.schemaName;
      var definitions = ctx.createDefinitions().accept(this).filter(function (d) {
        return d === null || d === void 0 ? void 0 : d.kind;
      });
      var options = ctx.tableOption().map(function (to) {
        return to.accept(_this5);
      }).filter(function (o) {
        return o === null || o === void 0 ? void 0 : o.kind;
      });
      return {
        tableName: tableName,
        schemaName: schemaName,
        definitions: definitions,
        options: options
      };
    }

    // tableOption visits: check MySqlParser.g4 line 491.
    // Out of all these rules, We only care about tableOptionComment

    // COMMENT '='? STRING_LITERAL
  }, {
    key: "visitTableOptionComment",
    value: function visitTableOptionComment(ctx) {
      var quotedString = ctx.STRING_LITERAL().getText();
      return {
        kind: TABLE_OPTIONS_KIND.NOTE,
        value: {
          value: quotedString.slice(1, quotedString.length - 1)
        }
      };
    }

    // fullId
  }, {
    key: "visitTableName",
    value: function visitTableName(ctx) {
      return ctx.fullId().accept(this);
    }

    // uid (DOT_ID | '.' uid)?
  }, {
    key: "visitFullId",
    value: function visitFullId(ctx) {
      var _this6 = this;
      var names = ctx.uid().map(function (u) {
        return u.accept(_this6);
      });
      if (ctx.DOT_ID()) {
        // DOT_ID: '.' ID_LITERAL
        var text = ctx.DOT_ID().getText();
        names.push(text.slice(1));
      }
      return names;
    }

    // simpleId | CHARSET_REVERSE_QOUTE_STRING | STRING_LITERAL
  }, {
    key: "visitUid",
    value: function visitUid(ctx) {
      if (ctx.simpleId()) return ctx.simpleId().accept(this);

      // both CHARSET_REVERSE_QOUTE_STRING and STRING_LITERAL contain outside quotes like '...', "..." or `...`
      var quotedString = ctx.getChild(0).getText();
      return quotedString.slice(1, quotedString.length - 1);
    }

    // ID | charsetNameBase | transactionLevelBase | engineNameBase | privilegesBase
    // | intervalTypeBase | dataTypeBase | keywordsCanBeId | scalarFunctionName
  }, {
    key: "visitSimpleId",
    value: function visitSimpleId(ctx) {
      return ctx.getChild(0).getText();
    }

    // '(' createDefinition (',' createDefinition)* ')'
  }, {
    key: "visitCreateDefinitions",
    value: function visitCreateDefinitions(ctx) {
      var _this7 = this;
      return ctx.createDefinition().map(function (cd) {
        return cd.accept(_this7);
      });
    }

    // createDefinition:
    // fullColumnName columnDefinition # columnDeclaration
    // | tableConstraint NOT? ENFORCED?  # constraintDeclaration
    // | indexColumnDefinition           # indexDeclaration
  }, {
    key: "visitColumnDeclaration",
    value: function visitColumnDeclaration(ctx) {
      var names = ctx.fullColumnName().accept(this);
      var _getFieldNames = getFieldNames(names),
        fieldName = _getFieldNames.fieldName;
      var _ctx$columnDefinition = ctx.columnDefinition().accept(this),
        type = _ctx$columnDefinition.type,
        constraints = _ctx$columnDefinition.constraints;
      var field = new _AST.Field(_objectSpread({
        name: fieldName,
        type: type
      }, constraints));
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.FIELD,
        value: {
          field: field,
          inlineRefs: constraints.inlineRefs
        }
      };
    }
  }, {
    key: "visitConstraintDeclaration",
    value: function visitConstraintDeclaration(ctx) {
      return ctx.tableConstraint().accept(this);
    }
  }, {
    key: "visitIndexDeclaration",
    value: function visitIndexDeclaration(ctx) {
      return ctx.indexColumnDefinition().accept(this);
    }

    // uid (dottedId dottedId?)? | .? dottedId dottedId?
  }, {
    key: "visitFullColumnName",
    value: function visitFullColumnName(ctx) {
      var _this8 = this;
      var names = [];
      if (ctx.uid()) names.push(ctx.uid().accept(this));
      names.push.apply(names, _toConsumableArray(ctx.dottedId().map(function (dId) {
        return dId.accept(_this8);
      })));
      return names;
    }

    // DOT_ID | '.' uid
  }, {
    key: "visitDottedId",
    value: function visitDottedId(ctx) {
      if (ctx.DOT_ID()) {
        // DOT_ID: '.' ID_LITERAL
        var text = ctx.DOT_ID().getText();
        return text.slice(1);
      }
      return ctx.uid().accept(this);
    }

    // dataType columnConstraint* NOT? ENFORCED?
  }, {
    key: "visitColumnDefinition",
    value: function visitColumnDefinition(ctx) {
      var _this9 = this;
      var type = ctx.dataType().accept(this);
      var constraints = {
        inlineRefs: []
      };
      ctx.columnConstraint().forEach(function (c) {
        var constraint = c.accept(_this9);
        if (!constraint) return;
        if (constraint.kind === _constants.COLUMN_CONSTRAINT_KIND.INLINE_REF) {
          constraints.inlineRefs.push(constraint.value);
          return;
        }
        constraints[constraint.kind] = constraint.value;
      });
      return {
        type: type,
        constraints: constraints
      };
    }

    // dataType visits:
    // stringDataType | nationalVaryingStringDataType | nationalStringDataType | dimensionDataType | simpleDataType
    // | collectionDataType | spatialDataType | longVarcharDataType | longVarbinaryDataType

    // typeName = ( CHAR | CHARACTER | VARCHAR | TINYTEXT | TEXT | MEDIUMTEXT | LONGTEXT | NCHAR | NVARCHAR | LONG )
    // VARYING? lengthOneDimension? BINARY? (charSet charsetName)? (COLLATE collationName | BINARY)? # stringDataType
  }, {
    key: "visitStringDataType",
    value: function visitStringDataType(ctx) {
      var typeName = ctx.typeName.text;
      if (ctx.lengthOneDimension()) typeName += ctx.lengthOneDimension().getText();
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // NATIONAL typeName = (CHAR | CHARACTER) VARYING lengthOneDimension? BINARY?
  }, {
    key: "visitNationalVaryingStringDataType",
    value: function visitNationalVaryingStringDataType(ctx) {
      var typeName = ctx.typeName.text;
      if (ctx.lengthOneDimension()) typeName += ctx.lengthOneDimension().getText();
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // NATIONAL typeName = (VARCHAR | CHARACTER | CHAR) lengthOneDimension? BINARY?
    // | NCHAR typeName = VARCHAR lengthOneDimension? BINARY?
  }, {
    key: "visitNationalStringDataType",
    value: function visitNationalStringDataType(ctx) {
      var typeName = ctx.typeName.text;
      if (ctx.lengthOneDimension()) typeName += ctx.lengthOneDimension().getText();
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // typeName = (TINYINT | SMALLINT | MEDIUMINT | INT | INTEGER | BIGINT | MIDDLEINT | INT1 | INT2 | INT3 | INT4 | INT8) lengthOneDimension? (SIGNED | UNSIGNED | ZEROFILL)*
    // | typeName = REAL lengthTwoDimension? (SIGNED | UNSIGNED | ZEROFILL)*
    // | typeName = DOUBLE PRECISION? lengthTwoDimension? (SIGNED | UNSIGNED | ZEROFILL)*
    // | typeName = (DECIMAL | DEC | FIXED | NUMERIC | FLOAT | FLOAT4 | FLOAT8) lengthTwoOptionalDimension? (SIGNED | UNSIGNED | ZEROFILL)*
    // | typeName = (BIT | TIME | TIMESTAMP | DATETIME | BINARY | VARBINARY | BLOB | YEAR) lengthOneDimension?
  }, {
    key: "visitDimensionDataType",
    value: function visitDimensionDataType(ctx) {
      var typeName = ctx.typeName.text;
      if (ctx.lengthOneDimension()) typeName += ctx.lengthOneDimension().getText();
      if (ctx.lengthTwoDimension()) typeName += ctx.lengthTwoDimension().getText();
      if (ctx.lengthTwoOptionalDimension()) typeName += ctx.lengthTwoOptionalDimension().getText();
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // typeName = (DATE | TINYBLOB | MEDIUMBLOB | LONGBLOB | BOOL | BOOLEAN | SERIAL)
  }, {
    key: "visitSimpleDataType",
    value: function visitSimpleDataType(ctx) {
      var typeName = ctx.typeName.text;
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // typeName = (ENUM | SET) collectionOptions BINARY? (charSet charsetName)?
  }, {
    key: "visitCollectionDataType",
    value: function visitCollectionDataType(ctx) {
      if (ctx.SET()) {
        var _typeName = ctx.typeName.text + ctx.collectionOptions().getText();
        return {
          type_name: _typeName,
          schemaName: null
        };
      }
      var typeName = ctx.typeName.text;
      var args = ctx.collectionOptions().accept(this);
      return {
        type_name: typeName,
        args: args,
        schemaName: null
      };
    }

    // '(' STRING_LITERAL (',' STRING_LITERAL)* ')'
  }, {
    key: "visitCollectionOptions",
    value: function visitCollectionOptions(ctx) {
      return ctx.STRING_LITERAL().map(function (s) {
        return s.getText();
      });
    }

    // typeName = (GEOMETRYCOLLECTION | GEOMCOLLECTION | LINESTRING | MULTILINESTRING | MULTIPOINT | MULTIPOLYGON | POINT | POLYGON | JSON | GEOMETRY) (SRID decimalLiteral)?
  }, {
    key: "visitSpatialDataType",
    value: function visitSpatialDataType(ctx) {
      var typeName = ctx.typeName.text;
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // typeName = LONG VARCHAR? BINARY? (charSet charsetName)? (COLLATE collationName)?
  }, {
    key: "visitLongVarcharDataType",
    value: function visitLongVarcharDataType(ctx) {
      var typeName = ctx.typeName.text;
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // LONG VARBINARY
  }, {
    key: "visitLongVarbinaryDataType",
    value: function visitLongVarbinaryDataType(ctx) {
      var typeName = "".concat(ctx.LONG().getText(), " ").concat(ctx.VARBINARY().getText());
      return {
        type_name: typeName,
        schemaName: null
      };
    }

    // columnConstraint visits:
    //   : nullNotnull                                                   # nullColumnConstraint
    //   | DEFAULT defaultValue                                          # defaultColumnConstraint
    //   | VISIBLE                                                       # visibilityColumnConstraint
    //   | INVISIBLE                                                     # invisibilityColumnConstraint
    //   | (AUTO_INCREMENT | ON UPDATE currentTimestamp)                 # autoIncrementColumnConstraint
    //   | PRIMARY? KEY                                                  # primaryKeyColumnConstraint
    //   | UNIQUE KEY?                                                   # uniqueKeyColumnConstraint
    //   | COMMENT STRING_LITERAL                                        # commentColumnConstraint
    //   | COLUMN_FORMAT colformat = (FIXED | DYNAMIC | DEFAULT)         # formatColumnConstraint
    //   | STORAGE storageval = (DISK | MEMORY | DEFAULT)                # storageColumnConstraint
    //   | referenceDefinition                                           # referenceColumnConstraint
    //   | COLLATE collationName                                         # collateColumnConstraint
    //   | (GENERATED ALWAYS)? AS '(' expression ')' (VIRTUAL | STORED)? # generatedColumnConstraint
    //   | SERIAL DEFAULT VALUE                                          # serialDefaultColumnConstraint
    //   | (CONSTRAINT name = uid?)? CHECK '(' expression ')'            # checkColumnConstraint

    // nullColumnConstraint: nullNotnull
  }, {
    key: "visitNullColumnConstraint",
    value: function visitNullColumnConstraint(ctx) {
      return ctx.nullNotnull().accept(this);
    }

    // NOT? (NULL_LITERAL | NULL_SPEC_LITERAL)
  }, {
    key: "visitNullNotnull",
    value: function visitNullNotnull(ctx) {
      var notNull = false;
      if (ctx.NOT()) notNull = true;
      return {
        kind: _constants.COLUMN_CONSTRAINT_KIND.NOT_NULL,
        value: notNull
      };
    }

    // defaultColumnConstraint: DEFAULT defaultValue
  }, {
    key: "visitDefaultColumnConstraint",
    value: function visitDefaultColumnConstraint(ctx) {
      return {
        kind: _constants.COLUMN_CONSTRAINT_KIND.DEFAULT,
        value: ctx.defaultValue().accept(this)
      };
    }

    // autoIncrementColumnConstraint: (AUTO_INCREMENT | ON UPDATE currentTimestamp)
  }, {
    key: "visitAutoIncrementColumnConstraint",
    value: function visitAutoIncrementColumnConstraint(ctx) {
      if (ctx.AUTO_INCREMENT()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.INCREMENT,
          value: true
        };
      }
      return null;
    }

    // primaryKeyColumnConstraint: PRIMARY? KEY
  }, {
    key: "visitPrimaryKeyColumnConstraint",
    value: function visitPrimaryKeyColumnConstraint(ctx) {
      if (ctx.PRIMARY()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.PK,
          value: true
        };
      }
      return null;
    }

    // uniqueKeyColumnConstraint: UNIQUE KEY?
  }, {
    key: "visitUniqueKeyColumnConstraint",
    value: function visitUniqueKeyColumnConstraint() {
      return {
        kind: _constants.COLUMN_CONSTRAINT_KIND.UNIQUE,
        value: true
      };
    }

    // commentColumnConstraint: COMMENT STRING_LITERAL
  }, {
    key: "visitCommentColumnConstraint",
    value: function visitCommentColumnConstraint(ctx) {
      var quotedString = ctx.STRING_LITERAL().getText();
      return {
        kind: _constants.COLUMN_CONSTRAINT_KIND.NOTE,
        value: {
          value: quotedString.slice(1, quotedString.length - 1)
        }
      };
    }

    // referenceColumnConstraint: referenceDefinition
  }, {
    key: "visitReferenceColumnConstraint",
    value: function visitReferenceColumnConstraint(ctx) {
      var value = ctx.referenceDefinition().accept(this);
      return {
        kind: _constants.COLUMN_CONSTRAINT_KIND.INLINE_REF,
        value: value
      };
    }

    // NULL_LITERAL | CAST '(' expression AS convertedDataType ')' | unaryOperator? constant
    // | currentTimestamp (ON UPDATE currentTimestamp)? | '(' expression ')' | '(' fullId ')'
  }, {
    key: "visitDefaultValue",
    value: function visitDefaultValue(ctx) {
      var _ctx$currentTimestamp;
      if (ctx.NULL_LITERAL()) {
        return {
          value: ctx.NULL_LITERAL().getText(),
          type: _constants.DATA_TYPE.BOOLEAN // same behavior as the legacy parser
        };
      }
      if (ctx.expression()) {
        return {
          value: ctx.expression().getText(),
          type: _constants.DATA_TYPE.EXPRESSION
        };
      }
      if (ctx.constant()) {
        if (ctx.unaryOperator()) {
          return {
            value: ctx.getText(),
            type: _constants.DATA_TYPE.EXPRESSION
          };
        }
        var _ctx$constant$accept = ctx.constant().accept(this),
          value = _ctx$constant$accept.value,
          type = _ctx$constant$accept.type;
        return {
          value: value,
          type: type
        };
      }
      if ((_ctx$currentTimestamp = ctx.currentTimestamp()) !== null && _ctx$currentTimestamp !== void 0 && _ctx$currentTimestamp.length) {
        return {
          value: ctx.currentTimestamp()[0].getText(),
          type: _constants.DATA_TYPE.EXPRESSION
        };
      }
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // stringLiteral | decimalLiteral | '-' decimalLiteral | hexadecimalLiteral | booleanLiteral
    // | REAL_LITERAL | BIT_STRING | NOT? nullLiteral = (NULL_LITERAL | NULL_SPEC_LITERAL)
  }, {
    key: "visitConstant",
    value: function visitConstant(ctx) {
      if (ctx.stringLiteral()) {
        var quotedString = ctx.stringLiteral().getText();
        return {
          value: quotedString.slice(1, quotedString.length - 1),
          type: _constants.DATA_TYPE.STRING
        };
      }
      if (ctx.decimalLiteral()) {
        if (ctx.getChildCount() > 1) {
          return {
            value: ctx.getText(),
            type: _constants.DATA_TYPE.EXPRESSION
          };
        }
        return {
          value: ctx.decimalLiteral().getText(),
          type: _constants.DATA_TYPE.NUMBER
        };
      }
      if (ctx.hexadecimalLiteral()) {
        return {
          value: ctx.hexadecimalLiteral().getText(),
          type: _constants.DATA_TYPE.NUMBER
        };
      }
      if (ctx.booleanLiteral()) {
        return {
          value: ctx.booleanLiteral().getText(),
          type: _constants.DATA_TYPE.BOOLEAN
        };
      }
      if (ctx.REAL_LITERAL()) {
        return {
          value: ctx.REAL_LITERAL().getText(),
          type: _constants.DATA_TYPE.NUMBER
        };
      }
      if (ctx.BIT_STRING()) {
        return {
          value: ctx.BIT_STRING().getText(),
          type: _constants.DATA_TYPE.STRING
        };
      }
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.STRING
      };
    }

    // REFERENCES tableName indexColumnNames? (MATCH matchType = (FULL | PARTIAL | SIMPLE))? referenceAction?
  }, {
    key: "visitReferenceDefinition",
    value: function visitReferenceDefinition(ctx) {
      var _ctx$referenceAction;
      var names = ctx.tableName().accept(this);
      var _getTableNames3 = getTableNames(names),
        tableName = _getTableNames3.tableName,
        schemaName = _getTableNames3.schemaName;
      if (!ctx.indexColumnNames()) return null;
      var actions = ((_ctx$referenceAction = ctx.referenceAction()) === null || _ctx$referenceAction === void 0 ? void 0 : _ctx$referenceAction.accept(this)) || {};
      var fieldNames = ctx.indexColumnNames().accept(this).map(function (icn) {
        return icn.value;
      });
      var endpoint0 = new _AST.Endpoint({
        tableName: null,
        schemaName: null,
        fieldNames: null,
        relation: '*'
      });
      var endpoint1 = new _AST.Endpoint({
        tableName: tableName,
        schemaName: schemaName,
        fieldNames: fieldNames,
        relation: '1'
      });
      return new _AST.Ref({
        endpoints: [endpoint0, endpoint1],
        onUpdate: actions.onUpdate,
        onDelete: actions.onDelete
      });
    }

    // '(' indexColumnName (',' indexColumnName)* ')'
  }, {
    key: "visitIndexColumnNames",
    value: function visitIndexColumnNames(ctx) {
      var _this0 = this;
      return ctx.indexColumnName().map(function (indexColumnName) {
        return indexColumnName.accept(_this0);
      });
    }

    // ((uid | STRING_LITERAL) ('(' decimalLiteral ')')? | expression) sortType = (ASC | DESC)?
  }, {
    key: "visitIndexColumnName",
    value: function visitIndexColumnName(ctx) {
      if (ctx.uid()) {
        return {
          type: _constants.CONSTRAINT_TYPE.COLUMN,
          value: ctx.uid().accept(this)
        };
      }
      if (ctx.STRING_LITERAL()) {
        var quotedString = ctx.STRING_LITERAL().getText();
        return {
          type: _constants.CONSTRAINT_TYPE.STRING,
          value: quotedString.slice(1, quotedString.length - 1)
        };
      }
      return {
        type: _constants.CONSTRAINT_TYPE.EXPRESSION,
        value: ctx.expression().getText()
      };
    }

    // ON DELETE onDelete = referenceControlType (ON UPDATE onUpdate = referenceControlType)?
    // | ON UPDATE onUpdate = referenceControlType (ON DELETE onDelete = referenceControlType)?
  }, {
    key: "visitReferenceAction",
    value: function visitReferenceAction(ctx) {
      var _ctx$onDelete, _ctx$onUpdate;
      var r = {};
      r.onDelete = (_ctx$onDelete = ctx.onDelete) === null || _ctx$onDelete === void 0 ? void 0 : _ctx$onDelete.accept(this);
      r.onUpdate = (_ctx$onUpdate = ctx.onUpdate) === null || _ctx$onUpdate === void 0 ? void 0 : _ctx$onUpdate.accept(this);
      return r;
    }

    // RESTRICT | CASCADE  | SET NULL_LITERAL | NO ACTION | SET DEFAULT
  }, {
    key: "visitReferenceControlType",
    value: function visitReferenceControlType(ctx) {
      var childIndices = _toConsumableArray(Array(ctx.getChildCount()).keys());
      var text = childIndices.reduce(function (acc, i) {
        return "".concat(acc).concat(ctx.getChild(i).getText(), " ");
      }, '');
      return text.slice(0, text.length - 1); // remove the last whitespace
    }

    // tableConstraint:
    // (CONSTRAINT name = uid?)? PRIMARY KEY index = uid? indexType? indexColumnNames indexOption*                         # primaryKeyTableConstraint
    // | (CONSTRAINT name = uid?)? UNIQUE indexFormat = (INDEX | KEY)? index = uid? indexType? indexColumnNames indexOption* # uniqueKeyTableConstraint
    // | (CONSTRAINT name = uid?)? FOREIGN KEY index = uid? indexColumnNames referenceDefinition                             # foreignKeyTableConstraint
    // | (CONSTRAINT name = uid?)? CHECK '(' expression ')'                                                                  # checkTableConstraint

    // Note: In MySQL 8.0.16 and higher, 'index' is ignored. For maximum compability, we use both 'name' and 'index' for naming index
    // https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html
  }, {
    key: "visitPrimaryKeyTableConstraint",
    value: function visitPrimaryKeyTableConstraint(ctx) {
      var _ctx$name,
        _ctx$index,
        _ctx$indexType,
        _ctx$indexOption,
        _this1 = this;
      var name = ((_ctx$name = ctx.name) === null || _ctx$name === void 0 ? void 0 : _ctx$name.accept(this)) || ((_ctx$index = ctx.index) === null || _ctx$index === void 0 ? void 0 : _ctx$index.accept(this));
      var type = (_ctx$indexType = ctx.indexType()) === null || _ctx$indexType === void 0 ? void 0 : _ctx$indexType.accept(this);
      if ((_ctx$indexOption = ctx.indexOption()) !== null && _ctx$indexOption !== void 0 && _ctx$indexOption.length) {
        var indexOptions = ctx.indexOption().map(function (io) {
          return io.accept(_this1);
        });
        var typeOption = indexOptions.find(function (io) {
          return (io === null || io === void 0 ? void 0 : io.kind) === INDEX_OPTION_KIND.TYPE;
        });
        if (typeOption) type = typeOption.value;
      }
      var columns = ctx.indexColumnNames().accept(this);
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.PK,
        value: new _AST.Index({
          name: name,
          pk: true,
          columns: columns,
          type: type
        })
      };
    }
  }, {
    key: "visitUniqueKeyTableConstraint",
    value: function visitUniqueKeyTableConstraint(ctx) {
      var _ctx$name2,
        _ctx$index2,
        _ctx$indexType2,
        _ctx$indexOption2,
        _this10 = this;
      var name = ((_ctx$name2 = ctx.name) === null || _ctx$name2 === void 0 ? void 0 : _ctx$name2.accept(this)) || ((_ctx$index2 = ctx.index) === null || _ctx$index2 === void 0 ? void 0 : _ctx$index2.accept(this));
      var type = (_ctx$indexType2 = ctx.indexType()) === null || _ctx$indexType2 === void 0 ? void 0 : _ctx$indexType2.accept(this);
      if ((_ctx$indexOption2 = ctx.indexOption()) !== null && _ctx$indexOption2 !== void 0 && _ctx$indexOption2.length) {
        var indexOptions = ctx.indexOption().map(function (io) {
          return io.accept(_this10);
        });
        var typeOption = indexOptions.find(function (io) {
          return (io === null || io === void 0 ? void 0 : io.kind) === INDEX_OPTION_KIND.TYPE;
        });
        if (typeOption) type = typeOption.value;
      }
      var columns = ctx.indexColumnNames().accept(this);
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.UNIQUE,
        value: new _AST.Index({
          name: name,
          unique: true,
          columns: columns,
          type: type
        })
      };
    }
  }, {
    key: "visitForeignKeyTableConstraint",
    value: function visitForeignKeyTableConstraint(ctx) {
      var _ctx$name3, _ctx$index3;
      var ref = ctx.referenceDefinition().accept(this);
      ref.name = ((_ctx$name3 = ctx.name) === null || _ctx$name3 === void 0 ? void 0 : _ctx$name3.accept(this)) || ((_ctx$index3 = ctx.index) === null || _ctx$index3 === void 0 ? void 0 : _ctx$index3.accept(this));
      ref.endpoints[0].fieldNames = ctx.indexColumnNames().accept(this).map(function (icn) {
        return icn.value;
      });
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.FK,
        value: ref
      };
    }
  }, {
    key: "visitCheckTableConstraint",
    value: function visitCheckTableConstraint() {
      // ignored
    }

    // USING (BTREE | HASH)
  }, {
    key: "visitIndexType",
    value: function visitIndexType(ctx) {
      return ctx.getChild(1).getText();
    }

    // KEY_BLOCK_SIZE EQUAL_SYMBOL? fileSizeLiteral | indexType | WITH PARSER uid | COMMENT STRING_LITERAL | (VISIBLE | INVISIBLE)
    // | ENGINE_ATTRIBUTE EQUAL_SYMBOL? STRING_LITERAL | SECONDARY_ENGINE_ATTRIBUTE EQUAL_SYMBOL? STRING_LITERAL
  }, {
    key: "visitIndexOption",
    value: function visitIndexOption(ctx) {
      if (ctx.indexType()) {
        return {
          kind: INDEX_OPTION_KIND.TYPE,
          value: ctx.indexType().accept(this)
        };
      }
      return null;
    }

    // indexColumnDefinition:
    // indexFormat = (INDEX | KEY) uid? indexType? indexColumnNames indexOption*            # simpleIndexDeclaration
    // | (FULLTEXT | SPATIAL) indexFormat = (INDEX | KEY)? uid? indexColumnNames indexOption* # specialIndexDeclaration
  }, {
    key: "visitSimpleIndexDeclaration",
    value: function visitSimpleIndexDeclaration(ctx) {
      var _ctx$uid,
        _ctx$indexType3,
        _ctx$indexOption3,
        _this11 = this;
      var name = (_ctx$uid = ctx.uid()) === null || _ctx$uid === void 0 ? void 0 : _ctx$uid.accept(this);
      var type = (_ctx$indexType3 = ctx.indexType()) === null || _ctx$indexType3 === void 0 ? void 0 : _ctx$indexType3.accept(this);
      if ((_ctx$indexOption3 = ctx.indexOption()) !== null && _ctx$indexOption3 !== void 0 && _ctx$indexOption3.length) {
        var indexOptions = ctx.indexOption().map(function (io) {
          return io.accept(_this11);
        });
        var typeOption = indexOptions.find(function (io) {
          return (io === null || io === void 0 ? void 0 : io.kind) === INDEX_OPTION_KIND.TYPE;
        });
        if (typeOption) type = typeOption.value;
      }
      var columns = ctx.indexColumnNames().accept(this);
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.INDEX,
        value: new _AST.Index({
          name: name,
          columns: columns,
          type: type
        })
      };
    }
  }, {
    key: "visitSpecialIndexDeclaration",
    value: function visitSpecialIndexDeclaration(ctx) {
      var _ctx$uid2,
        _ctx$indexOption4,
        _this12 = this;
      var name = (_ctx$uid2 = ctx.uid()) === null || _ctx$uid2 === void 0 ? void 0 : _ctx$uid2.accept(this);
      var type = null;
      if ((_ctx$indexOption4 = ctx.indexOption()) !== null && _ctx$indexOption4 !== void 0 && _ctx$indexOption4.length) {
        var indexOptions = ctx.indexOption().map(function (io) {
          return io.accept(_this12);
        });
        var typeOption = indexOptions.find(function (io) {
          return (io === null || io === void 0 ? void 0 : io.kind) === INDEX_OPTION_KIND.TYPE;
        });
        if (typeOption) type = typeOption.value;
      }
      var columns = ctx.indexColumnNames().accept(this);
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.INDEX,
        value: new _AST.Index({
          name: name,
          columns: columns,
          type: type
        })
      };
    }

    // ALTER intimeAction = (ONLINE | OFFLINE)? IGNORE? TABLE tableName waitNowaitClause? (alterSpecification (',' alterSpecification)*)? partitionDefinitions?
  }, {
    key: "visitAlterTable",
    value: function visitAlterTable(ctx) {
      var _ctx$alterSpecificati,
        _this13 = this;
      var names = ctx.tableName().accept(this);
      var _getTableNames4 = getTableNames(names),
        tableName = _getTableNames4.tableName,
        schemaName = _getTableNames4.schemaName;

      /** @type {Table} */
      var table = this.findTable(schemaName, tableName);
      if (!table) return;
      var alterSpecs = ((_ctx$alterSpecificati = ctx.alterSpecification()) === null || _ctx$alterSpecificati === void 0 ? void 0 : _ctx$alterSpecificati.map(function (spec) {
        return spec.accept(_this13);
      }).filter(function (spec) {
        return spec === null || spec === void 0 ? void 0 : spec.kind;
      })) || [];
      alterSpecs.forEach(function (alter) {
        if (alter.kind === ALTER_KIND.ADD_PK) {
          /** @type {Index} */
          var index = alter.value;
          if (index.columns.length > 1) return table.indexes.push(index);
          var field = table.fields.find(function (f) {
            return f.name === index.columns[0].value;
          });
          field.pk = true;
        } else if (alter.kind === ALTER_KIND.ADD_FK) {
          /** @type {Ref} */
          var ref = alter.value;
          ref.endpoints[0].schemaName = schemaName;
          ref.endpoints[0].tableName = tableName;
          _this13.data.refs.push(ref);
        }
        return null;
      });
    }

    // alterSpecification: for full rules breakdown check MySqlParser.g4 line 660.
    // The list below only containt alterSpecification rules that we will supported (should have same behaviors as the legacy parser):
    // alterByAddPrimaryKey | alterByAddForeignKey

    // ADD (CONSTRAINT name = uid?)? PRIMARY KEY index = uid? indexType? indexColumnNames indexOption*
  }, {
    key: "visitAlterByAddPrimaryKey",
    value: function visitAlterByAddPrimaryKey(ctx) {
      var _ctx$name4,
        _ctx$index4,
        _ctx$indexType4,
        _ctx$indexOption5,
        _this14 = this;
      var name = ((_ctx$name4 = ctx.name) === null || _ctx$name4 === void 0 ? void 0 : _ctx$name4.accept(this)) || ((_ctx$index4 = ctx.index) === null || _ctx$index4 === void 0 ? void 0 : _ctx$index4.accept(this));
      var type = (_ctx$indexType4 = ctx.indexType()) === null || _ctx$indexType4 === void 0 ? void 0 : _ctx$indexType4.accept(this);
      if ((_ctx$indexOption5 = ctx.indexOption()) !== null && _ctx$indexOption5 !== void 0 && _ctx$indexOption5.length) {
        var indexOptions = ctx.indexOption().map(function (io) {
          return io.accept(_this14);
        });
        var typeOption = indexOptions.find(function (io) {
          return (io === null || io === void 0 ? void 0 : io.kind) === INDEX_OPTION_KIND.TYPE;
        });
        if (typeOption) type = typeOption.value;
      }
      var columns = ctx.indexColumnNames().accept(this);
      return {
        kind: ALTER_KIND.ADD_PK,
        value: new _AST.Index({
          name: name,
          pk: true,
          columns: columns,
          type: type
        })
      };
    }

    // ADD (CONSTRAINT name = uid?)? FOREIGN KEY indexName = uid? indexColumnNames referenceDefinition
  }, {
    key: "visitAlterByAddForeignKey",
    value: function visitAlterByAddForeignKey(ctx) {
      var _ctx$name5, _ctx$index5;
      var ref = ctx.referenceDefinition().accept(this);
      ref.name = ((_ctx$name5 = ctx.name) === null || _ctx$name5 === void 0 ? void 0 : _ctx$name5.accept(this)) || ((_ctx$index5 = ctx.index) === null || _ctx$index5 === void 0 ? void 0 : _ctx$index5.accept(this));
      ref.endpoints[0].fieldNames = ctx.indexColumnNames().accept(this).map(function (icn) {
        return icn.value;
      });
      return {
        kind: ALTER_KIND.ADD_FK,
        value: ref
      };
    }

    // CREATE intimeAction = (ONLINE | OFFLINE)? indexCategory = (UNIQUE | FULLTEXT | SPATIAL)? INDEX uid indexType? ON tableName indexColumnNames
    // indexOption* (ALGORITHM EQUAL_SYMBOL? algType = (DEFAULT | INPLACE | COPY) | LOCK EQUAL_SYMBOL? lockType = (DEFAULT | NONE | SHARED | EXCLUSIVE))*
  }, {
    key: "visitCreateIndex",
    value: function visitCreateIndex(ctx) {
      var _ctx$indexType5,
        _ctx$indexOption6,
        _this15 = this;
      var tableNames = ctx.tableName().accept(this);
      var _getTableNames5 = getTableNames(tableNames),
        tableName = _getTableNames5.tableName,
        schemaName = _getTableNames5.schemaName;
      var table = this.findTable(schemaName, tableName);
      if (!table) return;
      var name = ctx.uid().accept(this);
      var type = (_ctx$indexType5 = ctx.indexType()) === null || _ctx$indexType5 === void 0 ? void 0 : _ctx$indexType5.accept(this);
      if ((_ctx$indexOption6 = ctx.indexOption()) !== null && _ctx$indexOption6 !== void 0 && _ctx$indexOption6.length) {
        var indexOptions = ctx.indexOption().map(function (io) {
          return io.accept(_this15);
        });
        var typeOption = indexOptions.find(function (io) {
          return (io === null || io === void 0 ? void 0 : io.kind) === INDEX_OPTION_KIND.TYPE;
        });
        if (typeOption) type = typeOption.value;
      }
      var columns = ctx.indexColumnNames().accept(this);
      var index = new _AST.Index({
        name: name,
        columns: columns,
        unique: !!ctx.UNIQUE(),
        type: type
      });
      table.indexes.push(index);
    }

    // dmlStatement
    //   : selectStatement | insertStatement | updateStatement | deleteStatement | replaceStatement |
    // callStatement | loadDataStatement | loadXmlStatement | doStatement | handlerStatement | valuesStatement | withStatement | tableStatement ;
  }, {
    key: "visitDmlStatement",
    value: function visitDmlStatement(ctx) {
      if (ctx.insertStatement()) {
        ctx.insertStatement().accept(this);
      }
    }

    // insertStatement
    //   : INSERT priority = (LOW_PRIORITY | DELAYED | HIGH_PRIORITY)? IGNORE? INTO? tableName (
    //       PARTITION '(' partitions = uidList? ')'
    //   )? (
    //       ('(' columns = fullColumnNameList? ')')? insertStatementValue (AS? uid)?
    //       | SET setFirst = updatedElement (',' setElements += updatedElement)*
    //   ) (
    //       ON DUPLICATE KEY UPDATE duplicatedFirst = updatedElement (
    //           ',' duplicatedElements += updatedElement
    //       )*
    //   )?
    //   ;
  }, {
    key: "visitInsertStatement",
    value: function visitInsertStatement(ctx) {
      var names = ctx.tableName().accept(this);
      var tableName = (0, _lodash.last)(names);
      var schemaName = names.length > 1 ? names[names.length - 2] : undefined;

      // insert without specified columns
      var columns = ctx.fullColumnNameList() ? ctx.fullColumnNameList().accept(this) : [];
      var values = ctx.insertStatementValue().accept(this);
      var record = new _AST.TableRecord({
        schemaName: schemaName,
        tableName: tableName,
        columns: columns,
        values: values
      });
      this.data.records.push(record);
    }

    // fullColumnNameList
    //   : fullColumnName (',' fullColumnName)*
    //   ;
  }, {
    key: "visitFullColumnNameList",
    value: function visitFullColumnNameList(ctx) {
      var _this16 = this;
      // [ [ 'id' ], [ 'name' ], [ 'email' ], [ 'created_at' ] ]
      var columns = ctx.fullColumnName().map(function (fullColumn) {
        return fullColumn.accept(_this16);
      });
      return (0, _lodash.flattenDepth)(columns, 1);
    }

    // insertStatementValue
    //   : selectStatement
    //   | insertFormat = (VALUES | VALUE) '(' expressionsWithDefaults? ')' (
    //       ',' '(' expressionsWithDefaults? ')'
    //   )*
    //   ;
  }, {
    key: "visitInsertStatementValue",
    value: function visitInsertStatementValue(ctx) {
      var _this17 = this;
      return ctx.expressionsWithDefaults().map(function (expression) {
        // [
        //   [ { value: '1', type: 'number' } ],
        //   [ { value: 'Alice', type: 'string' } ],
        //   [ { value: 'alice@host', type: 'string' } ],
        //   [ { value: '2021-01-01', type: 'string' } ],
        //   [ { value: '2021-01-01', type: 'string' } ],
        // ]
        var rowValues = expression.accept(_this17);
        return (0, _lodash.flattenDepth)(rowValues, 1);
      });
    }

    // expressionsWithDefaults
    //   : expressionOrDefault (',' expressionOrDefault)*
    //   ;
  }, {
    key: "visitExpressionsWithDefaults",
    value: function visitExpressionsWithDefaults(ctx) {
      var _this18 = this;
      return ctx.expressionOrDefault().map(function (expressionOrDefault) {
        var rawValues = expressionOrDefault.accept(_this18);

        // We get the value of the column (constantExpressionAtom or functionCallExpressionAtom) through:
        // expression->predicate->expressionAtom
        var FLATTEN_DEPTH = 3;
        var rawColumnValues = (0, _lodash.flattenDepth)(rawValues, FLATTEN_DEPTH);
        // [ { value: '["555-1234", "555-5678"]', type: 'string' } ]
        return rawColumnValues;
      });
    }

    // predicate
    //   : predicate NOT? IN '(' (selectStatement | expressions) ')'                            # inPredicate
    //   | predicate IS nullNotnull                                                             # isNullPredicate
    //   | left = predicate comparisonOperator right = predicate                                # binaryComparisonPredicate
    //   | predicate comparisonOperator quantifier = (ALL | ANY | SOME) '(' selectStatement ')' # subqueryComparisonPredicate
    //   | predicate NOT? BETWEEN predicate AND predicate                                       # betweenPredicate
    //   | predicate SOUNDS LIKE predicate                                                      # soundsLikePredicate
    //   | predicate NOT? LIKE predicate (ESCAPE STRING_LITERAL)?                               # likePredicate
    //   | predicate NOT? regex = (REGEXP | RLIKE) predicate                                    # regexpPredicate
    //   | predicate MEMBER OF '(' predicate ')'                                                # jsonMemberOfPredicate
    //   | expressionAtom                                                                       # expressionAtomPredicate
    //   ;

    // expressionAtom
    //   : constant                                                  # constantExpressionAtom
    //   | fullColumnName                                            # fullColumnNameExpressionAtom
    //   | functionCall                                              # functionCallExpressionAtom
    //   | expressionAtom COLLATE collationName                      # collateExpressionAtom
    //   | mysqlVariable                                             # mysqlVariableExpressionAtom
    //   | unaryOperator expressionAtom                              # unaryExpressionAtom
    //   | BINARY expressionAtom                                     # binaryExpressionAtom
    //   | LOCAL_ID VAR_ASSIGN expressionAtom                        # variableAssignExpressionAtom
    //   | '(' expression (',' expression)* ')'                      # nestedExpressionAtom
    //   | ROW '(' expression (',' expression)+ ')'                  # nestedRowExpressionAtom
    //   | EXISTS '(' selectStatement ')'                            # existsExpressionAtom
    //   | '(' selectStatement ')'                                   # subqueryExpressionAtom
    //   | INTERVAL expression intervalType                          # intervalExpressionAtom
    //   | left = expressionAtom bitOperator right = expressionAtom  # bitExpressionAtom
    //   | left = expressionAtom multOperator right = expressionAtom # mathExpressionAtom
    //   | left = expressionAtom addOperator right = expressionAtom  # mathExpressionAtom
    //   | left = expressionAtom jsonOperator right = expressionAtom # jsonExpressionAtom
    //   ;

    // functionCall
    //   : specificFunction                         # specificFunctionCall
    //   | aggregateWindowedFunction                # aggregateFunctionCall
    //   | nonAggregateWindowedFunction             # nonAggregateFunctionCall
    //   | scalarFunctionName '(' functionArgs? ')' # scalarFunctionCall
    //   | fullId '(' functionArgs? ')'             # udfFunctionCall
    //   | passwordFunctionClause                   # passwordFunctionCall
    //   ;
  }, {
    key: "visitFunctionCallExpressionAtom",
    value: function visitFunctionCallExpressionAtom(ctx) {
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }
  }]);
}(_MySqlParserVisitor["default"]);