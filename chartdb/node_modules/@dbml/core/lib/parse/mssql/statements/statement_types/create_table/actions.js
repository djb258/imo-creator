"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = require('lodash');
var _require = require('../../../utils'),
  getFullTableName = _require.getFullTableName;
function createRefFromInlineRef(linesRefs, inlineRefs, fieldName, tableName) {
  if (!inlineRefs || inlineRefs.length === 0) return;
  var newRef = {};
  var inlineRef = inlineRefs[0];
  newRef.onUpdate = inlineRef.onUpdate;
  newRef.onDelete = inlineRef.onDelete;
  newRef.endpoints = [];
  newRef.endpoints.push({
    tableName: tableName.name,
    schemaName: tableName.schemaName,
    fieldNames: [fieldName],
    relation: '*'
  });
  if (!inlineRef.endpoint.fieldNames) {
    inlineRef.endpoint.fieldNames = newRef.endpoints[0].fieldNames;
  }
  newRef.endpoints.push(inlineRef.endpoint);
  linesRefs.push(newRef);
}
function pushOutEnum(linesEnums, fieldValue, tableName) {
  if (fieldValue.enums) {
    var _enum = fieldValue.enums;
    var fieldType = fieldValue.type;
    _enum.name = "".concat(tableName.schemaName ? "".concat(tableName.schemaName, "_") : '').concat(tableName.name, "_").concat(fieldValue.enums.name);
    fieldType.type_name = _enum.name;
    fieldType.args = _enum.values.map(function (value) {
      return "'".concat(value.name, "'");
    }).join(', ');
    linesEnums.push(_enum);
    fieldValue.enums = null;
  }
}
function pushOutIndex(linesIndexes, fieldValue) {
  if (fieldValue.indexes) {
    fieldValue.indexes.columns.push({
      value: fieldValue.name,
      type: 'column'
    });
    linesIndexes.push(fieldValue.indexes);
    fieldValue.indexes = null;
  }
}
function getLinesValue(lines, tableName) {
  var value = {
    fields: [],
    enums: [],
    refs: [],
    indexes: []
  };
  lines.forEach(function (line) {
    if (line && value[line.type]) {
      if (line.type === 'fields') {
        pushOutEnum(value.enums, line.value, tableName);
        pushOutIndex(value.indexes, line.value);
        createRefFromInlineRef(value.refs, line.value.inline_refs, line.value.name, tableName);
      }
      if (line.type === 'refs') {
        var ref = line.value;
        ref.endpoints[0].tableName = tableName.name;
        ref.endpoints[0].schemaName = tableName.schemaName;
      }
      value[line.type].push(line.value);
    }
  });
  return {
    type: 'lines',
    value: value
  };
}
function makeTable(_keyword, tableName, _keyword2, lines) {
  var fullName = getFullTableName(tableName);
  var linesValue = getLinesValue(lines, fullName);
  return {
    type: 'tables',
    value: _objectSpread(_objectSpread({}, fullName), linesValue.value)
  };
}
module.exports = {
  makeTable: makeTable
};