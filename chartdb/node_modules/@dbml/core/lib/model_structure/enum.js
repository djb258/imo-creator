"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _element = _interopRequireDefault(require("./element"));
var _enumValue = _interopRequireDefault(require("./enumValue"));
var _utils = require("./utils");
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
var Enum = /*#__PURE__*/function (_Element) {
  function Enum() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      token = _ref.token,
      values = _ref.values,
      note = _ref.note,
      schema = _ref.schema,
      _ref$noteToken = _ref.noteToken,
      noteToken = _ref$noteToken === void 0 ? null : _ref$noteToken;
    _classCallCheck(this, Enum);
    _this = _callSuper(this, Enum, [token]);
    if (!name) {
      _this.error('Enum must have a name');
    }
    _this.name = name;
    _this.note = note ? (0, _lodash.get)(note, 'value', note) : null;
    _this.noteToken = note ? (0, _lodash.get)(note, 'token', noteToken) : null;
    _this.values = [];
    _this.fields = [];
    _this.schema = schema;
    _this.dbState = _this.schema.dbState;
    _this.generateId();
    _this.processValues(values);
    return _this;
  }
  _inherits(Enum, _Element);
  return _createClass(Enum, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('enumId');
    }
  }, {
    key: "processValues",
    value: function processValues(rawValues) {
      var _this2 = this;
      rawValues.forEach(function (value) {
        _this2.pushValue(new _enumValue["default"](_objectSpread(_objectSpread({}, value), {}, {
          _enum: _this2
        })));
      });
    }
  }, {
    key: "pushValue",
    value: function pushValue(value) {
      this.checkValue(value);
      this.values.push(value);
    }
  }, {
    key: "checkValue",
    value: function checkValue(value) {
      if (this.values.some(function (v) {
        return v.name === value.name;
      })) {
        value.error("Enum value \"".concat(value.name, "\" existed in enum ").concat((0, _utils.shouldPrintSchema)(this.schema) ? "\"".concat(this.schema.name, "\".") : '', "\"").concat(this.name, "\""));
      }
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
        return f.id === field.id;
      })) {
        this.error("Field ".concat((0, _utils.shouldPrintSchema)(field.table.schema) ? "\"".concat(field.table.schema.name, "\".") : '', "\"").concat(field.table.name, "\".\"").concat(field.name, "\" already associated with enum ").concat((0, _utils.shouldPrintSchema)(this.schema) ? "\"".concat(this.schema.name, "\".") : '').concat(this.name, "\""));
      }
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
        values: this.values.map(function (value) {
          return value["export"]();
        })
      };
    }
  }, {
    key: "exportChildIds",
    value: function exportChildIds() {
      return {
        valueIds: this.values.map(function (value) {
          return value.id;
        }),
        fieldIds: this.fields.map(function (field) {
          return field.id;
        })
      };
    }
  }, {
    key: "exportParentIds",
    value: function exportParentIds() {
      return {
        schemaId: this.schema.id
      };
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      return {
        name: this.name,
        note: this.note
      };
    }
  }, {
    key: "normalize",
    value: function normalize(model) {
      model.enums[this.id] = _objectSpread(_objectSpread(_objectSpread({
        id: this.id
      }, this.shallowExport()), this.exportChildIds()), this.exportParentIds());
      this.values.forEach(function (v) {
        return v.normalize(model);
      });
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Enum;