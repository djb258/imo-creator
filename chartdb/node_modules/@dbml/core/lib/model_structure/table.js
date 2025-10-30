"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _element = _interopRequireDefault(require("./element"));
var _field = _interopRequireDefault(require("./field"));
var _indexes = _interopRequireDefault(require("./indexes"));
var _config = require("./config");
var _utils = require("./utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
var Table = /*#__PURE__*/function (_Element) {
  function Table() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      alias = _ref.alias,
      note = _ref.note,
      _ref$fields = _ref.fields,
      fields = _ref$fields === void 0 ? [] : _ref$fields,
      _ref$indexes = _ref.indexes,
      indexes = _ref$indexes === void 0 ? [] : _ref$indexes,
      _ref$schema = _ref.schema,
      schema = _ref$schema === void 0 ? {} : _ref$schema,
      token = _ref.token,
      headerColor = _ref.headerColor,
      _ref$noteToken = _ref.noteToken,
      noteToken = _ref$noteToken === void 0 ? null : _ref$noteToken,
      _ref$partials = _ref.partials,
      partials = _ref$partials === void 0 ? [] : _ref$partials;
    _classCallCheck(this, Table);
    _this = _callSuper(this, Table, [token]);
    _this.name = name;
    _this.alias = alias;
    _this.note = note ? (0, _lodash.get)(note, 'value', note) : null;
    _this.noteToken = note ? (0, _lodash.get)(note, 'token', noteToken) : null;
    _this.headerColor = headerColor;
    _this.fields = [];
    _this.indexes = [];
    _this.schema = schema;
    _this.partials = partials;
    _this.dbState = _this.schema.dbState;
    _this.generateId();
    _this.processFields(fields);
    // Process partials after fields to get injected fields' orders
    // Process partials before indexes for indexes to properly check all owned and injected columns
    _this.processPartials();
    _this.checkFieldCount();
    _this.processIndexes(indexes);
    return _this;
  }
  _inherits(Table, _Element);
  return _createClass(Table, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('tableId');
    }
  }, {
    key: "checkFieldCount",
    value: function checkFieldCount() {
      if (this.fields.length === 0) {
        this.error('Table must have at least one field');
      }
    }
  }, {
    key: "processFields",
    value: function processFields(rawFields) {
      var _this2 = this;
      rawFields.forEach(function (field) {
        _this2.pushField(new _field["default"](_objectSpread(_objectSpread({}, field), {}, {
          table: _this2
        })));
      });
    }
  }, {
    key: "pushField",
    value: function pushField(field) {
      this.checkField(field);
      this.fields.push(field);
    }
  }, {
    key: "checkField",
    value: function checkField(field) {
      if (this.fields.some(function (f) {
        return f.name === field.name;
      })) {
        field.error("Field \"".concat(field.name, "\" existed in table ").concat((0, _utils.shouldPrintSchema)(this.schema) ? "\"".concat(this.schema.name, "\".") : '', "\"").concat(this.name, "\""));
      }
    }
  }, {
    key: "processIndexes",
    value: function processIndexes(rawIndexes) {
      var _this3 = this;
      rawIndexes.forEach(function (index) {
        _this3.pushIndex(new _indexes["default"](_objectSpread(_objectSpread({}, index), {}, {
          table: _this3
        })));
      });
    }
  }, {
    key: "pushIndex",
    value: function pushIndex(index) {
      this.checkIndex(index);
      this.indexes.push(index);
    }
  }, {
    key: "checkIndex",
    value: function checkIndex(index) {
      var _this4 = this;
      index.columns.forEach(function (column) {
        if (column.type === 'column' && !_this4.findField(column.value)) {
          index.error("Column \"".concat(column.value, "\" do not exist in table ").concat((0, _utils.shouldPrintSchema)(_this4.schema) ? "\"".concat(_this4.schema.name, "\".") : '', "\"").concat(_this4.name, "\""));
        }
      });
    }
  }, {
    key: "findField",
    value: function findField(fieldName) {
      return this.fields.find(function (f) {
        return f.name === fieldName;
      });
    }
  }, {
    key: "checkSameId",
    value: function checkSameId(table) {
      return this.schema.checkSameId(table.schemaName || _config.DEFAULT_SCHEMA_NAME) && (this.name === table.name || this.alias === table.name || this.name === table.alias || this.alias && this.alias === table.alias);
    }
  }, {
    key: "processPartials",
    value: function processPartials() {
      var _this$partials,
        _this5 = this;
      if (!((_this$partials = this.partials) !== null && _this$partials !== void 0 && _this$partials.length)) return;
      /**
       * When encountering conflicting columns or settings with identical names, the following resolution order is applied:
       * 1. Local Table Definition: If a definition exists within the local table, it takes precedence.
       * 2. Last Partial Definition: If no local definition is found,
       *  the definition from the last partial (in dbml source) containing the conflicting name is used.
       *
       * each partial has the following structure:
       * {
       *   name: string,
       *   order: number, // determine where the partials fields will be injected in comparison with the table fields and other partials
       *   token, // token of the partial definition
       * }
       */
      var existingFieldNames = new Set(this.fields.map(function (f) {
        return f.name;
      }));
      var existingSettingNames = new Set();
      if (!(0, _lodash.isNil)(this.note)) existingSettingNames.add('note');
      if (!(0, _lodash.isNil)(this.headerColor)) existingSettingNames.add('headerColor');

      // descending order, we'll inserted the partial fields from tail to head
      var sortedPartials = this.partials.sort(function (a, b) {
        return b.order - a.order;
      });

      // insert placeholder into table.fields
      sortedPartials.toReversed().forEach(function (partial) {
        _this5.fields.splice(partial.order, 0, 'dummy');
      });
      sortedPartials.forEach(function (partial) {
        var tablePartial = _this5.schema.database.findTablePartial(partial.name);
        if (!tablePartial) _this5.error("Table partial ".concat(partial.name, " not found"), partial.token);
        partial.id = tablePartial.id;
        if (tablePartial.fields) {
          var _this5$fields;
          // ignore fields that already exist in the table, or have been added by a later partial
          var rawFields = tablePartial.fields.filter(function (f) {
            return !existingFieldNames.has(f.name);
          });
          var fields = rawFields.map(function (rawField) {
            existingFieldNames.add(rawField.name);

            // convert inline_refs from injected fields to refs
            if (rawField.inline_refs) {
              rawField.inline_refs.forEach(function (iref) {
                var _this5$schema;
                var ref = {
                  token: rawField.token,
                  endpoints: [{
                    tableName: _this5.name,
                    schemaName: (_this5$schema = _this5.schema) === null || _this5$schema === void 0 ? void 0 : _this5$schema.name,
                    fieldNames: [rawField.name],
                    relation: ['-', '<'].includes(iref.relation) ? '1' : '*',
                    token: rawField.token
                  }, {
                    tableName: iref.tableName,
                    schemaName: iref.schemaName,
                    fieldNames: iref.fieldNames,
                    relation: ['-', '>'].includes(iref.relation) ? '1' : '*',
                    token: iref.token
                  }],
                  injectedPartial: tablePartial
                };
                // The global array containing references with 1 endpoint being a field injected from a partial to a table
                _this5.schema.database.injectedRawRefs.push(ref);
              });
            }
            return new _field["default"](_objectSpread(_objectSpread({}, rawField), {}, {
              noteToken: null,
              table: _this5,
              injectedPartial: tablePartial,
              injectedToken: partial.token
            }));
          });
          (_this5$fields = _this5.fields).splice.apply(_this5$fields, [partial.order, 1].concat(_toConsumableArray(fields)));
        } else {
          _this5.fields.splice(partial.order, 1); // still need to remove the dummy element, even when there's no field in the partial
        }

        // merge settings
        if (!existingSettingNames.has('note') && !(0, _lodash.isNil)(tablePartial.note)) {
          _this5.noteToken = null;
          _this5.note = tablePartial.note;
          existingSettingNames.add('note');
        }
        if (!existingSettingNames.has('headerColor') && !(0, _lodash.isNil)(tablePartial.headerColor)) {
          _this5.headerColor = tablePartial.headerColor;
          existingSettingNames.add('headerColor');
        }

        // merge indexes
        tablePartial.indexes.forEach(function (index) {
          _this5.indexes.push(new _indexes["default"](_objectSpread(_objectSpread({}, index), {}, {
            table: _this5,
            injectedPartial: tablePartial
          })));
        });
      });
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
        fields: this.fields.map(function (f) {
          return f["export"]();
        }),
        indexes: this.indexes.map(function (i) {
          return i["export"]();
        })
      };
    }
  }, {
    key: "exportChildIds",
    value: function exportChildIds() {
      return {
        fieldIds: this.fields.map(function (f) {
          return f.id;
        }),
        indexIds: this.indexes.map(function (i) {
          return i.id;
        })
      };
    }
  }, {
    key: "exportParentIds",
    value: function exportParentIds() {
      return {
        schemaId: this.schema.id,
        groupId: this.group ? this.group.id : null
      };
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      return {
        name: this.name,
        alias: this.alias,
        note: this.note,
        headerColor: this.headerColor,
        partials: this.partials
      };
    }
  }, {
    key: "normalize",
    value: function normalize(model) {
      model.tables[this.id] = _objectSpread(_objectSpread(_objectSpread({
        id: this.id
      }, this.shallowExport()), this.exportChildIds()), this.exportParentIds());
      this.fields.forEach(function (field) {
        return field.normalize(model);
      });
      this.indexes.forEach(function (index) {
        return index.normalize(model);
      });
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Table;