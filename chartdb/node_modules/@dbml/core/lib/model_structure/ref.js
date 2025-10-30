"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _element = _interopRequireDefault(require("./element"));
var _endpoint = _interopRequireDefault(require("./endpoint"));
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
/**
 * Compare two pairs of objects
 * @param {Array} pair1
 * @param {Array} pair2
 * @returns {Boolean}
 */
function isEqualPair(pair1, pair2) {
  return pair1[0].equals(pair2[0]) && pair1[1].equals(pair2[1]);
}
var Ref = /*#__PURE__*/function (_Element) {
  function Ref() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      color = _ref.color,
      endpoints = _ref.endpoints,
      onDelete = _ref.onDelete,
      onUpdate = _ref.onUpdate,
      token = _ref.token,
      _ref$schema = _ref.schema,
      schema = _ref$schema === void 0 ? {} : _ref$schema,
      _ref$injectedPartial = _ref.injectedPartial,
      injectedPartial = _ref$injectedPartial === void 0 ? null : _ref$injectedPartial;
    _classCallCheck(this, Ref);
    _this = _callSuper(this, Ref, [token]);
    _this.name = name;
    _this.color = color;
    _this.onDelete = onDelete;
    _this.onUpdate = onUpdate;
    _this.endpoints = [];
    _this.schema = schema;
    _this.injectedPartial = injectedPartial;
    _this.dbState = _this.schema.dbState;
    _this.generateId();
    _this.processEndpoints(endpoints);
    return _this;
  }
  _inherits(Ref, _Element);
  return _createClass(Ref, [{
    key: "generateId",
    value: function generateId() {
      this.id = this.dbState.generateId('refId');
    }
  }, {
    key: "processEndpoints",
    value: function processEndpoints(rawEndpoints) {
      var _this2 = this;
      rawEndpoints.forEach(function (endpoint) {
        _this2.endpoints.push(new _endpoint["default"](_objectSpread(_objectSpread({}, endpoint), {}, {
          ref: _this2
        })));
        if (endpoint.schemaName === _config.DEFAULT_SCHEMA_NAME) {
          // this.schema.database.hasDefaultSchema = true;
        }
      });
      if (this.endpoints[0].equals(this.endpoints[1])) {
        this.error('Two endpoints are the same');
      }
      if (this.endpoints[0].fields.length !== this.endpoints[1].fields.length) {
        this.error('Two endpoints have unequal number of fields');
      }
      // TODO: Handle Error with different number of fields
    }
  }, {
    key: "equals",
    value: function equals(ref) {
      return isEqualPair(this.endpoints, ref.endpoints) || isEqualPair(this.endpoints, ref.endpoints.slice().reverse());
    }
  }, {
    key: "export",
    value: function _export() {
      return _objectSpread(_objectSpread({}, this.shallowExport()), this.exportChild());
    }
  }, {
    key: "shallowExport",
    value: function shallowExport() {
      var _this$injectedPartial;
      return {
        name: this.name,
        color: this.color,
        onDelete: this.onDelete,
        onUpdate: this.onUpdate,
        injectedPartialId: (_this$injectedPartial = this.injectedPartial) === null || _this$injectedPartial === void 0 ? void 0 : _this$injectedPartial.id
      };
    }
  }, {
    key: "exportChild",
    value: function exportChild() {
      return {
        endpoints: this.endpoints.map(function (e) {
          return e["export"]();
        })
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
    key: "exportParentIds",
    value: function exportParentIds() {
      return {
        schemaId: this.schema.id
      };
    }
  }, {
    key: "normalize",
    value: function normalize(model) {
      model.refs[this.id] = _objectSpread(_objectSpread(_objectSpread({
        id: this.id
      }, this.shallowExport()), this.exportChildIds()), this.exportParentIds());
      this.endpoints.forEach(function (endpoint) {
        return endpoint.normalize(model);
      });
    }
  }]);
}(_element["default"]);
var _default = exports["default"] = Ref;