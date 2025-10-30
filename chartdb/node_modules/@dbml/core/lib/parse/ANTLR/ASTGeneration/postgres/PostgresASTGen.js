"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _PostgreSQLParserVisitor = _interopRequireDefault(require("../../parsers/postgresql/PostgreSQLParserVisitor"));
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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /* eslint-disable no-param-reassign */ /* eslint-disable consistent-return */ /* eslint-disable class-methods-use-this */
var COMMAND_KIND = {
  REF: 'ref'
};
var COMMENT_OBJECT_TYPE = {
  TABLE: 'table'
};
var findTable = function findTable(tables, schemaName, tableName) {
  var realSchemaName = schemaName || 'public';
  var table = tables.find(function (table) {
    var targetSchemaName = table.schemaName || 'public';
    return targetSchemaName === realSchemaName && table.name === tableName;
  });
  return table;
};
var escapeStr = function escapeStr(str) {
  if (str) {
    return str.replaceAll("''", "'");
  }
  return str;
};
var PostgresASTGen = exports["default"] = /*#__PURE__*/function (_PostgreSQLParserVisi) {
  function PostgresASTGen() {
    var _this;
    _classCallCheck(this, PostgresASTGen);
    _this = _callSuper(this, PostgresASTGen);
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

  // stmtblock EOF
  _inherits(PostgresASTGen, _PostgreSQLParserVisi);
  return _createClass(PostgresASTGen, [{
    key: "visitRoot",
    value: function visitRoot(ctx) {
      ctx.stmtblock().accept(this);
      return this.data;
    }

    // stmtmulti
  }, {
    key: "visitStmtblock",
    value: function visitStmtblock(ctx) {
      ctx.stmtmulti().accept(this);
    }

    // (stmt SEMI?)*
  }, {
    key: "visitStmtmulti",
    value: function visitStmtmulti(ctx) {
      var _this2 = this;
      ctx.stmt().map(function (stmt) {
        return stmt.accept(_this2);
      });
    }

    // check PostgresSQLParser.g4 line 31
  }, {
    key: "visitStmt",
    value: function visitStmt(ctx) {
      if (ctx.createstmt()) {
        var table = ctx.createstmt().accept(this);

        // filter out null table that can cause error in model_structure stage
        if (table) this.data.tables.push(table);
        return;
      }
      if (ctx.indexstmt()) {
        /** @type {Index} */
        var indexStmt = ctx.indexstmt().accept(this);
        var _indexStmt$pathName = indexStmt.pathName,
          tableName = _indexStmt$pathName.tableName,
          schemaName = _indexStmt$pathName.schemaName;
        var _table = findTable(this.data.tables, schemaName, tableName);
        if (_table) _table.indexes.push(indexStmt.index);
        return;
      }
      if (ctx.altertablestmt()) {
        ctx.altertablestmt().accept(this);
        return;
      }
      if (ctx.commentstmt()) {
        ctx.commentstmt().accept(this);
        return;
      }
      if (ctx.definestmt()) {
        ctx.definestmt().accept(this);
        return;
      }
      if (ctx.insertstmt()) {
        ctx.insertstmt().accept(this);
      }
    }

    /*
     CREATE opttemp TABLE (IF_P NOT EXISTS)? qualified_name (
     OPEN_PAREN opttableelementlist CLOSE_PAREN optinherit optpartitionspec
     table_access_method_clause optwith oncommitoption opttablespace
     | OF any_name opttypedtableelementlist optpartitionspec table_access_method_clause
     optwith oncommitoption opttablespace | PARTITION OF qualified_name opttypedtableelementlist
     partitionboundspec optpartitionspec table_access_method_clause optwith oncommitoption opttablespace)
     */
  }, {
    key: "visitCreatestmt",
    value: function visitCreatestmt(ctx) {
      var _this$data$refs, _this$data$refs2;
      var names = ctx.qualified_name(0).accept(this);
      var tableName = (0, _lodash.last)(names);
      var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
      if (!ctx.opttableelementlist()) return;
      var tableElements = ctx.opttableelementlist().accept(this).filter(function (e) {
        return e;
      });
      var _tableElements$reduce = tableElements.reduce(function (acc, ele) {
          if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.FIELD) acc[0].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.INDEX) acc[1].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.FK) acc[2].push(ele.value);else if (ele.kind === _constants.TABLE_CONSTRAINT_KIND.UNIQUE) acc[1].push(ele.value);
          return acc;
        }, [[], [], []]),
        _tableElements$reduce2 = _slicedToArray(_tableElements$reduce, 3),
        fieldsData = _tableElements$reduce2[0],
        indexes = _tableElements$reduce2[1],
        tableRefs = _tableElements$reduce2[2];
      (_this$data$refs = this.data.refs).push.apply(_this$data$refs, _toConsumableArray((0, _lodash.flatten)(fieldsData.map(function (fieldData) {
        return fieldData.inline_refs.map(function (inlineRef) {
          inlineRef.endpoints[0].tableName = tableName;
          inlineRef.endpoints[0].schemaName = schemaName;
          inlineRef.endpoints[0].fieldNames = [fieldData.field.name];
          return inlineRef;
        });
      }))));
      (_this$data$refs2 = this.data.refs).push.apply(_this$data$refs2, _toConsumableArray(tableRefs.map(function (tableRef) {
        tableRef.endpoints[0].tableName = tableName;
        tableRef.endpoints[0].schemaName = schemaName;
        return tableRef;
      })));
      return new _AST.Table({
        name: tableName,
        schemaName: schemaName,
        fields: fieldsData.map(function (fd) {
          return fd.field;
        }),
        indexes: indexes
      });
    }

    // tableelementlist
  }, {
    key: "visitOpttableelementlist",
    value: function visitOpttableelementlist(ctx) {
      if (!ctx.tableelementlist()) return [];
      return ctx.tableelementlist().accept(this);
    }

    // tableelement (COMMA tableelement)*
  }, {
    key: "visitTableelementlist",
    value: function visitTableelementlist(ctx) {
      var _this3 = this;
      return ctx.tableelement().map(function (element) {
        return element.accept(_this3);
      });
    }

    // tableconstraint | tablelikeclause | columnDef
  }, {
    key: "visitTableelement",
    value: function visitTableelement(ctx) {
      if (ctx.columnDef()) return ctx.columnDef().accept(this);
      if (ctx.tableconstraint()) return ctx.tableconstraint().accept(this);
    }

    // CONSTRAINT name constraintelem | constraintelem
  }, {
    key: "visitTableconstraint",
    value: function visitTableconstraint(ctx) {
      var _ctx$name;
      var constraintName = (_ctx$name = ctx.name()) === null || _ctx$name === void 0 ? void 0 : _ctx$name.accept(this);
      var constraint = ctx.constraintelem().accept(this);
      if (!constraint) return;
      constraint.value.name = constraintName;
      return constraint;
    }

    /*
     CHECK OPEN_PAREN a_expr CLOSE_PAREN constraintattributespec
     | UNIQUE (OPEN_PAREN columnlist CLOSE_PAREN opt_c_include opt_definition optconstablespace constraintattributespec | existingindex constraintattributespec)
     | PRIMARY KEY (OPEN_PAREN columnlist CLOSE_PAREN opt_c_include opt_definition optconstablespace constraintattributespec | existingindex constraintattributespec)
     | EXCLUDE access_method_clause OPEN_PAREN exclusionconstraintlist CLOSE_PAREN opt_c_include opt_definition optconstablespace exclusionwhereclause constraintattributespec
     | FOREIGN KEY OPEN_PAREN columnlist CLOSE_PAREN REFERENCES qualified_name opt_column_list key_match key_actions constraintattributespec
     */
  }, {
    key: "visitConstraintelem",
    value: function visitConstraintelem(ctx) {
      if (ctx.PRIMARY()) {
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.INDEX,
          value: new _AST.Index({
            pk: true,
            columns: ctx.columnlist().accept(this)
          })
          // value: {
          //   type: 'PrimaryKey',
          //   columns:
          // },
        };
      }
      if (ctx.FOREIGN()) {
        var _ctx$opt_column_list$;
        var names = ctx.qualified_name().accept(this);
        var refTableName = (0, _lodash.last)(names);
        var refSchemaName = names.length > 1 ? names[names.length - 2] : undefined;
        var firstFieldNames = ctx.columnlist().accept(this).map(function (c) {
          return c.value;
        });
        var secondFieldNames = (_ctx$opt_column_list$ = ctx.opt_column_list().accept(this)) === null || _ctx$opt_column_list$ === void 0 ? void 0 : _ctx$opt_column_list$.map(function (c) {
          return c.value;
        });
        var actions = ctx.key_actions().accept(this);
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.FK,
          value: {
            endpoints: [{
              tableName: null,
              schemaName: null,
              fieldNames: firstFieldNames,
              relation: '*'
            }, {
              tableName: refTableName,
              schemaName: refSchemaName,
              fieldNames: secondFieldNames,
              relation: '1'
            }],
            onDelete: actions.onDelete,
            onUpdate: actions.onUpdate
          }
        };
      }
      if (ctx.UNIQUE()) {
        return {
          kind: _constants.TABLE_CONSTRAINT_KIND.UNIQUE,
          value: new _AST.Index({
            unique: true,
            columns: ctx.columnlist().accept(this)
          })
        };
      }
    }

    // OPEN_PAREN columnlist CLOSE_PAREN |
  }, {
    key: "visitOpt_column_list",
    value: function visitOpt_column_list(ctx) {
      var _ctx$columnlist;
      return (_ctx$columnlist = ctx.columnlist()) === null || _ctx$columnlist === void 0 ? void 0 : _ctx$columnlist.accept(this);
    }

    // columnElem (COMMA columnElem)*
  }, {
    key: "visitColumnlist",
    value: function visitColumnlist(ctx) {
      var _this4 = this;
      return ctx.columnElem().map(function (c) {
        return c.accept(_this4);
      });
    }

    // colid
  }, {
    key: "visitColumnElem",
    value: function visitColumnElem(ctx) {
      return {
        value: ctx.colid().accept(this),
        type: _constants.CONSTRAINT_TYPE.COLUMN
      };
    }

    // colid typename create_generic_options colquallist
  }, {
    key: "visitColumnDef",
    value: function visitColumnDef(ctx) {
      var name = ctx.colid().accept(this);
      var type = ctx.typename().accept(this);
      var contraints = ctx.colquallist().accept(this);
      var serialIncrementType = new Set(['serial', 'smallserial', 'bigserial']);
      var columnTypeName = type.type_name.toLowerCase();
      if (serialIncrementType.has(columnTypeName)) contraints.increment = true;
      return {
        kind: _constants.TABLE_CONSTRAINT_KIND.FIELD,
        value: {
          field: new _AST.Field(_objectSpread({
            name: name,
            type: type
          }, contraints)),
          inline_refs: contraints.inline_refs
        }
      };
    }

    // colconstraint*
  }, {
    key: "visitColquallist",
    value: function visitColquallist(ctx) {
      var _this5 = this;
      var r = {
        inline_refs: []
      };
      ctx.colconstraint().forEach(function (c) {
        var constraint = c.accept(_this5);
        if (!constraint) return;
        if (constraint.kind === _constants.COLUMN_CONSTRAINT_KIND.INLINE_REF) {
          r.inline_refs.push(constraint.value);
          return;
        }
        r[constraint.kind] = constraint.value;
      });
      return r;
    }

    /*
     CONSTRAINT name colconstraintelem
     | colconstraintelem
     | constraintattr
     | COLLATE any_name
     */
  }, {
    key: "visitColconstraint",
    value: function visitColconstraint(ctx) {
      if (ctx.colconstraintelem()) {
        return ctx.colconstraintelem().accept(this);
      }
    }

    /*
     NOT NULL_P
     | NULL_P
     | UNIQUE opt_definition optconstablespace
     | PRIMARY KEY opt_definition optconstablespace
     | CHECK OPEN_PAREN a_expr CLOSE_PAREN opt_no_inherit
     | DEFAULT b_expr
     | GENERATED generated_when AS (IDENTITY_P optparenthesizedseqoptlist | OPEN_PAREN a_expr CLOSE_PAREN STORED)
     | REFERENCES qualified_name opt_column_list key_match key_actions
     */
  }, {
    key: "visitColconstraintelem",
    value: function visitColconstraintelem(ctx) {
      if (ctx.NULL_P()) {
        var notNull = false;
        if (ctx.NOT()) notNull = true;
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
      if (ctx.DEFAULT()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.DEFAULT,
          value: ctx.b_expr().accept(this)
        };
      }
      if (ctx.IDENTITY_P()) {
        return {
          kind: _constants.COLUMN_CONSTRAINT_KIND.INCREMENT,
          value: true
        };
      }
      if (ctx.REFERENCES()) {
        var _ctx$opt_column_list$2;
        var names = ctx.qualified_name().accept(this);
        var refTableName = (0, _lodash.last)(names);
        var refSchemaName = names.length > 1 ? names[names.length - 2] : undefined;
        var secondFieldNames = (_ctx$opt_column_list$2 = ctx.opt_column_list().accept(this)) === null || _ctx$opt_column_list$2 === void 0 ? void 0 : _ctx$opt_column_list$2.map(function (c) {
          return c.value;
        });
        var actions = ctx.key_actions().accept(this);
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
              fieldNames: secondFieldNames,
              relation: '1'
            }],
            onDelete: actions.onDelete,
            onUpdate: actions.onUpdate
          }
        };
      }
    }

    // check PostgresSQLParser.g4 line 3619
  }, {
    key: "visitB_expr",
    value: function visitB_expr(ctx) {
      if (ctx.c_expr()) return ctx.c_expr().accept(this);
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // check PostgresSQLParser.g4 line 3640
  }, {
    key: "visitC_expr_expr",
    value: function visitC_expr_expr(ctx) {
      if (ctx.aexprconst()) return ctx.aexprconst().accept(this);
      if (ctx.a_expr()) {
        return {
          value: ctx.a_expr().getText(),
          type: _constants.DATA_TYPE.EXPRESSION
        };
      }
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }
  }, {
    key: "visitC_expr_exists",
    value: function visitC_expr_exists(ctx) {
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }
  }, {
    key: "visitC_expr_case",
    value: function visitC_expr_case(ctx) {
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // iconst | fconst | sconst | bconst | xconst | func_name (sconst | OPEN_PAREN func_arg_list opt_sort_clause CLOSE_PAREN sconst) | consttypename sconst | constinterval (sconst opt_interval | OPEN_PAREN iconst CLOSE_PAREN sconst) | TRUE_P | FALSE_P | NULL_P
  }, {
    key: "visitAexprconst",
    value: function visitAexprconst(ctx) {
      if (ctx.sconst() && ctx.getChildCount() === 1) {
        return {
          value: ctx.sconst().accept(this),
          type: _constants.DATA_TYPE.STRING
        };
      }
      if (ctx.TRUE_P() || ctx.FALSE_P() || ctx.NULL_P()) {
        return {
          value: ctx.getText(),
          type: _constants.DATA_TYPE.BOOLEAN
        };
      }
      if (ctx.iconst() || ctx.fconst) {
        return {
          value: ctx.getText(),
          type: _constants.DATA_TYPE.NUMBER
        };
      }
      return {
        value: ctx.getText(),
        type: _constants.DATA_TYPE.EXPRESSION
      };
    }

    // key_update | key_delete | key_update key_delete | key_delete key_update |
  }, {
    key: "visitKey_actions",
    value: function visitKey_actions(ctx) {
      var onDelete = null,
        onUpdate = null;
      if (ctx.key_update()) onUpdate = ctx.key_update().accept(this);
      if (ctx.key_delete()) onDelete = ctx.key_delete().accept(this);
      return {
        onDelete: onDelete,
        onUpdate: onUpdate
      };
    }

    // ON UPDATE key_action
  }, {
    key: "visitKey_update",
    value: function visitKey_update(ctx) {
      return ctx.key_action().accept(this);
    }

    // ON DELETE_P key_action
  }, {
    key: "visitKey_delete",
    value: function visitKey_delete(ctx) {
      return ctx.key_action().accept(this);
    }

    // NO ACTION | RESTRICT | CASCADE | SET (NULL_P | DEFAULT)
  }, {
    key: "visitKey_action",
    value: function visitKey_action(ctx) {
      // Generate n element integer array [0, 1, ..., n-1]
      var childIndices = _toConsumableArray(Array(ctx.getChildCount()).keys());
      var text = childIndices.reduce(function (acc, i) {
        acc += "".concat(ctx.getChild(i).getText(), " ");
        return acc;
      }, '');
      return text.slice(0, text.length - 1); // remove the last whitespace
    }

    // colid indirection?
  }, {
    key: "visitQualified_name",
    value: function visitQualified_name(ctx) {
      var r = [ctx.colid().accept(this)];
      if (ctx.indirection()) {
        r.push.apply(r, _toConsumableArray(ctx.indirection().accept(this)));
      }
      return r;
    }

    /*
     identifier
     | unreserved_keyword
     | col_name_keyword
     | plsql_unreserved_keyword
     | LEFT
     | RIGHT
     */
  }, {
    key: "visitColid",
    value: function visitColid(ctx) {
      return ctx.getChild(0).accept(this);
    }

    // check PostgresSQLParser.g4 line 4187
  }, {
    key: "visitUnreserved_keyword",
    value: function visitUnreserved_keyword(ctx) {
      return ctx.getText();
    }

    /*
     Identifier opt_uescape
     | QuotedIdentifier
     | UnicodeQuotedIdentifier
     | plsqlvariablename
     | plsqlidentifier
     | plsql_unreserved_keyword
     */
  }, {
    key: "visitIdentifier",
    value: function visitIdentifier(ctx) {
      if (ctx.Identifier()) {
        return ctx.Identifier().getText();
      }
      if (ctx.QuotedIdentifier()) {
        var qId = ctx.QuotedIdentifier().getText();
        return qId.slice(1, qId.length - 1);
      }
      if (ctx.UnicodeQuotedIdentifier()) {
        var _qId = ctx.UnicodeQuotedIdentifier().getText();
        return _qId.slice(1, _qId.length - 1);
      }
      if (ctx.plsql_unreserved_keyword()) {
        return ctx.plsql_unreserved_keyword().accept(this);
      }
      return ctx.getChild(0).getText();
    }
  }, {
    key: "visitCol_name_keyword",
    value: function visitCol_name_keyword(ctx) {
      return ctx.getChild(0).getText();
    }
  }, {
    key: "visitPlsql_unreserved_keyword",
    value: function visitPlsql_unreserved_keyword(ctx) {
      return ctx.getChild(0).getText();
    }

    // indirection_el+
  }, {
    key: "visitIndirection",
    value: function visitIndirection(ctx) {
      var _this6 = this;
      return ctx.indirection_el().map(function (i) {
        return i.accept(_this6);
      });
    }

    // DOT (attr_name | STAR)
    // | OPEN_BRACKET (a_expr | opt_slice_bound COLON opt_slice_bound) CLOSE_BRACKET
  }, {
    key: "visitIndirection_el",
    value: function visitIndirection_el(ctx) {
      if (ctx.attr_name()) return ctx.attr_name().accept(this);
    }

    // collabel
  }, {
    key: "visitAttr_name",
    value: function visitAttr_name(ctx) {
      return ctx.collabel().accept(this);
    }

    /*
     identifier
     | plsql_unreserved_keyword
     | unreserved_keyword
     | col_name_keyword
     | type_func_name_keyword
     | reserved_keyword
     */
  }, {
    key: "visitCollabel",
    value: function visitCollabel(ctx) {
      return ctx.getChild(0).accept(this);
    }

    // check PostgresSQLParser.g4 line 4567
  }, {
    key: "visitReserved_keyword",
    value: function visitReserved_keyword(ctx) {
      return ctx.getText();
    }

    // SETOF? simpletypename (opt_array_bounds | ARRAY (OPEN_BRACKET iconst CLOSE_BRACKET)?)
    // | qualified_name PERCENT (ROWTYPE | TYPE_P)
  }, {
    key: "visitTypename",
    value: function visitTypename(ctx) {
      if (ctx.simpletypename()) {
        var arrayExtension = '';
        var type = ctx.simpletypename().accept(this);
        if (ctx.opt_array_bounds()) arrayExtension = ctx.opt_array_bounds().accept(this);
        if (ctx.ARRAY()) arrayExtension = "[".concat(ctx.iconst() ? ctx.iconst().accept(this) : '', "]");
        return {
          type_name: type.type + arrayExtension,
          schemaName: type.schemaName
        };
      }
    }

    /*
     generictype
     | numeric
     | bit
     | character
     | constdatetime
     | constinterval (opt_interval | OPEN_PAREN iconst CLOSE_PAREN)
     */
  }, {
    key: "visitSimpletypename",
    value: function visitSimpletypename(ctx) {
      if (ctx.generictype()) return ctx.generictype().accept(this);
      if (ctx.character()) {
        return {
          type: ctx.character().accept(this),
          schemaName: null
        };
      }
      if (ctx.numeric()) {
        return {
          type: ctx.numeric().accept(this),
          schemaName: null
        };
      }
      if (ctx.constdatetime()) {
        return {
          type: ctx.constdatetime().accept(this),
          schemaName: null
        };
      }
      return {
        type: ctx.getText(),
        schemaName: null
      };
    }

    // (TIMESTAMP | TIME) (OPEN_PAREN iconst CLOSE_PAREN)? opt_timezone
  }, {
    key: "visitConstdatetime",
    value: function visitConstdatetime(ctx) {
      return "".concat(ctx.getChild(0).getText()).concat(ctx.iconst() ? "(".concat(ctx.iconst().accept(this), ")") : '');
    }

    // INT_P | INTEGER | SMALLINT | BIGINT | REAL | FLOAT_P opt_float | DOUBLE_P PRECISION | DECIMAL_P opt_type_modifiers | DEC opt_type_modifiers | NUMERIC opt_type_modifiers | BOOLEAN_P
  }, {
    key: "visitNumeric",
    value: function visitNumeric(ctx) {
      return ctx.getText();
    }

    // (builtin_function_name | type_function_name | LEFT | RIGHT) attrs? opt_type_modifiers
  }, {
    key: "visitGenerictype",
    value: function visitGenerictype(ctx) {
      if (ctx.attrs()) {
        var names = [ctx.getChild(0).getText()].concat(_toConsumableArray(ctx.attrs().accept(this)));
        var enumName = (0, _lodash.last)(names);
        var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
        return {
          type: enumName,
          schemaName: schemaName
        };
      }
      var type = '';
      if (ctx.type_function_name()) type = ctx.type_function_name().accept(this);else type = ctx.getText();
      return {
        type: type + ctx.opt_type_modifiers().getText(),
        schemaName: null
      };
    }

    // character_c (OPEN_PAREN iconst CLOSE_PAREN)?
  }, {
    key: "visitCharacter",
    value: function visitCharacter(ctx) {
      var r = ctx.character_c().accept(this);
      if (ctx.getChildCount() > 1) {
        r += "(".concat(ctx.iconst().accept(this), ")");
      }
      return r;
    }

    // (CHARACTER | CHAR_P | NCHAR) opt_varying
    // | VARCHAR
    // | NATIONAL (CHARACTER | CHAR_P) opt_varying
  }, {
    key: "visitCharacter_c",
    value: function visitCharacter_c(ctx) {
      // Generate n element integer array [0, 1, ..., n-1]
      var childIndices = _toConsumableArray(Array(ctx.getChildCount()).keys());
      var text = childIndices.reduce(function (acc, i) {
        acc += "".concat(ctx.getChild(i).getText(), " ");
        return acc;
      }, '');
      return text.slice(0, text.length - 1); // remove the last whitespace
    }

    // identifier | unreserved_keyword | plsql_unreserved_keyword | type_func_name_keyword
  }, {
    key: "visitType_function_name",
    value: function visitType_function_name(ctx) {
      return ctx.getChild(0).accept(this);
    }
  }, {
    key: "visitType_func_name_keyword",
    value: function visitType_func_name_keyword(ctx) {
      return ctx.getText();
    }

    // (OPEN_BRACKET iconst? CLOSE_BRACKET)*
  }, {
    key: "visitOpt_array_bounds",
    value: function visitOpt_array_bounds(ctx) {
      return ctx.getText();
    }

    // Integral
  }, {
    key: "visitIconst",
    value: function visitIconst(ctx) {
      return ctx.Integral().getText();
    }

    // CREATE opt_unique INDEX opt_concurrently opt_index_name ON relation_expr access_method_clause OPEN_PAREN index_params CLOSE_PAREN opt_include opt_reloptions opttablespace where_clause
    // | CREATE opt_unique INDEX opt_concurrently IF_P NOT EXISTS name ON relation_expr access_method_clause OPEN_PAREN index_params CLOSE_PAREN opt_include opt_reloptions opttablespace where_clause
  }, {
    key: "visitIndexstmt",
    value: function visitIndexstmt(ctx) {
      var names = ctx.relation_expr().accept(this);
      var tableName = (0, _lodash.last)(names);
      var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
      if (ctx.opt_index_name()) {
        var r = {
          pathName: {
            tableName: tableName,
            schemaName: schemaName
          },
          index: new _AST.Index({
            name: ctx.opt_index_name().accept(this),
            unique: ctx.opt_unique().accept(this),
            type: ctx.access_method_clause().accept(this),
            columns: ctx.index_params().accept(this)
          })
        };
        return r;
      }
    }

    // name |
  }, {
    key: "visitOpt_index_name",
    value: function visitOpt_index_name(ctx) {
      var _ctx$name2;
      return (_ctx$name2 = ctx.name()) === null || _ctx$name2 === void 0 ? void 0 : _ctx$name2.accept(this);
    }

    // colid
  }, {
    key: "visitName",
    value: function visitName(ctx) {
      return ctx.colid().accept(this);
    }

    // USING name |
  }, {
    key: "visitAccess_method_clause",
    value: function visitAccess_method_clause(ctx) {
      if (ctx.name()) return ctx.name().accept(this);
    }

    // qualified_name STAR?
    // | ONLY (qualified_name | OPEN_PAREN qualified_name CLOSE_PAREN)
  }, {
    key: "visitRelation_expr",
    value: function visitRelation_expr(ctx) {
      return ctx.qualified_name().accept(this);
    }

    // index_elem (COMMA index_elem)*
  }, {
    key: "visitIndex_params",
    value: function visitIndex_params(ctx) {
      var _this7 = this;
      return ctx.index_elem().map(function (i) {
        return i.accept(_this7);
      }).filter(function (col) {
        return !!col;
      });
    }

    /*
     colid index_elem_options
     | func_expr_windowless index_elem_options
     | OPEN_PAREN a_expr CLOSE_PAREN index_elem_options
     */
  }, {
    key: "visitIndex_elem",
    value: function visitIndex_elem(ctx) {
      if (ctx.colid()) {
        return {
          value: ctx.colid().accept(this),
          type: _constants.CONSTRAINT_TYPE.STRING
        };
      }
      return {
        value: ctx.getText(),
        type: _constants.CONSTRAINT_TYPE.EXPRESSION
      };
    }

    // UNIQUE |
  }, {
    key: "visitOpt_unique",
    value: function visitOpt_unique(ctx) {
      return !!ctx.UNIQUE();
    }

    /*
     ALTER TABLE (IF_P EXISTS)? relation_expr (alter_table_cmds | partition_cmd)
     | ALTER TABLE ALL IN_P TABLESPACE name (OWNED BY role_list)? SET TABLESPACE name opt_nowait
     | ALTER INDEX (IF_P EXISTS)? qualified_name (alter_table_cmds | index_partition_cmd)
     | ALTER INDEX ALL IN_P TABLESPACE name (OWNED BY role_list)? SET TABLESPACE name opt_nowait
     | ALTER SEQUENCE (IF_P EXISTS)? qualified_name alter_table_cmds
     | ALTER VIEW (IF_P EXISTS)? qualified_name alter_table_cmds
     | ALTER MATERIALIZED VIEW (IF_P EXISTS)? qualified_name alter_table_cmds
     | ALTER MATERIALIZED VIEW ALL IN_P TABLESPACE name (OWNED BY role_list)? SET TABLESPACE name opt_nowait
     | ALTER FOREIGN TABLE (IF_P EXISTS)? relation_expr alter_table_cmds
     */
  }, {
    key: "visitAltertablestmt",
    value: function visitAltertablestmt(ctx) {
      var _this8 = this;
      if (ctx.TABLE() && ctx.relation_expr() && ctx.alter_table_cmds()) {
        var names = ctx.relation_expr().accept(this);
        var tableName = (0, _lodash.last)(names);
        var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
        var cmds = ctx.alter_table_cmds().accept(this);
        return cmds.map(function (cmd) {
          if (!cmd) return null;
          var kind = null;
          switch (cmd.kind) {
            case _constants.TABLE_CONSTRAINT_KIND.FK:
              kind = COMMAND_KIND.REF;
              cmd.value.endpoints[0].tableName = tableName;
              cmd.value.endpoints[0].schemaName = schemaName;
              _this8.data.refs.push(cmd.value);
              break;
            case _constants.TABLE_CONSTRAINT_KIND.UNIQUE:
            case _constants.TABLE_CONSTRAINT_KIND.PK:
            case _constants.TABLE_CONSTRAINT_KIND.INDEX:
              {
                if (cmd.value.columns.length === 0) break;
                if (!(cmd.value.pk || cmd.value.unique)) break;
                // eslint-disable-next-line prefer-destructuring
                kind = cmd.kind;
                var table = findTable(_this8.data.tables, schemaName, tableName);
                if (!table) break;
                if (cmd.value.columns.length === 1 && (cmd.value.unique || cmd.value.pk)) {
                  var key = cmd.value.columns[0].value;
                  var fieldToUpdate = table.fields.find(function (f) {
                    return f.name === key;
                  });
                  if (fieldToUpdate) {
                    // If we have an exact match, this is a column, if not, might be an expression
                    fieldToUpdate[cmd.value.unique ? 'unique' : 'pk'] = true;
                    break;
                  }
                }
                // multi column constraint -> need to create new index
                var index = new _AST.Index({
                  name: cmd.value.name,
                  columns: cmd.value.columns,
                  note: cmd.value.note,
                  pk: cmd.value.pk,
                  type: cmd.value.type,
                  unique: cmd.value.unique
                });
                table.indexes.push(index);
                break;
              }
            default:
              break;
          }
          return {
            kind: kind,
            value: cmd.value
          };
        }).filter(function (c) {
          return c;
        });
      }
    }

    // alter_table_cmd (COMMA alter_table_cmd)*
  }, {
    key: "visitAlter_table_cmds",
    value: function visitAlter_table_cmds(ctx) {
      var _this9 = this;
      return ctx.alter_table_cmd().map(function (a) {
        return a.accept(_this9);
      });
    }

    // check PostgresSQLParser.g4 line 410
  }, {
    key: "visitAlter_table_cmd",
    value: function visitAlter_table_cmd(ctx) {
      if (ctx.tableconstraint()) {
        var constraint = ctx.tableconstraint().accept(this);
        return constraint;
      }
    }

    /*
     COMMENT ON object_type_any_name any_name IS comment_text
     | COMMENT ON COLUMN any_name IS comment_text
     | COMMENT ON object_type_name name IS comment_text
     | COMMENT ON TYPE_P typename IS comment_text
     | COMMENT ON DOMAIN_P typename IS comment_text
     | COMMENT ON AGGREGATE aggregate_with_argtypes IS comment_text
     | COMMENT ON FUNCTION function_with_argtypes IS comment_text
     | COMMENT ON OPERATOR operator_with_argtypes IS comment_text
     | COMMENT ON CONSTRAINT name ON any_name IS comment_text
     | COMMENT ON CONSTRAINT name ON DOMAIN_P any_name IS comment_text
     | COMMENT ON object_type_name_on_any_name name ON any_name IS comment_text
     | COMMENT ON PROCEDURE function_with_argtypes IS comment_text
     | COMMENT ON ROUTINE function_with_argtypes IS comment_text
     | COMMENT ON TRANSFORM FOR typename LANGUAGE name IS comment_text
     | COMMENT ON OPERATOR CLASS any_name USING name IS comment_text
     | COMMENT ON OPERATOR FAMILY any_name USING name IS comment_text
     | COMMENT ON LARGE_P OBJECT_P numericonly IS comment_text
     | COMMENT ON CAST OPEN_PAREN typename AS typename CLOSE_PAREN IS comment_text
     */
  }, {
    key: "visitCommentstmt",
    value: function visitCommentstmt(ctx) {
      if (ctx.object_type_any_name()) {
        var objectType = ctx.object_type_any_name().accept(this);
        if (!objectType) return;
        if (objectType === COMMENT_OBJECT_TYPE.TABLE) {
          var names = ctx.any_name().accept(this);
          var tableName = (0, _lodash.last)(names);
          var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
          var table = findTable(this.data.tables, schemaName, tableName);
          if (!table) return;
          var note = ctx.comment_text().accept(this);
          table.note = {
            value: escapeStr(note)
          };
        }
      }
      if (ctx.COLUMN()) {
        var _names = ctx.any_name().accept(this);
        var fieldName = (0, _lodash.last)(_names);
        var _tableName = _names.length > 1 ? _names[_names.length - 2] : undefined;
        var _schemaName = _names.length > 2 ? _names[_names.length - 3] : undefined;
        var _table2 = findTable(this.data.tables, _schemaName, _tableName);
        var field = _table2.fields.find(function (field) {
          return field.name === fieldName;
        });
        if (!field) return;
        var _note = ctx.comment_text().accept(this);
        field.note = {
          value: escapeStr(_note)
        };
      }
    }

    // sconst | NULL_P
  }, {
    key: "visitComment_text",
    value: function visitComment_text(ctx) {
      if (ctx.NULL_P()) return null;
      return ctx.sconst().accept(this);
    }

    // anysconst opt_uescape
  }, {
    key: "visitSconst",
    value: function visitSconst(ctx) {
      return ctx.anysconst().accept(this);
    }

    // StringConstant | UnicodeEscapeStringConstant | BeginDollarStringConstant DollarText* EndDollarStringConstant | EscapeStringConstant
  }, {
    key: "visitAnysconst",
    value: function visitAnysconst(ctx) {
      var value = ctx.getChild(0).getText();
      return value.slice(1, value.length - 1);
    }

    // TABLE | SEQUENCE | VIEW | MATERIALIZED VIEW | INDEX | FOREIGN TABLE | COLLATION | CONVERSION_P | STATISTICS | TEXT_P SEARCH PARSER | TEXT_P SEARCH DICTIONARY | TEXT_P SEARCH TEMPLATE | TEXT_P SEARCH CONFIGURATION
  }, {
    key: "visitObject_type_any_name",
    value: function visitObject_type_any_name(ctx) {
      if (ctx.TABLE()) return COMMENT_OBJECT_TYPE.TABLE;
    }

    // colid attrs?
  }, {
    key: "visitAny_name",
    value: function visitAny_name(ctx) {
      var r = [ctx.colid().accept(this)];
      if (ctx.attrs()) {
        r.push.apply(r, _toConsumableArray(ctx.attrs().accept(this)));
      }
      return r;
    }

    // (DOT attr_name)+
  }, {
    key: "visitAttrs",
    value: function visitAttrs(ctx) {
      var _this0 = this;
      return ctx.attr_name().map(function (a) {
        return a.accept(_this0);
      });
    }

    /*
     CREATE opt_or_replace AGGREGATE func_name aggr_args definition
     | CREATE opt_or_replace AGGREGATE func_name old_aggr_definition
     | CREATE OPERATOR any_operator definition
     | CREATE TYPE_P any_name definition
     | CREATE TYPE_P any_name
     | CREATE TYPE_P any_name AS OPEN_PAREN opttablefuncelementlist CLOSE_PAREN
     | CREATE TYPE_P any_name AS ENUM_P OPEN_PAREN opt_enum_val_list CLOSE_PAREN
     | CREATE TYPE_P any_name AS RANGE definition
     | CREATE TEXT_P SEARCH PARSER any_name definition
     | CREATE TEXT_P SEARCH DICTIONARY any_name definition
     | CREATE TEXT_P SEARCH TEMPLATE any_name definition
     | CREATE TEXT_P SEARCH CONFIGURATION any_name definition
     | CREATE COLLATION any_name definition
     | CREATE COLLATION IF_P NOT EXISTS any_name definition
     | CREATE COLLATION any_name FROM any_name
     | CREATE COLLATION IF_P NOT EXISTS any_name FROM any_name
     */
  }, {
    key: "visitDefinestmt",
    value: function visitDefinestmt(ctx) {
      if (ctx.TYPE_P() && ctx.opt_enum_val_list()) {
        var names = ctx.any_name(0).accept(this);
        var enumName = (0, _lodash.last)(names);
        var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
        var values = ctx.opt_enum_val_list().accept(this).map(function (e) {
          return {
            name: e
          };
        });
        if (!values) return;

        // enum is a keyworkd
        var _enum = new _AST.Enum({
          name: enumName,
          schemaName: schemaName,
          values: values
        });
        this.data.enums.push(_enum.toJSON());
      }
    }

    // enum_val_list |
  }, {
    key: "visitOpt_enum_val_list",
    value: function visitOpt_enum_val_list(ctx) {
      var _ctx$enum_val_list;
      return (_ctx$enum_val_list = ctx.enum_val_list()) === null || _ctx$enum_val_list === void 0 ? void 0 : _ctx$enum_val_list.accept(this);
    }

    // sconst (COMMA sconst)*
  }, {
    key: "visitEnum_val_list",
    value: function visitEnum_val_list(ctx) {
      var _this1 = this;
      return ctx.sconst().map(function (s) {
        return s.accept(_this1);
      });
    }

    // insertstmt
    //  : opt_with_clause INSERT INTO insert_target insert_rest opt_on_conflict returning_clause
    //  ;
  }, {
    key: "visitInsertstmt",
    value: function visitInsertstmt(ctx) {
      var names = ctx.insert_target().accept(this);
      var tableName = (0, _lodash.last)(names);
      var schemaName = names.length > 1 ? names[names.length - 2] : undefined;
      var _ctx$insert_rest$acce = ctx.insert_rest().accept(this),
        columns = _ctx$insert_rest$acce.columns,
        values = _ctx$insert_rest$acce.values;
      var record = new _AST.TableRecord({
        schemaName: schemaName,
        tableName: tableName,
        columns: columns,
        values: values
      });
      this.data.records.push(record);
    }
  }, {
    key: "visitInsert_target",
    value: function visitInsert_target(ctx) {
      return ctx.qualified_name().accept(this);
    }

    // insert_rest
    //  : selectstmt
    //  | OVERRIDING override_kind VALUE_P selectstmt
    //  | OPEN_PAREN insert_column_list CLOSE_PAREN (OVERRIDING override_kind VALUE_P)? selectstmt
    //  | DEFAULT VALUES
    //  ;
  }, {
    key: "visitInsert_rest",
    value: function visitInsert_rest(ctx) {
      var columns = ctx.insert_column_list() ? ctx.insert_column_list().accept(this) : [];
      var rowsValue = ctx.selectstmt().accept(this) || [];
      // each sub array represents a set of value of a row
      // [
      //   [
      //     { value: '1', type: 'number' },
      //     undefined,
      //     {
      //       value: '{"theme": "dark", "notifications": true}',
      //       type: 'string',
      //       type_name: 'JSONB',
      //       schemaName: null
      //     },
      //     undefined,
      //   ]
      // ]

      var sanitizeRowValue = function sanitizeRowValue(rowValue) {
        return rowValue.filter(function (row) {
          return row;
        }).map(function (_ref) {
          var value = _ref.value,
            type = _ref.type;
          return {
            value: value,
            type: type
          };
        });
      };
      var sanitizedRowsValue = rowsValue.filter(function (rowValue) {
        return Array.isArray(rowValue);
      }).map(sanitizeRowValue);
      return {
        columns: columns,
        values: sanitizedRowsValue
      };
    }

    // insert_column_list
    //  : insert_column_item (COMMA insert_column_item)*
    //  ;
  }, {
    key: "visitInsert_column_list",
    value: function visitInsert_column_list(ctx) {
      var _this10 = this;
      return ctx.insert_column_item().map(function (colItem) {
        return colItem.accept(_this10);
      });
    }

    // insert_column_item
    //  : colid opt_indirection
    //  ;
  }, {
    key: "visitInsert_column_item",
    value: function visitInsert_column_item(ctx) {
      return ctx.colid().accept(this);
    }

    // selectstmt
    //  : select_no_parens
    //  | select_with_parens
    //  ;
  }, {
    key: "visitSelectstmt",
    value: function visitSelectstmt(ctx) {
      if (!ctx.select_no_parens()) {
        return null;
      }
      return ctx.select_no_parens().accept(this);
    }

    // select_no_parens
    //  : select_clause opt_sort_clause (for_locking_clause opt_select_limit | select_limit opt_for_locking_clause)?
    //  | with_clause select_clause opt_sort_clause (for_locking_clause opt_select_limit | select_limit opt_for_locking_clause)?
    //  ;
  }, {
    key: "visitSelect_no_parens",
    value: function visitSelect_no_parens(ctx) {
      return ctx.select_clause().accept(this);
    }

    // select_clause
    //  : simple_select
    //  | select_with_parens
    //  ;
  }, {
    key: "visitSelect_clause",
    value: function visitSelect_clause(ctx) {
      return ctx.simple_select().accept(this);
    }

    // simple_select
    //  : ( SELECT (opt_all_clause into_clause opt_target_list | distinct_clause target_list)
    //          into_clause
    //          from_clause
    //          where_clause
    //          group_clause
    //          having_clause
    //          window_clause
    //      | values_clause
    //      | TABLE relation_expr
    //      | select_with_parens set_operator_with_all_or_distinct (simple_select | select_with_parens)
    //    )
    //       (set_operator_with_all_or_distinct (simple_select | select_with_parens))*
    //  ;
  }, {
    key: "visitSimple_select",
    value: function visitSimple_select(ctx) {
      if (!ctx.values_clause()) {
        return null;
      }
      return ctx.values_clause().accept(this);
    }

    // values_clause
    //  : VALUES OPEN_PAREN expr_list CLOSE_PAREN (COMMA OPEN_PAREN expr_list CLOSE_PAREN)*
    //  ;
  }, {
    key: "visitValues_clause",
    value: function visitValues_clause(ctx) {
      var _this11 = this;
      return ctx.expr_list().map(function (expr) {
        var rawValues = expr.accept(_this11);

        // We get the value of the c_expr through:
        // a_expr->a_expr_qual->a_expr_lessless->a_expr_or->a_expr_and->
        // a_expr_between->a_expr_in->a_expr_unary_not->a_expr_isnull->a_expr_is_not->
        // a_expr_compare->a_expr_like->a_expr_qual_op->a_expr_unary_qualop->a_expr_add->
        // a_expr_mul->a_expr_caret->a_expr_unary_sign->a_expr_at_time_zone->a_expr_collate->
        // a_expr_typecast
        var FLATTEN_DEPTH = 21;
        var rawRowValues = (0, _lodash.flattenDepth)(rawValues, FLATTEN_DEPTH);

        // [
        //   { value: '1', type: 'number' },
        //   undefined,
        //   {
        //     value: '{"theme": "dark", "notifications": true}',
        //     type: 'string',
        //     type_name: 'JSONB',
        //     schemaName: null
        //   },
        //   undefined,
        // ]
        return rawRowValues;
      });
    }

    // a_expr_collate
    //  : a_expr_typecast (COLLATE any_name)?
    //  ;
  }, {
    key: "visitA_expr_collate",
    value: function visitA_expr_collate(ctx) {
      var expressionValueSet = ctx.a_expr_typecast().accept(this);

      // Possible values
      // 1: [ { value: 'inactive', type: 'string' } ]
      // 2: [
      //   { value: '2021-01-05 18:45:00+00', type: 'string' },
      //   undefined,
      //   { type_name: 'TIMESTAMPTZ', schemaName: null }
      // ]
      // eslint-disable-next-line no-unused-vars
      var _expressionValueSet = _slicedToArray(expressionValueSet, 3),
        rawValue = _expressionValueSet[0],
        _ = _expressionValueSet[1],
        _expressionValueSet$ = _expressionValueSet[2],
        rawType = _expressionValueSet$ === void 0 ? {} : _expressionValueSet$;
      var value = rawValue.value,
        type = rawValue.type;
      return _objectSpread({
        value: value,
        type: type
      }, rawType);
    }
  }]);
}(_PostgreSQLParserVisitor["default"]);