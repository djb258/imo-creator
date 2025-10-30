"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // Generated from ./MySqlParser.g4 by ANTLR 4.13.1
// jshint ignore: start
// This class defines a complete generic visitor for a parse tree produced by MySqlParser.
var MySqlParserVisitor = exports["default"] = /*#__PURE__*/function (_antlr4$tree$ParseTre) {
  function MySqlParserVisitor() {
    _classCallCheck(this, MySqlParserVisitor);
    return _callSuper(this, MySqlParserVisitor, arguments);
  }
  _inherits(MySqlParserVisitor, _antlr4$tree$ParseTre);
  return _createClass(MySqlParserVisitor, [{
    key: "visitRoot",
    value:
    // Visit a parse tree produced by MySqlParser#root.
    function visitRoot(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#sqlStatements.
  }, {
    key: "visitSqlStatements",
    value: function visitSqlStatements(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#sqlStatement.
  }, {
    key: "visitSqlStatement",
    value: function visitSqlStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#emptyStatement_.
  }, {
    key: "visitEmptyStatement_",
    value: function visitEmptyStatement_(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ddlStatement.
  }, {
    key: "visitDdlStatement",
    value: function visitDdlStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dmlStatement.
  }, {
    key: "visitDmlStatement",
    value: function visitDmlStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#transactionStatement.
  }, {
    key: "visitTransactionStatement",
    value: function visitTransactionStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#replicationStatement.
  }, {
    key: "visitReplicationStatement",
    value: function visitReplicationStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#preparedStatement.
  }, {
    key: "visitPreparedStatement",
    value: function visitPreparedStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#compoundStatement.
  }, {
    key: "visitCompoundStatement",
    value: function visitCompoundStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#administrationStatement.
  }, {
    key: "visitAdministrationStatement",
    value: function visitAdministrationStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#utilityStatement.
  }, {
    key: "visitUtilityStatement",
    value: function visitUtilityStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createDatabase.
  }, {
    key: "visitCreateDatabase",
    value: function visitCreateDatabase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createEvent.
  }, {
    key: "visitCreateEvent",
    value: function visitCreateEvent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createIndex.
  }, {
    key: "visitCreateIndex",
    value: function visitCreateIndex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createLogfileGroup.
  }, {
    key: "visitCreateLogfileGroup",
    value: function visitCreateLogfileGroup(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createProcedure.
  }, {
    key: "visitCreateProcedure",
    value: function visitCreateProcedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createFunction.
  }, {
    key: "visitCreateFunction",
    value: function visitCreateFunction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createRole.
  }, {
    key: "visitCreateRole",
    value: function visitCreateRole(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createServer.
  }, {
    key: "visitCreateServer",
    value: function visitCreateServer(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#copyCreateTable.
  }, {
    key: "visitCopyCreateTable",
    value: function visitCopyCreateTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#queryCreateTable.
  }, {
    key: "visitQueryCreateTable",
    value: function visitQueryCreateTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#columnCreateTable.
  }, {
    key: "visitColumnCreateTable",
    value: function visitColumnCreateTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createTablespaceInnodb.
  }, {
    key: "visitCreateTablespaceInnodb",
    value: function visitCreateTablespaceInnodb(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createTablespaceNdb.
  }, {
    key: "visitCreateTablespaceNdb",
    value: function visitCreateTablespaceNdb(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createTrigger.
  }, {
    key: "visitCreateTrigger",
    value: function visitCreateTrigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#withClause.
  }, {
    key: "visitWithClause",
    value: function visitWithClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#commonTableExpressions.
  }, {
    key: "visitCommonTableExpressions",
    value: function visitCommonTableExpressions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#cteName.
  }, {
    key: "visitCteName",
    value: function visitCteName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#cteColumnName.
  }, {
    key: "visitCteColumnName",
    value: function visitCteColumnName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createView.
  }, {
    key: "visitCreateView",
    value: function visitCreateView(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createDatabaseOption.
  }, {
    key: "visitCreateDatabaseOption",
    value: function visitCreateDatabaseOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#charSet.
  }, {
    key: "visitCharSet",
    value: function visitCharSet(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#currentUserExpression.
  }, {
    key: "visitCurrentUserExpression",
    value: function visitCurrentUserExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ownerStatement.
  }, {
    key: "visitOwnerStatement",
    value: function visitOwnerStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#preciseSchedule.
  }, {
    key: "visitPreciseSchedule",
    value: function visitPreciseSchedule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#intervalSchedule.
  }, {
    key: "visitIntervalSchedule",
    value: function visitIntervalSchedule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#timestampValue.
  }, {
    key: "visitTimestampValue",
    value: function visitTimestampValue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#intervalExpr.
  }, {
    key: "visitIntervalExpr",
    value: function visitIntervalExpr(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#intervalType.
  }, {
    key: "visitIntervalType",
    value: function visitIntervalType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#enableType.
  }, {
    key: "visitEnableType",
    value: function visitEnableType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexType.
  }, {
    key: "visitIndexType",
    value: function visitIndexType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexOption.
  }, {
    key: "visitIndexOption",
    value: function visitIndexOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#procedureParameter.
  }, {
    key: "visitProcedureParameter",
    value: function visitProcedureParameter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#functionParameter.
  }, {
    key: "visitFunctionParameter",
    value: function visitFunctionParameter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#routineComment.
  }, {
    key: "visitRoutineComment",
    value: function visitRoutineComment(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#routineLanguage.
  }, {
    key: "visitRoutineLanguage",
    value: function visitRoutineLanguage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#routineBehavior.
  }, {
    key: "visitRoutineBehavior",
    value: function visitRoutineBehavior(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#routineData.
  }, {
    key: "visitRoutineData",
    value: function visitRoutineData(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#routineSecurity.
  }, {
    key: "visitRoutineSecurity",
    value: function visitRoutineSecurity(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#serverOption.
  }, {
    key: "visitServerOption",
    value: function visitServerOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createDefinitions.
  }, {
    key: "visitCreateDefinitions",
    value: function visitCreateDefinitions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#columnDeclaration.
  }, {
    key: "visitColumnDeclaration",
    value: function visitColumnDeclaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#constraintDeclaration.
  }, {
    key: "visitConstraintDeclaration",
    value: function visitConstraintDeclaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexDeclaration.
  }, {
    key: "visitIndexDeclaration",
    value: function visitIndexDeclaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#columnDefinition.
  }, {
    key: "visitColumnDefinition",
    value: function visitColumnDefinition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nullColumnConstraint.
  }, {
    key: "visitNullColumnConstraint",
    value: function visitNullColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#defaultColumnConstraint.
  }, {
    key: "visitDefaultColumnConstraint",
    value: function visitDefaultColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#visibilityColumnConstraint.
  }, {
    key: "visitVisibilityColumnConstraint",
    value: function visitVisibilityColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#invisibilityColumnConstraint.
  }, {
    key: "visitInvisibilityColumnConstraint",
    value: function visitInvisibilityColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#autoIncrementColumnConstraint.
  }, {
    key: "visitAutoIncrementColumnConstraint",
    value: function visitAutoIncrementColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#primaryKeyColumnConstraint.
  }, {
    key: "visitPrimaryKeyColumnConstraint",
    value: function visitPrimaryKeyColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#uniqueKeyColumnConstraint.
  }, {
    key: "visitUniqueKeyColumnConstraint",
    value: function visitUniqueKeyColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#commentColumnConstraint.
  }, {
    key: "visitCommentColumnConstraint",
    value: function visitCommentColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#formatColumnConstraint.
  }, {
    key: "visitFormatColumnConstraint",
    value: function visitFormatColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#storageColumnConstraint.
  }, {
    key: "visitStorageColumnConstraint",
    value: function visitStorageColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#referenceColumnConstraint.
  }, {
    key: "visitReferenceColumnConstraint",
    value: function visitReferenceColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#collateColumnConstraint.
  }, {
    key: "visitCollateColumnConstraint",
    value: function visitCollateColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#generatedColumnConstraint.
  }, {
    key: "visitGeneratedColumnConstraint",
    value: function visitGeneratedColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#serialDefaultColumnConstraint.
  }, {
    key: "visitSerialDefaultColumnConstraint",
    value: function visitSerialDefaultColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#checkColumnConstraint.
  }, {
    key: "visitCheckColumnConstraint",
    value: function visitCheckColumnConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#primaryKeyTableConstraint.
  }, {
    key: "visitPrimaryKeyTableConstraint",
    value: function visitPrimaryKeyTableConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#uniqueKeyTableConstraint.
  }, {
    key: "visitUniqueKeyTableConstraint",
    value: function visitUniqueKeyTableConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#foreignKeyTableConstraint.
  }, {
    key: "visitForeignKeyTableConstraint",
    value: function visitForeignKeyTableConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#checkTableConstraint.
  }, {
    key: "visitCheckTableConstraint",
    value: function visitCheckTableConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#referenceDefinition.
  }, {
    key: "visitReferenceDefinition",
    value: function visitReferenceDefinition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#referenceAction.
  }, {
    key: "visitReferenceAction",
    value: function visitReferenceAction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#referenceControlType.
  }, {
    key: "visitReferenceControlType",
    value: function visitReferenceControlType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleIndexDeclaration.
  }, {
    key: "visitSimpleIndexDeclaration",
    value: function visitSimpleIndexDeclaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#specialIndexDeclaration.
  }, {
    key: "visitSpecialIndexDeclaration",
    value: function visitSpecialIndexDeclaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionEngine.
  }, {
    key: "visitTableOptionEngine",
    value: function visitTableOptionEngine(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionEngineAttribute.
  }, {
    key: "visitTableOptionEngineAttribute",
    value: function visitTableOptionEngineAttribute(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionAutoextendSize.
  }, {
    key: "visitTableOptionAutoextendSize",
    value: function visitTableOptionAutoextendSize(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionAutoIncrement.
  }, {
    key: "visitTableOptionAutoIncrement",
    value: function visitTableOptionAutoIncrement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionAverage.
  }, {
    key: "visitTableOptionAverage",
    value: function visitTableOptionAverage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionCharset.
  }, {
    key: "visitTableOptionCharset",
    value: function visitTableOptionCharset(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionChecksum.
  }, {
    key: "visitTableOptionChecksum",
    value: function visitTableOptionChecksum(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionCollate.
  }, {
    key: "visitTableOptionCollate",
    value: function visitTableOptionCollate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionComment.
  }, {
    key: "visitTableOptionComment",
    value: function visitTableOptionComment(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionCompression.
  }, {
    key: "visitTableOptionCompression",
    value: function visitTableOptionCompression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionConnection.
  }, {
    key: "visitTableOptionConnection",
    value: function visitTableOptionConnection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionDataDirectory.
  }, {
    key: "visitTableOptionDataDirectory",
    value: function visitTableOptionDataDirectory(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionDelay.
  }, {
    key: "visitTableOptionDelay",
    value: function visitTableOptionDelay(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionEncryption.
  }, {
    key: "visitTableOptionEncryption",
    value: function visitTableOptionEncryption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionPageCompressed.
  }, {
    key: "visitTableOptionPageCompressed",
    value: function visitTableOptionPageCompressed(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionPageCompressionLevel.
  }, {
    key: "visitTableOptionPageCompressionLevel",
    value: function visitTableOptionPageCompressionLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionEncryptionKeyId.
  }, {
    key: "visitTableOptionEncryptionKeyId",
    value: function visitTableOptionEncryptionKeyId(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionIndexDirectory.
  }, {
    key: "visitTableOptionIndexDirectory",
    value: function visitTableOptionIndexDirectory(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionInsertMethod.
  }, {
    key: "visitTableOptionInsertMethod",
    value: function visitTableOptionInsertMethod(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionKeyBlockSize.
  }, {
    key: "visitTableOptionKeyBlockSize",
    value: function visitTableOptionKeyBlockSize(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionMaxRows.
  }, {
    key: "visitTableOptionMaxRows",
    value: function visitTableOptionMaxRows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionMinRows.
  }, {
    key: "visitTableOptionMinRows",
    value: function visitTableOptionMinRows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionPackKeys.
  }, {
    key: "visitTableOptionPackKeys",
    value: function visitTableOptionPackKeys(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionPassword.
  }, {
    key: "visitTableOptionPassword",
    value: function visitTableOptionPassword(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionRowFormat.
  }, {
    key: "visitTableOptionRowFormat",
    value: function visitTableOptionRowFormat(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionStartTransaction.
  }, {
    key: "visitTableOptionStartTransaction",
    value: function visitTableOptionStartTransaction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionSecondaryEngineAttribute.
  }, {
    key: "visitTableOptionSecondaryEngineAttribute",
    value: function visitTableOptionSecondaryEngineAttribute(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionRecalculation.
  }, {
    key: "visitTableOptionRecalculation",
    value: function visitTableOptionRecalculation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionPersistent.
  }, {
    key: "visitTableOptionPersistent",
    value: function visitTableOptionPersistent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionSamplePage.
  }, {
    key: "visitTableOptionSamplePage",
    value: function visitTableOptionSamplePage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionTablespace.
  }, {
    key: "visitTableOptionTablespace",
    value: function visitTableOptionTablespace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionTableType.
  }, {
    key: "visitTableOptionTableType",
    value: function visitTableOptionTableType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionTransactional.
  }, {
    key: "visitTableOptionTransactional",
    value: function visitTableOptionTransactional(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableOptionUnion.
  }, {
    key: "visitTableOptionUnion",
    value: function visitTableOptionUnion(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableType.
  }, {
    key: "visitTableType",
    value: function visitTableType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tablespaceStorage.
  }, {
    key: "visitTablespaceStorage",
    value: function visitTablespaceStorage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionDefinitions.
  }, {
    key: "visitPartitionDefinitions",
    value: function visitPartitionDefinitions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionFunctionHash.
  }, {
    key: "visitPartitionFunctionHash",
    value: function visitPartitionFunctionHash(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionFunctionKey.
  }, {
    key: "visitPartitionFunctionKey",
    value: function visitPartitionFunctionKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionFunctionRange.
  }, {
    key: "visitPartitionFunctionRange",
    value: function visitPartitionFunctionRange(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionFunctionList.
  }, {
    key: "visitPartitionFunctionList",
    value: function visitPartitionFunctionList(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#subPartitionFunctionHash.
  }, {
    key: "visitSubPartitionFunctionHash",
    value: function visitSubPartitionFunctionHash(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#subPartitionFunctionKey.
  }, {
    key: "visitSubPartitionFunctionKey",
    value: function visitSubPartitionFunctionKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionComparison.
  }, {
    key: "visitPartitionComparison",
    value: function visitPartitionComparison(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionListAtom.
  }, {
    key: "visitPartitionListAtom",
    value: function visitPartitionListAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionListVector.
  }, {
    key: "visitPartitionListVector",
    value: function visitPartitionListVector(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionSimple.
  }, {
    key: "visitPartitionSimple",
    value: function visitPartitionSimple(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionDefinerAtom.
  }, {
    key: "visitPartitionDefinerAtom",
    value: function visitPartitionDefinerAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionDefinerVector.
  }, {
    key: "visitPartitionDefinerVector",
    value: function visitPartitionDefinerVector(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#subpartitionDefinition.
  }, {
    key: "visitSubpartitionDefinition",
    value: function visitSubpartitionDefinition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionEngine.
  }, {
    key: "visitPartitionOptionEngine",
    value: function visitPartitionOptionEngine(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionComment.
  }, {
    key: "visitPartitionOptionComment",
    value: function visitPartitionOptionComment(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionDataDirectory.
  }, {
    key: "visitPartitionOptionDataDirectory",
    value: function visitPartitionOptionDataDirectory(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionIndexDirectory.
  }, {
    key: "visitPartitionOptionIndexDirectory",
    value: function visitPartitionOptionIndexDirectory(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionMaxRows.
  }, {
    key: "visitPartitionOptionMaxRows",
    value: function visitPartitionOptionMaxRows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionMinRows.
  }, {
    key: "visitPartitionOptionMinRows",
    value: function visitPartitionOptionMinRows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionTablespace.
  }, {
    key: "visitPartitionOptionTablespace",
    value: function visitPartitionOptionTablespace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionOptionNodeGroup.
  }, {
    key: "visitPartitionOptionNodeGroup",
    value: function visitPartitionOptionNodeGroup(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterSimpleDatabase.
  }, {
    key: "visitAlterSimpleDatabase",
    value: function visitAlterSimpleDatabase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterUpgradeName.
  }, {
    key: "visitAlterUpgradeName",
    value: function visitAlterUpgradeName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterEvent.
  }, {
    key: "visitAlterEvent",
    value: function visitAlterEvent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterFunction.
  }, {
    key: "visitAlterFunction",
    value: function visitAlterFunction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterInstance.
  }, {
    key: "visitAlterInstance",
    value: function visitAlterInstance(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterLogfileGroup.
  }, {
    key: "visitAlterLogfileGroup",
    value: function visitAlterLogfileGroup(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterProcedure.
  }, {
    key: "visitAlterProcedure",
    value: function visitAlterProcedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterServer.
  }, {
    key: "visitAlterServer",
    value: function visitAlterServer(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterTable.
  }, {
    key: "visitAlterTable",
    value: function visitAlterTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterTablespace.
  }, {
    key: "visitAlterTablespace",
    value: function visitAlterTablespace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterView.
  }, {
    key: "visitAlterView",
    value: function visitAlterView(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByTableOption.
  }, {
    key: "visitAlterByTableOption",
    value: function visitAlterByTableOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddColumn.
  }, {
    key: "visitAlterByAddColumn",
    value: function visitAlterByAddColumn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddColumns.
  }, {
    key: "visitAlterByAddColumns",
    value: function visitAlterByAddColumns(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddIndex.
  }, {
    key: "visitAlterByAddIndex",
    value: function visitAlterByAddIndex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddPrimaryKey.
  }, {
    key: "visitAlterByAddPrimaryKey",
    value: function visitAlterByAddPrimaryKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddUniqueKey.
  }, {
    key: "visitAlterByAddUniqueKey",
    value: function visitAlterByAddUniqueKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddSpecialIndex.
  }, {
    key: "visitAlterByAddSpecialIndex",
    value: function visitAlterByAddSpecialIndex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddForeignKey.
  }, {
    key: "visitAlterByAddForeignKey",
    value: function visitAlterByAddForeignKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddCheckTableConstraint.
  }, {
    key: "visitAlterByAddCheckTableConstraint",
    value: function visitAlterByAddCheckTableConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAlterCheckTableConstraint.
  }, {
    key: "visitAlterByAlterCheckTableConstraint",
    value: function visitAlterByAlterCheckTableConstraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterBySetAlgorithm.
  }, {
    key: "visitAlterBySetAlgorithm",
    value: function visitAlterBySetAlgorithm(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByChangeDefault.
  }, {
    key: "visitAlterByChangeDefault",
    value: function visitAlterByChangeDefault(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByChangeColumn.
  }, {
    key: "visitAlterByChangeColumn",
    value: function visitAlterByChangeColumn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByRenameColumn.
  }, {
    key: "visitAlterByRenameColumn",
    value: function visitAlterByRenameColumn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByLock.
  }, {
    key: "visitAlterByLock",
    value: function visitAlterByLock(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByModifyColumn.
  }, {
    key: "visitAlterByModifyColumn",
    value: function visitAlterByModifyColumn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDropColumn.
  }, {
    key: "visitAlterByDropColumn",
    value: function visitAlterByDropColumn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDropConstraintCheck.
  }, {
    key: "visitAlterByDropConstraintCheck",
    value: function visitAlterByDropConstraintCheck(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDropPrimaryKey.
  }, {
    key: "visitAlterByDropPrimaryKey",
    value: function visitAlterByDropPrimaryKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDropIndex.
  }, {
    key: "visitAlterByDropIndex",
    value: function visitAlterByDropIndex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByRenameIndex.
  }, {
    key: "visitAlterByRenameIndex",
    value: function visitAlterByRenameIndex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAlterColumnDefault.
  }, {
    key: "visitAlterByAlterColumnDefault",
    value: function visitAlterByAlterColumnDefault(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAlterIndexVisibility.
  }, {
    key: "visitAlterByAlterIndexVisibility",
    value: function visitAlterByAlterIndexVisibility(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDropForeignKey.
  }, {
    key: "visitAlterByDropForeignKey",
    value: function visitAlterByDropForeignKey(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDisableKeys.
  }, {
    key: "visitAlterByDisableKeys",
    value: function visitAlterByDisableKeys(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByEnableKeys.
  }, {
    key: "visitAlterByEnableKeys",
    value: function visitAlterByEnableKeys(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByRename.
  }, {
    key: "visitAlterByRename",
    value: function visitAlterByRename(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByOrder.
  }, {
    key: "visitAlterByOrder",
    value: function visitAlterByOrder(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByConvertCharset.
  }, {
    key: "visitAlterByConvertCharset",
    value: function visitAlterByConvertCharset(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDefaultCharset.
  }, {
    key: "visitAlterByDefaultCharset",
    value: function visitAlterByDefaultCharset(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDiscardTablespace.
  }, {
    key: "visitAlterByDiscardTablespace",
    value: function visitAlterByDiscardTablespace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByImportTablespace.
  }, {
    key: "visitAlterByImportTablespace",
    value: function visitAlterByImportTablespace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByForce.
  }, {
    key: "visitAlterByForce",
    value: function visitAlterByForce(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByValidate.
  }, {
    key: "visitAlterByValidate",
    value: function visitAlterByValidate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddDefinitions.
  }, {
    key: "visitAlterByAddDefinitions",
    value: function visitAlterByAddDefinitions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterPartition.
  }, {
    key: "visitAlterPartition",
    value: function visitAlterPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAddPartition.
  }, {
    key: "visitAlterByAddPartition",
    value: function visitAlterByAddPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDropPartition.
  }, {
    key: "visitAlterByDropPartition",
    value: function visitAlterByDropPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByDiscardPartition.
  }, {
    key: "visitAlterByDiscardPartition",
    value: function visitAlterByDiscardPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByImportPartition.
  }, {
    key: "visitAlterByImportPartition",
    value: function visitAlterByImportPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByTruncatePartition.
  }, {
    key: "visitAlterByTruncatePartition",
    value: function visitAlterByTruncatePartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByCoalescePartition.
  }, {
    key: "visitAlterByCoalescePartition",
    value: function visitAlterByCoalescePartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByReorganizePartition.
  }, {
    key: "visitAlterByReorganizePartition",
    value: function visitAlterByReorganizePartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByExchangePartition.
  }, {
    key: "visitAlterByExchangePartition",
    value: function visitAlterByExchangePartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByAnalyzePartition.
  }, {
    key: "visitAlterByAnalyzePartition",
    value: function visitAlterByAnalyzePartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByCheckPartition.
  }, {
    key: "visitAlterByCheckPartition",
    value: function visitAlterByCheckPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByOptimizePartition.
  }, {
    key: "visitAlterByOptimizePartition",
    value: function visitAlterByOptimizePartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByRebuildPartition.
  }, {
    key: "visitAlterByRebuildPartition",
    value: function visitAlterByRebuildPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByRepairPartition.
  }, {
    key: "visitAlterByRepairPartition",
    value: function visitAlterByRepairPartition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByRemovePartitioning.
  }, {
    key: "visitAlterByRemovePartitioning",
    value: function visitAlterByRemovePartitioning(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterByUpgradePartitioning.
  }, {
    key: "visitAlterByUpgradePartitioning",
    value: function visitAlterByUpgradePartitioning(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropDatabase.
  }, {
    key: "visitDropDatabase",
    value: function visitDropDatabase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropEvent.
  }, {
    key: "visitDropEvent",
    value: function visitDropEvent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropIndex.
  }, {
    key: "visitDropIndex",
    value: function visitDropIndex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropLogfileGroup.
  }, {
    key: "visitDropLogfileGroup",
    value: function visitDropLogfileGroup(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropProcedure.
  }, {
    key: "visitDropProcedure",
    value: function visitDropProcedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropFunction.
  }, {
    key: "visitDropFunction",
    value: function visitDropFunction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropServer.
  }, {
    key: "visitDropServer",
    value: function visitDropServer(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropTable.
  }, {
    key: "visitDropTable",
    value: function visitDropTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropTablespace.
  }, {
    key: "visitDropTablespace",
    value: function visitDropTablespace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropTrigger.
  }, {
    key: "visitDropTrigger",
    value: function visitDropTrigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropView.
  }, {
    key: "visitDropView",
    value: function visitDropView(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropRole.
  }, {
    key: "visitDropRole",
    value: function visitDropRole(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setRole.
  }, {
    key: "visitSetRole",
    value: function visitSetRole(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#renameTable.
  }, {
    key: "visitRenameTable",
    value: function visitRenameTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#renameTableClause.
  }, {
    key: "visitRenameTableClause",
    value: function visitRenameTableClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#truncateTable.
  }, {
    key: "visitTruncateTable",
    value: function visitTruncateTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#callStatement.
  }, {
    key: "visitCallStatement",
    value: function visitCallStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#deleteStatement.
  }, {
    key: "visitDeleteStatement",
    value: function visitDeleteStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#doStatement.
  }, {
    key: "visitDoStatement",
    value: function visitDoStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerStatement.
  }, {
    key: "visitHandlerStatement",
    value: function visitHandlerStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#insertStatement.
  }, {
    key: "visitInsertStatement",
    value: function visitInsertStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#loadDataStatement.
  }, {
    key: "visitLoadDataStatement",
    value: function visitLoadDataStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#loadXmlStatement.
  }, {
    key: "visitLoadXmlStatement",
    value: function visitLoadXmlStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#replaceStatement.
  }, {
    key: "visitReplaceStatement",
    value: function visitReplaceStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleSelect.
  }, {
    key: "visitSimpleSelect",
    value: function visitSimpleSelect(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#parenthesisSelect.
  }, {
    key: "visitParenthesisSelect",
    value: function visitParenthesisSelect(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unionSelect.
  }, {
    key: "visitUnionSelect",
    value: function visitUnionSelect(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unionParenthesisSelect.
  }, {
    key: "visitUnionParenthesisSelect",
    value: function visitUnionParenthesisSelect(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#withLateralStatement.
  }, {
    key: "visitWithLateralStatement",
    value: function visitWithLateralStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#updateStatement.
  }, {
    key: "visitUpdateStatement",
    value: function visitUpdateStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#valuesStatement.
  }, {
    key: "visitValuesStatement",
    value: function visitValuesStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#insertStatementValue.
  }, {
    key: "visitInsertStatementValue",
    value: function visitInsertStatementValue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#updatedElement.
  }, {
    key: "visitUpdatedElement",
    value: function visitUpdatedElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#assignmentField.
  }, {
    key: "visitAssignmentField",
    value: function visitAssignmentField(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lockClause.
  }, {
    key: "visitLockClause",
    value: function visitLockClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#singleDeleteStatement.
  }, {
    key: "visitSingleDeleteStatement",
    value: function visitSingleDeleteStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#multipleDeleteStatement.
  }, {
    key: "visitMultipleDeleteStatement",
    value: function visitMultipleDeleteStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerOpenStatement.
  }, {
    key: "visitHandlerOpenStatement",
    value: function visitHandlerOpenStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerReadIndexStatement.
  }, {
    key: "visitHandlerReadIndexStatement",
    value: function visitHandlerReadIndexStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerReadStatement.
  }, {
    key: "visitHandlerReadStatement",
    value: function visitHandlerReadStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerCloseStatement.
  }, {
    key: "visitHandlerCloseStatement",
    value: function visitHandlerCloseStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#singleUpdateStatement.
  }, {
    key: "visitSingleUpdateStatement",
    value: function visitSingleUpdateStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#multipleUpdateStatement.
  }, {
    key: "visitMultipleUpdateStatement",
    value: function visitMultipleUpdateStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#orderByClause.
  }, {
    key: "visitOrderByClause",
    value: function visitOrderByClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#orderByExpression.
  }, {
    key: "visitOrderByExpression",
    value: function visitOrderByExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableSources.
  }, {
    key: "visitTableSources",
    value: function visitTableSources(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableSourceBase.
  }, {
    key: "visitTableSourceBase",
    value: function visitTableSourceBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableSourceNested.
  }, {
    key: "visitTableSourceNested",
    value: function visitTableSourceNested(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableJson.
  }, {
    key: "visitTableJson",
    value: function visitTableJson(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#atomTableItem.
  }, {
    key: "visitAtomTableItem",
    value: function visitAtomTableItem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#subqueryTableItem.
  }, {
    key: "visitSubqueryTableItem",
    value: function visitSubqueryTableItem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableSourcesItem.
  }, {
    key: "visitTableSourcesItem",
    value: function visitTableSourcesItem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexHint.
  }, {
    key: "visitIndexHint",
    value: function visitIndexHint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexHintType.
  }, {
    key: "visitIndexHintType",
    value: function visitIndexHintType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#innerJoin.
  }, {
    key: "visitInnerJoin",
    value: function visitInnerJoin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#straightJoin.
  }, {
    key: "visitStraightJoin",
    value: function visitStraightJoin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#outerJoin.
  }, {
    key: "visitOuterJoin",
    value: function visitOuterJoin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#naturalJoin.
  }, {
    key: "visitNaturalJoin",
    value: function visitNaturalJoin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#joinSpec.
  }, {
    key: "visitJoinSpec",
    value: function visitJoinSpec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#queryExpression.
  }, {
    key: "visitQueryExpression",
    value: function visitQueryExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#queryExpressionNointo.
  }, {
    key: "visitQueryExpressionNointo",
    value: function visitQueryExpressionNointo(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#querySpecification.
  }, {
    key: "visitQuerySpecification",
    value: function visitQuerySpecification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#querySpecificationNointo.
  }, {
    key: "visitQuerySpecificationNointo",
    value: function visitQuerySpecificationNointo(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unionParenthesis.
  }, {
    key: "visitUnionParenthesis",
    value: function visitUnionParenthesis(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unionStatement.
  }, {
    key: "visitUnionStatement",
    value: function visitUnionStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lateralStatement.
  }, {
    key: "visitLateralStatement",
    value: function visitLateralStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonTable.
  }, {
    key: "visitJsonTable",
    value: function visitJsonTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonColumnList.
  }, {
    key: "visitJsonColumnList",
    value: function visitJsonColumnList(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonColumn.
  }, {
    key: "visitJsonColumn",
    value: function visitJsonColumn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonOnEmpty.
  }, {
    key: "visitJsonOnEmpty",
    value: function visitJsonOnEmpty(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonOnError.
  }, {
    key: "visitJsonOnError",
    value: function visitJsonOnError(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectSpec.
  }, {
    key: "visitSelectSpec",
    value: function visitSelectSpec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectElements.
  }, {
    key: "visitSelectElements",
    value: function visitSelectElements(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectStarElement.
  }, {
    key: "visitSelectStarElement",
    value: function visitSelectStarElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectColumnElement.
  }, {
    key: "visitSelectColumnElement",
    value: function visitSelectColumnElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectFunctionElement.
  }, {
    key: "visitSelectFunctionElement",
    value: function visitSelectFunctionElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectExpressionElement.
  }, {
    key: "visitSelectExpressionElement",
    value: function visitSelectExpressionElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectIntoVariables.
  }, {
    key: "visitSelectIntoVariables",
    value: function visitSelectIntoVariables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectIntoDumpFile.
  }, {
    key: "visitSelectIntoDumpFile",
    value: function visitSelectIntoDumpFile(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectIntoTextFile.
  }, {
    key: "visitSelectIntoTextFile",
    value: function visitSelectIntoTextFile(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectFieldsInto.
  }, {
    key: "visitSelectFieldsInto",
    value: function visitSelectFieldsInto(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#selectLinesInto.
  }, {
    key: "visitSelectLinesInto",
    value: function visitSelectLinesInto(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fromClause.
  }, {
    key: "visitFromClause",
    value: function visitFromClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#groupByClause.
  }, {
    key: "visitGroupByClause",
    value: function visitGroupByClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#havingClause.
  }, {
    key: "visitHavingClause",
    value: function visitHavingClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#windowClause.
  }, {
    key: "visitWindowClause",
    value: function visitWindowClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#groupByItem.
  }, {
    key: "visitGroupByItem",
    value: function visitGroupByItem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#limitClause.
  }, {
    key: "visitLimitClause",
    value: function visitLimitClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#limitClauseAtom.
  }, {
    key: "visitLimitClauseAtom",
    value: function visitLimitClauseAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#startTransaction.
  }, {
    key: "visitStartTransaction",
    value: function visitStartTransaction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#beginWork.
  }, {
    key: "visitBeginWork",
    value: function visitBeginWork(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#commitWork.
  }, {
    key: "visitCommitWork",
    value: function visitCommitWork(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#rollbackWork.
  }, {
    key: "visitRollbackWork",
    value: function visitRollbackWork(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#savepointStatement.
  }, {
    key: "visitSavepointStatement",
    value: function visitSavepointStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#rollbackStatement.
  }, {
    key: "visitRollbackStatement",
    value: function visitRollbackStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#releaseStatement.
  }, {
    key: "visitReleaseStatement",
    value: function visitReleaseStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lockTables.
  }, {
    key: "visitLockTables",
    value: function visitLockTables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unlockTables.
  }, {
    key: "visitUnlockTables",
    value: function visitUnlockTables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setAutocommitStatement.
  }, {
    key: "visitSetAutocommitStatement",
    value: function visitSetAutocommitStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setTransactionStatement.
  }, {
    key: "visitSetTransactionStatement",
    value: function visitSetTransactionStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#transactionMode.
  }, {
    key: "visitTransactionMode",
    value: function visitTransactionMode(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lockTableElement.
  }, {
    key: "visitLockTableElement",
    value: function visitLockTableElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lockAction.
  }, {
    key: "visitLockAction",
    value: function visitLockAction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#transactionOption.
  }, {
    key: "visitTransactionOption",
    value: function visitTransactionOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#transactionLevel.
  }, {
    key: "visitTransactionLevel",
    value: function visitTransactionLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#changeMaster.
  }, {
    key: "visitChangeMaster",
    value: function visitChangeMaster(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#changeReplicationFilter.
  }, {
    key: "visitChangeReplicationFilter",
    value: function visitChangeReplicationFilter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#purgeBinaryLogs.
  }, {
    key: "visitPurgeBinaryLogs",
    value: function visitPurgeBinaryLogs(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#resetMaster.
  }, {
    key: "visitResetMaster",
    value: function visitResetMaster(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#resetSlave.
  }, {
    key: "visitResetSlave",
    value: function visitResetSlave(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#startSlave.
  }, {
    key: "visitStartSlave",
    value: function visitStartSlave(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#stopSlave.
  }, {
    key: "visitStopSlave",
    value: function visitStopSlave(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#startGroupReplication.
  }, {
    key: "visitStartGroupReplication",
    value: function visitStartGroupReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#stopGroupReplication.
  }, {
    key: "visitStopGroupReplication",
    value: function visitStopGroupReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#masterStringOption.
  }, {
    key: "visitMasterStringOption",
    value: function visitMasterStringOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#masterDecimalOption.
  }, {
    key: "visitMasterDecimalOption",
    value: function visitMasterDecimalOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#masterBoolOption.
  }, {
    key: "visitMasterBoolOption",
    value: function visitMasterBoolOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#masterRealOption.
  }, {
    key: "visitMasterRealOption",
    value: function visitMasterRealOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#masterUidListOption.
  }, {
    key: "visitMasterUidListOption",
    value: function visitMasterUidListOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#stringMasterOption.
  }, {
    key: "visitStringMasterOption",
    value: function visitStringMasterOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#decimalMasterOption.
  }, {
    key: "visitDecimalMasterOption",
    value: function visitDecimalMasterOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#boolMasterOption.
  }, {
    key: "visitBoolMasterOption",
    value: function visitBoolMasterOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#channelOption.
  }, {
    key: "visitChannelOption",
    value: function visitChannelOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#doDbReplication.
  }, {
    key: "visitDoDbReplication",
    value: function visitDoDbReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ignoreDbReplication.
  }, {
    key: "visitIgnoreDbReplication",
    value: function visitIgnoreDbReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#doTableReplication.
  }, {
    key: "visitDoTableReplication",
    value: function visitDoTableReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ignoreTableReplication.
  }, {
    key: "visitIgnoreTableReplication",
    value: function visitIgnoreTableReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#wildDoTableReplication.
  }, {
    key: "visitWildDoTableReplication",
    value: function visitWildDoTableReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#wildIgnoreTableReplication.
  }, {
    key: "visitWildIgnoreTableReplication",
    value: function visitWildIgnoreTableReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#rewriteDbReplication.
  }, {
    key: "visitRewriteDbReplication",
    value: function visitRewriteDbReplication(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tablePair.
  }, {
    key: "visitTablePair",
    value: function visitTablePair(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#threadType.
  }, {
    key: "visitThreadType",
    value: function visitThreadType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#gtidsUntilOption.
  }, {
    key: "visitGtidsUntilOption",
    value: function visitGtidsUntilOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#masterLogUntilOption.
  }, {
    key: "visitMasterLogUntilOption",
    value: function visitMasterLogUntilOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#relayLogUntilOption.
  }, {
    key: "visitRelayLogUntilOption",
    value: function visitRelayLogUntilOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#sqlGapsUntilOption.
  }, {
    key: "visitSqlGapsUntilOption",
    value: function visitSqlGapsUntilOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userConnectionOption.
  }, {
    key: "visitUserConnectionOption",
    value: function visitUserConnectionOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#passwordConnectionOption.
  }, {
    key: "visitPasswordConnectionOption",
    value: function visitPasswordConnectionOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#defaultAuthConnectionOption.
  }, {
    key: "visitDefaultAuthConnectionOption",
    value: function visitDefaultAuthConnectionOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#pluginDirConnectionOption.
  }, {
    key: "visitPluginDirConnectionOption",
    value: function visitPluginDirConnectionOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#gtuidSet.
  }, {
    key: "visitGtuidSet",
    value: function visitGtuidSet(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xaStartTransaction.
  }, {
    key: "visitXaStartTransaction",
    value: function visitXaStartTransaction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xaEndTransaction.
  }, {
    key: "visitXaEndTransaction",
    value: function visitXaEndTransaction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xaPrepareStatement.
  }, {
    key: "visitXaPrepareStatement",
    value: function visitXaPrepareStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xaCommitWork.
  }, {
    key: "visitXaCommitWork",
    value: function visitXaCommitWork(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xaRollbackWork.
  }, {
    key: "visitXaRollbackWork",
    value: function visitXaRollbackWork(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xaRecoverWork.
  }, {
    key: "visitXaRecoverWork",
    value: function visitXaRecoverWork(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#prepareStatement.
  }, {
    key: "visitPrepareStatement",
    value: function visitPrepareStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#executeStatement.
  }, {
    key: "visitExecuteStatement",
    value: function visitExecuteStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#deallocatePrepare.
  }, {
    key: "visitDeallocatePrepare",
    value: function visitDeallocatePrepare(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#routineBody.
  }, {
    key: "visitRoutineBody",
    value: function visitRoutineBody(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#blockStatement.
  }, {
    key: "visitBlockStatement",
    value: function visitBlockStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#caseStatement.
  }, {
    key: "visitCaseStatement",
    value: function visitCaseStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ifStatement.
  }, {
    key: "visitIfStatement",
    value: function visitIfStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#iterateStatement.
  }, {
    key: "visitIterateStatement",
    value: function visitIterateStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#leaveStatement.
  }, {
    key: "visitLeaveStatement",
    value: function visitLeaveStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#loopStatement.
  }, {
    key: "visitLoopStatement",
    value: function visitLoopStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#repeatStatement.
  }, {
    key: "visitRepeatStatement",
    value: function visitRepeatStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#returnStatement.
  }, {
    key: "visitReturnStatement",
    value: function visitReturnStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#whileStatement.
  }, {
    key: "visitWhileStatement",
    value: function visitWhileStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#CloseCursor.
  }, {
    key: "visitCloseCursor",
    value: function visitCloseCursor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#FetchCursor.
  }, {
    key: "visitFetchCursor",
    value: function visitFetchCursor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#OpenCursor.
  }, {
    key: "visitOpenCursor",
    value: function visitOpenCursor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#declareVariable.
  }, {
    key: "visitDeclareVariable",
    value: function visitDeclareVariable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#declareCondition.
  }, {
    key: "visitDeclareCondition",
    value: function visitDeclareCondition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#declareCursor.
  }, {
    key: "visitDeclareCursor",
    value: function visitDeclareCursor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#declareHandler.
  }, {
    key: "visitDeclareHandler",
    value: function visitDeclareHandler(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerConditionCode.
  }, {
    key: "visitHandlerConditionCode",
    value: function visitHandlerConditionCode(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerConditionState.
  }, {
    key: "visitHandlerConditionState",
    value: function visitHandlerConditionState(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerConditionName.
  }, {
    key: "visitHandlerConditionName",
    value: function visitHandlerConditionName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerConditionWarning.
  }, {
    key: "visitHandlerConditionWarning",
    value: function visitHandlerConditionWarning(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerConditionNotfound.
  }, {
    key: "visitHandlerConditionNotfound",
    value: function visitHandlerConditionNotfound(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#handlerConditionException.
  }, {
    key: "visitHandlerConditionException",
    value: function visitHandlerConditionException(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#procedureSqlStatement.
  }, {
    key: "visitProcedureSqlStatement",
    value: function visitProcedureSqlStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#caseAlternative.
  }, {
    key: "visitCaseAlternative",
    value: function visitCaseAlternative(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#elifAlternative.
  }, {
    key: "visitElifAlternative",
    value: function visitElifAlternative(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterUserMysqlV56.
  }, {
    key: "visitAlterUserMysqlV56",
    value: function visitAlterUserMysqlV56(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#alterUserMysqlV80.
  }, {
    key: "visitAlterUserMysqlV80",
    value: function visitAlterUserMysqlV80(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createUserMysqlV56.
  }, {
    key: "visitCreateUserMysqlV56",
    value: function visitCreateUserMysqlV56(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createUserMysqlV80.
  }, {
    key: "visitCreateUserMysqlV80",
    value: function visitCreateUserMysqlV80(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dropUser.
  }, {
    key: "visitDropUser",
    value: function visitDropUser(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#grantStatement.
  }, {
    key: "visitGrantStatement",
    value: function visitGrantStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#roleOption.
  }, {
    key: "visitRoleOption",
    value: function visitRoleOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#grantProxy.
  }, {
    key: "visitGrantProxy",
    value: function visitGrantProxy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#renameUser.
  }, {
    key: "visitRenameUser",
    value: function visitRenameUser(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#detailRevoke.
  }, {
    key: "visitDetailRevoke",
    value: function visitDetailRevoke(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#shortRevoke.
  }, {
    key: "visitShortRevoke",
    value: function visitShortRevoke(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#roleRevoke.
  }, {
    key: "visitRoleRevoke",
    value: function visitRoleRevoke(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#revokeProxy.
  }, {
    key: "visitRevokeProxy",
    value: function visitRevokeProxy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setPasswordStatement.
  }, {
    key: "visitSetPasswordStatement",
    value: function visitSetPasswordStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userSpecification.
  }, {
    key: "visitUserSpecification",
    value: function visitUserSpecification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#hashAuthOption.
  }, {
    key: "visitHashAuthOption",
    value: function visitHashAuthOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#randomAuthOption.
  }, {
    key: "visitRandomAuthOption",
    value: function visitRandomAuthOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#stringAuthOption.
  }, {
    key: "visitStringAuthOption",
    value: function visitStringAuthOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#moduleAuthOption.
  }, {
    key: "visitModuleAuthOption",
    value: function visitModuleAuthOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleAuthOption.
  }, {
    key: "visitSimpleAuthOption",
    value: function visitSimpleAuthOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#authOptionClause.
  }, {
    key: "visitAuthOptionClause",
    value: function visitAuthOptionClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#module.
  }, {
    key: "visitModule",
    value: function visitModule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#passwordModuleOption.
  }, {
    key: "visitPasswordModuleOption",
    value: function visitPasswordModuleOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tlsOption.
  }, {
    key: "visitTlsOption",
    value: function visitTlsOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userResourceOption.
  }, {
    key: "visitUserResourceOption",
    value: function visitUserResourceOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userPasswordOption.
  }, {
    key: "visitUserPasswordOption",
    value: function visitUserPasswordOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userLockOption.
  }, {
    key: "visitUserLockOption",
    value: function visitUserLockOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#privelegeClause.
  }, {
    key: "visitPrivelegeClause",
    value: function visitPrivelegeClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#privilege.
  }, {
    key: "visitPrivilege",
    value: function visitPrivilege(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#currentSchemaPriviLevel.
  }, {
    key: "visitCurrentSchemaPriviLevel",
    value: function visitCurrentSchemaPriviLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#globalPrivLevel.
  }, {
    key: "visitGlobalPrivLevel",
    value: function visitGlobalPrivLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#definiteSchemaPrivLevel.
  }, {
    key: "visitDefiniteSchemaPrivLevel",
    value: function visitDefiniteSchemaPrivLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#definiteFullTablePrivLevel.
  }, {
    key: "visitDefiniteFullTablePrivLevel",
    value: function visitDefiniteFullTablePrivLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#definiteFullTablePrivLevel2.
  }, {
    key: "visitDefiniteFullTablePrivLevel2",
    value: function visitDefiniteFullTablePrivLevel2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#definiteTablePrivLevel.
  }, {
    key: "visitDefiniteTablePrivLevel",
    value: function visitDefiniteTablePrivLevel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#renameUserClause.
  }, {
    key: "visitRenameUserClause",
    value: function visitRenameUserClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#analyzeTable.
  }, {
    key: "visitAnalyzeTable",
    value: function visitAnalyzeTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#checkTable.
  }, {
    key: "visitCheckTable",
    value: function visitCheckTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#checksumTable.
  }, {
    key: "visitChecksumTable",
    value: function visitChecksumTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#optimizeTable.
  }, {
    key: "visitOptimizeTable",
    value: function visitOptimizeTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#repairTable.
  }, {
    key: "visitRepairTable",
    value: function visitRepairTable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#checkTableOption.
  }, {
    key: "visitCheckTableOption",
    value: function visitCheckTableOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#createUdfunction.
  }, {
    key: "visitCreateUdfunction",
    value: function visitCreateUdfunction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#installPlugin.
  }, {
    key: "visitInstallPlugin",
    value: function visitInstallPlugin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#uninstallPlugin.
  }, {
    key: "visitUninstallPlugin",
    value: function visitUninstallPlugin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setVariable.
  }, {
    key: "visitSetVariable",
    value: function visitSetVariable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setCharset.
  }, {
    key: "visitSetCharset",
    value: function visitSetCharset(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setNames.
  }, {
    key: "visitSetNames",
    value: function visitSetNames(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setPassword.
  }, {
    key: "visitSetPassword",
    value: function visitSetPassword(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setTransaction.
  }, {
    key: "visitSetTransaction",
    value: function visitSetTransaction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setAutocommit.
  }, {
    key: "visitSetAutocommit",
    value: function visitSetAutocommit(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#setNewValueInsideTrigger.
  }, {
    key: "visitSetNewValueInsideTrigger",
    value: function visitSetNewValueInsideTrigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showMasterLogs.
  }, {
    key: "visitShowMasterLogs",
    value: function visitShowMasterLogs(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showLogEvents.
  }, {
    key: "visitShowLogEvents",
    value: function visitShowLogEvents(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showObjectFilter.
  }, {
    key: "visitShowObjectFilter",
    value: function visitShowObjectFilter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showColumns.
  }, {
    key: "visitShowColumns",
    value: function visitShowColumns(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showCreateDb.
  }, {
    key: "visitShowCreateDb",
    value: function visitShowCreateDb(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showCreateFullIdObject.
  }, {
    key: "visitShowCreateFullIdObject",
    value: function visitShowCreateFullIdObject(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showCreateUser.
  }, {
    key: "visitShowCreateUser",
    value: function visitShowCreateUser(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showEngine.
  }, {
    key: "visitShowEngine",
    value: function visitShowEngine(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showGlobalInfo.
  }, {
    key: "visitShowGlobalInfo",
    value: function visitShowGlobalInfo(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showErrors.
  }, {
    key: "visitShowErrors",
    value: function visitShowErrors(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showCountErrors.
  }, {
    key: "visitShowCountErrors",
    value: function visitShowCountErrors(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showSchemaFilter.
  }, {
    key: "visitShowSchemaFilter",
    value: function visitShowSchemaFilter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showRoutine.
  }, {
    key: "visitShowRoutine",
    value: function visitShowRoutine(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showGrants.
  }, {
    key: "visitShowGrants",
    value: function visitShowGrants(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showIndexes.
  }, {
    key: "visitShowIndexes",
    value: function visitShowIndexes(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showOpenTables.
  }, {
    key: "visitShowOpenTables",
    value: function visitShowOpenTables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showProfile.
  }, {
    key: "visitShowProfile",
    value: function visitShowProfile(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showSlaveStatus.
  }, {
    key: "visitShowSlaveStatus",
    value: function visitShowSlaveStatus(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#variableClause.
  }, {
    key: "visitVariableClause",
    value: function visitVariableClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showCommonEntity.
  }, {
    key: "visitShowCommonEntity",
    value: function visitShowCommonEntity(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showFilter.
  }, {
    key: "visitShowFilter",
    value: function visitShowFilter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showGlobalInfoClause.
  }, {
    key: "visitShowGlobalInfoClause",
    value: function visitShowGlobalInfoClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showSchemaEntity.
  }, {
    key: "visitShowSchemaEntity",
    value: function visitShowSchemaEntity(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#showProfileType.
  }, {
    key: "visitShowProfileType",
    value: function visitShowProfileType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#binlogStatement.
  }, {
    key: "visitBinlogStatement",
    value: function visitBinlogStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#cacheIndexStatement.
  }, {
    key: "visitCacheIndexStatement",
    value: function visitCacheIndexStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#flushStatement.
  }, {
    key: "visitFlushStatement",
    value: function visitFlushStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#killStatement.
  }, {
    key: "visitKillStatement",
    value: function visitKillStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#loadIndexIntoCache.
  }, {
    key: "visitLoadIndexIntoCache",
    value: function visitLoadIndexIntoCache(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#resetStatement.
  }, {
    key: "visitResetStatement",
    value: function visitResetStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#shutdownStatement.
  }, {
    key: "visitShutdownStatement",
    value: function visitShutdownStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableIndexes.
  }, {
    key: "visitTableIndexes",
    value: function visitTableIndexes(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleFlushOption.
  }, {
    key: "visitSimpleFlushOption",
    value: function visitSimpleFlushOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#channelFlushOption.
  }, {
    key: "visitChannelFlushOption",
    value: function visitChannelFlushOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableFlushOption.
  }, {
    key: "visitTableFlushOption",
    value: function visitTableFlushOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#flushTableOption.
  }, {
    key: "visitFlushTableOption",
    value: function visitFlushTableOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#loadedTableIndexes.
  }, {
    key: "visitLoadedTableIndexes",
    value: function visitLoadedTableIndexes(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleDescribeStatement.
  }, {
    key: "visitSimpleDescribeStatement",
    value: function visitSimpleDescribeStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fullDescribeStatement.
  }, {
    key: "visitFullDescribeStatement",
    value: function visitFullDescribeStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#helpStatement.
  }, {
    key: "visitHelpStatement",
    value: function visitHelpStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#useStatement.
  }, {
    key: "visitUseStatement",
    value: function visitUseStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#signalStatement.
  }, {
    key: "visitSignalStatement",
    value: function visitSignalStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#resignalStatement.
  }, {
    key: "visitResignalStatement",
    value: function visitResignalStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#signalConditionInformation.
  }, {
    key: "visitSignalConditionInformation",
    value: function visitSignalConditionInformation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#withStatement.
  }, {
    key: "visitWithStatement",
    value: function visitWithStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableStatement.
  }, {
    key: "visitTableStatement",
    value: function visitTableStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#diagnosticsStatement.
  }, {
    key: "visitDiagnosticsStatement",
    value: function visitDiagnosticsStatement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#diagnosticsConditionInformationName.
  }, {
    key: "visitDiagnosticsConditionInformationName",
    value: function visitDiagnosticsConditionInformationName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#describeStatements.
  }, {
    key: "visitDescribeStatements",
    value: function visitDescribeStatements(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#describeConnection.
  }, {
    key: "visitDescribeConnection",
    value: function visitDescribeConnection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fullId.
  }, {
    key: "visitFullId",
    value: function visitFullId(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tableName.
  }, {
    key: "visitTableName",
    value: function visitTableName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#roleName.
  }, {
    key: "visitRoleName",
    value: function visitRoleName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fullColumnName.
  }, {
    key: "visitFullColumnName",
    value: function visitFullColumnName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexColumnName.
  }, {
    key: "visitIndexColumnName",
    value: function visitIndexColumnName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleUserName.
  }, {
    key: "visitSimpleUserName",
    value: function visitSimpleUserName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#hostName.
  }, {
    key: "visitHostName",
    value: function visitHostName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userName.
  }, {
    key: "visitUserName",
    value: function visitUserName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#mysqlVariable.
  }, {
    key: "visitMysqlVariable",
    value: function visitMysqlVariable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#charsetName.
  }, {
    key: "visitCharsetName",
    value: function visitCharsetName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#collationName.
  }, {
    key: "visitCollationName",
    value: function visitCollationName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#engineName.
  }, {
    key: "visitEngineName",
    value: function visitEngineName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#engineNameBase.
  }, {
    key: "visitEngineNameBase",
    value: function visitEngineNameBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#uuidSet.
  }, {
    key: "visitUuidSet",
    value: function visitUuidSet(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xid.
  }, {
    key: "visitXid",
    value: function visitXid(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#xuidStringId.
  }, {
    key: "visitXuidStringId",
    value: function visitXuidStringId(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#authPlugin.
  }, {
    key: "visitAuthPlugin",
    value: function visitAuthPlugin(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#uid.
  }, {
    key: "visitUid",
    value: function visitUid(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleId.
  }, {
    key: "visitSimpleId",
    value: function visitSimpleId(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dottedId.
  }, {
    key: "visitDottedId",
    value: function visitDottedId(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#decimalLiteral.
  }, {
    key: "visitDecimalLiteral",
    value: function visitDecimalLiteral(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fileSizeLiteral.
  }, {
    key: "visitFileSizeLiteral",
    value: function visitFileSizeLiteral(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#stringLiteral.
  }, {
    key: "visitStringLiteral",
    value: function visitStringLiteral(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#booleanLiteral.
  }, {
    key: "visitBooleanLiteral",
    value: function visitBooleanLiteral(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#hexadecimalLiteral.
  }, {
    key: "visitHexadecimalLiteral",
    value: function visitHexadecimalLiteral(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nullNotnull.
  }, {
    key: "visitNullNotnull",
    value: function visitNullNotnull(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#constant.
  }, {
    key: "visitConstant",
    value: function visitConstant(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#stringDataType.
  }, {
    key: "visitStringDataType",
    value: function visitStringDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nationalVaryingStringDataType.
  }, {
    key: "visitNationalVaryingStringDataType",
    value: function visitNationalVaryingStringDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nationalStringDataType.
  }, {
    key: "visitNationalStringDataType",
    value: function visitNationalStringDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dimensionDataType.
  }, {
    key: "visitDimensionDataType",
    value: function visitDimensionDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleDataType.
  }, {
    key: "visitSimpleDataType",
    value: function visitSimpleDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#collectionDataType.
  }, {
    key: "visitCollectionDataType",
    value: function visitCollectionDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#spatialDataType.
  }, {
    key: "visitSpatialDataType",
    value: function visitSpatialDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#longVarcharDataType.
  }, {
    key: "visitLongVarcharDataType",
    value: function visitLongVarcharDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#longVarbinaryDataType.
  }, {
    key: "visitLongVarbinaryDataType",
    value: function visitLongVarbinaryDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#collectionOptions.
  }, {
    key: "visitCollectionOptions",
    value: function visitCollectionOptions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#convertedDataType.
  }, {
    key: "visitConvertedDataType",
    value: function visitConvertedDataType(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lengthOneDimension.
  }, {
    key: "visitLengthOneDimension",
    value: function visitLengthOneDimension(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lengthTwoDimension.
  }, {
    key: "visitLengthTwoDimension",
    value: function visitLengthTwoDimension(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#lengthTwoOptionalDimension.
  }, {
    key: "visitLengthTwoOptionalDimension",
    value: function visitLengthTwoOptionalDimension(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#uidList.
  }, {
    key: "visitUidList",
    value: function visitUidList(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fullColumnNameList.
  }, {
    key: "visitFullColumnNameList",
    value: function visitFullColumnNameList(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#tables.
  }, {
    key: "visitTables",
    value: function visitTables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#indexColumnNames.
  }, {
    key: "visitIndexColumnNames",
    value: function visitIndexColumnNames(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#expressions.
  }, {
    key: "visitExpressions",
    value: function visitExpressions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#expressionsWithDefaults.
  }, {
    key: "visitExpressionsWithDefaults",
    value: function visitExpressionsWithDefaults(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#constants.
  }, {
    key: "visitConstants",
    value: function visitConstants(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleStrings.
  }, {
    key: "visitSimpleStrings",
    value: function visitSimpleStrings(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#userVariables.
  }, {
    key: "visitUserVariables",
    value: function visitUserVariables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#defaultValue.
  }, {
    key: "visitDefaultValue",
    value: function visitDefaultValue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#currentTimestamp.
  }, {
    key: "visitCurrentTimestamp",
    value: function visitCurrentTimestamp(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#expressionOrDefault.
  }, {
    key: "visitExpressionOrDefault",
    value: function visitExpressionOrDefault(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ifExists.
  }, {
    key: "visitIfExists",
    value: function visitIfExists(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#ifNotExists.
  }, {
    key: "visitIfNotExists",
    value: function visitIfNotExists(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#orReplace.
  }, {
    key: "visitOrReplace",
    value: function visitOrReplace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#waitNowaitClause.
  }, {
    key: "visitWaitNowaitClause",
    value: function visitWaitNowaitClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#specificFunctionCall.
  }, {
    key: "visitSpecificFunctionCall",
    value: function visitSpecificFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#aggregateFunctionCall.
  }, {
    key: "visitAggregateFunctionCall",
    value: function visitAggregateFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nonAggregateFunctionCall.
  }, {
    key: "visitNonAggregateFunctionCall",
    value: function visitNonAggregateFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#scalarFunctionCall.
  }, {
    key: "visitScalarFunctionCall",
    value: function visitScalarFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#udfFunctionCall.
  }, {
    key: "visitUdfFunctionCall",
    value: function visitUdfFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#passwordFunctionCall.
  }, {
    key: "visitPasswordFunctionCall",
    value: function visitPasswordFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#simpleFunctionCall.
  }, {
    key: "visitSimpleFunctionCall",
    value: function visitSimpleFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#currentUser.
  }, {
    key: "visitCurrentUser",
    value: function visitCurrentUser(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dataTypeFunctionCall.
  }, {
    key: "visitDataTypeFunctionCall",
    value: function visitDataTypeFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#valuesFunctionCall.
  }, {
    key: "visitValuesFunctionCall",
    value: function visitValuesFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#caseExpressionFunctionCall.
  }, {
    key: "visitCaseExpressionFunctionCall",
    value: function visitCaseExpressionFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#caseFunctionCall.
  }, {
    key: "visitCaseFunctionCall",
    value: function visitCaseFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#charFunctionCall.
  }, {
    key: "visitCharFunctionCall",
    value: function visitCharFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#positionFunctionCall.
  }, {
    key: "visitPositionFunctionCall",
    value: function visitPositionFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#substrFunctionCall.
  }, {
    key: "visitSubstrFunctionCall",
    value: function visitSubstrFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#trimFunctionCall.
  }, {
    key: "visitTrimFunctionCall",
    value: function visitTrimFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#weightFunctionCall.
  }, {
    key: "visitWeightFunctionCall",
    value: function visitWeightFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#extractFunctionCall.
  }, {
    key: "visitExtractFunctionCall",
    value: function visitExtractFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#getFormatFunctionCall.
  }, {
    key: "visitGetFormatFunctionCall",
    value: function visitGetFormatFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonValueFunctionCall.
  }, {
    key: "visitJsonValueFunctionCall",
    value: function visitJsonValueFunctionCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#caseFuncAlternative.
  }, {
    key: "visitCaseFuncAlternative",
    value: function visitCaseFuncAlternative(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#levelWeightList.
  }, {
    key: "visitLevelWeightList",
    value: function visitLevelWeightList(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#levelWeightRange.
  }, {
    key: "visitLevelWeightRange",
    value: function visitLevelWeightRange(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#levelInWeightListElement.
  }, {
    key: "visitLevelInWeightListElement",
    value: function visitLevelInWeightListElement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#aggregateWindowedFunction.
  }, {
    key: "visitAggregateWindowedFunction",
    value: function visitAggregateWindowedFunction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nonAggregateWindowedFunction.
  }, {
    key: "visitNonAggregateWindowedFunction",
    value: function visitNonAggregateWindowedFunction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#overClause.
  }, {
    key: "visitOverClause",
    value: function visitOverClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#windowSpec.
  }, {
    key: "visitWindowSpec",
    value: function visitWindowSpec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#windowName.
  }, {
    key: "visitWindowName",
    value: function visitWindowName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#frameClause.
  }, {
    key: "visitFrameClause",
    value: function visitFrameClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#frameUnits.
  }, {
    key: "visitFrameUnits",
    value: function visitFrameUnits(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#frameExtent.
  }, {
    key: "visitFrameExtent",
    value: function visitFrameExtent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#frameBetween.
  }, {
    key: "visitFrameBetween",
    value: function visitFrameBetween(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#frameRange.
  }, {
    key: "visitFrameRange",
    value: function visitFrameRange(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#partitionClause.
  }, {
    key: "visitPartitionClause",
    value: function visitPartitionClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#scalarFunctionName.
  }, {
    key: "visitScalarFunctionName",
    value: function visitScalarFunctionName(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#passwordFunctionClause.
  }, {
    key: "visitPasswordFunctionClause",
    value: function visitPasswordFunctionClause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#functionArgs.
  }, {
    key: "visitFunctionArgs",
    value: function visitFunctionArgs(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#functionArg.
  }, {
    key: "visitFunctionArg",
    value: function visitFunctionArg(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#isExpression.
  }, {
    key: "visitIsExpression",
    value: function visitIsExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#notExpression.
  }, {
    key: "visitNotExpression",
    value: function visitNotExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#logicalExpression.
  }, {
    key: "visitLogicalExpression",
    value: function visitLogicalExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#predicateExpression.
  }, {
    key: "visitPredicateExpression",
    value: function visitPredicateExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#soundsLikePredicate.
  }, {
    key: "visitSoundsLikePredicate",
    value: function visitSoundsLikePredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#expressionAtomPredicate.
  }, {
    key: "visitExpressionAtomPredicate",
    value: function visitExpressionAtomPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#subqueryComparisonPredicate.
  }, {
    key: "visitSubqueryComparisonPredicate",
    value: function visitSubqueryComparisonPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonMemberOfPredicate.
  }, {
    key: "visitJsonMemberOfPredicate",
    value: function visitJsonMemberOfPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#binaryComparisonPredicate.
  }, {
    key: "visitBinaryComparisonPredicate",
    value: function visitBinaryComparisonPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#inPredicate.
  }, {
    key: "visitInPredicate",
    value: function visitInPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#betweenPredicate.
  }, {
    key: "visitBetweenPredicate",
    value: function visitBetweenPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#isNullPredicate.
  }, {
    key: "visitIsNullPredicate",
    value: function visitIsNullPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#likePredicate.
  }, {
    key: "visitLikePredicate",
    value: function visitLikePredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#regexpPredicate.
  }, {
    key: "visitRegexpPredicate",
    value: function visitRegexpPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unaryExpressionAtom.
  }, {
    key: "visitUnaryExpressionAtom",
    value: function visitUnaryExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#collateExpressionAtom.
  }, {
    key: "visitCollateExpressionAtom",
    value: function visitCollateExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#variableAssignExpressionAtom.
  }, {
    key: "visitVariableAssignExpressionAtom",
    value: function visitVariableAssignExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#mysqlVariableExpressionAtom.
  }, {
    key: "visitMysqlVariableExpressionAtom",
    value: function visitMysqlVariableExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nestedExpressionAtom.
  }, {
    key: "visitNestedExpressionAtom",
    value: function visitNestedExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#nestedRowExpressionAtom.
  }, {
    key: "visitNestedRowExpressionAtom",
    value: function visitNestedRowExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#mathExpressionAtom.
  }, {
    key: "visitMathExpressionAtom",
    value: function visitMathExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#existsExpressionAtom.
  }, {
    key: "visitExistsExpressionAtom",
    value: function visitExistsExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#intervalExpressionAtom.
  }, {
    key: "visitIntervalExpressionAtom",
    value: function visitIntervalExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonExpressionAtom.
  }, {
    key: "visitJsonExpressionAtom",
    value: function visitJsonExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#subqueryExpressionAtom.
  }, {
    key: "visitSubqueryExpressionAtom",
    value: function visitSubqueryExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#constantExpressionAtom.
  }, {
    key: "visitConstantExpressionAtom",
    value: function visitConstantExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#functionCallExpressionAtom.
  }, {
    key: "visitFunctionCallExpressionAtom",
    value: function visitFunctionCallExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#binaryExpressionAtom.
  }, {
    key: "visitBinaryExpressionAtom",
    value: function visitBinaryExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#fullColumnNameExpressionAtom.
  }, {
    key: "visitFullColumnNameExpressionAtom",
    value: function visitFullColumnNameExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#bitExpressionAtom.
  }, {
    key: "visitBitExpressionAtom",
    value: function visitBitExpressionAtom(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#unaryOperator.
  }, {
    key: "visitUnaryOperator",
    value: function visitUnaryOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#comparisonOperator.
  }, {
    key: "visitComparisonOperator",
    value: function visitComparisonOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#logicalOperator.
  }, {
    key: "visitLogicalOperator",
    value: function visitLogicalOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#bitOperator.
  }, {
    key: "visitBitOperator",
    value: function visitBitOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#multOperator.
  }, {
    key: "visitMultOperator",
    value: function visitMultOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#addOperator.
  }, {
    key: "visitAddOperator",
    value: function visitAddOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#jsonOperator.
  }, {
    key: "visitJsonOperator",
    value: function visitJsonOperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#charsetNameBase.
  }, {
    key: "visitCharsetNameBase",
    value: function visitCharsetNameBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#transactionLevelBase.
  }, {
    key: "visitTransactionLevelBase",
    value: function visitTransactionLevelBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#privilegesBase.
  }, {
    key: "visitPrivilegesBase",
    value: function visitPrivilegesBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#intervalTypeBase.
  }, {
    key: "visitIntervalTypeBase",
    value: function visitIntervalTypeBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#dataTypeBase.
  }, {
    key: "visitDataTypeBase",
    value: function visitDataTypeBase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#keywordsCanBeId.
  }, {
    key: "visitKeywordsCanBeId",
    value: function visitKeywordsCanBeId(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by MySqlParser#functionNameBase.
  }, {
    key: "visitFunctionNameBase",
    value: function visitFunctionNameBase(ctx) {
      return this.visitChildren(ctx);
    }
  }]);
}(_antlr["default"].tree.ParseTreeVisitor);