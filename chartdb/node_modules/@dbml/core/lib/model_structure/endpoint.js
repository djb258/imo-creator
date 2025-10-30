"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _element = _interopRequireDefault(require("./element"));
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
var Endpoint = /*#__PURE__*/function (_Element) {
  function Endpoint(_ref) {
    var _this;
    var tableName = _ref.tableName,
      schemaName = _ref.schemaName,
      fieldNames = _ref.fieldNames,
      relation = _ref.relation,
      token = _ref.token,
      ref = _ref.ref;
    _classCallCheck(this, Endpoint);
    _this = _callSuper(this, Endpoint, [token]);
    _this.relation = relation;
    _this.schemaName = schemaName;
    _this.tableName = tableName;
    _this.fieldNames = fieldNames;
    _this.fields = [];
    _this.ref = ref;
    _this.dbState = _this.ref.dbState;
    _this.generateId();
    // Use name of schema,table and field object
    // Name in constructor could be alias
    var schema = ref.schema.database.findOrCreateSchema(schemaName || _config.DEFAULT_SCHEMA_NAME);
    var table = schema.database.findTable(schemaName, tableName);
    if (!table) {
      _this.error("Can't find table ".concat((0, _utils.shouldPrintSchemaName)(schemaName) ? "\"".concat(schemaName, "\".") : '', "\"").concat(tableName, "\""));
    }
    _this.setFields(fieldNames, table);
    return _this;
  }
  _inherits(Endpoint, _Element);
  return _createClass(Endpoint, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('endpointId');
    }
  }, {
    key: "equals",
    value: function equals(endpoint) {
      if (this.fields.length !== endpoint.fields.length) return false;
      return this.compareFields(endpoint);
    }
  }, {
    key: "compareFields",
    value: function compareFields(endpoint) {
      var sortedThisFieldIds = this.fields.map(function (field) {
        return field.id;
      }).sort();
      var sortedEndpointFieldIds = endpoint.fields.map(function (field) {
        return field.id;
      }).sort();
      for (var i = 0; i < sortedThisFieldIds.length; i += 1) {
        if (sortedThisFieldIds[i] !== sortedEndpointFieldIds[i]) return false;
      }
      return true;
    }
  }, {
    key: "export",
    value: function _export() {
      return _objectSpread({}, this.shallowExport());
    }
  }, {
    key: "exportParentIds",
    value: function exportParentIds() {
      return {
        refId: this.ref.id,
        fieldIds: this.fields.map(function (field) {
          return field.id;
        })
      };
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      return {
        schemaName: this.schemaName,
        tableName: this.tableName,
        fieldNames: this.fieldNames,
        relation: this.relation
      };
    }
  }, {
    key: "setFields",
    value: function setFields(fieldNames, table) {
      var _this2 = this;
      var newFieldNames = fieldNames && fieldNames.length ? _toConsumableArray(fieldNames) : [];
      if (!newFieldNames.length) {
        var fieldHasPK = table.fields.find(function (field) {
          return field.pk;
        });
        if (fieldHasPK) {
          newFieldNames.push(fieldHasPK.name);
        } else {
          var indexHasPK = table.indexes.find(function (index) {
            return index.pk;
          });
          if (indexHasPK) {
            newFieldNames = indexHasPK.columns.map(function (column) {
              return column.value;
            });
          } else {
            this.error("Can't find primary or composite key in table ".concat((0, _utils.shouldPrintSchema)(table.schema) ? "\"".concat(table.schema.name, "\".") : '', "\"").concat(table.name, "\""));
          }
        }
      }
      newFieldNames.forEach(function (fieldName) {
        var field = table.findField(fieldName);
        if (!field) {
          _this2.error("Can't find field ".concat((0, _utils.shouldPrintSchema)(table.schema) ? "\"".concat(table.schema.name, "\".") : '', "\"").concat(fieldName, "\" in table \"").concat(table.name, "\""));
        }
        _this2.fields.push(field);
        field.pushEndpoint(_this2);
      });
    }
  }, {
    key: "normalize",
    value: function normalize(model) {
      model.endpoints[this.id] = _objectSpread(_objectSpread({
        id: this.id
      }, this.shallowExport()), this.exportParentIds());
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Endpoint;