"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableRecord = exports.Table = exports.Ref = exports.Index = exports.Field = exports.Enum = exports.Endpoint = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
var Index = exports.Index = /*#__PURE__*/function () {
  /**
   * @param {{
   *  name: string,
   *  unique: boolean,
   *  pk: boolean,
   *  type: string,
   *  columns: {value: string, type: 'column' | 'string' | 'expression'}[],
   * }} param0
   */
  function Index(_ref) {
    var name = _ref.name,
      unique = _ref.unique,
      pk = _ref.pk,
      type = _ref.type,
      columns = _ref.columns;
    _classCallCheck(this, Index);
    /** @type {string} */
    this.name = name;

    /** @type {string} */
    this.type = type;

    /** @type {boolean} */
    this.unique = unique;

    /** @type {boolean} */
    this.pk = pk;

    /** @type {{value: string, type: 'column' | 'string' | 'expression'}[]} */
    this.columns = columns;
  }
  return _createClass(Index, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        type: this.type,
        unique: this.unique,
        pk: this.pk,
        columns: this.columns
      };
    }
  }]);
}();
var Field = exports.Field = /*#__PURE__*/function () {
  /** @type {boolean} */
  // fk;

  /**
   * @param {{
   *  name: string,
   *  type: {type_name: string, schemaName: string},
   *  not_null: boolean,
   *  increment: boolean,
   *  dbdefault: {value: string, type: 'string' | 'number' | 'boolean' | 'expression'},
   *  unique: boolean,
   *  pk: boolean,
   *  note: {value: string}
   * }} param0
   */
  function Field(_ref2) {
    var name = _ref2.name,
      type = _ref2.type,
      not_null = _ref2.not_null,
      increment = _ref2.increment,
      dbdefault = _ref2.dbdefault,
      unique = _ref2.unique,
      pk = _ref2.pk,
      note = _ref2.note;
    _classCallCheck(this, Field);
    /** @type {string} */
    this.name = name;

    /** @type {{type_name: string, schemaName: string}} */
    this.type = type;

    /** @type {boolean} */
    this.not_null = not_null;

    /** @type {boolean} */
    this.increment = increment;

    /** @type {{value: string, type: 'string' | 'number' | 'boolean' | 'expression'}} */
    this.dbdefault = dbdefault;

    /** @type {boolean} */
    this.unique = unique;

    /** @type {boolean} */
    this.pk = pk;

    /** @type {{value: string}} */
    this.note = note;
  }
  return _createClass(Field, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        type: this.type,
        not_null: this.not_null,
        increment: this.increment,
        dbdefault: this.dbdefault,
        unique: this.unique,
        pk: this.pk,
        note: this.note
      };
    }
  }]);
}();
var Table = exports.Table = /*#__PURE__*/function () {
  /**
   * @param {{
   *  name: string,
   *  schemaName: string,
   *  fields: Field[],
   *  indexes: Index[],
   *  note: {value: string}
   * }} param0
   */
  function Table(_ref3) {
    var name = _ref3.name,
      schemaName = _ref3.schemaName,
      fields = _ref3.fields,
      indexes = _ref3.indexes,
      note = _ref3.note;
    _classCallCheck(this, Table);
    /** @type {string} */
    this.name = name;

    /** @type {string} */
    this.schemaName = schemaName;

    /** @type {Field[]} */
    this.fields = fields || [];

    /** @type {Index[]} */
    this.indexes = indexes || [];

    /** @type {{value: string}} */
    this.note = note;
  }
  return _createClass(Table, [{
    key: "toJSON",
    value: function toJSON() {
      var _this$fields, _this$indexes;
      return {
        name: this.name,
        schemaName: this.schemaName,
        fields: (_this$fields = this.fields) === null || _this$fields === void 0 ? void 0 : _this$fields.map(function (f) {
          return f.toJSON();
        }),
        indexes: (_this$indexes = this.indexes) === null || _this$indexes === void 0 ? void 0 : _this$indexes.map(function (i) {
          return i.toJSON();
        }),
        note: this.note
      };
    }
  }]);
}();
var Endpoint = exports.Endpoint = /*#__PURE__*/function () {
  /**
   * @param {{
   *  tableName: string,
   *  schemaName: string,
   *  fieldNames: string[],
   *  relation: '*' | '1'
   * }} param0
   */
  function Endpoint(_ref4) {
    var tableName = _ref4.tableName,
      schemaName = _ref4.schemaName,
      fieldNames = _ref4.fieldNames,
      relation = _ref4.relation;
    _classCallCheck(this, Endpoint);
    /** @type {string} */
    this.tableName = tableName;

    /** @type {string} */
    this.schemaName = schemaName;

    /** @type {string[]} */
    this.fieldNames = fieldNames;

    /** @type {'*' | '1'} */
    this.relation = relation;
  }
  return _createClass(Endpoint, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        tableName: this.tableName,
        schemaName: this.schemaName,
        fieldNames: this.fieldNames,
        relation: this.relation
      };
    }
  }]);
}();
var Ref = exports.Ref = /*#__PURE__*/function () {
  /**
   * @param {{
   *  name: string,
   *  endpoints: Endpoint[],
   *  onDelete: string,
   *  onUpdate: string
   * }} param0
   */
  function Ref(_ref5) {
    var name = _ref5.name,
      endpoints = _ref5.endpoints,
      onDelete = _ref5.onDelete,
      onUpdate = _ref5.onUpdate;
    _classCallCheck(this, Ref);
    /** @type {string} */
    this.name = name;

    /** @type {Endpoint[]} */
    this.endpoints = endpoints || [];

    /** @type {string} */
    this.onDelete = onDelete;

    /** @type {string} */
    this.onUpdate = onUpdate;
  }
  return _createClass(Ref, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        onDelete: this.onDelete,
        onUpdate: this.onUpdate,
        endpoints: this.endpoints.map(function (e) {
          return e.toJSON();
        })
      };
    }
  }]);
}();
var Enum = exports.Enum = /*#__PURE__*/function () {
  function Enum(_ref6) {
    var name = _ref6.name,
      schemaName = _ref6.schemaName,
      values = _ref6.values;
    _classCallCheck(this, Enum);
    /** @type {string} */
    this.name = name;

    /** @type {string} */
    this.schemaName = schemaName;

    /** @type {{name: string}[]} */
    this.values = values;
  }
  return _createClass(Enum, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        schemaName: this.schemaName,
        values: this.values
      };
    }
  }]);
}();
var TableRecord = exports.TableRecord = /*#__PURE__*/function () {
  /**
   * @param {{
   *  tableName: string,
   *  columns: string[],
   *  values: {
   *    value: any,
   *    type: string,
   *  }[]
   *  schemaName?: string,
   * }} param0
   */
  function TableRecord(_ref7) {
    var tableName = _ref7.tableName,
      columns = _ref7.columns,
      values = _ref7.values,
      _ref7$schemaName = _ref7.schemaName,
      schemaName = _ref7$schemaName === void 0 ? undefined : _ref7$schemaName;
    _classCallCheck(this, TableRecord);
    /** @type {string} */
    this.tableName = tableName;

    /** @type {string | undefined} */
    this.schemaName = schemaName;

    /** @type {string[]} */
    this.columns = columns;

    /** @type {{value: any, type: string}[]} */
    this.values = values;
  }
  return _createClass(TableRecord, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        tableName: this.tableName,
        schemaName: this.schemaName,
        columns: this.columns,
        values: this.values
      };
    }
  }]);
}();