"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = require("lodash");
var _utils = require("./utils");
var _config = require("../model_structure/config");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DbmlExporter = /*#__PURE__*/function () {
  function DbmlExporter() {
    _classCallCheck(this, DbmlExporter);
  }
  return _createClass(DbmlExporter, null, [{
    key: "hasWhiteSpace",
    value: function hasWhiteSpace(str) {
      return /\s/g.test(str);
    }
  }, {
    key: "hasSquareBracket",
    value: function hasSquareBracket(str) {
      return /\[|\]/.test(str);
    }
  }, {
    key: "isExpression",
    value: function isExpression(str) {
      return /\s*(\*|\+|-|\([A-Za-z0-9_]+\)|\(\))/g.test(str);
    }
  }, {
    key: "escapeNote",
    value: function escapeNote(str) {
      if (str === null) {
        return '';
      }
      var newStr = str.replaceAll('\\', '\\\\');
      if (!newStr.match(/[\n\r']/)) {
        // Only safe chars, no simple quotes nor CR/LF
        return "'".concat(newStr, "'");
      }
      newStr = newStr.replaceAll("'", "\\'");
      newStr = newStr.replaceAll('\r\n', '\n'); // turn all CRLF to LF
      return "'''".concat(newStr, "'''");
    }
  }, {
    key: "exportEnums",
    value: function exportEnums(enumIds, model) {
      var enumStrs = enumIds.map(function (enumId) {
        var _enum = model.enums[enumId];
        var schema = model.schemas[_enum.schemaId];
        return "Enum ".concat((0, _utils.shouldPrintSchema)(schema, model) ? "\"".concat(schema.name, "\".") : '', "\"").concat(_enum.name, "\" {\n").concat(_enum.valueIds.map(function (valueId) {
          return "  \"".concat(model.enumValues[valueId].name, "\"").concat(model.enumValues[valueId].note ? " [note: ".concat(DbmlExporter.escapeNote(model.enumValues[valueId].note), "]") : '');
        }).join('\n'), "\n}\n");
      });
      return enumStrs.length ? enumStrs.join('\n') : '';
    }
  }, {
    key: "getFieldLines",
    value: function getFieldLines(tableId, model) {
      var table = model.tables[tableId];
      var lines = table.fieldIds.map(function (fieldId) {
        var field = model.fields[fieldId];
        var schemaName = '';
        if (field.type.schemaName && field.type.schemaName !== _config.DEFAULT_SCHEMA_NAME) {
          schemaName = DbmlExporter.hasWhiteSpace(field.type.schemaName) ? "\"".concat(field.type.schemaName, "\".") : "".concat(field.type.schemaName, ".");
        }
        var line = "\"".concat(field.name, "\" ").concat(schemaName).concat(DbmlExporter.hasWhiteSpace(field.type.type_name) || DbmlExporter.hasSquareBracket(field.type.type_name) ? "\"".concat(field.type.type_name, "\"") : field.type.type_name);
        var constraints = [];
        if (field.unique) {
          constraints.push('unique');
        }
        if (field.pk) {
          constraints.push('pk');
        }
        if (field.not_null) {
          constraints.push('not null');
        }
        if (field.increment) {
          constraints.push('increment');
        }
        if (field.dbdefault) {
          var value = 'default: ';
          switch (field.dbdefault.type) {
            case 'boolean':
            case 'number':
              value += "".concat(field.dbdefault.value);
              break;
            case 'string':
              {
                var quote = field.dbdefault.value.includes('\n') ? "'''" : "'";
                value += "".concat(quote).concat(field.dbdefault.value).concat(quote);
                break;
              }
            case 'expression':
              value += "`".concat(field.dbdefault.value, "`");
              break;
            default:
              break;
          }
          constraints.push(value);
        }
        if (field.note) {
          constraints.push("note: ".concat(DbmlExporter.escapeNote(field.note)));
        }
        if (constraints.length > 0) {
          line += " [".concat(constraints.join(', '), "]");
        }
        return line;
      });
      return lines;
    }
  }, {
    key: "getIndexLines",
    value: function getIndexLines(tableId, model) {
      var table = model.tables[tableId];
      var lines = table.indexIds.map(function (indexId) {
        var line = '';
        var index = model.indexes[indexId];
        if (index.columnIds.length > 1) {
          line = "(".concat(index.columnIds.map(function (columnId) {
            var column = model.indexColumns[columnId];
            if (column.type === 'expression') {
              return "`".concat(column.value, "`");
            }
            return column.value;
          }).join(', '), ")");
        } else if (index.columnIds.length === 1) {
          var column = model.indexColumns[index.columnIds[0]];
          line = column.type === 'expression' ? "`".concat(column.value, "`") : column.value;
        }
        var indexSettings = [];
        if (index.pk) {
          indexSettings.push('pk');
        }
        if (index.type) {
          indexSettings.push("type: ".concat(index.type.toLowerCase()));
        }
        if (index.unique) {
          indexSettings.push('unique');
        }
        if (index.name) {
          indexSettings.push("name: \"".concat(index.name, "\""));
        }
        if (indexSettings.length > 1) {
          line += " [".concat(indexSettings.join(', '), "]");
        } else if (indexSettings.length === 1) {
          line += " [".concat(indexSettings[0], "]");
        }
        return line;
      });
      return lines;
    }
  }, {
    key: "getTableContentArr",
    value: function getTableContentArr(tableIds, model) {
      var tableContentArr = tableIds.map(function (tableId) {
        var fieldContents = DbmlExporter.getFieldLines(tableId, model);
        var indexContents = DbmlExporter.getIndexLines(tableId, model);
        return {
          tableId: tableId,
          fieldContents: fieldContents,
          indexContents: indexContents
        };
      });
      return tableContentArr;
    }
  }, {
    key: "getTableSettings",
    value: function getTableSettings(table) {
      var settingStr = '';
      var settingSep = ', ';
      if (table.headerColor) {
        settingStr += "headerColor: ".concat(table.headerColor).concat(settingSep);
      }
      if (settingStr.endsWith(', ')) {
        settingStr = settingStr.replace(/,\s$/, '');
      }
      return settingStr ? " [".concat(settingStr, "]") : '';
    }
  }, {
    key: "exportTables",
    value: function exportTables(tableIds, model) {
      var tableContentArr = DbmlExporter.getTableContentArr(tableIds, model);
      var tableStrs = tableContentArr.map(function (tableContent) {
        var table = model.tables[tableContent.tableId];
        var schema = model.schemas[table.schemaId];
        var tableSettingStr = DbmlExporter.getTableSettings(table);
        // Include schema name if needed
        var tableName = "\"".concat(table.name, "\"");
        if ((0, _utils.shouldPrintSchema)(schema, model)) tableName = "\"".concat(schema.name, "\".\"").concat(table.name, "\"");
        var fieldStr = tableContent.fieldContents.map(function (field) {
          return "  ".concat(field, "\n");
        }).join('');
        var indexStr = '';
        if (!(0, _lodash.isEmpty)(tableContent.indexContents)) {
          var indexBody = tableContent.indexContents.map(function (indexLine) {
            return "    ".concat(indexLine, "\n");
          }).join('');
          indexStr = "\n  Indexes {\n".concat(indexBody, "  }\n");
        }
        var noteStr = table.note ? "  Note: ".concat(DbmlExporter.escapeNote(table.note), "\n") : '';
        return "Table ".concat(tableName).concat(tableSettingStr, " {\n").concat(fieldStr).concat(indexStr).concat(noteStr, "}\n");
      });
      return tableStrs.length ? tableStrs.join('\n') : '';
    }
  }, {
    key: "buildFieldName",
    value: function buildFieldName(fieldIds, model) {
      var fieldNames = fieldIds.map(function (fieldId) {
        return "\"".concat(model.fields[fieldId].name, "\"");
      }).join(', ');
      return fieldIds.length === 1 ? fieldNames : "(".concat(fieldNames, ")");
    }
  }, {
    key: "exportRefs",
    value: function exportRefs(refIds, model) {
      var _this = this;
      var strArr = refIds.map(function (refId) {
        var ref = model.refs[refId];
        var oneRelationEndpointIndex = ref.endpointIds.findIndex(function (endpointId) {
          return model.endpoints[endpointId].relation === '1';
        });
        var isManyToMany = oneRelationEndpointIndex === -1;
        var refEndpointIndex = isManyToMany ? 0 : oneRelationEndpointIndex;
        var foreignEndpointId = ref.endpointIds[1 - refEndpointIndex];
        var refEndpointId = ref.endpointIds[refEndpointIndex];
        var foreignEndpoint = model.endpoints[foreignEndpointId];
        var refEndpoint = model.endpoints[refEndpointId];
        var line = 'Ref';
        var refEndpointField = model.fields[refEndpoint.fieldIds[0]];
        var refEndpointTable = model.tables[refEndpointField.tableId];
        var refEndpointSchema = model.schemas[refEndpointTable.schemaId];
        var refEndpointFieldName = _this.buildFieldName(refEndpoint.fieldIds, model, 'dbml');
        if (ref.name) {
          line += " ".concat((0, _utils.shouldPrintSchema)(model.schemas[ref.schemaId], model) ? "\"".concat(model.schemas[ref.schemaId].name, "\".") : '', "\"").concat(ref.name, "\"");
        }
        line += ':';
        line += "".concat((0, _utils.shouldPrintSchema)(refEndpointSchema, model) ? "\"".concat(refEndpointSchema.name, "\".") : '', "\"").concat(refEndpointTable.name, "\".").concat(refEndpointFieldName, " ");
        var foreignEndpointField = model.fields[foreignEndpoint.fieldIds[0]];
        var foreignEndpointTable = model.tables[foreignEndpointField.tableId];
        var foreignEndpointSchema = model.schemas[foreignEndpointTable.schemaId];
        var foreignEndpointFieldName = _this.buildFieldName(foreignEndpoint.fieldIds, model, 'dbml');
        if (isManyToMany) line += '<> ';else if (foreignEndpoint.relation === '1') line += '- ';else line += '< ';
        line += "".concat((0, _utils.shouldPrintSchema)(foreignEndpointSchema, model) ? "\"".concat(foreignEndpointSchema.name, "\".") : '', "\"").concat(foreignEndpointTable.name, "\".").concat(foreignEndpointFieldName);
        var refActions = [];
        if (ref.onUpdate) {
          refActions.push("update: ".concat(ref.onUpdate.toLowerCase()));
        }
        if (ref.onDelete) {
          refActions.push("delete: ".concat(ref.onDelete.toLowerCase()));
        }
        if (refActions.length > 0) {
          line += " [".concat(refActions.join(', '), "]");
        }
        line += '\n';
        return line;
      });
      return strArr.length ? strArr.join('\n') : '';
    }
  }, {
    key: "getTableGroupSettings",
    value: function getTableGroupSettings(tableGroup) {
      var settings = [];
      if (tableGroup.color) settings.push("color: ".concat(tableGroup.color));
      return settings.length ? " [".concat(settings.join(', '), "]") : '';
    }
  }, {
    key: "exportTableGroups",
    value: function exportTableGroups(tableGroupIds, model) {
      var tableGroupStrs = tableGroupIds.map(function (groupId) {
        var group = model.tableGroups[groupId];
        var groupSchema = model.schemas[group.schemaId];
        var groupSettingStr = DbmlExporter.getTableGroupSettings(group);
        var groupNote = group.note ? "  Note: ".concat(DbmlExporter.escapeNote(group.note), "\n") : '';
        var groupSchemaName = (0, _utils.shouldPrintSchema)(groupSchema, model) ? "\"".concat(groupSchema.name, "\".") : '';
        var groupName = "".concat(groupSchemaName, "\"").concat(group.name, "\"");
        var tableNames = group.tableIds.reduce(function (result, tableId) {
          var table = model.tables[tableId];
          var tableSchema = model.schemas[table.schemaId];
          var tableName = "  ".concat((0, _utils.shouldPrintSchema)(tableSchema, model) ? "\"".concat(tableSchema.name, "\".") : '', "\"").concat(table.name, "\"");
          return result + "".concat(tableName, "\n");
        }, '');
        return "TableGroup ".concat(groupName).concat(groupSettingStr, " {\n").concat(tableNames).concat(groupNote, "}\n");
      });
      return tableGroupStrs.length ? tableGroupStrs.join('\n') : '';
    }
  }, {
    key: "exportStickyNotes",
    value: function exportStickyNotes(model) {
      return (0, _lodash.reduce)(model.notes, function (result, note) {
        var escapedContent = "  ".concat(DbmlExporter.escapeNote(note.content));
        var stickyNote = "Note ".concat(note.name, " {\n").concat(escapedContent, "\n}\n");

        // Add a blank line between note elements
        return result ? result + '\n' + stickyNote : stickyNote;
      }, '');
    }
  }, {
    key: "export",
    value: function _export(model) {
      var elementStrs = [];
      var database = model.database['1'];
      database.schemaIds.forEach(function (schemaId) {
        var _model$schemas$schema = model.schemas[schemaId],
          enumIds = _model$schemas$schema.enumIds,
          tableIds = _model$schemas$schema.tableIds,
          tableGroupIds = _model$schemas$schema.tableGroupIds,
          refIds = _model$schemas$schema.refIds;
        if (!(0, _lodash.isEmpty)(enumIds)) elementStrs.push(DbmlExporter.exportEnums(enumIds, model));
        if (!(0, _lodash.isEmpty)(tableIds)) elementStrs.push(DbmlExporter.exportTables(tableIds, model));
        if (!(0, _lodash.isEmpty)(tableGroupIds)) elementStrs.push(DbmlExporter.exportTableGroups(tableGroupIds, model));
        if (!(0, _lodash.isEmpty)(refIds)) elementStrs.push(DbmlExporter.exportRefs(refIds, model));
      });
      if (!(0, _lodash.isEmpty)(model.notes)) elementStrs.push(DbmlExporter.exportStickyNotes(model));

      // all elements already end with 1 '\n', so join('\n') to separate them with 1 blank line
      return elementStrs.join('\n');
    }
  }]);
}();
var _default = exports["default"] = DbmlExporter;