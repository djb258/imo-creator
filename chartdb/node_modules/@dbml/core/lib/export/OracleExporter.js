"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _utils = require("./utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var OracleExporter = /*#__PURE__*/function () {
  function OracleExporter() {
    _classCallCheck(this, OracleExporter);
  }
  return _createClass(OracleExporter, null, [{
    key: "buildSchemaToTableNameSetMap",
    value: function buildSchemaToTableNameSetMap(model) {
      var schemaToTableNameSetMap = new Map();
      _lodash["default"].forEach(model.tables, function (table) {
        var schema = model.schemas[table.schemaId];
        var tableSet = schemaToTableNameSetMap.get(schema.name);
        if (!tableSet) {
          schemaToTableNameSetMap.set(schema.name, new Set([table.name]));
          return;
        }
        tableSet.add(table.name);
      });
      return schemaToTableNameSetMap;
    }
  }, {
    key: "buildTableNameWithSchema",
    value: function buildTableNameWithSchema(model, schema, table) {
      return "".concat((0, _utils.shouldPrintSchema)(schema, model) ? "".concat((0, _utils.escapeObjectName)(schema.name, 'oracle'), ".") : '').concat((0, _utils.escapeObjectName)(table.name, 'oracle'));
    }
  }, {
    key: "exportSchema",
    value: function exportSchema(schemaName) {
      // According to Oracle, CREATE SCHEMA statement does not actually create a schema and it automatically creates a schema when we create a user
      // Learn more: https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/CREATE-SCHEMA.html#GUID-2D154F9C-9E2B-4A09-B658-2EA5B99AC838__GUID-CC0A5080-2AF3-4460-AB2B-DEA6C79519BA
      return "CREATE USER ".concat((0, _utils.escapeObjectName)(schemaName, 'oracle'), "\n") + 'NO AUTHENTICATION\n' + 'DEFAULT TABLESPACE system\n' + 'TEMPORARY TABLESPACE temp\n' + 'QUOTA UNLIMITED ON system;\n';
    }
  }, {
    key: "getFieldLines",
    value: function getFieldLines(tableId, model) {
      var table = model.tables[tableId];
      var lines = table.fieldIds.map(function (fieldId) {
        var field = model.fields[fieldId];
        var fieldName = (0, _utils.escapeObjectName)(field.name, 'oracle');
        var line = fieldName;
        if (field.enumId) {
          var _enum = model.enums[field.enumId];
          var enumValues = _enum.valueIds.map(function (valueId) {
            var value = model.enumValues[valueId];
            return "'".concat(value.name, "'");
          });
          var enumString = enumValues.join(', ');
          line += " nvarchar2(255) NOT NULL CHECK (".concat(fieldName, " IN (").concat(enumString, "))");
        } else {
          line += " ".concat(field.type.type_name);
        }
        var cloneField = _objectSpread({}, field);
        if (cloneField.increment) {
          line += ' GENERATED AS IDENTITY';

          // in oracle, increment means using identity. If a clause includes identity, we must ignore not null + default value
          cloneField.dbdefault = null;
          cloneField.not_null = false;
        }
        if (cloneField.unique) {
          line += ' UNIQUE';
        }
        if (cloneField.pk) {
          line += ' PRIMARY KEY';
        }
        if (cloneField.not_null) {
          line += ' NOT NULL';
        }
        if (cloneField.dbdefault) {
          if (cloneField.dbdefault.type === 'string') {
            line += " DEFAULT '".concat(cloneField.dbdefault.value, "'");
          } else {
            line += " DEFAULT ".concat(cloneField.dbdefault.value);
          }
        }
        return line;
      });
      return lines;
    }
  }, {
    key: "getCompositePKs",
    value: function getCompositePKs(tableId, model) {
      var table = model.tables[tableId];
      var compositePkIds = table.indexIds ? table.indexIds.filter(function (indexId) {
        return model.indexes[indexId].pk;
      }) : [];
      var lines = compositePkIds.map(function (keyId) {
        var key = model.indexes[keyId];
        var line = 'PRIMARY KEY';
        var columnArr = [];
        key.columnIds.forEach(function (columnId) {
          var column = model.indexColumns[columnId];
          var columnStr = '';
          if (column.type === 'expression') {
            columnStr = "(".concat(column.value, ")");
          } else {
            columnStr = "\"".concat(column.value, "\"");
          }
          columnArr.push(columnStr);
        });
        line += " (".concat(columnArr.join(', '), ")");
        return line;
      });
      return lines;
    }
  }, {
    key: "getTableContents",
    value: function getTableContents(tableIds, model) {
      var _this = this;
      var tableContentArr = tableIds.map(function (tableId) {
        var fieldContents = _this.getFieldLines(tableId, model);
        var compositePKs = _this.getCompositePKs(tableId, model);
        return {
          tableId: tableId,
          fieldContents: fieldContents,
          compositePKs: compositePKs
        };
      });
      return tableContentArr;
    }
  }, {
    key: "exportTables",
    value: function exportTables(tableIds, model) {
      var _this2 = this;
      var tableContentList = this.getTableContents(tableIds, model);
      var tableStrs = tableContentList.map(function (tableContent) {
        var content = [].concat(_toConsumableArray(tableContent.fieldContents), _toConsumableArray(tableContent.compositePKs));
        var table = model.tables[tableContent.tableId];
        var schema = model.schemas[table.schemaId];
        var tableName = _this2.buildTableNameWithSchema(model, schema, table);
        var contentString = content.map(function (line) {
          return "  ".concat(line);
        }).join(',\n');
        var tableStr = "CREATE TABLE ".concat(tableName, " (\n").concat(contentString, "\n);\n");
        return tableStr;
      });
      return tableStrs;
    }
  }, {
    key: "buildReferenceFieldNamesString",
    value: function buildReferenceFieldNamesString(fieldIds, model) {
      var fieldNames = fieldIds.map(function (fieldId) {
        return "\"".concat(model.fields[fieldId].name, "\"");
      }).join(', ');
      return "(".concat(fieldNames, ")");
    }
  }, {
    key: "buildTableManyToMany",
    value: function buildTableManyToMany(firstTableFieldsMap, secondTableFieldsMap, tableName) {
      var line = "CREATE TABLE ".concat(tableName, " (\n");
      firstTableFieldsMap.forEach(function (fieldType, fieldName) {
        line += "  \"".concat(fieldName, "\" ").concat(fieldType, ",\n");
      });
      secondTableFieldsMap.forEach(function (fieldType, fieldName) {
        line += "  \"".concat(fieldName, "\" ").concat(fieldType, ",\n");
      });
      var key1s = _toConsumableArray(firstTableFieldsMap.keys()).join('`, `');
      var key2s = _toConsumableArray(secondTableFieldsMap.keys()).join('`, `');
      line += "  PRIMARY KEY (\"".concat(key1s, "\", \"").concat(key2s, "\")\n);\n");
      return line;
    }
  }, {
    key: "buildForeignKeyManyToMany",
    value: function buildForeignKeyManyToMany(foreignEndpointTableName, foreignEndpointFields, refEndpointTableName, refEndpointFieldsString) {
      var foreignEndpointFieldsString = _toConsumableArray(foreignEndpointFields.keys()).join('`, `');
      var line = "ALTER TABLE ".concat(foreignEndpointTableName, " ADD FOREIGN KEY (\"").concat(foreignEndpointFieldsString, "\") REFERENCES ").concat(refEndpointTableName, " ").concat(refEndpointFieldsString, ";\n");
      return line;
    }
  }, {
    key: "exportReferencesAndNewTablesIfExists",
    value: function exportReferencesAndNewTablesIfExists(refIds, model, usedTableNameMap) {
      var _this3 = this;
      var result = {
        refs: [],
        tables: []
      };
      refIds.forEach(function (refId) {
        var ref = model.refs[refId];

        // find the one relation in one-to-xxx or xxx-to-one relationship
        var refOneIndex = ref.endpointIds.findIndex(function (endpointId) {
          return model.endpoints[endpointId].relation === '1';
        });
        var refEndpointIndex = refOneIndex === -1 ? 0 : refOneIndex;

        // refEndpointIndex could be 0 or 1, so use 1 - refEndpointIndex will take the remained index
        var foreignEndpointId = ref.endpointIds[1 - refEndpointIndex];
        var foreignEndpoint = model.endpoints[foreignEndpointId];
        var foreignEndpointField = model.fields[foreignEndpoint.fieldIds[0]];
        var foreignEndpointTable = model.tables[foreignEndpointField.tableId];
        var foreignEndpointSchema = model.schemas[foreignEndpointTable.schemaId];
        var foreignEndpointFieldNameString = _this3.buildReferenceFieldNamesString(foreignEndpoint.fieldIds, model);
        var refEndpointId = ref.endpointIds[refEndpointIndex];
        var refEndpoint = model.endpoints[refEndpointId];
        var refEndpointField = model.fields[refEndpoint.fieldIds[0]];
        var refEndpointTable = model.tables[refEndpointField.tableId];
        var refEndpointSchema = model.schemas[refEndpointTable.schemaId];
        var refEndpointFieldNameString = _this3.buildReferenceFieldNamesString(refEndpoint.fieldIds, model);
        if (refOneIndex !== -1) {
          var foreignTableName = _this3.buildTableNameWithSchema(model, foreignEndpointSchema, foreignEndpointTable);
          var line = "ALTER TABLE ".concat(foreignTableName, " ADD");
          if (ref.name) {
            line += " CONSTRAINT ".concat((0, _utils.escapeObjectName)(ref.name, 'oracle'));
          }
          var refTableName = _this3.buildTableNameWithSchema(model, refEndpointSchema, refEndpointTable);
          line += " FOREIGN KEY ".concat(foreignEndpointFieldNameString, " REFERENCES ").concat(refTableName, " ").concat(refEndpointFieldNameString);
          if (ref.onDelete) {
            line += " ON DELETE ".concat(ref.onDelete.toUpperCase());
          }
          line += ';\n';
          result.refs.push(line);
          return;
        }

        // many to many relationship
        var firstTableFieldsMap = (0, _utils.buildJunctionFields1)(refEndpoint.fieldIds, model);
        var secondTableFieldsMap = (0, _utils.buildJunctionFields2)(foreignEndpoint.fieldIds, model, firstTableFieldsMap);
        var newTableName = (0, _utils.buildUniqueTableName)(refEndpointSchema, refEndpointTable.name, foreignEndpointTable.name, usedTableNameMap);
        var tableNameSet = usedTableNameMap.get(refEndpointSchema);
        if (!tableNameSet) {
          usedTableNameMap.set(refEndpointSchema, new Set([newTableName]));
        } else {
          tableNameSet.add(newTableName);
        }
        var escapedNewTableName = "".concat((0, _utils.shouldPrintSchema)(refEndpointSchema, model) ? "\"".concat(refEndpointSchema.name, "\".") : '', "\"").concat(newTableName, "\"");
        result.tables.push(_this3.buildTableManyToMany(firstTableFieldsMap, secondTableFieldsMap, escapedNewTableName));
        var firstTableName = _this3.buildTableNameWithSchema(model, refEndpointSchema, refEndpointTable);
        result.refs.push(_this3.buildForeignKeyManyToMany(escapedNewTableName, firstTableFieldsMap, firstTableName, refEndpointFieldNameString));
        var secondTableName = _this3.buildTableNameWithSchema(model, foreignEndpointSchema, foreignEndpointTable);
        result.refs.push(_this3.buildForeignKeyManyToMany(escapedNewTableName, secondTableFieldsMap, secondTableName, foreignEndpointFieldNameString));
      });
      return result;
    }
  }, {
    key: "exportReferenceGrants",
    value: function exportReferenceGrants(model, refIds) {
      var _this4 = this;
      // only default schema -> ignore it
      if (Object.keys(model.schemas).length <= 1) {
        return [];
      }
      var tableNameList = [];
      refIds.forEach(function (refId) {
        var ref = model.refs[refId];

        // find the one relation in one - many, many - one, one - one relationship
        var refOneIndex = ref.endpointIds.findIndex(function (endpointId) {
          return model.endpoints[endpointId].relation === '1';
        });
        var refEndpointIndex = refOneIndex === -1 ? 0 : refOneIndex;
        var refEndpointId = ref.endpointIds[refEndpointIndex];
        var refEndpoint = model.endpoints[refEndpointId];
        var refEndpointField = model.fields[refEndpoint.fieldIds[0]];
        var refEndpointTable = model.tables[refEndpointField.tableId];
        var refEndpointSchema = model.schemas[refEndpointTable.schemaId];

        // refEndpointIndex could be 0 or 1, so use 1 - refEndpointIndex will take the remained index
        var foreignEndpointId = ref.endpointIds[1 - refEndpointIndex];
        var foreignEndpoint = model.endpoints[foreignEndpointId];
        var foreignEndpointField = model.fields[foreignEndpoint.fieldIds[0]];
        var foreignEndpointTable = model.tables[foreignEndpointField.tableId];
        var foreignEndpointSchema = model.schemas[foreignEndpointTable.schemaId];

        // reference in the same schema
        if (refEndpointSchema.name === foreignEndpointSchema.name) {
          tableNameList.push('');
          return;
        }
        var refTableName = _this4.buildTableNameWithSchema(model, refEndpointSchema, refEndpointTable);
        // refTableName is always needed to be grant
        tableNameList.push(refTableName);

        // one - many, many - one, one - one relationship
        if (refOneIndex !== -1) {
          return;
        }
        var foreignTableName = _this4.buildTableNameWithSchema(model, foreignEndpointSchema, foreignEndpointTable);
        tableNameList.push(foreignTableName);
      });
      var tableToGrantList = tableNameList
      // remove duplicate
      .filter(function (table, index) {
        return table && tableNameList.indexOf(table) === index;
      })
      // map into grant statement
      .map(function (table) {
        return "GRANT REFERENCES ON ".concat(table, " TO PUBLIC;\n");
      });
      return tableToGrantList;
    }
  }, {
    key: "exportIndexes",
    value: function exportIndexes(indexIds, model) {
      var _this5 = this;
      // exclude composite pk index
      var indexArr = indexIds.filter(function (indexId) {
        return !model.indexes[indexId].pk;
      }).map(function (indexId) {
        var index = model.indexes[indexId];
        var table = model.tables[index.tableId];
        var schema = model.schemas[table.schemaId];
        var line = 'CREATE';
        // ignore dbml index type: b-tree, hash
        if (index.unique) {
          line += ' UNIQUE';
        }
        line += ' INDEX';
        if (index.name) {
          line += " ".concat((0, _utils.escapeObjectName)(index.name, 'oracle'));
        }
        var tableName = _this5.buildTableNameWithSchema(model, schema, table);
        line += " ON ".concat(tableName);
        var columnArr = [];
        index.columnIds.forEach(function (columnId) {
          var column = model.indexColumns[columnId];
          var columnStr = '';
          if (column.type === 'expression') {
            columnStr = "".concat(column.value);
          } else {
            columnStr = "\"".concat(column.value, "\"");
          }
          columnArr.push(columnStr);
        });
        var columnString = columnArr.join(', ');
        line += " (".concat(columnString, ");\n");
        return line;
      });
      return indexArr;
    }
  }, {
    key: "exportComments",
    value: function exportComments(comments, model) {
      var _this6 = this;
      var commentArr = comments.map(function (comment) {
        var line = 'COMMENT ON';
        var table = model.tables[comment.tableId];
        var schema = model.schemas[table.schemaId];
        var tableName = _this6.buildTableNameWithSchema(model, schema, table);
        switch (comment.type) {
          case 'table':
            {
              line += " TABLE ".concat(tableName, " IS '").concat(table.note.replace(/'/g, "''"), "'");
              break;
            }
          case 'column':
            {
              var field = model.fields[comment.fieldId];
              line += " COLUMN ".concat(tableName, ".").concat((0, _utils.escapeObjectName)(field.name, 'oracle'), " IS '").concat(field.note.replace(/'/g, "''"), "'");
              break;
            }
          default:
            break;
        }
        line += ';\n';
        return line;
      });
      return commentArr;
    }
  }, {
    key: "export",
    value: function _export(model) {
      var _this7 = this;
      var database = model.database['1'];
      var schemaToTableNameSetMap = this.buildSchemaToTableNameSetMap(model);
      var statements = database.schemaIds.reduce(function (prevStatements, schemaId) {
        var schema = model.schemas[schemaId];
        var tableIds = schema.tableIds,
          refIds = schema.refIds;
        if ((0, _utils.shouldPrintSchema)(schema, model)) {
          prevStatements.schemas.push(_this7.exportSchema(schema.name));
        }
        if (!_lodash["default"].isEmpty(tableIds)) {
          var _prevStatements$table;
          (_prevStatements$table = prevStatements.tables).push.apply(_prevStatements$table, _toConsumableArray(_this7.exportTables(tableIds, model)));
        }
        var indexIds = _lodash["default"].flatten(tableIds.map(function (tableId) {
          return model.tables[tableId].indexIds;
        }));
        if (!_lodash["default"].isEmpty(indexIds)) {
          var _prevStatements$index;
          (_prevStatements$index = prevStatements.indexes).push.apply(_prevStatements$index, _toConsumableArray(_this7.exportIndexes(indexIds, model)));
        }
        var commentNodes = _lodash["default"].flatten(tableIds.map(function (tableId) {
          var _model$tables$tableId = model.tables[tableId],
            fieldIds = _model$tables$tableId.fieldIds,
            note = _model$tables$tableId.note;
          var fieldObjects = fieldIds.filter(function (fieldId) {
            return model.fields[fieldId].note;
          }).map(function (fieldId) {
            return {
              type: 'column',
              fieldId: fieldId,
              tableId: tableId
            };
          });
          return note ? [{
            type: 'table',
            tableId: tableId
          }].concat(fieldObjects) : fieldObjects;
        }));
        if (!_lodash["default"].isEmpty(commentNodes)) {
          var _prevStatements$comme;
          (_prevStatements$comme = prevStatements.comments).push.apply(_prevStatements$comme, _toConsumableArray(_this7.exportComments(commentNodes, model)));
        }
        if (!_lodash["default"].isEmpty(refIds)) {
          var _prevStatements$table2, _prevStatements$refs, _prevStatements$refer;
          var _this7$exportReferenc = _this7.exportReferencesAndNewTablesIfExists(refIds, model, schemaToTableNameSetMap),
            refs = _this7$exportReferenc.refs,
            manyToManyTables = _this7$exportReferenc.tables;
          (_prevStatements$table2 = prevStatements.tables).push.apply(_prevStatements$table2, _toConsumableArray(manyToManyTables));
          (_prevStatements$refs = prevStatements.refs).push.apply(_prevStatements$refs, _toConsumableArray(refs));
          (_prevStatements$refer = prevStatements.referenceGrants).push.apply(_prevStatements$refer, _toConsumableArray(_this7.exportReferenceGrants(model, refIds)));
        }
        return prevStatements;
      }, {
        schemas: [],
        tables: [],
        indexes: [],
        comments: [],
        referenceGrants: [],
        refs: []
      });
      var res = _lodash["default"].concat(statements.schemas, statements.tables, statements.indexes, statements.comments, statements.referenceGrants, statements.refs).join('\n');
      return res;
    }
  }]);
}();
var _default = exports["default"] = OracleExporter;