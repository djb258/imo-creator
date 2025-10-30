"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _table = _interopRequireDefault(require("./table"));
var _element = _interopRequireDefault(require("./element"));
var _enum2 = _interopRequireDefault(require("./enum"));
var _utils = require("./utils");
var _tableGroup = _interopRequireDefault(require("./tableGroup"));
var _ref2 = _interopRequireDefault(require("./ref"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
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
var Schema = /*#__PURE__*/function (_Element) {
  function Schema() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      alias = _ref.alias,
      note = _ref.note,
      _ref$tables = _ref.tables,
      tables = _ref$tables === void 0 ? [] : _ref$tables,
      _ref$refs = _ref.refs,
      refs = _ref$refs === void 0 ? [] : _ref$refs,
      _ref$enums = _ref.enums,
      enums = _ref$enums === void 0 ? [] : _ref$enums,
      _ref$tableGroups = _ref.tableGroups,
      tableGroups = _ref$tableGroups === void 0 ? [] : _ref$tableGroups,
      token = _ref.token,
      _ref$database = _ref.database,
      database = _ref$database === void 0 ? {} : _ref$database,
      _ref$noteToken = _ref.noteToken,
      noteToken = _ref$noteToken === void 0 ? null : _ref$noteToken;
    _classCallCheck(this, Schema);
    _this = _callSuper(this, Schema, [token]);
    _this.tables = [];
    _this.enums = [];
    _this.tableGroups = [];
    _this.refs = [];
    _this.name = name;
    _this.note = note ? (0, _lodash.get)(note, 'value', note) : null;
    _this.noteToken = note ? (0, _lodash.get)(note, 'token', noteToken) : null;
    _this.alias = alias;
    _this.database = database;
    _this.dbState = _this.database.dbState;
    _this.generateId();
    _this.processEnums(enums);
    _this.processTables(tables);
    _this.processRefs(refs);
    _this.processTableGroups(tableGroups);
    return _this;
  }
  _inherits(Schema, _Element);
  return _createClass(Schema, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('schemaId');
    }
  }, {
    key: "processTables",
    value: function processTables(rawTables) {
      var _this2 = this;
      rawTables.forEach(function (table) {
        _this2.pushTable(new _table["default"](_objectSpread(_objectSpread({}, table), {}, {
          schema: _this2
        })));
      });
    }
  }, {
    key: "pushTable",
    value: function pushTable(table) {
      this.checkTable(table);
      this.tables.push(table);
    }
  }, {
    key: "checkTable",
    value: function checkTable(table) {
      if (this.tables.some(function (t) {
        return t.name === table.name;
      })) {
        table.error("Table ".concat((0, _utils.shouldPrintSchema)(this) ? "\"".concat(this.name, "\".") : '', "\"").concat(table.name, "\" existed"));
      }
    }
  }, {
    key: "findTable",
    value: function findTable(tableName) {
      return this.tables.find(function (t) {
        return t.name === tableName;
      });
    }
  }, {
    key: "processEnums",
    value: function processEnums(rawEnums) {
      var _this3 = this;
      rawEnums.forEach(function (_enum) {
        _this3.pushEnum(new _enum2["default"](_objectSpread(_objectSpread({}, _enum), {}, {
          schema: _this3
        })));
      });
    }
  }, {
    key: "pushEnum",
    value: function pushEnum(_enum) {
      this.checkEnum(_enum);
      this.enums.push(_enum);
    }
  }, {
    key: "checkEnum",
    value: function checkEnum(_enum) {
      if (this.enums.some(function (e) {
        return e.name === _enum.name;
      })) {
        _enum.error("Enum ".concat((0, _utils.shouldPrintSchema)(this) ? "\"".concat(this.name, "\".") : '', "\"").concat(_enum.name, "\" existed"));
      }
    }
  }, {
    key: "processRefs",
    value: function processRefs(rawRefs) {
      var _this4 = this;
      rawRefs.forEach(function (ref) {
        _this4.pushRef(new _ref2["default"](_objectSpread(_objectSpread({}, ref), {}, {
          schema: _this4
        })));
      });
    }
  }, {
    key: "pushRef",
    value: function pushRef(ref) {
      this.checkRef(ref);
      this.refs.push(ref);
    }
  }, {
    key: "checkRef",
    value: function checkRef(ref) {
      if (this.refs.some(function (r) {
        return r.equals(ref);
      })) {
        var endpoint1 = ref.endpoints[0];
        var fieldList1 = endpoint1.fieldNames.map(JSON.stringify).join(', ');
        var endpoint2 = ref.endpoints[1];
        var fieldList2 = endpoint2.fieldNames.map(JSON.stringify).join(', ');
        var ref1 = "\"".concat(endpoint1.schemaName ? "".concat(endpoint1.schemaName, "\".\"") : '').concat(endpoint1.tableName, "\"(").concat(fieldList1, ")");
        var ref2 = "\"".concat(endpoint2.schemaName ? "".concat(endpoint2.schemaName, "\".\"") : '').concat(endpoint2.tableName, "\"(").concat(fieldList2, ")");
        ref.error("Reference with the same endpoints already exists: ".concat(ref1, " references ").concat(ref2));
      }
    }
  }, {
    key: "processTableGroups",
    value: function processTableGroups(rawTableGroups) {
      var _this5 = this;
      rawTableGroups.forEach(function (tableGroup) {
        _this5.pushTableGroup(new _tableGroup["default"](_objectSpread(_objectSpread({}, tableGroup), {}, {
          schema: _this5
        })));
      });
    }
  }, {
    key: "pushTableGroup",
    value: function pushTableGroup(tableGroup) {
      this.checkTableGroup(tableGroup);
      this.tableGroups.push(tableGroup);
    }
  }, {
    key: "checkTableGroup",
    value: function checkTableGroup(tableGroup) {
      if (this.tableGroups.some(function (tg) {
        return tg.name === tableGroup.name;
      })) {
        tableGroup.error("Table Group ".concat((0, _utils.shouldPrintSchema)(this) ? "\"".concat(this.name, "\".") : '', "\"").concat(tableGroup.name, "\" existed"));
      }
    }
  }, {
    key: "checkSameId",
    value: function checkSameId(schema) {
      return this.name === schema.name || this.alias === schema.name || this.name === schema.alias || this.alias && this.alias === schema.alias;
    }
  }, {
    key: "export",
    value: function _export() {
      return _objectSpread(_objectSpread({}, this.shallowExport()), this.exportChild());
    }
  }, {
    key: "exportChild",
    value: function exportChild() {
      return {
        tables: this.tables.map(function (t) {
          return t["export"]();
        }),
        enums: this.enums.map(function (e) {
          return e["export"]();
        }),
        tableGroups: this.tableGroups.map(function (tg) {
          return tg["export"]();
        }),
        refs: this.refs.map(function (r) {
          return r["export"]();
        })
      };
    }
  }, {
    key: "exportChildIds",
    value: function exportChildIds() {
      return {
        tableIds: this.tables.map(function (t) {
          return t.id;
        }),
        enumIds: this.enums.map(function (e) {
          return e.id;
        }),
        tableGroupIds: this.tableGroups.map(function (tg) {
          return tg.id;
        }),
        refIds: this.refs.map(function (r) {
          return r.id;
        })
      };
    }
  }, {
    key: "exportParentIds",
    value: function exportParentIds() {
      return {
        databaseId: this.database.id
      };
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      return {
        name: this.name,
        note: this.note,
        alias: this.alias
      };
    }
  }, {
    key: "normalize",
    value: function normalize(model) {
      model.schemas[this.id] = _objectSpread(_objectSpread(_objectSpread({
        id: this.id
      }, this.shallowExport()), this.exportChildIds()), this.exportParentIds());
      this.tables.forEach(function (table) {
        return table.normalize(model);
      });
      this.enums.forEach(function (_enum) {
        return _enum.normalize(model);
      });
      this.tableGroups.forEach(function (tableGroup) {
        return tableGroup.normalize(model);
      });
      this.refs.forEach(function (ref) {
        return ref.normalize(model);
      });
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Schema;