"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _SnowflakeParserVisitor = _interopRequireDefault(require("../../parsers/snowflake/SnowflakeParserVisitor"));
var _AST = require("../AST");
var _constants = require("../constants");
var _helpers = require("../helpers");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
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
var sanitizeComment = function sanitizeComment(stringContext) {
  return (0, _helpers.getOriginalText)(stringContext).replace(/''/g, "'").slice(1, -1);
};
var SnowflakeASTGen = exports["default"] = /*#__PURE__*/function (_SnowflakeParserVisit) {
  function SnowflakeASTGen() {
    var _this;
    _classCallCheck(this, SnowflakeASTGen);
    _this = _callSuper(this, SnowflakeASTGen);
    _this.data = {
      schemas: [],
      tables: [],
      refs: [],
      enums: [],
      tableGroups: [],
      aliases: [],
      project: {}
    };
    return _this;
  }

  // batch? EOF
  _inherits(SnowflakeASTGen, _SnowflakeParserVisit);
  return _createClass(SnowflakeASTGen, [{
    key: "visitSnowflake_file",
    value: function visitSnowflake_file(ctx) {
      var _ctx$batch;
      (_ctx$batch = ctx.batch()) === null || _ctx$batch === void 0 || _ctx$batch.accept(this);
      return this.data;
    }

    // sql_command (SEMI sql_command)* SEMI?
  }, {
    key: "visitBatch",
    value: function visitBatch(ctx) {
      var _this2 = this;
      ctx.sql_command().forEach(function (c) {
        c.accept(_this2);
      });
    }

    // ddl_command | dml_command | show_command | use_command | describe_command | other_command
  }, {
    key: "visitSql_command",
    value: function visitSql_command(ctx) {
      if (ctx.ddl_command()) {
        ctx.ddl_command().accept(this);
      }
    }

    // alter_command | create_command | drop_command | undrop_command
  }, {
    key: "visitDdl_command",
    value: function visitDdl_command(ctx) {
      if (ctx.alter_command()) {
        ctx.alter_command().accept(this);
      } else if (ctx.create_command()) {
        ctx.create_command().accept(this);
      }
    }

    // check SnowflakeParser.g4 line 1442
  }, {
    key: "visitCreate_command",
    value: function visitCreate_command(ctx) {
      if (ctx.create_table()) {
        var table = ctx.create_table().accept(this);
        this.data.tables.push(table);
      } else if (ctx.create_table_like()) {
        var _ctx$create_table_lik = ctx.create_table_like().accept(this),
          _ctx$create_table_lik2 = _slicedToArray(_ctx$create_table_lik, 4),
          schemaNameLike = _ctx$create_table_lik2[0],
          nameLike = _ctx$create_table_lik2[1],
          schemaNameOrigin = _ctx$create_table_lik2[2],
          nameOrigin = _ctx$create_table_lik2[3];
        var originTable = this.data.tables.reduce(function (acc, ele) {
          if (ele.name === nameOrigin && ele.schemaName === schemaNameOrigin) return ele;
          return acc;
        }, null);
        if (originTable) {
          var likeTable = new _AST.Table({
            name: nameLike,
            schemaName: schemaNameLike,
            fields: originTable.fields
          });
          this.data.tables.push(likeTable);
        }
      }
    }

    // : CREATE or_replace? TRANSIENT? DATABASE if_not_exists? id_ clone_at_before? (
    //     DATA_RETENTION_TIME_IN_DAYS EQ num
    // )? (MAX_DATA_EXTENSION_TIME_IN_DAYS EQ num)? default_ddl_collation? with_tags? comment_clause?
    // ;
  }, {
    key: "visitCreate_database",
    value: function visitCreate_database(ctx) {
      var schema = (0, _helpers.getOriginalText)(ctx.object_name());
      this.data.schemas.push(schema);
    }

    // CREATE or_replace? table_type? TABLE (
    //   if_not_exists? object_name
    //   | object_name if_not_exists?
    // ) ((comment_clause? create_table_clause) | (create_table_clause comment_clause?))
  }, {
    key: "visitCreate_table",
    value: function visitCreate_table(ctx) {
      var _ctx$comment_clause,
        _this3 = this,
        _this$data$refs,
        _this$data$refs2;
      var _ctx$object_name$acce = ctx.object_name().accept(this),
        _ctx$object_name$acce2 = _slicedToArray(_ctx$object_name$acce, 3),
        databaseName = _ctx$object_name$acce2[0],
        schemaName = _ctx$object_name$acce2[1],
        tableName = _ctx$object_name$acce2[2];
      var _ctx$create_table_cla = ctx.create_table_clause().accept(this),
        definitions = _ctx$create_table_cla.definitions,
        tableNote = _ctx$create_table_cla.tableNote;
      var note = ((_ctx$comment_clause = ctx.comment_clause()) === null || _ctx$comment_clause === void 0 ? void 0 : _ctx$comment_clause.accept(this)) || tableNote;
      var _definitions$reduce = definitions.reduce(function (acc, ele) {
          if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.FIELD) acc[0].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.UNIQUE) acc[1].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.FK) acc[2].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.PK) {
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
          var _values = field.type.args.map(function (arg) {
            var newValue = arg.replace(/'|"|`/g, '').trim();
            return {
              name: newValue
            };
          });
          var _enum = new _AST.Enum({
            name: "".concat(tableName, "_").concat(field.name, "_enum"),
            schemaName: schemaName,
            values: _values
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
      var table = new _AST.Table({
        name: tableName,
        schemaName: schemaName,
        fields: fieldsData.map(function (fd) {
          return fd.field;
        }),
        indexes: indexes,
        note: note
      });
      if (singlePkIndex) {
        var field = table.fields.find(function (f) {
          return f.name === singlePkIndex.columns[0].value;
        });
        if (field) field.pk = true;
      }
      return table;
    }

    // : ALTER TABLE if_exists? object_name RENAME TO object_name
    // | ALTER TABLE if_exists? object_name SWAP WITH object_name
    // | ALTER TABLE if_exists? object_name (
    //     clustering_action
    //     | table_column_action
    //     | constraint_action
    // )
    // | ALTER TABLE if_exists? object_name ext_table_column_action
    // | ALTER TABLE if_exists? object_name search_optimization_action
    // | ALTER TABLE if_exists? object_name SET stage_file_format? (
    //     STAGE_COPY_OPTIONS EQ '(' copy_options ')'
    // )? (DATA_RETENTION_TIME_IN_DAYS EQ num)? (MAX_DATA_EXTENSION_TIME_IN_DAYS EQ num)? (
    //     CHANGE_TRACKING EQ true_false
    // )? default_ddl_collation? comment_clause?
    // | ALTER TABLE if_exists? object_name set_tags
    // | ALTER TABLE if_exists? object_name unset_tags
    // | ALTER TABLE if_exists? object_name UNSET (
    //     DATA_RETENTION_TIME_IN_DAYS
    //     | MAX_DATA_EXTENSION_TIME_IN_DAYS
    //     | CHANGE_TRACKING
    //     | DEFAULT_DDL_COLLATION_
    //     | COMMENT
    //     |
    // )
    // //[ , ... ]
    // | ALTER TABLE if_exists? object_name ADD ROW ACCESS POLICY id_ ON column_list_in_parentheses
    // | ALTER TABLE if_exists? object_name DROP ROW ACCESS POLICY id_
    // | ALTER TABLE if_exists? object_name DROP ROW ACCESS POLICY id_ COMMA ADD ROW ACCESS POLICY id_ ON column_list_in_parentheses
    // | ALTER TABLE if_exists? object_name DROP ALL ROW ACCESS POLICIES
  }, {
    key: "visitAlter_table",
    value: function visitAlter_table(ctx) {
      if (ctx.constraint_action()) {
        var _ctx$object_name$0$ac = ctx.object_name()[0].accept(this),
          _ctx$object_name$0$ac2 = _slicedToArray(_ctx$object_name$0$ac, 3),
          databaseName = _ctx$object_name$0$ac2[0],
          schemaName = _ctx$object_name$0$ac2[1],
          tableName = _ctx$object_name$0$ac2[2];
        var definition = ctx.constraint_action().accept(this);
        if (definition) {
          var _this$data$refs3;
          var fieldsData = [];
          var indexes = [];
          var tableRefs = [];
          if (definition.kind === _constants.TABLE_CONSTRAINT_KIND.FIELD) fieldsData.push(definition.value);else if (definition.kind === _constants.TABLE_CONSTRAINT_KIND.UNIQUE) indexes.push(definition.value);else if (definition.kind === _constants.TABLE_CONSTRAINT_KIND.FK) tableRefs.push(definition.value);
          (_this$data$refs3 = this.data.refs).push.apply(_this$data$refs3, _toConsumableArray(tableRefs.map(function (tableRef) {
            tableRef.endpoints[0].tableName = tableName;
            tableRef.endpoints[0].schemaName = schemaName;
            return tableRef;
          })));
          var table = this.data.tables.reduce(function (acc, ele) {
            if (ele.name === tableName && ele.schemaName === schemaName) return ele;
            return acc;
          }, null);
          if (table) {
            var _table$fields, _table$indexes;
            (_table$fields = table.fields).push.apply(_table$fields, fieldsData);
            (_table$indexes = table.indexes).push.apply(_table$indexes, indexes);
          }
          return table;
        }
      }
      return null;
    }

    // CREATE or_replace? TRANSIENT? TABLE if_not_exists? object_name LIKE object_name cluster_by? copy_grants?
  }, {
    key: "visitCreate_table_like",
    value: function visitCreate_table_like(ctx) {
      var _ctx$object_name$0$ac3 = ctx.object_name()[0].accept(this),
        _ctx$object_name$0$ac4 = _slicedToArray(_ctx$object_name$0$ac3, 3),
        databaseNameLike = _ctx$object_name$0$ac4[0],
        schemaNameLike = _ctx$object_name$0$ac4[1],
        nameLike = _ctx$object_name$0$ac4[2];
      var _ctx$object_name$1$ac = ctx.object_name()[1].accept(this),
        _ctx$object_name$1$ac2 = _slicedToArray(_ctx$object_name$1$ac, 3),
        databaseNameOrigin = _ctx$object_name$1$ac2[0],
        schemaNameOrigin = _ctx$object_name$1$ac2[1],
        nameOrigin = _ctx$object_name$1$ac2[2];
      return [schemaNameLike, nameLike, schemaNameOrigin, nameOrigin];
    }

    // : d = id_ DOT s = id_ DOT o = id_
    // | s = id_ DOT o = id_
    // | o = id_
  }, {
    key: "visitObject_name",
    value: function visitObject_name(ctx) {
      var _ctx$d, _ctx$s;
      return [(_ctx$d = ctx.d) === null || _ctx$d === void 0 ? void 0 : _ctx$d.accept(this), (_ctx$s = ctx.s) === null || _ctx$s === void 0 ? void 0 : _ctx$s.accept(this), ctx.o.accept(this)];
    }

    // : ID | ID2 | DOUBLE_QUOTE_ID | DOUBLE_QUOTE_BLANK
    // | keyword | non_reserved_words | object_type_plural | data_type
    // | builtin_function | unary_or_binary_builtin_function | binary_builtin_function
    // | binary_or_ternary_builtin_function | ternary_builtin_function
  }, {
    key: "visitId_",
    value: function visitId_(ctx) {
      if (ctx.DOUBLE_QUOTE_ID()) return (0, _helpers.getOriginalText)(ctx).slice(1, -1);
      return (0, _helpers.getOriginalText)(ctx);
    }

    // : (
    //     column_decl_item_list_paren cluster_by?
    //     | cluster_by? comment_clause? column_decl_item_list_paren
    // ) stage_file_format? (STAGE_COPY_OPTIONS EQ LR_BRACKET copy_options RR_BRACKET)? (
    //     DATA_RETENTION_TIME_IN_DAYS EQ num
    // )? (MAX_DATA_EXTENSION_TIME_IN_DAYS EQ num)? change_tracking? default_ddl_collation? copy_grants? comment_clause? with_row_access_policy?
    //     with_tags?
  }, {
    key: "visitCreate_table_clause",
    value: function visitCreate_table_clause(ctx) {
      var _ctx$comment_clause$m,
        _this4 = this;
      return {
        definitions: ctx.column_decl_item_list_paren().accept(this),
        tableNote: (_ctx$comment_clause$m = ctx.comment_clause().map(function (c) {
          return c.accept(_this4);
        })) === null || _ctx$comment_clause$m === void 0 ? void 0 : _ctx$comment_clause$m[-1]
      };
    }

    // : COMMENT EQ string
  }, {
    key: "visitComment_clause",
    value: function visitComment_clause(ctx) {
      return sanitizeComment(ctx.string());
    }

    // '(' column_decl_item_list ')'
  }, {
    key: "visitColumn_decl_item_list_paren",
    value: function visitColumn_decl_item_list_paren(ctx) {
      return ctx.column_decl_item_list().accept(this);
    }

    // column_decl_item (COMMA column_decl_item)*
  }, {
    key: "visitColumn_decl_item_list",
    value: function visitColumn_decl_item_list(ctx) {
      var _this5 = this;
      return ctx.column_decl_item().map(function (c) {
        return c.accept(_this5);
      }).filter(function (r) {
        return r;
      });
    }

    // full_col_decl | out_of_line_constraint
  }, {
    key: "visitColumn_decl_item",
    value: function visitColumn_decl_item(ctx) {
      if (ctx.full_col_decl()) {
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.FIELD,
          value: ctx.full_col_decl().accept(this)
        };
      }
      if (ctx.out_of_line_constraint()) {
        var test = ctx.out_of_line_constraint().accept(this);
        return test;
      }
      return null;
    }

    // col_decl (collate | inline_constraint | null_not_null | (default_value | NULL_))* with_masking_policy? with_tags? ( COMMENT string )?
  }, {
    key: "visitFull_col_decl",
    value: function visitFull_col_decl(ctx) {
      var _this6 = this;
      var field = ctx.col_decl().accept(this);
      var inlineRefs = [];
      if (ctx.inline_constraint()) {
        var inlineConstraints = ctx.inline_constraint().map(function (c) {
          return c.accept(_this6);
        });
        if (!(0, _lodash.isEmpty)(inlineConstraints)) {
          inlineConstraints.forEach(function (inlineConstraint) {
            if (inlineConstraint.kind === _constants.COLUMN_CONSTRAINT_KIND.UNIQUE) field.unique = true;else if (inlineConstraint.kind === _constants.COLUMN_CONSTRAINT_KIND.PK) field.pk = true;else if (inlineConstraint.kind === _constants.COLUMN_CONSTRAINT_KIND.FK) inlineRefs.push(inlineConstraint.value);
          });
        }
      }
      if (ctx.null_not_null()) {
        var notNulls = ctx.null_not_null().map(function (c) {
          return c.accept(_this6);
        });
        if (!(0, _lodash.isEmpty)(notNulls)) {
          notNulls.forEach(function (notNull) {
            if (notNull.kind === _constants.COLUMN_CONSTRAINT_KIND.NOT_NULL) field.not_null = notNull.value;
          });
        }
      }
      if (ctx.default_value()) {
        var defaultOrIncrements = ctx.default_value().map(function (c) {
          return c.accept(_this6);
        });
        defaultOrIncrements.forEach(function (defaultOrIncrement) {
          if (defaultOrIncrement.kind === _constants.COLUMN_CONSTRAINT_KIND.DEFAULT) {
            field.dbdefault = defaultOrIncrement.value;
          } else if (defaultOrIncrement.kind === _constants.COLUMN_CONSTRAINT_KIND.INCREMENT) {
            field.increment = defaultOrIncrement.value;
          }
        });
      }
      if (ctx.COMMENT()) {
        field.note = sanitizeComment(ctx.string());
      }
      return {
        field: field,
        inlineRefs: inlineRefs
      };
    }

    // column_name data_type virtual_column_decl?
  }, {
    key: "visitCol_decl",
    value: function visitCol_decl(ctx) {
      return new _AST.Field({
        name: ctx.column_name().accept(this),
        type: {
          type_name: (0, _helpers.getOriginalText)(ctx.data_type()),
          schemaName: null
        }
      });
    }

    // : (id_ '.')? id_
  }, {
    key: "visitColumn_name",
    value: function visitColumn_name(ctx) {
      var _this7 = this;
      return ctx.id_().map(function (c) {
        return c.accept(_this7);
      }).join('.');
    }

    // : (CONSTRAINT id_)? (
    //     (UNIQUE | primary_key) common_constraint_properties*
    //     | foreign_key REFERENCES object_name (LR_BRACKET column_name RR_BRACKET)? constraint_properties
    // )
  }, {
    key: "visitInline_constraint",
    value: function visitInline_constraint(ctx) {
      if (ctx.UNIQUE()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.UNIQUE,
          value: true
        };
      }
      if (ctx.primary_key()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.PK,
          value: true
        };
      }
      if (ctx.foreign_key() && ctx.column_name()) {
        var _ctx$object_name$acce3 = ctx.object_name().accept(this),
          _ctx$object_name$acce4 = _slicedToArray(_ctx$object_name$acce3, 3),
          databaseName = _ctx$object_name$acce4[0],
          schemaName = _ctx$object_name$acce4[1],
          tableName = _ctx$object_name$acce4[2];
        var destColumns = [ctx.column_name().accept(this)];
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.FK,
          value: {
            endpoints: [{
              tableName: null,
              schemaName: null,
              fieldNames: null,
              relation: '*'
            }, {
              tableName: tableName,
              schemaName: schemaName,
              fieldNames: destColumns,
              relation: '1'
            }]
          }
        };
      }
      return {
        kind: null,
        value: null
      };
    }

    // : (CONSTRAINT id_)? (
    //     (UNIQUE | primary_key) column_list_in_parentheses common_constraint_properties*
    //     | foreign_key column_list_in_parentheses REFERENCES object_name column_list_in_parentheses constraint_properties
    // )
  }, {
    key: "visitOut_of_line_constraint",
    value: function visitOut_of_line_constraint(ctx) {
      var _this8 = this;
      if (ctx.UNIQUE()) {
        var _ctx$id_;
        var name = (_ctx$id_ = ctx.id_()) === null || _ctx$id_ === void 0 ? void 0 : _ctx$id_.accept(this);
        var colNames = (0, _lodash.flatten)(ctx.column_list_in_parentheses().map(function (c) {
          return c.accept(_this8);
        }));
        var value = new _AST.Index({
          unique: true,
          columns: colNames.map(function (colName) {
            return {
              value: colName,
              type: _constants.CONSTRAINT_TYPE.COLUMN
            };
          })
        });
        return {
          name: name,
          kind: _constants.TABLE_CONSTRAINT_KIND.UNIQUE,
          value: value
        };
      }
      if (ctx.primary_key()) {
        var _ctx$id_2;
        var _name = (_ctx$id_2 = ctx.id_()) === null || _ctx$id_2 === void 0 ? void 0 : _ctx$id_2.accept(this);
        var _colNames = (0, _lodash.flatten)(ctx.column_list_in_parentheses().map(function (c) {
          return c.accept(_this8);
        }));
        var _value = new _AST.Index({
          name: _name,
          pk: true,
          columns: _colNames.map(function (colName) {
            return {
              value: colName,
              type: _constants.CONSTRAINT_TYPE.COLUMN
            };
          })
        });
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.PK,
          value: _value
        };
      }
      if (ctx.foreign_key() && ctx.column_list_in_parentheses().length === 2) {
        var _ctx$object_name$acce5 = ctx.object_name().accept(this),
          _ctx$object_name$acce6 = _slicedToArray(_ctx$object_name$acce5, 3),
          databaseName = _ctx$object_name$acce6[0],
          schemaName = _ctx$object_name$acce6[1],
          tableName = _ctx$object_name$acce6[2];
        var sourceColumns = ctx.column_list_in_parentheses()[0].accept(this);
        var destColumns = ctx.column_list_in_parentheses()[1].accept(this);
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.FK,
          value: {
            endpoints: [{
              tableName: null,
              schemaName: null,
              fieldNames: sourceColumns,
              relation: '*'
            }, {
              tableName: tableName,
              schemaName: schemaName,
              fieldNames: destColumns,
              relation: '1'
            }]
          }
        };
      }
      return null;
    }

    // LR_BRACKET column_list RR_BRACKET
  }, {
    key: "visitColumn_list_in_parentheses",
    value: function visitColumn_list_in_parentheses(ctx) {
      return ctx.column_list().accept(this);
    }

    // column_name (COMMA column_name)*
  }, {
    key: "visitColumn_list",
    value: function visitColumn_list(ctx) {
      var _this9 = this;
      return ctx.column_name().map(function (c) {
        return c.accept(_this9);
      });
    }

    // NOT? NULL_
  }, {
    key: "visitNull_not_null",
    value: function visitNull_not_null(ctx) {
      return {
        kind: _constants.COLUMN_CONSTRAINT_KIND.NOT_NULL,
        value: !!ctx.NOT()
      };
    }

    // : DEFAULT expr
    // | (AUTOINCREMENT | IDENTITY) (
    //     LR_BRACKET num COMMA num RR_BRACKET
    //     | start_with
    //     | increment_by
    //     | start_with increment_by
    // )? order_noorder?
  }, {
    key: "visitDefault_value",
    value: function visitDefault_value(ctx) {
      // dbdefault: {value: string, type: 'string' | 'number' | 'boolean' | 'expression'},
      if (ctx.DEFAULT()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.DEFAULT,
          value: ctx.expr().accept(this)
        };
      }
      if (ctx.AUTOINCREMENT() || ctx.IDENTITY()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.INCREMENT,
          value: true
        };
      }
      return null;
    }

    //  : object_name DOT NEXTVAL
    //  | expr LSB expr RSB //array access
    //  | expr COLON expr   //json access
    //  | expr DOT (VALUE | expr)
    //  | expr COLLATE string
    //  | case_expression
    //  | iff_expr
    //  | bracket_expression
    //  | op = ( PLUS | MINUS) expr
    //  | expr op = (STAR | DIVIDE | MODULE) expr
    //  | expr op = (PLUS | MINUS | PIPE_PIPE) expr
    //  | expr comparison_operator expr
    //  | op = NOT+ expr
    //  | expr AND expr //bool operation
    //  | expr OR expr  //bool operation
    //  | arr_literal
    //  //    | expr time_zone
    //  | expr over_clause
    //  | cast_expr
    //  | expr COLON_COLON data_type // Cast also
    //  | try_cast_expr
    //  | json_literal
    //  | trim_expression
    //  | function_call
    //  | subquery
    //  | expr IS null_not_null
    //  | expr NOT? IN LR_BRACKET (subquery | expr_list) RR_BRACKET
    //  | expr NOT? ( LIKE | ILIKE) expr (ESCAPE expr)?
    //  | expr NOT? RLIKE expr
    //  | expr NOT? (LIKE | ILIKE) ANY LR_BRACKET expr (COMMA expr)* RR_BRACKET (ESCAPE expr)?
    //  | primitive_expression //Should be latest rule as it's nearly a catch all
  }, {
    key: "visitExpr",
    value: function visitExpr(ctx) {
      if (ctx.primitive_expression()) return ctx.primitive_expression().accept(this);
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: 'expression'
      };
    }

    // : DEFAULT //?
    // | NULL_
    // | id_ ('.' id_)* // json field access
    // | full_column_name
    // | literal
    // | BOTH_Q
    // | ARRAY_Q
    // | OBJECT_Q
    // //| json_literal
    // //| arr_literal
  }, {
    key: "visitPrimitive_expression",
    value: function visitPrimitive_expression(ctx) {
      if (ctx.NULL_()) return {
        value: null,
        type: 'boolean'
      };
      if (ctx.literal()) return ctx.literal().accept(this);
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: 'expression'
      };
    }

    //  : STRING // string, date, time, timestamp
    //  | sign? DECIMAL
    //  | sign? (REAL | FLOAT)
    //  | true_false
    //  | NULL_
    //  | AT_Q
    //  ;
  }, {
    key: "visitLiteral",
    value: function visitLiteral(ctx) {
      if (ctx.STRING()) return {
        value: sanitizeComment(ctx),
        type: 'string'
      };
      if (ctx.DECIMAL() || ctx.REAL || ctx.FLOAT) return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: 'number'
      };
      if (ctx.true_false() || ctx.NULL_()) return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: 'boolean'
      };
      return {
        value: (0, _helpers.getOriginalText)(ctx),
        type: 'expression'
      };
    }

    // : ADD out_of_line_constraint
    // | RENAME CONSTRAINT id_ TO id_
    // | alter_modify (CONSTRAINT id_ | primary_key | UNIQUE | foreign_key) column_list_in_parentheses enforced_not_enforced? (
    //     VALIDATE
    //     | NOVALIDATE
    // ) (RELY | NORELY)
    // | DROP (CONSTRAINT id_ | primary_key | UNIQUE | foreign_key) column_list_in_parentheses? cascade_restrict?
    // | DROP PRIMARY KEY
  }, {
    key: "visitConstraint_action",
    value: function visitConstraint_action(ctx) {
      if (ctx.ADD()) {
        return ctx.out_of_line_constraint().accept(this);
      }
      return null;
    }
  }]);
}(_SnowflakeParserVisitor["default"]);