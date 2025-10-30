"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _utils = require("./utils");
var _utils2 = require("../model_structure/utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// PostgreSQL built-in data types
// Generated from PostgreSQLParser.g4 and PostgreSQLLexer.g4

var POSTGRES_BUILTIN_TYPES = [
// Numeric types
'SMALLINT', 'INTEGER', 'INT', 'BIGINT', 'DECIMAL', 'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'SMALLSERIAL', 'SERIAL', 'BIGSERIAL', 'FLOAT',
// Monetary types
'MONEY',
// Character types
'CHARACTER', 'CHAR', 'CHARACTER VARYING', 'VARCHAR', 'TEXT', 'NAME', 'BPCHAR',
// Binary data types
'BYTEA',
// Date/time types
'TIMESTAMP', 'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITHOUT TIME ZONE', 'DATE', 'TIME', 'TIME WITH TIME ZONE', 'TIME WITHOUT TIME ZONE', 'INTERVAL',
// Boolean type
'BOOLEAN', 'BOOL',
// Geometric types
'POINT', 'LINE', 'LSEG', 'BOX', 'PATH', 'POLYGON', 'CIRCLE',
// Network address types
'CIDR', 'INET', 'MACADDR', 'MACADDR8',
// Bit string types
'BIT', 'BIT VARYING', 'VARBIT',
// UUID type
'UUID',
// XML type
'XML',
// JSON types
'JSON', 'JSONB',
// Range types
'INT4RANGE', 'INT8RANGE', 'NUMRANGE', 'TSRANGE', 'TSTZRANGE', 'DATERANGE',
// Object identifier types
'OID', 'REGCLASS', 'REGCOLLATION', 'REGCONFIG', 'REGDICTIONARY', 'REGNAMESPACE', 'REGOPER', 'REGOPERATOR', 'REGPROC', 'REGPROCEDURE', 'REGROLE', 'REGTYPE',
// pg_lsn type
'PG_LSN',
// Special types
'VOID', 'RECORD', 'TRIGGER', 'EVENT_TRIGGER', 'PG_DDL_COMMAND', 'UNKNOWN', 'ANYELEMENT', 'ANYARRAY', 'ANYNONARRAY', 'ANYENUM', 'ANYRANGE', 'ANY', 'CSTRING', 'INTERNAL', 'LANGUAGE_HANDLER', 'FDW_HANDLER', 'INDEX_AM_HANDLER', 'TSM_HANDLER', 'OPAQUE'];
var POSTGRES_RESERVED_KEYWORDS = ['USER'];
var PostgresExporter = /*#__PURE__*/function () {
  function PostgresExporter() {
    _classCallCheck(this, PostgresExporter);
  }
  return _createClass(PostgresExporter, null, [{
    key: "exportEnums",
    value: function exportEnums(enumIds, model) {
      return enumIds.map(function (enumId) {
        var _enum = model.enums[enumId];
        var schema = model.schemas[_enum.schemaId];
        var enumName = "".concat((0, _utils.shouldPrintSchema)(schema, model) ? "\"".concat(schema.name, "\".") : '', "\"").concat(_enum.name, "\"");
        var enumValueArr = _enum.valueIds.map(function (valueId) {
          var value = model.enumValues[valueId];
          return "  '".concat(value.name, "'");
        });
        var enumValueStr = enumValueArr.join(',\n');
        var enumLine = "CREATE TYPE ".concat(enumName, " AS ENUM (\n").concat(enumValueStr, "\n);\n");
        return [enumName, enumLine];
      });
    }
  }, {
    key: "getFieldLines",
    value: function getFieldLines(tableId, model, enumSet) {
      var table = model.tables[tableId];
      var lines = table.fieldIds.map(function (fieldId) {
        var field = model.fields[fieldId];
        var line = '';
        if (field.increment) {
          var typicalIntergers = new Set(['BIGINT', 'INT', 'INTEGER', 'SMALLINT']);
          var incrementIntergers = new Set(['SMALLSERIAL', 'SERIAL', 'BIGSERIAL']);
          var typeRaw = field.type.type_name.toUpperCase();
          var type = '';
          if (typicalIntergers.has(typeRaw)) type = "".concat(typeRaw, " GENERATED BY DEFAULT AS IDENTITY");else if (incrementIntergers.has(typeRaw)) type = typeRaw;else type = 'SERIAL';
          line = "\"".concat(field.name, "\" ").concat(type);
        } else if (!field.type.schemaName || !(0, _utils2.shouldPrintSchemaName)(field.type.schemaName)) {
          // The result type will only has the type part, no schema part (e.g. `int` or `dollars`)
          var originalTypeName = field.type.type_name;
          var upperCaseTypeName = originalTypeName.toUpperCase();
          var shouldDoubleQuote = !POSTGRES_BUILTIN_TYPES.includes(upperCaseTypeName) && ((0, _utils.hasWhiteSpaceOrUpperCase)(originalTypeName) || POSTGRES_RESERVED_KEYWORDS.includes(upperCaseTypeName));
          var typeName = shouldDoubleQuote ? "\"".concat(originalTypeName, "\"") : originalTypeName;
          line = "\"".concat(field.name, "\" ").concat(typeName);
        } else if (field.type.originalTypeName) {
          // A custom Postgres type that is not defined as enum in DBML content
          line = "\"".concat(field.name, "\" \"").concat(field.type.schemaName, "\".\"").concat(field.type.originalTypeName, "\"");
        } else {
          var schemaName = (0, _utils.hasWhiteSpaceOrUpperCase)(field.type.schemaName) ? "\"".concat(field.type.schemaName, "\".") : "".concat(field.type.schemaName, ".");
          var _typeName = (0, _utils.hasWhiteSpaceOrUpperCase)(field.type.type_name) ? "\"".concat(field.type.type_name, "\"") : field.type.type_name;
          var typeWithSchema = "".concat(schemaName).concat(_typeName);
          var typeAsEnum = "\"".concat(field.type.schemaName, "\".\"").concat(field.type.type_name, "\"");
          if (!enumSet.has(typeAsEnum) && !(0, _utils.hasWhiteSpace)(typeAsEnum)) typeWithSchema = typeWithSchema.replaceAll('"', '');
          line = "\"".concat(field.name, "\" ").concat(typeWithSchema);
        }
        if (field.unique) {
          line += ' UNIQUE';
        }
        if (field.pk) {
          line += ' PRIMARY KEY';
        }
        if (field.not_null) {
          line += ' NOT NULL';
        }
        if (field.dbdefault) {
          if (field.dbdefault.type === 'expression') {
            line += " DEFAULT (".concat(field.dbdefault.value, ")");
          } else if (field.dbdefault.type === 'string') {
            line += " DEFAULT '".concat(field.dbdefault.value, "'");
          } else {
            line += " DEFAULT ".concat(field.dbdefault.value);
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
    key: "getTableContentArr",
    value: function getTableContentArr(tableIds, model, enumSet) {
      var tableContentArr = tableIds.map(function (tableId) {
        var fieldContents = PostgresExporter.getFieldLines(tableId, model, enumSet);
        var compositePKs = PostgresExporter.getCompositePKs(tableId, model);
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
    value: function exportTables(tableIds, model, enumSet) {
      var tableContentArr = PostgresExporter.getTableContentArr(tableIds, model, enumSet);
      var tableStrs = tableContentArr.map(function (tableContent) {
        var content = [].concat(_toConsumableArray(tableContent.fieldContents), _toConsumableArray(tableContent.compositePKs));
        var table = model.tables[tableContent.tableId];
        var schema = model.schemas[table.schemaId];
        var tableStr = "CREATE TABLE ".concat((0, _utils.shouldPrintSchema)(schema, model) ? "\"".concat(schema.name, "\".") : '', "\"").concat(table.name, "\" (\n").concat(content.map(function (line) {
          return "  ".concat(line);
        }).join(',\n'), "\n);\n");
        return tableStr;
      });
      return tableStrs;
    }
  }, {
    key: "buildFieldName",
    value: function buildFieldName(fieldIds, model) {
      var fieldNames = fieldIds.map(function (fieldId) {
        return "\"".concat(model.fields[fieldId].name, "\"");
      }).join(', ');
      return "(".concat(fieldNames, ")");
    }
  }, {
    key: "buildTableManyToMany",
    value: function buildTableManyToMany(firstTableFieldsMap, secondTableFieldsMap, tableName, refEndpointSchema, model) {
      var line = "CREATE TABLE ".concat((0, _utils.shouldPrintSchema)(refEndpointSchema, model) ? "\"".concat(refEndpointSchema.name, "\".") : '', "\"").concat(tableName, "\" (\n");
      var key1s = _toConsumableArray(firstTableFieldsMap.keys()).join('", "');
      var key2s = _toConsumableArray(secondTableFieldsMap.keys()).join('", "');
      firstTableFieldsMap.forEach(function (fieldType, fieldName) {
        line += "  \"".concat(fieldName, "\" ").concat(fieldType, ",\n");
      });
      secondTableFieldsMap.forEach(function (fieldType, fieldName) {
        line += "  \"".concat(fieldName, "\" ").concat(fieldType, ",\n");
      });
      line += "  PRIMARY KEY (\"".concat(key1s, "\", \"").concat(key2s, "\")\n");
      line += ');\n\n';
      return line;
    }
  }, {
    key: "buildForeignKeyManyToMany",
    value: function buildForeignKeyManyToMany(fieldsMap, foreignEndpointFields, refEndpointTableName, foreignEndpointTableName, refEndpointSchema, foreignEndpointSchema, model) {
      var refEndpointFields = _toConsumableArray(fieldsMap.keys()).join('", "');
      var line = "ALTER TABLE ".concat((0, _utils.shouldPrintSchema)(refEndpointSchema, model) ? "\"".concat(refEndpointSchema.name, "\".") : '', "\"").concat(refEndpointTableName, "\" ADD FOREIGN KEY (\"").concat(refEndpointFields, "\") REFERENCES ").concat((0, _utils.shouldPrintSchema)(foreignEndpointSchema, model) ? "\"".concat(foreignEndpointSchema.name, "\".") : '', "\"").concat(foreignEndpointTableName, "\" ").concat(foreignEndpointFields, ";\n\n");
      return line;
    }
  }, {
    key: "exportRefs",
    value: function exportRefs(refIds, model, usedTableNames) {
      var _this = this;
      var strArr = refIds.map(function (refId) {
        var line = '';
        var ref = model.refs[refId];
        var refOneIndex = ref.endpointIds.findIndex(function (endpointId) {
          return model.endpoints[endpointId].relation === '1';
        });
        var refEndpointIndex = refOneIndex === -1 ? 0 : refOneIndex;
        var foreignEndpointId = ref.endpointIds[1 - refEndpointIndex];
        var refEndpointId = ref.endpointIds[refEndpointIndex];
        var foreignEndpoint = model.endpoints[foreignEndpointId];
        var refEndpoint = model.endpoints[refEndpointId];
        var refEndpointField = model.fields[refEndpoint.fieldIds[0]];
        var refEndpointTable = model.tables[refEndpointField.tableId];
        var refEndpointSchema = model.schemas[refEndpointTable.schemaId];
        var refEndpointFieldName = _this.buildFieldName(refEndpoint.fieldIds, model, 'postgres');
        var foreignEndpointField = model.fields[foreignEndpoint.fieldIds[0]];
        var foreignEndpointTable = model.tables[foreignEndpointField.tableId];
        var foreignEndpointSchema = model.schemas[foreignEndpointTable.schemaId];
        var foreignEndpointFieldName = _this.buildFieldName(foreignEndpoint.fieldIds, model, 'postgres');
        if (refOneIndex === -1) {
          // many to many relationship
          var firstTableFieldsMap = (0, _utils.buildJunctionFields1)(refEndpoint.fieldIds, model);
          var secondTableFieldsMap = (0, _utils.buildJunctionFields2)(foreignEndpoint.fieldIds, model, firstTableFieldsMap);
          var newTableName = (0, _utils.buildNewTableName)(refEndpointTable.name, foreignEndpointTable.name, usedTableNames);
          line += _this.buildTableManyToMany(firstTableFieldsMap, secondTableFieldsMap, newTableName, refEndpointSchema, model);
          line += _this.buildForeignKeyManyToMany(firstTableFieldsMap, refEndpointFieldName, newTableName, refEndpointTable.name, refEndpointSchema, refEndpointSchema, model);
          line += _this.buildForeignKeyManyToMany(secondTableFieldsMap, foreignEndpointFieldName, newTableName, foreignEndpointTable.name, refEndpointSchema, foreignEndpointSchema, model);
        } else {
          line = "ALTER TABLE ".concat((0, _utils.shouldPrintSchema)(foreignEndpointSchema, model) ? "\"".concat(foreignEndpointSchema.name, "\".") : '', "\"").concat(foreignEndpointTable.name, "\" ADD ");
          if (ref.name) {
            line += "CONSTRAINT \"".concat(ref.name, "\" ");
          }
          line += "FOREIGN KEY ".concat(foreignEndpointFieldName, " REFERENCES ").concat((0, _utils.shouldPrintSchema)(refEndpointSchema, model) ? "\"".concat(refEndpointSchema.name, "\".") : '', "\"").concat(refEndpointTable.name, "\" ").concat(refEndpointFieldName);
          if (ref.onDelete) {
            line += " ON DELETE ".concat(ref.onDelete.toUpperCase());
          }
          if (ref.onUpdate) {
            line += " ON UPDATE ".concat(ref.onUpdate.toUpperCase());
          }
          line += ';\n';
        }
        return line;
      });
      return strArr;
    }
  }, {
    key: "exportIndexes",
    value: function exportIndexes(indexIds, model) {
      // exclude composite pk index
      var indexArr = indexIds.filter(function (indexId) {
        return !model.indexes[indexId].pk;
      }).map(function (indexId) {
        var index = model.indexes[indexId];
        var table = model.tables[index.tableId];
        var schema = model.schemas[table.schemaId];
        var line = 'CREATE';
        if (index.unique) {
          line += ' UNIQUE';
        }
        var indexName = index.name ? "\"".concat(index.name, "\"") : '';
        line += ' INDEX';
        if (indexName) {
          line += " ".concat(indexName);
        }
        line += " ON ".concat((0, _utils.shouldPrintSchema)(schema, model) ? "\"".concat(schema.name, "\".") : '', "\"").concat(table.name, "\"");
        if (index.type) {
          line += " USING ".concat(index.type.toUpperCase());
        }
        var columnArr = [];
        index.columnIds.forEach(function (columnId) {
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
        line += ';\n';
        return line;
      });
      return indexArr;
    }
  }, {
    key: "exportComments",
    value: function exportComments(comments, model) {
      var commentArr = comments.map(function (comment) {
        var line = 'COMMENT ON';
        var table = model.tables[comment.tableId];
        var schema = model.schemas[table.schemaId];
        switch (comment.type) {
          case 'table':
            {
              line += " TABLE ".concat((0, _utils.shouldPrintSchema)(schema, model) ? "\"".concat(schema.name, "\".") : '', "\"").concat(table.name, "\" IS '").concat(table.note.replace(/'/g, "''"), "'");
              break;
            }
          case 'column':
            {
              var field = model.fields[comment.fieldId];
              line += " COLUMN ".concat((0, _utils.shouldPrintSchema)(schema, model) ? "\"".concat(schema.name, "\".") : '', "\"").concat(table.name, "\".\"").concat(field.name, "\" IS '").concat(field.note.replace(/'/g, "''"), "'");
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
      var database = model.database['1'];
      var usedTableNames = new Set(Object.values(model.tables).map(function (table) {
        return table.name;
      }));

      // Pre-collect all user-defined enum names to distinguish them from built-in PostgreSQL types
      // This prevents built-in types like VARCHAR, INTEGER from being quoted unnecessarily
      var enumSet = new Set();
      var schemaEnumStatements = database.schemaIds.reduce(function (prevStatements, schemaId) {
        var schema = model.schemas[schemaId];
        var enumIds = schema.enumIds;
        if ((0, _utils.shouldPrintSchema)(schema, model)) {
          prevStatements.schemas.push("CREATE SCHEMA \"".concat(schema.name, "\";\n"));
        }
        if (!_lodash["default"].isEmpty(enumIds)) {
          var enumPairs = PostgresExporter.exportEnums(enumIds, model);
          enumPairs.forEach(function (enumPair) {
            var _enumPair = _slicedToArray(enumPair, 2),
              enumName = _enumPair[0],
              enumLine = _enumPair[1];
            prevStatements.enums.push(enumLine);
            enumSet.add(enumName);
          });
        }
        return prevStatements;
      }, {
        schemas: [],
        enums: [],
        tables: [],
        indexes: [],
        comments: [],
        refs: []
      });
      var statements = database.schemaIds.reduce(function (prevStatements, schemaId) {
        var schema = model.schemas[schemaId];
        var tableIds = schema.tableIds,
          refIds = schema.refIds;
        if (!_lodash["default"].isEmpty(tableIds)) {
          var _prevStatements$table;
          (_prevStatements$table = prevStatements.tables).push.apply(_prevStatements$table, _toConsumableArray(PostgresExporter.exportTables(tableIds, model, enumSet)));
        }
        var indexIds = _lodash["default"].flatten(tableIds.map(function (tableId) {
          return model.tables[tableId].indexIds;
        }));
        if (!_lodash["default"].isEmpty(indexIds)) {
          var _prevStatements$index;
          (_prevStatements$index = prevStatements.indexes).push.apply(_prevStatements$index, _toConsumableArray(PostgresExporter.exportIndexes(indexIds, model)));
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
          (_prevStatements$comme = prevStatements.comments).push.apply(_prevStatements$comme, _toConsumableArray(PostgresExporter.exportComments(commentNodes, model)));
        }
        if (!_lodash["default"].isEmpty(refIds)) {
          var _prevStatements$refs;
          (_prevStatements$refs = prevStatements.refs).push.apply(_prevStatements$refs, _toConsumableArray(PostgresExporter.exportRefs(refIds, model, usedTableNames)));
        }
        return prevStatements;
      }, schemaEnumStatements);
      var res = _lodash["default"].concat(statements.schemas, statements.enums, statements.tables, statements.indexes, statements.comments, statements.refs).join('\n');
      return res;
    }
  }]);
}();
var _default = exports["default"] = PostgresExporter;