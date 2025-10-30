"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildJunctionFields1 = buildJunctionFields1;
exports.buildJunctionFields2 = buildJunctionFields2;
exports.buildNewTableName = buildNewTableName;
exports.buildUniqueTableName = buildUniqueTableName;
exports.escapeObjectName = escapeObjectName;
exports.hasWhiteSpace = hasWhiteSpace;
exports.hasWhiteSpaceOrUpperCase = hasWhiteSpaceOrUpperCase;
exports.shouldPrintSchema = shouldPrintSchema;
var _config = require("../model_structure/config");
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
function hasWhiteSpaceOrUpperCase(s) {
  return /[\sA-Z]/g.test(s);
}
function shouldPrintSchema(schema, model) {
  return schema.name !== _config.DEFAULT_SCHEMA_NAME || schema.name === _config.DEFAULT_SCHEMA_NAME && model.database['1'].hasDefaultSchema;
}
function buildJunctionFields1(fieldIds, model) {
  var fieldsMap = new Map();
  fieldIds.map(function (fieldId) {
    return fieldsMap.set("".concat(model.tables[model.fields[fieldId].tableId].name, "_").concat(model.fields[fieldId].name), model.fields[fieldId].type.type_name);
  });
  return fieldsMap;
}
function buildJunctionFields2(fieldIds, model, firstTableFieldsMap) {
  var fieldsMap = new Map();
  fieldIds.forEach(function (fieldId) {
    var fieldName = "".concat(model.tables[model.fields[fieldId].tableId].name, "_").concat(model.fields[fieldId].name);
    var count = 1;
    while (firstTableFieldsMap.has(fieldName)) {
      fieldName = "".concat(model.tables[model.fields[fieldId].tableId].name, "_").concat(model.fields[fieldId].name, "(").concat(count, ")");
      count += 1;
    }
    fieldsMap.set(fieldName, model.fields[fieldId].type.type_name);
  });
  return fieldsMap;
}
function buildNewTableName(firstTable, secondTable, usedTableNames) {
  var newTableName = "".concat(firstTable, "_").concat(secondTable);
  var count = 1;
  while (usedTableNames.has(newTableName)) {
    newTableName = "".concat(firstTable, "_").concat(secondTable, "(").concat(count, ")");
    count += 1;
  }
  usedTableNames.add(newTableName);
  return newTableName;
}

/**
 *
 * @param {string} schemaName
 * @param {string} firstTableName
 * @param {string} secondTableName
 * @param {Map<string, Set>} schemaToTableNameSetMap
 * @returns string
 * @description This function is a clone version of the buildNewTableName, but without side effect - update the original usedTableNames
 */
function buildUniqueTableName(schemaName, firstTableName, secondTableName, schemaToTableNameSetMap) {
  var newTableName = "".concat(firstTableName, "_").concat(secondTableName);
  var count = 1;
  var tableNameSet = schemaToTableNameSetMap.get(schemaName);
  if (!tableNameSet) {
    return newTableName;
  }
  while (tableNameSet.has(newTableName)) {
    newTableName = "".concat(firstTableName, "_").concat(secondTableName, "(").concat(count, ")");
    count += 1;
  }
  return newTableName;
}
function escapeObjectName(name, database) {
  if (!name) {
    return '';
  }
  var escapeSignature = '';
  switch (database) {
    case 'mysql':
      escapeSignature = '`';
      break;
    case 'postgres':
    case 'oracle':
      escapeSignature = '"';
      break;
    default:
      break;
  }
  return "".concat(escapeSignature).concat(name).concat(escapeSignature);
}