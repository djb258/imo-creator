"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireWildcard(require("lodash"));
var _schema = _interopRequireDefault(require("./schema"));
var _ref3 = _interopRequireDefault(require("./ref"));
var _enum2 = _interopRequireDefault(require("./enum"));
var _tableGroup = _interopRequireDefault(require("./tableGroup"));
var _table = _interopRequireDefault(require("./table"));
var _stickyNote = _interopRequireDefault(require("./stickyNote"));
var _element = _interopRequireDefault(require("./element"));
var _config = require("./config");
var _dbState = _interopRequireDefault(require("./dbState"));
var _tablePartial = _interopRequireDefault(require("./tablePartial"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
var Database = /*#__PURE__*/function (_Element) {
  function Database(_ref) {
    var _this;
    var _ref$schemas = _ref.schemas,
      schemas = _ref$schemas === void 0 ? [] : _ref$schemas,
      _ref$tables = _ref.tables,
      tables = _ref$tables === void 0 ? [] : _ref$tables,
      _ref$notes = _ref.notes,
      notes = _ref$notes === void 0 ? [] : _ref$notes,
      _ref$enums = _ref.enums,
      enums = _ref$enums === void 0 ? [] : _ref$enums,
      _ref$refs = _ref.refs,
      refs = _ref$refs === void 0 ? [] : _ref$refs,
      _ref$tableGroups = _ref.tableGroups,
      tableGroups = _ref$tableGroups === void 0 ? [] : _ref$tableGroups,
      _ref$project = _ref.project,
      project = _ref$project === void 0 ? {} : _ref$project,
      _ref$aliases = _ref.aliases,
      aliases = _ref$aliases === void 0 ? [] : _ref$aliases,
      _ref$records = _ref.records,
      records = _ref$records === void 0 ? [] : _ref$records,
      _ref$tablePartials = _ref.tablePartials,
      tablePartials = _ref$tablePartials === void 0 ? [] : _ref$tablePartials;
    _classCallCheck(this, Database);
    _this = _callSuper(this, Database);
    _this.dbState = new _dbState["default"]();
    _this.generateId();
    _this.hasDefaultSchema = false;
    _this.schemas = [];
    _this.notes = [];
    _this.note = project.note ? (0, _lodash.get)(project, 'note.value', project.note) : null;
    _this.noteToken = project.note ? (0, _lodash.get)(project, 'note.token', project.noteToken) : null;
    _this.databaseType = project.database_type;
    _this.name = project.name;
    _this.token = project.token;
    _this.aliases = aliases;
    _this.records = [];
    _this.tablePartials = [];

    // The global array containing references with 1 endpoint being a field injected from a partial to a table
    // These refs are add to this array when resolving partials in tables (`Table.processPartials()`)
    _this.injectedRawRefs = [];

    // The process order is important. Do not change !
    _this.processNotes(notes);
    _this.processRecords(records);
    _this.processTablePartials(tablePartials);
    _this.processSchemas(schemas);
    _this.processSchemaElements(enums, _config.ENUM);
    _this.processSchemaElements(tables, _config.TABLE);
    _this.processSchemaElements(notes, _config.NOTE);
    _this.processSchemaElements(refs, _config.REF);
    _this.processSchemaElements(tableGroups, _config.TABLE_GROUP);
    _this.injectedRawRefs.forEach(function (rawRef) {
      var schema = _this.findOrCreateSchema(_config.DEFAULT_SCHEMA_NAME);
      var ref = new _ref3["default"](_objectSpread(_objectSpread({}, rawRef), {}, {
        schema: schema
      }));
      if (schema.refs.some(function (r) {
        return r.equals(ref);
      })) return;
      schema.pushRef(ref);
    });
    return _this;
  }
  _inherits(Database, _Element);
  return _createClass(Database, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('dbId');
    }
  }, {
    key: "processNotes",
    value: function processNotes(rawNotes) {
      var _this2 = this;
      rawNotes.forEach(function (note) {
        _this2.pushNote(new _stickyNote["default"](_objectSpread(_objectSpread({}, note), {}, {
          database: _this2
        })));
      });
    }
  }, {
    key: "processRecords",
    value: function processRecords(rawRecords) {
      var _this3 = this;
      rawRecords.forEach(function (_ref2) {
        var schemaName = _ref2.schemaName,
          tableName = _ref2.tableName,
          columns = _ref2.columns,
          values = _ref2.values;
        _this3.records.push({
          id: _this3.dbState.generateId('recordId'),
          schemaName: schemaName,
          tableName: tableName,
          columns: columns,
          values: values
        });
      });
    }
  }, {
    key: "processTablePartials",
    value: function processTablePartials(rawTablePartials) {
      var _this4 = this;
      rawTablePartials.forEach(function (rawTablePartial) {
        _this4.tablePartials.push(new _tablePartial["default"](_objectSpread(_objectSpread({}, rawTablePartial), {}, {
          dbState: _this4.dbState
        })));
      });
    }
  }, {
    key: "pushNote",
    value: function pushNote(note) {
      this.checkNote(note);
      this.notes.push(note);
    }
  }, {
    key: "checkNote",
    value: function checkNote(note) {
      if (this.notes.some(function (n) {
        return n.name === note.name;
      })) {
        note.error("Notes ".concat(note.name, " existed"));
      }
    }
  }, {
    key: "processSchemas",
    value: function processSchemas(rawSchemas) {
      var _this5 = this;
      rawSchemas.forEach(function (schema) {
        _this5.pushSchema(new _schema["default"](_objectSpread(_objectSpread({}, schema), {}, {
          database: _this5
        })));
      });
    }
  }, {
    key: "pushSchema",
    value: function pushSchema(schema) {
      this.checkSchema(schema);
      this.schemas.push(schema);
    }
  }, {
    key: "checkSchema",
    value: function checkSchema(schema) {
      if (this.schemas.some(function (s) {
        return s.name === schema.name;
      })) {
        schema.error("Schemas ".concat(schema.name, " existed"));
      }
    }
  }, {
    key: "processSchemaElements",
    value: function processSchemaElements(elements, elementType) {
      var _this6 = this;
      var schema;
      elements.forEach(function (element) {
        if (element.schemaName) {
          schema = _this6.findOrCreateSchema(element.schemaName);
          if (element.schemaName === _config.DEFAULT_SCHEMA_NAME) {
            // this.hasDefaultSchema = true;
          }
        } else {
          schema = _this6.findOrCreateSchema(_config.DEFAULT_SCHEMA_NAME);
        }
        switch (elementType) {
          case _config.TABLE:
            schema.pushTable(new _table["default"](_objectSpread(_objectSpread({}, element), {}, {
              schema: schema
            })));
            break;
          case _config.ENUM:
            schema.pushEnum(new _enum2["default"](_objectSpread(_objectSpread({}, element), {}, {
              schema: schema
            })));
            break;
          case _config.TABLE_GROUP:
            schema.pushTableGroup(new _tableGroup["default"](_objectSpread(_objectSpread({}, element), {}, {
              schema: schema
            })));
            break;
          case _config.REF:
            schema.pushRef(new _ref3["default"](_objectSpread(_objectSpread({}, element), {}, {
              schema: schema
            })));
            break;
          default:
            break;
        }
      });
    }
  }, {
    key: "findOrCreateSchema",
    value: function findOrCreateSchema(schemaName) {
      var schema = this.schemas.find(function (s) {
        return s.name === schemaName || s.alias === schemaName;
      });
      // create new schema if schema not found
      if (!schema) {
        schema = new _schema["default"]({
          name: schemaName,
          note: {
            value: schemaName === _config.DEFAULT_SCHEMA_NAME ? "Default ".concat(_lodash["default"].capitalize(_config.DEFAULT_SCHEMA_NAME), " Schema") : null
          },
          database: this
        });
        this.pushSchema(schema);
      }
      return schema;
    }
  }, {
    key: "findTableAlias",
    value: function findTableAlias(alias) {
      var sym = this.aliases.find(function (a) {
        return a.name === alias;
      });
      if (!sym || sym.kind !== 'table') return null;
      var schemaName = sym.value.schemaName || _config.DEFAULT_SCHEMA_NAME;
      var schema = this.schemas.find(function (s) {
        return s.name === schemaName;
      });
      if (!schema) return null;
      var tableName = sym.value.tableName;
      var table = schema.tables.find(function (t) {
        return t.name === tableName;
      });
      return table;
    }
  }, {
    key: "findTable",
    value: function findTable(schemaName, tableName) {
      var table = null;
      if (!schemaName) {
        table = this.findTableAlias(tableName);
        if (table) return table;
      }
      var schema = this.findOrCreateSchema(schemaName || _config.DEFAULT_SCHEMA_NAME);
      if (!schema) {
        this.error("Schema ".concat(schemaName || _config.DEFAULT_SCHEMA_NAME, " don't exist"));
      }
      return schema.findTable(tableName);
    }
  }, {
    key: "findEnum",
    value: function findEnum(schemaName, name) {
      var schema = this.schemas.find(function (s) {
        return s.name === schemaName || s.alias === schemaName;
      });
      if (!schema) return null;
      var _enum = schema.enums.find(function (e) {
        return e.name === name;
      });
      return _enum;
    }
  }, {
    key: "findTablePartial",
    value: function findTablePartial(name) {
      return this.tablePartials.find(function (tp) {
        return tp.name === name;
      });
    }
  }, {
    key: "export",
    value: function _export() {
      return _objectSpread({}, this.exportChild());
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      return {
        hasDefaultSchema: this.hasDefaultSchema,
        note: this.note,
        databaseType: this.databaseType,
        name: this.name
      };
    }
  }, {
    key: "exportChild",
    value: function exportChild() {
      return {
        schemas: this.schemas.map(function (s) {
          return s["export"]();
        }),
        notes: this.notes.map(function (n) {
          return n["export"]();
        }),
        records: this.records.map(function (r) {
          return _objectSpread({}, r);
        })
      };
    }
  }, {
    key: "exportChildIds",
    value: function exportChildIds() {
      return {
        schemaIds: this.schemas.map(function (s) {
          return s.id;
        }),
        noteIds: this.notes.map(function (n) {
          return n.id;
        })
      };
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var normalizedModel = {
        database: _defineProperty({}, this.id, _objectSpread(_objectSpread({
          id: this.id
        }, this.shallowExport()), this.exportChildIds())),
        schemas: {},
        notes: {},
        refs: {},
        enums: {},
        tableGroups: {},
        tables: {},
        endpoints: {},
        enumValues: {},
        indexes: {},
        indexColumns: {},
        fields: {},
        records: {},
        tablePartials: {}
      };
      this.schemas.forEach(function (schema) {
        return schema.normalize(normalizedModel);
      });
      this.notes.forEach(function (note) {
        return note.normalize(normalizedModel);
      });
      this.records.forEach(function (record) {
        normalizedModel.records[record.id] = _objectSpread({}, record);
      });
      this.tablePartials.forEach(function (tablePartial) {
        return tablePartial.normalize(normalizedModel);
      });
      return normalizedModel;
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Database;