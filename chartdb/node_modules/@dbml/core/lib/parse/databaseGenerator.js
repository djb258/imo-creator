"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateDatabase = void 0;
var _database = _interopRequireDefault(require("../model_structure/database"));
var _AST = require("./ANTLR/ASTGeneration/AST");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var parseJSONToDatabase = function parseJSONToDatabase(rawDatabase) {
  return new _database["default"](rawDatabase);
};
var createRefs = function createRefs(rawRefs) {
  return rawRefs.map(function (rawRef) {
    var name = rawRef.name,
      endpoints = rawRef.endpoints,
      onDelete = rawRef.onDelete,
      onUpdate = rawRef.onUpdate;
    var eps = endpoints.map(function (ep) {
      return new _AST.Endpoint(ep);
    });
    return new _AST.Ref({
      name: name,
      endpoints: eps,
      onDelete: onDelete,
      onUpdate: onUpdate
    }).toJSON();
  });
};
var createEnums = function createEnums(rawEnums) {
  return rawEnums.map(function (rawEnum) {
    var name = rawEnum.name,
      schemaName = rawEnum.schemaName,
      values = rawEnum.values;
    return new _AST.Enum({
      name: name,
      schemaName: schemaName,
      values: values
    });
  });
};
var createFields = function createFields(rawFields, fieldsConstraints) {
  return rawFields.map(function (field) {
    var constraints = fieldsConstraints[field.name] || {};
    var f = new _AST.Field({
      name: field.name,
      type: field.type,
      dbdefault: field.dbdefault,
      not_null: field.not_null,
      increment: field.increment,
      pk: constraints.pk || field.pk,
      unique: constraints.unique || field.unique,
      note: field.note
    });
    return f;
  });
};
var createIndexes = function createIndexes(rawIndexes) {
  return rawIndexes.map(function (rawIndex) {
    var name = rawIndex.name,
      unique = rawIndex.unique,
      primary = rawIndex.primary,
      type = rawIndex.type,
      columns = rawIndex.columns;
    var index = new _AST.Index({
      name: name,
      unique: unique,
      pk: primary,
      type: type,
      columns: columns
    });
    return index;
  });
};
var createTables = function createTables(rawTables, rawFields, rawIndexes, tableConstraints) {
  return rawTables.map(function (rawTable) {
    var name = rawTable.name,
      schemaName = rawTable.schemaName,
      note = rawTable.note;
    var key = schemaName ? "".concat(schemaName, ".").concat(name) : "".concat(name);
    var constraints = tableConstraints[key] || {};
    var fields = createFields(rawFields[key], constraints);
    var indexes = createIndexes(rawIndexes[key] || []);
    return new _AST.Table({
      name: name,
      schemaName: schemaName,
      fields: fields,
      indexes: indexes,
      note: note
    });
  });
};
var generateDatabase = exports.generateDatabase = function generateDatabase(schemaJson) {
  var rawTables = schemaJson.tables,
    rawFields = schemaJson.fields,
    rawIndexes = schemaJson.indexes,
    rawRefs = schemaJson.refs,
    rawEnums = schemaJson.enums,
    tableConstraints = schemaJson.tableConstraints;
  try {
    var tables = createTables(rawTables, rawFields, rawIndexes, tableConstraints);
    var enums = createEnums(rawEnums);
    var refs = createRefs(rawRefs);
    var rawDatabase = {
      schemas: [],
      tables: tables,
      refs: refs,
      enums: enums,
      tableGroups: [],
      aliases: [],
      project: {}
    };
    return parseJSONToDatabase(rawDatabase);
  } catch (err) {
    throw new Error(err);
  }
};