"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _element = _interopRequireDefault(require("./element"));
var _config = require("./config");
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
var Field = /*#__PURE__*/function (_Element) {
  function Field() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      type = _ref.type,
      unique = _ref.unique,
      pk = _ref.pk,
      token = _ref.token,
      notNull = _ref.not_null,
      note = _ref.note,
      dbdefault = _ref.dbdefault,
      increment = _ref.increment,
      _ref$table = _ref.table,
      table = _ref$table === void 0 ? {} : _ref$table,
      _ref$noteToken = _ref.noteToken,
      noteToken = _ref$noteToken === void 0 ? null : _ref$noteToken,
      _ref$injectedPartial = _ref.injectedPartial,
      injectedPartial = _ref$injectedPartial === void 0 ? null : _ref$injectedPartial,
      _ref$injectedToken = _ref.injectedToken,
      injectedToken = _ref$injectedToken === void 0 ? null : _ref$injectedToken;
    _classCallCheck(this, Field);
    _this = _callSuper(this, Field, [token]);
    if (!name) {
      _this.error('Field must have a name');
    }
    if (!type) {
      _this.error('Field must have a type');
    }
    _this.name = name;
    // type : { type_name, value, schemaName }
    _this.type = type;
    _this.unique = unique;
    _this.pk = pk;
    _this.not_null = notNull;
    _this.note = note ? (0, _lodash.get)(note, 'value', note) : null;
    _this.noteToken = note ? (0, _lodash.get)(note, 'token', noteToken) : null;
    _this.dbdefault = dbdefault;
    _this.increment = increment;
    _this.endpoints = [];
    _this.table = table;
    _this.injectedPartial = injectedPartial;
    _this.injectedToken = injectedToken;
    _this.dbState = _this.table.dbState;
    _this.generateId();
    _this.bindType();
    return _this;
  }
  _inherits(Field, _Element);
  return _createClass(Field, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('fieldId');
    }
  }, {
    key: "bindType",
    value: function bindType() {
      var typeName = this.type.type_name;
      var typeSchemaName = this.type.schemaName || _config.DEFAULT_SCHEMA_NAME;
      if (this.type.schemaName) {
        var _enum = this.table.schema.database.findEnum(typeSchemaName, typeName);
        if (!_enum) {
          // SQL allow definition of non-enum type to be used as column type, which we don't have equivalent dbml counterpart.
          // So instead of throwing errors on those type, we can view the type as plain text for the purpose of importing to dbml.
          this.type.type_name = "".concat(typeSchemaName, ".").concat(typeName);
          // We set this field to avoid doubling schema name when exporting this type to SQL
          // e.g. to avoid `schema.schema.type`
          this.type.originalTypeName = typeName;
          return;
        }
        this._enum = _enum;
        _enum.pushField(this);
      } else {
        var _enum2 = this.table.schema.database.findEnum(typeSchemaName, typeName);
        if (!_enum2) return;
        this._enum = _enum2;
        _enum2.pushField(this);
      }
    }
  }, {
    key: "pushEndpoint",
    value: function pushEndpoint(endpoint) {
      this.endpoints.push(endpoint);
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
        tableId: this.table.id,
        enumId: this._enum ? this._enum.id : null
      };
    }
  }, {
    key: "exportChildIds",
    value: function exportChildIds() {
      return {
        endpointIds: this.endpoints.map(function (e) {
          return e.id;
        })
      };
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      var _this$injectedPartial;
      return {
        name: this.name,
        type: this.type,
        unique: this.unique,
        pk: this.pk,
        not_null: this.not_null,
        note: this.note,
        dbdefault: this.dbdefault,
        increment: this.increment,
        injectedPartialId: (_this$injectedPartial = this.injectedPartial) === null || _this$injectedPartial === void 0 ? void 0 : _this$injectedPartial.id
      };
    }
  }, {
    key: "normalize",
    value: function normalize(model) {
      model.fields[this.id] = _objectSpread(_objectSpread(_objectSpread({
        id: this.id
      }, this.shallowExport()), this.exportChildIds()), this.exportParentIds());
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Field;