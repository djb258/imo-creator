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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // Generated from ./TSqlParser.g4 by ANTLR 4.13.2
// jshint ignore: start
// This class defines a complete generic visitor for a parse tree produced by TSqlParser.
var TSqlParserVisitor = exports["default"] = /*#__PURE__*/function (_antlr4$tree$ParseTre) {
  function TSqlParserVisitor() {
    _classCallCheck(this, TSqlParserVisitor);
    return _callSuper(this, TSqlParserVisitor, arguments);
  }
  _inherits(TSqlParserVisitor, _antlr4$tree$ParseTre);
  return _createClass(TSqlParserVisitor, [{
    key: "visitTsql_file",
    value:
    // Visit a parse tree produced by TSqlParser#tsql_file.
    function visitTsql_file(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#batch.
  }, {
    key: "visitBatch",
    value: function visitBatch(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#batch_level_statement.
  }, {
    key: "visitBatch_level_statement",
    value: function visitBatch_level_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#sql_clauses.
  }, {
    key: "visitSql_clauses",
    value: function visitSql_clauses(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dml_clause.
  }, {
    key: "visitDml_clause",
    value: function visitDml_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ddl_clause.
  }, {
    key: "visitDdl_clause",
    value: function visitDdl_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#backup_statement.
  }, {
    key: "visitBackup_statement",
    value: function visitBackup_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#cfl_statement.
  }, {
    key: "visitCfl_statement",
    value: function visitCfl_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#block_statement.
  }, {
    key: "visitBlock_statement",
    value: function visitBlock_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#break_statement.
  }, {
    key: "visitBreak_statement",
    value: function visitBreak_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#continue_statement.
  }, {
    key: "visitContinue_statement",
    value: function visitContinue_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#goto_statement.
  }, {
    key: "visitGoto_statement",
    value: function visitGoto_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#return_statement.
  }, {
    key: "visitReturn_statement",
    value: function visitReturn_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#if_statement.
  }, {
    key: "visitIf_statement",
    value: function visitIf_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#throw_statement.
  }, {
    key: "visitThrow_statement",
    value: function visitThrow_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#throw_error_number.
  }, {
    key: "visitThrow_error_number",
    value: function visitThrow_error_number(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#throw_message.
  }, {
    key: "visitThrow_message",
    value: function visitThrow_message(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#throw_state.
  }, {
    key: "visitThrow_state",
    value: function visitThrow_state(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#try_catch_statement.
  }, {
    key: "visitTry_catch_statement",
    value: function visitTry_catch_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#waitfor_statement.
  }, {
    key: "visitWaitfor_statement",
    value: function visitWaitfor_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#while_statement.
  }, {
    key: "visitWhile_statement",
    value: function visitWhile_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#print_statement.
  }, {
    key: "visitPrint_statement",
    value: function visitPrint_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#raiseerror_statement.
  }, {
    key: "visitRaiseerror_statement",
    value: function visitRaiseerror_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#empty_statement.
  }, {
    key: "visitEmpty_statement",
    value: function visitEmpty_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#another_statement.
  }, {
    key: "visitAnother_statement",
    value: function visitAnother_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_application_role.
  }, {
    key: "visitAlter_application_role",
    value: function visitAlter_application_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_xml_schema_collection.
  }, {
    key: "visitAlter_xml_schema_collection",
    value: function visitAlter_xml_schema_collection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_application_role.
  }, {
    key: "visitCreate_application_role",
    value: function visitCreate_application_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_aggregate.
  }, {
    key: "visitDrop_aggregate",
    value: function visitDrop_aggregate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_application_role.
  }, {
    key: "visitDrop_application_role",
    value: function visitDrop_application_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly.
  }, {
    key: "visitAlter_assembly",
    value: function visitAlter_assembly(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_start.
  }, {
    key: "visitAlter_assembly_start",
    value: function visitAlter_assembly_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_clause.
  }, {
    key: "visitAlter_assembly_clause",
    value: function visitAlter_assembly_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_from_clause.
  }, {
    key: "visitAlter_assembly_from_clause",
    value: function visitAlter_assembly_from_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_from_clause_start.
  }, {
    key: "visitAlter_assembly_from_clause_start",
    value: function visitAlter_assembly_from_clause_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_drop_clause.
  }, {
    key: "visitAlter_assembly_drop_clause",
    value: function visitAlter_assembly_drop_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_drop_multiple_files.
  }, {
    key: "visitAlter_assembly_drop_multiple_files",
    value: function visitAlter_assembly_drop_multiple_files(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_drop.
  }, {
    key: "visitAlter_assembly_drop",
    value: function visitAlter_assembly_drop(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_add_clause.
  }, {
    key: "visitAlter_assembly_add_clause",
    value: function visitAlter_assembly_add_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_asssembly_add_clause_start.
  }, {
    key: "visitAlter_asssembly_add_clause_start",
    value: function visitAlter_asssembly_add_clause_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_client_file_clause.
  }, {
    key: "visitAlter_assembly_client_file_clause",
    value: function visitAlter_assembly_client_file_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_file_name.
  }, {
    key: "visitAlter_assembly_file_name",
    value: function visitAlter_assembly_file_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_file_bits.
  }, {
    key: "visitAlter_assembly_file_bits",
    value: function visitAlter_assembly_file_bits(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_as.
  }, {
    key: "visitAlter_assembly_as",
    value: function visitAlter_assembly_as(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_with_clause.
  }, {
    key: "visitAlter_assembly_with_clause",
    value: function visitAlter_assembly_with_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_assembly_with.
  }, {
    key: "visitAlter_assembly_with",
    value: function visitAlter_assembly_with(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#client_assembly_specifier.
  }, {
    key: "visitClient_assembly_specifier",
    value: function visitClient_assembly_specifier(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#assembly_option.
  }, {
    key: "visitAssembly_option",
    value: function visitAssembly_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#network_file_share.
  }, {
    key: "visitNetwork_file_share",
    value: function visitNetwork_file_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#network_computer.
  }, {
    key: "visitNetwork_computer",
    value: function visitNetwork_computer(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#network_file_start.
  }, {
    key: "visitNetwork_file_start",
    value: function visitNetwork_file_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#file_path.
  }, {
    key: "visitFile_path",
    value: function visitFile_path(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#file_directory_path_separator.
  }, {
    key: "visitFile_directory_path_separator",
    value: function visitFile_directory_path_separator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#local_file.
  }, {
    key: "visitLocal_file",
    value: function visitLocal_file(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#local_drive.
  }, {
    key: "visitLocal_drive",
    value: function visitLocal_drive(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#multiple_local_files.
  }, {
    key: "visitMultiple_local_files",
    value: function visitMultiple_local_files(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#multiple_local_file_start.
  }, {
    key: "visitMultiple_local_file_start",
    value: function visitMultiple_local_file_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_assembly.
  }, {
    key: "visitCreate_assembly",
    value: function visitCreate_assembly(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_assembly.
  }, {
    key: "visitDrop_assembly",
    value: function visitDrop_assembly(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_asymmetric_key.
  }, {
    key: "visitAlter_asymmetric_key",
    value: function visitAlter_asymmetric_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_asymmetric_key_start.
  }, {
    key: "visitAlter_asymmetric_key_start",
    value: function visitAlter_asymmetric_key_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#asymmetric_key_option.
  }, {
    key: "visitAsymmetric_key_option",
    value: function visitAsymmetric_key_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#asymmetric_key_option_start.
  }, {
    key: "visitAsymmetric_key_option_start",
    value: function visitAsymmetric_key_option_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#asymmetric_key_password_change_option.
  }, {
    key: "visitAsymmetric_key_password_change_option",
    value: function visitAsymmetric_key_password_change_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_asymmetric_key.
  }, {
    key: "visitCreate_asymmetric_key",
    value: function visitCreate_asymmetric_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_asymmetric_key.
  }, {
    key: "visitDrop_asymmetric_key",
    value: function visitDrop_asymmetric_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_authorization.
  }, {
    key: "visitAlter_authorization",
    value: function visitAlter_authorization(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#authorization_grantee.
  }, {
    key: "visitAuthorization_grantee",
    value: function visitAuthorization_grantee(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#entity_to.
  }, {
    key: "visitEntity_to",
    value: function visitEntity_to(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#colon_colon.
  }, {
    key: "visitColon_colon",
    value: function visitColon_colon(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_authorization_start.
  }, {
    key: "visitAlter_authorization_start",
    value: function visitAlter_authorization_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_authorization_for_sql_database.
  }, {
    key: "visitAlter_authorization_for_sql_database",
    value: function visitAlter_authorization_for_sql_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_authorization_for_azure_dw.
  }, {
    key: "visitAlter_authorization_for_azure_dw",
    value: function visitAlter_authorization_for_azure_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_authorization_for_parallel_dw.
  }, {
    key: "visitAlter_authorization_for_parallel_dw",
    value: function visitAlter_authorization_for_parallel_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#class_type.
  }, {
    key: "visitClass_type",
    value: function visitClass_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#class_type_for_sql_database.
  }, {
    key: "visitClass_type_for_sql_database",
    value: function visitClass_type_for_sql_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#class_type_for_azure_dw.
  }, {
    key: "visitClass_type_for_azure_dw",
    value: function visitClass_type_for_azure_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#class_type_for_parallel_dw.
  }, {
    key: "visitClass_type_for_parallel_dw",
    value: function visitClass_type_for_parallel_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#class_type_for_grant.
  }, {
    key: "visitClass_type_for_grant",
    value: function visitClass_type_for_grant(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_availability_group.
  }, {
    key: "visitDrop_availability_group",
    value: function visitDrop_availability_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_availability_group.
  }, {
    key: "visitAlter_availability_group",
    value: function visitAlter_availability_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_availability_group_start.
  }, {
    key: "visitAlter_availability_group_start",
    value: function visitAlter_availability_group_start(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_availability_group_options.
  }, {
    key: "visitAlter_availability_group_options",
    value: function visitAlter_availability_group_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ip_v4_failover.
  }, {
    key: "visitIp_v4_failover",
    value: function visitIp_v4_failover(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ip_v6_failover.
  }, {
    key: "visitIp_v6_failover",
    value: function visitIp_v6_failover(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_broker_priority.
  }, {
    key: "visitCreate_or_alter_broker_priority",
    value: function visitCreate_or_alter_broker_priority(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_broker_priority.
  }, {
    key: "visitDrop_broker_priority",
    value: function visitDrop_broker_priority(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_certificate.
  }, {
    key: "visitAlter_certificate",
    value: function visitAlter_certificate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_column_encryption_key.
  }, {
    key: "visitAlter_column_encryption_key",
    value: function visitAlter_column_encryption_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_column_encryption_key.
  }, {
    key: "visitCreate_column_encryption_key",
    value: function visitCreate_column_encryption_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_certificate.
  }, {
    key: "visitDrop_certificate",
    value: function visitDrop_certificate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_column_encryption_key.
  }, {
    key: "visitDrop_column_encryption_key",
    value: function visitDrop_column_encryption_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_column_master_key.
  }, {
    key: "visitDrop_column_master_key",
    value: function visitDrop_column_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_contract.
  }, {
    key: "visitDrop_contract",
    value: function visitDrop_contract(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_credential.
  }, {
    key: "visitDrop_credential",
    value: function visitDrop_credential(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_cryptograhic_provider.
  }, {
    key: "visitDrop_cryptograhic_provider",
    value: function visitDrop_cryptograhic_provider(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_database.
  }, {
    key: "visitDrop_database",
    value: function visitDrop_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_database_audit_specification.
  }, {
    key: "visitDrop_database_audit_specification",
    value: function visitDrop_database_audit_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_database_encryption_key.
  }, {
    key: "visitDrop_database_encryption_key",
    value: function visitDrop_database_encryption_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_database_scoped_credential.
  }, {
    key: "visitDrop_database_scoped_credential",
    value: function visitDrop_database_scoped_credential(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_default.
  }, {
    key: "visitDrop_default",
    value: function visitDrop_default(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_endpoint.
  }, {
    key: "visitDrop_endpoint",
    value: function visitDrop_endpoint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_external_data_source.
  }, {
    key: "visitDrop_external_data_source",
    value: function visitDrop_external_data_source(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_external_file_format.
  }, {
    key: "visitDrop_external_file_format",
    value: function visitDrop_external_file_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_external_library.
  }, {
    key: "visitDrop_external_library",
    value: function visitDrop_external_library(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_external_resource_pool.
  }, {
    key: "visitDrop_external_resource_pool",
    value: function visitDrop_external_resource_pool(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_external_table.
  }, {
    key: "visitDrop_external_table",
    value: function visitDrop_external_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_event_notifications.
  }, {
    key: "visitDrop_event_notifications",
    value: function visitDrop_event_notifications(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_event_session.
  }, {
    key: "visitDrop_event_session",
    value: function visitDrop_event_session(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_fulltext_catalog.
  }, {
    key: "visitDrop_fulltext_catalog",
    value: function visitDrop_fulltext_catalog(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_fulltext_index.
  }, {
    key: "visitDrop_fulltext_index",
    value: function visitDrop_fulltext_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_fulltext_stoplist.
  }, {
    key: "visitDrop_fulltext_stoplist",
    value: function visitDrop_fulltext_stoplist(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_login.
  }, {
    key: "visitDrop_login",
    value: function visitDrop_login(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_master_key.
  }, {
    key: "visitDrop_master_key",
    value: function visitDrop_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_message_type.
  }, {
    key: "visitDrop_message_type",
    value: function visitDrop_message_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_partition_function.
  }, {
    key: "visitDrop_partition_function",
    value: function visitDrop_partition_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_partition_scheme.
  }, {
    key: "visitDrop_partition_scheme",
    value: function visitDrop_partition_scheme(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_queue.
  }, {
    key: "visitDrop_queue",
    value: function visitDrop_queue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_remote_service_binding.
  }, {
    key: "visitDrop_remote_service_binding",
    value: function visitDrop_remote_service_binding(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_resource_pool.
  }, {
    key: "visitDrop_resource_pool",
    value: function visitDrop_resource_pool(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_db_role.
  }, {
    key: "visitDrop_db_role",
    value: function visitDrop_db_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_route.
  }, {
    key: "visitDrop_route",
    value: function visitDrop_route(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_rule.
  }, {
    key: "visitDrop_rule",
    value: function visitDrop_rule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_schema.
  }, {
    key: "visitDrop_schema",
    value: function visitDrop_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_search_property_list.
  }, {
    key: "visitDrop_search_property_list",
    value: function visitDrop_search_property_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_security_policy.
  }, {
    key: "visitDrop_security_policy",
    value: function visitDrop_security_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_sequence.
  }, {
    key: "visitDrop_sequence",
    value: function visitDrop_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_server_audit.
  }, {
    key: "visitDrop_server_audit",
    value: function visitDrop_server_audit(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_server_audit_specification.
  }, {
    key: "visitDrop_server_audit_specification",
    value: function visitDrop_server_audit_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_server_role.
  }, {
    key: "visitDrop_server_role",
    value: function visitDrop_server_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_service.
  }, {
    key: "visitDrop_service",
    value: function visitDrop_service(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_signature.
  }, {
    key: "visitDrop_signature",
    value: function visitDrop_signature(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_statistics_name_azure_dw_and_pdw.
  }, {
    key: "visitDrop_statistics_name_azure_dw_and_pdw",
    value: function visitDrop_statistics_name_azure_dw_and_pdw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_symmetric_key.
  }, {
    key: "visitDrop_symmetric_key",
    value: function visitDrop_symmetric_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_synonym.
  }, {
    key: "visitDrop_synonym",
    value: function visitDrop_synonym(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_user.
  }, {
    key: "visitDrop_user",
    value: function visitDrop_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_workload_group.
  }, {
    key: "visitDrop_workload_group",
    value: function visitDrop_workload_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_xml_schema_collection.
  }, {
    key: "visitDrop_xml_schema_collection",
    value: function visitDrop_xml_schema_collection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#disable_trigger.
  }, {
    key: "visitDisable_trigger",
    value: function visitDisable_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#enable_trigger.
  }, {
    key: "visitEnable_trigger",
    value: function visitEnable_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#lock_table.
  }, {
    key: "visitLock_table",
    value: function visitLock_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#truncate_table.
  }, {
    key: "visitTruncate_table",
    value: function visitTruncate_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_column_master_key.
  }, {
    key: "visitCreate_column_master_key",
    value: function visitCreate_column_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_credential.
  }, {
    key: "visitAlter_credential",
    value: function visitAlter_credential(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_credential.
  }, {
    key: "visitCreate_credential",
    value: function visitCreate_credential(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_cryptographic_provider.
  }, {
    key: "visitAlter_cryptographic_provider",
    value: function visitAlter_cryptographic_provider(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_cryptographic_provider.
  }, {
    key: "visitCreate_cryptographic_provider",
    value: function visitCreate_cryptographic_provider(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_endpoint.
  }, {
    key: "visitCreate_endpoint",
    value: function visitCreate_endpoint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#endpoint_encryption_alogorithm_clause.
  }, {
    key: "visitEndpoint_encryption_alogorithm_clause",
    value: function visitEndpoint_encryption_alogorithm_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#endpoint_authentication_clause.
  }, {
    key: "visitEndpoint_authentication_clause",
    value: function visitEndpoint_authentication_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#endpoint_listener_clause.
  }, {
    key: "visitEndpoint_listener_clause",
    value: function visitEndpoint_listener_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_event_notification.
  }, {
    key: "visitCreate_event_notification",
    value: function visitCreate_event_notification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_event_session.
  }, {
    key: "visitCreate_or_alter_event_session",
    value: function visitCreate_or_alter_event_session(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#event_session_predicate_expression.
  }, {
    key: "visitEvent_session_predicate_expression",
    value: function visitEvent_session_predicate_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#event_session_predicate_factor.
  }, {
    key: "visitEvent_session_predicate_factor",
    value: function visitEvent_session_predicate_factor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#event_session_predicate_leaf.
  }, {
    key: "visitEvent_session_predicate_leaf",
    value: function visitEvent_session_predicate_leaf(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_external_data_source.
  }, {
    key: "visitAlter_external_data_source",
    value: function visitAlter_external_data_source(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_external_library.
  }, {
    key: "visitAlter_external_library",
    value: function visitAlter_external_library(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_external_library.
  }, {
    key: "visitCreate_external_library",
    value: function visitCreate_external_library(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_external_resource_pool.
  }, {
    key: "visitAlter_external_resource_pool",
    value: function visitAlter_external_resource_pool(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_external_resource_pool.
  }, {
    key: "visitCreate_external_resource_pool",
    value: function visitCreate_external_resource_pool(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_fulltext_catalog.
  }, {
    key: "visitAlter_fulltext_catalog",
    value: function visitAlter_fulltext_catalog(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_fulltext_catalog.
  }, {
    key: "visitCreate_fulltext_catalog",
    value: function visitCreate_fulltext_catalog(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_fulltext_stoplist.
  }, {
    key: "visitAlter_fulltext_stoplist",
    value: function visitAlter_fulltext_stoplist(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_fulltext_stoplist.
  }, {
    key: "visitCreate_fulltext_stoplist",
    value: function visitCreate_fulltext_stoplist(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_login_sql_server.
  }, {
    key: "visitAlter_login_sql_server",
    value: function visitAlter_login_sql_server(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_login_sql_server.
  }, {
    key: "visitCreate_login_sql_server",
    value: function visitCreate_login_sql_server(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_login_azure_sql.
  }, {
    key: "visitAlter_login_azure_sql",
    value: function visitAlter_login_azure_sql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_login_azure_sql.
  }, {
    key: "visitCreate_login_azure_sql",
    value: function visitCreate_login_azure_sql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_login_azure_sql_dw_and_pdw.
  }, {
    key: "visitAlter_login_azure_sql_dw_and_pdw",
    value: function visitAlter_login_azure_sql_dw_and_pdw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_login_pdw.
  }, {
    key: "visitCreate_login_pdw",
    value: function visitCreate_login_pdw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_master_key_sql_server.
  }, {
    key: "visitAlter_master_key_sql_server",
    value: function visitAlter_master_key_sql_server(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_master_key_sql_server.
  }, {
    key: "visitCreate_master_key_sql_server",
    value: function visitCreate_master_key_sql_server(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_master_key_azure_sql.
  }, {
    key: "visitAlter_master_key_azure_sql",
    value: function visitAlter_master_key_azure_sql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_master_key_azure_sql.
  }, {
    key: "visitCreate_master_key_azure_sql",
    value: function visitCreate_master_key_azure_sql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_message_type.
  }, {
    key: "visitAlter_message_type",
    value: function visitAlter_message_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_partition_function.
  }, {
    key: "visitAlter_partition_function",
    value: function visitAlter_partition_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_partition_scheme.
  }, {
    key: "visitAlter_partition_scheme",
    value: function visitAlter_partition_scheme(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_remote_service_binding.
  }, {
    key: "visitAlter_remote_service_binding",
    value: function visitAlter_remote_service_binding(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_remote_service_binding.
  }, {
    key: "visitCreate_remote_service_binding",
    value: function visitCreate_remote_service_binding(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_resource_pool.
  }, {
    key: "visitCreate_resource_pool",
    value: function visitCreate_resource_pool(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_resource_governor.
  }, {
    key: "visitAlter_resource_governor",
    value: function visitAlter_resource_governor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_database_audit_specification.
  }, {
    key: "visitAlter_database_audit_specification",
    value: function visitAlter_database_audit_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#audit_action_spec_group.
  }, {
    key: "visitAudit_action_spec_group",
    value: function visitAudit_action_spec_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#audit_action_specification.
  }, {
    key: "visitAudit_action_specification",
    value: function visitAudit_action_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#action_specification.
  }, {
    key: "visitAction_specification",
    value: function visitAction_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#audit_class_name.
  }, {
    key: "visitAudit_class_name",
    value: function visitAudit_class_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#audit_securable.
  }, {
    key: "visitAudit_securable",
    value: function visitAudit_securable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_db_role.
  }, {
    key: "visitAlter_db_role",
    value: function visitAlter_db_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_database_audit_specification.
  }, {
    key: "visitCreate_database_audit_specification",
    value: function visitCreate_database_audit_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_db_role.
  }, {
    key: "visitCreate_db_role",
    value: function visitCreate_db_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_route.
  }, {
    key: "visitCreate_route",
    value: function visitCreate_route(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_rule.
  }, {
    key: "visitCreate_rule",
    value: function visitCreate_rule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_schema_sql.
  }, {
    key: "visitAlter_schema_sql",
    value: function visitAlter_schema_sql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_schema.
  }, {
    key: "visitCreate_schema",
    value: function visitCreate_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_schema_azure_sql_dw_and_pdw.
  }, {
    key: "visitCreate_schema_azure_sql_dw_and_pdw",
    value: function visitCreate_schema_azure_sql_dw_and_pdw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_schema_azure_sql_dw_and_pdw.
  }, {
    key: "visitAlter_schema_azure_sql_dw_and_pdw",
    value: function visitAlter_schema_azure_sql_dw_and_pdw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_search_property_list.
  }, {
    key: "visitCreate_search_property_list",
    value: function visitCreate_search_property_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_security_policy.
  }, {
    key: "visitCreate_security_policy",
    value: function visitCreate_security_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_sequence.
  }, {
    key: "visitAlter_sequence",
    value: function visitAlter_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_sequence.
  }, {
    key: "visitCreate_sequence",
    value: function visitCreate_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_server_audit.
  }, {
    key: "visitAlter_server_audit",
    value: function visitAlter_server_audit(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_server_audit.
  }, {
    key: "visitCreate_server_audit",
    value: function visitCreate_server_audit(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_server_audit_specification.
  }, {
    key: "visitAlter_server_audit_specification",
    value: function visitAlter_server_audit_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_server_audit_specification.
  }, {
    key: "visitCreate_server_audit_specification",
    value: function visitCreate_server_audit_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_server_configuration.
  }, {
    key: "visitAlter_server_configuration",
    value: function visitAlter_server_configuration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_server_role.
  }, {
    key: "visitAlter_server_role",
    value: function visitAlter_server_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_server_role.
  }, {
    key: "visitCreate_server_role",
    value: function visitCreate_server_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_server_role_pdw.
  }, {
    key: "visitAlter_server_role_pdw",
    value: function visitAlter_server_role_pdw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_service.
  }, {
    key: "visitAlter_service",
    value: function visitAlter_service(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#opt_arg_clause.
  }, {
    key: "visitOpt_arg_clause",
    value: function visitOpt_arg_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_service.
  }, {
    key: "visitCreate_service",
    value: function visitCreate_service(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_service_master_key.
  }, {
    key: "visitAlter_service_master_key",
    value: function visitAlter_service_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_symmetric_key.
  }, {
    key: "visitAlter_symmetric_key",
    value: function visitAlter_symmetric_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_synonym.
  }, {
    key: "visitCreate_synonym",
    value: function visitCreate_synonym(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_user.
  }, {
    key: "visitAlter_user",
    value: function visitAlter_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_user.
  }, {
    key: "visitCreate_user",
    value: function visitCreate_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_user_azure_sql_dw.
  }, {
    key: "visitCreate_user_azure_sql_dw",
    value: function visitCreate_user_azure_sql_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_user_azure_sql.
  }, {
    key: "visitAlter_user_azure_sql",
    value: function visitAlter_user_azure_sql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_workload_group.
  }, {
    key: "visitAlter_workload_group",
    value: function visitAlter_workload_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_workload_group.
  }, {
    key: "visitCreate_workload_group",
    value: function visitCreate_workload_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_xml_schema_collection.
  }, {
    key: "visitCreate_xml_schema_collection",
    value: function visitCreate_xml_schema_collection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_partition_function.
  }, {
    key: "visitCreate_partition_function",
    value: function visitCreate_partition_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_partition_scheme.
  }, {
    key: "visitCreate_partition_scheme",
    value: function visitCreate_partition_scheme(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_queue.
  }, {
    key: "visitCreate_queue",
    value: function visitCreate_queue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#queue_settings.
  }, {
    key: "visitQueue_settings",
    value: function visitQueue_settings(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_queue.
  }, {
    key: "visitAlter_queue",
    value: function visitAlter_queue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#queue_action.
  }, {
    key: "visitQueue_action",
    value: function visitQueue_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#queue_rebuild_options.
  }, {
    key: "visitQueue_rebuild_options",
    value: function visitQueue_rebuild_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_contract.
  }, {
    key: "visitCreate_contract",
    value: function visitCreate_contract(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#conversation_statement.
  }, {
    key: "visitConversation_statement",
    value: function visitConversation_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#message_statement.
  }, {
    key: "visitMessage_statement",
    value: function visitMessage_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#merge_statement.
  }, {
    key: "visitMerge_statement",
    value: function visitMerge_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#when_matches.
  }, {
    key: "visitWhen_matches",
    value: function visitWhen_matches(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#merge_matched.
  }, {
    key: "visitMerge_matched",
    value: function visitMerge_matched(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#merge_not_matched.
  }, {
    key: "visitMerge_not_matched",
    value: function visitMerge_not_matched(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#delete_statement.
  }, {
    key: "visitDelete_statement",
    value: function visitDelete_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#delete_statement_from.
  }, {
    key: "visitDelete_statement_from",
    value: function visitDelete_statement_from(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#insert_statement.
  }, {
    key: "visitInsert_statement",
    value: function visitInsert_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#insert_statement_value.
  }, {
    key: "visitInsert_statement_value",
    value: function visitInsert_statement_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#receive_statement.
  }, {
    key: "visitReceive_statement",
    value: function visitReceive_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#select_statement_standalone.
  }, {
    key: "visitSelect_statement_standalone",
    value: function visitSelect_statement_standalone(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#select_statement.
  }, {
    key: "visitSelect_statement",
    value: function visitSelect_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#time.
  }, {
    key: "visitTime",
    value: function visitTime(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#update_statement.
  }, {
    key: "visitUpdate_statement",
    value: function visitUpdate_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#output_clause.
  }, {
    key: "visitOutput_clause",
    value: function visitOutput_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#output_dml_list_elem.
  }, {
    key: "visitOutput_dml_list_elem",
    value: function visitOutput_dml_list_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_database.
  }, {
    key: "visitCreate_database",
    value: function visitCreate_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_index.
  }, {
    key: "visitCreate_index",
    value: function visitCreate_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_index_options.
  }, {
    key: "visitCreate_index_options",
    value: function visitCreate_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#relational_index_option.
  }, {
    key: "visitRelational_index_option",
    value: function visitRelational_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_index.
  }, {
    key: "visitAlter_index",
    value: function visitAlter_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#resumable_index_options.
  }, {
    key: "visitResumable_index_options",
    value: function visitResumable_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#resumable_index_option.
  }, {
    key: "visitResumable_index_option",
    value: function visitResumable_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#reorganize_partition.
  }, {
    key: "visitReorganize_partition",
    value: function visitReorganize_partition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#reorganize_options.
  }, {
    key: "visitReorganize_options",
    value: function visitReorganize_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#reorganize_option.
  }, {
    key: "visitReorganize_option",
    value: function visitReorganize_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#set_index_options.
  }, {
    key: "visitSet_index_options",
    value: function visitSet_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#set_index_option.
  }, {
    key: "visitSet_index_option",
    value: function visitSet_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#rebuild_partition.
  }, {
    key: "visitRebuild_partition",
    value: function visitRebuild_partition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#rebuild_index_options.
  }, {
    key: "visitRebuild_index_options",
    value: function visitRebuild_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#rebuild_index_option.
  }, {
    key: "visitRebuild_index_option",
    value: function visitRebuild_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#single_partition_rebuild_index_options.
  }, {
    key: "visitSingle_partition_rebuild_index_options",
    value: function visitSingle_partition_rebuild_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#single_partition_rebuild_index_option.
  }, {
    key: "visitSingle_partition_rebuild_index_option",
    value: function visitSingle_partition_rebuild_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#on_partitions.
  }, {
    key: "visitOn_partitions",
    value: function visitOn_partitions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_columnstore_index.
  }, {
    key: "visitCreate_columnstore_index",
    value: function visitCreate_columnstore_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_columnstore_index_options.
  }, {
    key: "visitCreate_columnstore_index_options",
    value: function visitCreate_columnstore_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#columnstore_index_option.
  }, {
    key: "visitColumnstore_index_option",
    value: function visitColumnstore_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_nonclustered_columnstore_index.
  }, {
    key: "visitCreate_nonclustered_columnstore_index",
    value: function visitCreate_nonclustered_columnstore_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_xml_index.
  }, {
    key: "visitCreate_xml_index",
    value: function visitCreate_xml_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_index_options.
  }, {
    key: "visitXml_index_options",
    value: function visitXml_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_index_option.
  }, {
    key: "visitXml_index_option",
    value: function visitXml_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_procedure.
  }, {
    key: "visitCreate_or_alter_procedure",
    value: function visitCreate_or_alter_procedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#as_external_name.
  }, {
    key: "visitAs_external_name",
    value: function visitAs_external_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_trigger.
  }, {
    key: "visitCreate_or_alter_trigger",
    value: function visitCreate_or_alter_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_dml_trigger.
  }, {
    key: "visitCreate_or_alter_dml_trigger",
    value: function visitCreate_or_alter_dml_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dml_trigger_option.
  }, {
    key: "visitDml_trigger_option",
    value: function visitDml_trigger_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dml_trigger_operation.
  }, {
    key: "visitDml_trigger_operation",
    value: function visitDml_trigger_operation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_ddl_trigger.
  }, {
    key: "visitCreate_or_alter_ddl_trigger",
    value: function visitCreate_or_alter_ddl_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ddl_trigger_operation.
  }, {
    key: "visitDdl_trigger_operation",
    value: function visitDdl_trigger_operation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_or_alter_function.
  }, {
    key: "visitCreate_or_alter_function",
    value: function visitCreate_or_alter_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#func_body_returns_select.
  }, {
    key: "visitFunc_body_returns_select",
    value: function visitFunc_body_returns_select(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#func_body_returns_table.
  }, {
    key: "visitFunc_body_returns_table",
    value: function visitFunc_body_returns_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#func_body_returns_scalar.
  }, {
    key: "visitFunc_body_returns_scalar",
    value: function visitFunc_body_returns_scalar(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#procedure_param_default_value.
  }, {
    key: "visitProcedure_param_default_value",
    value: function visitProcedure_param_default_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#procedure_param.
  }, {
    key: "visitProcedure_param",
    value: function visitProcedure_param(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#procedure_option.
  }, {
    key: "visitProcedure_option",
    value: function visitProcedure_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#function_option.
  }, {
    key: "visitFunction_option",
    value: function visitFunction_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_statistics.
  }, {
    key: "visitCreate_statistics",
    value: function visitCreate_statistics(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#update_statistics.
  }, {
    key: "visitUpdate_statistics",
    value: function visitUpdate_statistics(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#update_statistics_options.
  }, {
    key: "visitUpdate_statistics_options",
    value: function visitUpdate_statistics_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#update_statistics_option.
  }, {
    key: "visitUpdate_statistics_option",
    value: function visitUpdate_statistics_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_table.
  }, {
    key: "visitCreate_table",
    value: function visitCreate_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_indices.
  }, {
    key: "visitTable_indices",
    value: function visitTable_indices(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_options.
  }, {
    key: "visitTable_options",
    value: function visitTable_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_option.
  }, {
    key: "visitTable_option",
    value: function visitTable_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_table_index_options.
  }, {
    key: "visitCreate_table_index_options",
    value: function visitCreate_table_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_table_index_option.
  }, {
    key: "visitCreate_table_index_option",
    value: function visitCreate_table_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_view.
  }, {
    key: "visitCreate_view",
    value: function visitCreate_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#view_attribute.
  }, {
    key: "visitView_attribute",
    value: function visitView_attribute(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_table.
  }, {
    key: "visitAlter_table",
    value: function visitAlter_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#switch_partition.
  }, {
    key: "visitSwitch_partition",
    value: function visitSwitch_partition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#low_priority_lock_wait.
  }, {
    key: "visitLow_priority_lock_wait",
    value: function visitLow_priority_lock_wait(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_database.
  }, {
    key: "visitAlter_database",
    value: function visitAlter_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#add_or_modify_files.
  }, {
    key: "visitAdd_or_modify_files",
    value: function visitAdd_or_modify_files(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#filespec.
  }, {
    key: "visitFilespec",
    value: function visitFilespec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#add_or_modify_filegroups.
  }, {
    key: "visitAdd_or_modify_filegroups",
    value: function visitAdd_or_modify_filegroups(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#filegroup_updatability_option.
  }, {
    key: "visitFilegroup_updatability_option",
    value: function visitFilegroup_updatability_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#database_optionspec.
  }, {
    key: "visitDatabase_optionspec",
    value: function visitDatabase_optionspec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#auto_option.
  }, {
    key: "visitAuto_option",
    value: function visitAuto_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#change_tracking_option.
  }, {
    key: "visitChange_tracking_option",
    value: function visitChange_tracking_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#change_tracking_option_list.
  }, {
    key: "visitChange_tracking_option_list",
    value: function visitChange_tracking_option_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#containment_option.
  }, {
    key: "visitContainment_option",
    value: function visitContainment_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#cursor_option.
  }, {
    key: "visitCursor_option",
    value: function visitCursor_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_endpoint.
  }, {
    key: "visitAlter_endpoint",
    value: function visitAlter_endpoint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#database_mirroring_option.
  }, {
    key: "visitDatabase_mirroring_option",
    value: function visitDatabase_mirroring_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#mirroring_set_option.
  }, {
    key: "visitMirroring_set_option",
    value: function visitMirroring_set_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#mirroring_partner.
  }, {
    key: "visitMirroring_partner",
    value: function visitMirroring_partner(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#mirroring_witness.
  }, {
    key: "visitMirroring_witness",
    value: function visitMirroring_witness(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#witness_partner_equal.
  }, {
    key: "visitWitness_partner_equal",
    value: function visitWitness_partner_equal(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#partner_option.
  }, {
    key: "visitPartner_option",
    value: function visitPartner_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#witness_option.
  }, {
    key: "visitWitness_option",
    value: function visitWitness_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#witness_server.
  }, {
    key: "visitWitness_server",
    value: function visitWitness_server(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#partner_server.
  }, {
    key: "visitPartner_server",
    value: function visitPartner_server(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#mirroring_host_port_seperator.
  }, {
    key: "visitMirroring_host_port_seperator",
    value: function visitMirroring_host_port_seperator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#partner_server_tcp_prefix.
  }, {
    key: "visitPartner_server_tcp_prefix",
    value: function visitPartner_server_tcp_prefix(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#port_number.
  }, {
    key: "visitPort_number",
    value: function visitPort_number(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#host.
  }, {
    key: "visitHost",
    value: function visitHost(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#date_correlation_optimization_option.
  }, {
    key: "visitDate_correlation_optimization_option",
    value: function visitDate_correlation_optimization_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#db_encryption_option.
  }, {
    key: "visitDb_encryption_option",
    value: function visitDb_encryption_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#db_state_option.
  }, {
    key: "visitDb_state_option",
    value: function visitDb_state_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#db_update_option.
  }, {
    key: "visitDb_update_option",
    value: function visitDb_update_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#db_user_access_option.
  }, {
    key: "visitDb_user_access_option",
    value: function visitDb_user_access_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#delayed_durability_option.
  }, {
    key: "visitDelayed_durability_option",
    value: function visitDelayed_durability_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#external_access_option.
  }, {
    key: "visitExternal_access_option",
    value: function visitExternal_access_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#hadr_options.
  }, {
    key: "visitHadr_options",
    value: function visitHadr_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#mixed_page_allocation_option.
  }, {
    key: "visitMixed_page_allocation_option",
    value: function visitMixed_page_allocation_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#parameterization_option.
  }, {
    key: "visitParameterization_option",
    value: function visitParameterization_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#recovery_option.
  }, {
    key: "visitRecovery_option",
    value: function visitRecovery_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#service_broker_option.
  }, {
    key: "visitService_broker_option",
    value: function visitService_broker_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#snapshot_option.
  }, {
    key: "visitSnapshot_option",
    value: function visitSnapshot_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#sql_option.
  }, {
    key: "visitSql_option",
    value: function visitSql_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#target_recovery_time_option.
  }, {
    key: "visitTarget_recovery_time_option",
    value: function visitTarget_recovery_time_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#termination.
  }, {
    key: "visitTermination",
    value: function visitTermination(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_index.
  }, {
    key: "visitDrop_index",
    value: function visitDrop_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_relational_or_xml_or_spatial_index.
  }, {
    key: "visitDrop_relational_or_xml_or_spatial_index",
    value: function visitDrop_relational_or_xml_or_spatial_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_backward_compatible_index.
  }, {
    key: "visitDrop_backward_compatible_index",
    value: function visitDrop_backward_compatible_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_procedure.
  }, {
    key: "visitDrop_procedure",
    value: function visitDrop_procedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_trigger.
  }, {
    key: "visitDrop_trigger",
    value: function visitDrop_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_dml_trigger.
  }, {
    key: "visitDrop_dml_trigger",
    value: function visitDrop_dml_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_ddl_trigger.
  }, {
    key: "visitDrop_ddl_trigger",
    value: function visitDrop_ddl_trigger(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_function.
  }, {
    key: "visitDrop_function",
    value: function visitDrop_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_statistics.
  }, {
    key: "visitDrop_statistics",
    value: function visitDrop_statistics(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_table.
  }, {
    key: "visitDrop_table",
    value: function visitDrop_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_view.
  }, {
    key: "visitDrop_view",
    value: function visitDrop_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_type.
  }, {
    key: "visitCreate_type",
    value: function visitCreate_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#drop_type.
  }, {
    key: "visitDrop_type",
    value: function visitDrop_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#rowset_function_limited.
  }, {
    key: "visitRowset_function_limited",
    value: function visitRowset_function_limited(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#openquery.
  }, {
    key: "visitOpenquery",
    value: function visitOpenquery(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#opendatasource.
  }, {
    key: "visitOpendatasource",
    value: function visitOpendatasource(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#declare_statement.
  }, {
    key: "visitDeclare_statement",
    value: function visitDeclare_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_declaration.
  }, {
    key: "visitXml_declaration",
    value: function visitXml_declaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#cursor_statement.
  }, {
    key: "visitCursor_statement",
    value: function visitCursor_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#backup_database.
  }, {
    key: "visitBackup_database",
    value: function visitBackup_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#backup_log.
  }, {
    key: "visitBackup_log",
    value: function visitBackup_log(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#backup_certificate.
  }, {
    key: "visitBackup_certificate",
    value: function visitBackup_certificate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#backup_master_key.
  }, {
    key: "visitBackup_master_key",
    value: function visitBackup_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#backup_service_master_key.
  }, {
    key: "visitBackup_service_master_key",
    value: function visitBackup_service_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#kill_statement.
  }, {
    key: "visitKill_statement",
    value: function visitKill_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#kill_process.
  }, {
    key: "visitKill_process",
    value: function visitKill_process(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#kill_query_notification.
  }, {
    key: "visitKill_query_notification",
    value: function visitKill_query_notification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#kill_stats_job.
  }, {
    key: "visitKill_stats_job",
    value: function visitKill_stats_job(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_statement.
  }, {
    key: "visitExecute_statement",
    value: function visitExecute_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_body_batch.
  }, {
    key: "visitExecute_body_batch",
    value: function visitExecute_body_batch(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_body.
  }, {
    key: "visitExecute_body",
    value: function visitExecute_body(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_statement_arg.
  }, {
    key: "visitExecute_statement_arg",
    value: function visitExecute_statement_arg(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_statement_arg_named.
  }, {
    key: "visitExecute_statement_arg_named",
    value: function visitExecute_statement_arg_named(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_statement_arg_unnamed.
  }, {
    key: "visitExecute_statement_arg_unnamed",
    value: function visitExecute_statement_arg_unnamed(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_parameter.
  }, {
    key: "visitExecute_parameter",
    value: function visitExecute_parameter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_var_string.
  }, {
    key: "visitExecute_var_string",
    value: function visitExecute_var_string(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#security_statement.
  }, {
    key: "visitSecurity_statement",
    value: function visitSecurity_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#principal_id.
  }, {
    key: "visitPrincipal_id",
    value: function visitPrincipal_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_certificate.
  }, {
    key: "visitCreate_certificate",
    value: function visitCreate_certificate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#existing_keys.
  }, {
    key: "visitExisting_keys",
    value: function visitExisting_keys(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#private_key_options.
  }, {
    key: "visitPrivate_key_options",
    value: function visitPrivate_key_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#generate_new_keys.
  }, {
    key: "visitGenerate_new_keys",
    value: function visitGenerate_new_keys(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#date_options.
  }, {
    key: "visitDate_options",
    value: function visitDate_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#open_key.
  }, {
    key: "visitOpen_key",
    value: function visitOpen_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#close_key.
  }, {
    key: "visitClose_key",
    value: function visitClose_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_key.
  }, {
    key: "visitCreate_key",
    value: function visitCreate_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#key_options.
  }, {
    key: "visitKey_options",
    value: function visitKey_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#algorithm.
  }, {
    key: "visitAlgorithm",
    value: function visitAlgorithm(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#encryption_mechanism.
  }, {
    key: "visitEncryption_mechanism",
    value: function visitEncryption_mechanism(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#decryption_mechanism.
  }, {
    key: "visitDecryption_mechanism",
    value: function visitDecryption_mechanism(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#grant_permission.
  }, {
    key: "visitGrant_permission",
    value: function visitGrant_permission(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#set_statement.
  }, {
    key: "visitSet_statement",
    value: function visitSet_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#transaction_statement.
  }, {
    key: "visitTransaction_statement",
    value: function visitTransaction_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#go_statement.
  }, {
    key: "visitGo_statement",
    value: function visitGo_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#use_statement.
  }, {
    key: "visitUse_statement",
    value: function visitUse_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#setuser_statement.
  }, {
    key: "visitSetuser_statement",
    value: function visitSetuser_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#reconfigure_statement.
  }, {
    key: "visitReconfigure_statement",
    value: function visitReconfigure_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#shutdown_statement.
  }, {
    key: "visitShutdown_statement",
    value: function visitShutdown_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#checkpoint_statement.
  }, {
    key: "visitCheckpoint_statement",
    value: function visitCheckpoint_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkalloc_option.
  }, {
    key: "visitDbcc_checkalloc_option",
    value: function visitDbcc_checkalloc_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkalloc.
  }, {
    key: "visitDbcc_checkalloc",
    value: function visitDbcc_checkalloc(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkcatalog.
  }, {
    key: "visitDbcc_checkcatalog",
    value: function visitDbcc_checkcatalog(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkconstraints_option.
  }, {
    key: "visitDbcc_checkconstraints_option",
    value: function visitDbcc_checkconstraints_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkconstraints.
  }, {
    key: "visitDbcc_checkconstraints",
    value: function visitDbcc_checkconstraints(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkdb_table_option.
  }, {
    key: "visitDbcc_checkdb_table_option",
    value: function visitDbcc_checkdb_table_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkdb.
  }, {
    key: "visitDbcc_checkdb",
    value: function visitDbcc_checkdb(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkfilegroup_option.
  }, {
    key: "visitDbcc_checkfilegroup_option",
    value: function visitDbcc_checkfilegroup_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checkfilegroup.
  }, {
    key: "visitDbcc_checkfilegroup",
    value: function visitDbcc_checkfilegroup(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_checktable.
  }, {
    key: "visitDbcc_checktable",
    value: function visitDbcc_checktable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_cleantable.
  }, {
    key: "visitDbcc_cleantable",
    value: function visitDbcc_cleantable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_clonedatabase_option.
  }, {
    key: "visitDbcc_clonedatabase_option",
    value: function visitDbcc_clonedatabase_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_clonedatabase.
  }, {
    key: "visitDbcc_clonedatabase",
    value: function visitDbcc_clonedatabase(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_pdw_showspaceused.
  }, {
    key: "visitDbcc_pdw_showspaceused",
    value: function visitDbcc_pdw_showspaceused(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_proccache.
  }, {
    key: "visitDbcc_proccache",
    value: function visitDbcc_proccache(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_showcontig_option.
  }, {
    key: "visitDbcc_showcontig_option",
    value: function visitDbcc_showcontig_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_showcontig.
  }, {
    key: "visitDbcc_showcontig",
    value: function visitDbcc_showcontig(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_shrinklog.
  }, {
    key: "visitDbcc_shrinklog",
    value: function visitDbcc_shrinklog(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_dbreindex.
  }, {
    key: "visitDbcc_dbreindex",
    value: function visitDbcc_dbreindex(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_dll_free.
  }, {
    key: "visitDbcc_dll_free",
    value: function visitDbcc_dll_free(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_dropcleanbuffers.
  }, {
    key: "visitDbcc_dropcleanbuffers",
    value: function visitDbcc_dropcleanbuffers(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dbcc_clause.
  }, {
    key: "visitDbcc_clause",
    value: function visitDbcc_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#execute_clause.
  }, {
    key: "visitExecute_clause",
    value: function visitExecute_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#declare_local.
  }, {
    key: "visitDeclare_local",
    value: function visitDeclare_local(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_type_definition.
  }, {
    key: "visitTable_type_definition",
    value: function visitTable_type_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_type_indices.
  }, {
    key: "visitTable_type_indices",
    value: function visitTable_type_indices(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_type_definition.
  }, {
    key: "visitXml_type_definition",
    value: function visitXml_type_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_schema_collection.
  }, {
    key: "visitXml_schema_collection",
    value: function visitXml_schema_collection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_def_table_constraints.
  }, {
    key: "visitColumn_def_table_constraints",
    value: function visitColumn_def_table_constraints(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_def_table_constraint.
  }, {
    key: "visitColumn_def_table_constraint",
    value: function visitColumn_def_table_constraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_definition.
  }, {
    key: "visitColumn_definition",
    value: function visitColumn_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_definition_element.
  }, {
    key: "visitColumn_definition_element",
    value: function visitColumn_definition_element(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_modifier.
  }, {
    key: "visitColumn_modifier",
    value: function visitColumn_modifier(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#materialized_column_definition.
  }, {
    key: "visitMaterialized_column_definition",
    value: function visitMaterialized_column_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_constraint.
  }, {
    key: "visitColumn_constraint",
    value: function visitColumn_constraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_index.
  }, {
    key: "visitColumn_index",
    value: function visitColumn_index(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#on_partition_or_filegroup.
  }, {
    key: "visitOn_partition_or_filegroup",
    value: function visitOn_partition_or_filegroup(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_constraint.
  }, {
    key: "visitTable_constraint",
    value: function visitTable_constraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#connection_node.
  }, {
    key: "visitConnection_node",
    value: function visitConnection_node(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#primary_key_options.
  }, {
    key: "visitPrimary_key_options",
    value: function visitPrimary_key_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#foreign_key_options.
  }, {
    key: "visitForeign_key_options",
    value: function visitForeign_key_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#check_constraint.
  }, {
    key: "visitCheck_constraint",
    value: function visitCheck_constraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#on_delete.
  }, {
    key: "visitOn_delete",
    value: function visitOn_delete(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#on_update.
  }, {
    key: "visitOn_update",
    value: function visitOn_update(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_table_index_options.
  }, {
    key: "visitAlter_table_index_options",
    value: function visitAlter_table_index_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#alter_table_index_option.
  }, {
    key: "visitAlter_table_index_option",
    value: function visitAlter_table_index_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#declare_cursor.
  }, {
    key: "visitDeclare_cursor",
    value: function visitDeclare_cursor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#declare_set_cursor_common.
  }, {
    key: "visitDeclare_set_cursor_common",
    value: function visitDeclare_set_cursor_common(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#declare_set_cursor_common_partial.
  }, {
    key: "visitDeclare_set_cursor_common_partial",
    value: function visitDeclare_set_cursor_common_partial(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#fetch_cursor.
  }, {
    key: "visitFetch_cursor",
    value: function visitFetch_cursor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#set_special.
  }, {
    key: "visitSet_special",
    value: function visitSet_special(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#special_list.
  }, {
    key: "visitSpecial_list",
    value: function visitSpecial_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#constant_LOCAL_ID.
  }, {
    key: "visitConstant_LOCAL_ID",
    value: function visitConstant_LOCAL_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#expression.
  }, {
    key: "visitExpression",
    value: function visitExpression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#parameter.
  }, {
    key: "visitParameter",
    value: function visitParameter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#time_zone.
  }, {
    key: "visitTime_zone",
    value: function visitTime_zone(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#primitive_expression.
  }, {
    key: "visitPrimitive_expression",
    value: function visitPrimitive_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#case_expression.
  }, {
    key: "visitCase_expression",
    value: function visitCase_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#unary_operator_expression.
  }, {
    key: "visitUnary_operator_expression",
    value: function visitUnary_operator_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#bracket_expression.
  }, {
    key: "visitBracket_expression",
    value: function visitBracket_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#subquery.
  }, {
    key: "visitSubquery",
    value: function visitSubquery(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#with_expression.
  }, {
    key: "visitWith_expression",
    value: function visitWith_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#common_table_expression.
  }, {
    key: "visitCommon_table_expression",
    value: function visitCommon_table_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#update_elem.
  }, {
    key: "visitUpdate_elem",
    value: function visitUpdate_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#update_elem_merge.
  }, {
    key: "visitUpdate_elem_merge",
    value: function visitUpdate_elem_merge(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#search_condition.
  }, {
    key: "visitSearch_condition",
    value: function visitSearch_condition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#predicate.
  }, {
    key: "visitPredicate",
    value: function visitPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#query_expression.
  }, {
    key: "visitQuery_expression",
    value: function visitQuery_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#sql_union.
  }, {
    key: "visitSql_union",
    value: function visitSql_union(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#query_specification.
  }, {
    key: "visitQuery_specification",
    value: function visitQuery_specification(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#top_clause.
  }, {
    key: "visitTop_clause",
    value: function visitTop_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#top_percent.
  }, {
    key: "visitTop_percent",
    value: function visitTop_percent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#top_count.
  }, {
    key: "visitTop_count",
    value: function visitTop_count(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#order_by_clause.
  }, {
    key: "visitOrder_by_clause",
    value: function visitOrder_by_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#select_order_by_clause.
  }, {
    key: "visitSelect_order_by_clause",
    value: function visitSelect_order_by_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#for_clause.
  }, {
    key: "visitFor_clause",
    value: function visitFor_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_common_directives.
  }, {
    key: "visitXml_common_directives",
    value: function visitXml_common_directives(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#order_by_expression.
  }, {
    key: "visitOrder_by_expression",
    value: function visitOrder_by_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#grouping_sets_item.
  }, {
    key: "visitGrouping_sets_item",
    value: function visitGrouping_sets_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#group_by_item.
  }, {
    key: "visitGroup_by_item",
    value: function visitGroup_by_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#option_clause.
  }, {
    key: "visitOption_clause",
    value: function visitOption_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#option.
  }, {
    key: "visitOption",
    value: function visitOption(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#optimize_for_arg.
  }, {
    key: "visitOptimize_for_arg",
    value: function visitOptimize_for_arg(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#select_list.
  }, {
    key: "visitSelect_list",
    value: function visitSelect_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#udt_method_arguments.
  }, {
    key: "visitUdt_method_arguments",
    value: function visitUdt_method_arguments(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#asterisk.
  }, {
    key: "visitAsterisk",
    value: function visitAsterisk(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#udt_elem.
  }, {
    key: "visitUdt_elem",
    value: function visitUdt_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#expression_elem.
  }, {
    key: "visitExpression_elem",
    value: function visitExpression_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#select_list_elem.
  }, {
    key: "visitSelect_list_elem",
    value: function visitSelect_list_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_sources.
  }, {
    key: "visitTable_sources",
    value: function visitTable_sources(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#non_ansi_join.
  }, {
    key: "visitNon_ansi_join",
    value: function visitNon_ansi_join(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_source.
  }, {
    key: "visitTable_source",
    value: function visitTable_source(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_source_item.
  }, {
    key: "visitTable_source_item",
    value: function visitTable_source_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#open_xml.
  }, {
    key: "visitOpen_xml",
    value: function visitOpen_xml(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#open_json.
  }, {
    key: "visitOpen_json",
    value: function visitOpen_json(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#json_declaration.
  }, {
    key: "visitJson_declaration",
    value: function visitJson_declaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#json_column_declaration.
  }, {
    key: "visitJson_column_declaration",
    value: function visitJson_column_declaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#schema_declaration.
  }, {
    key: "visitSchema_declaration",
    value: function visitSchema_declaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_declaration.
  }, {
    key: "visitColumn_declaration",
    value: function visitColumn_declaration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#change_table.
  }, {
    key: "visitChange_table",
    value: function visitChange_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#change_table_changes.
  }, {
    key: "visitChange_table_changes",
    value: function visitChange_table_changes(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#change_table_version.
  }, {
    key: "visitChange_table_version",
    value: function visitChange_table_version(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#join_part.
  }, {
    key: "visitJoin_part",
    value: function visitJoin_part(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#join_on.
  }, {
    key: "visitJoin_on",
    value: function visitJoin_on(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#cross_join.
  }, {
    key: "visitCross_join",
    value: function visitCross_join(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#apply_.
  }, {
    key: "visitApply_",
    value: function visitApply_(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#pivot.
  }, {
    key: "visitPivot",
    value: function visitPivot(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#unpivot.
  }, {
    key: "visitUnpivot",
    value: function visitUnpivot(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#pivot_clause.
  }, {
    key: "visitPivot_clause",
    value: function visitPivot_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#unpivot_clause.
  }, {
    key: "visitUnpivot_clause",
    value: function visitUnpivot_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#full_column_name_list.
  }, {
    key: "visitFull_column_name_list",
    value: function visitFull_column_name_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#rowset_function.
  }, {
    key: "visitRowset_function",
    value: function visitRowset_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#bulk_option.
  }, {
    key: "visitBulk_option",
    value: function visitBulk_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#derived_table.
  }, {
    key: "visitDerived_table",
    value: function visitDerived_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#RANKING_WINDOWED_FUNC.
  }, {
    key: "visitRANKING_WINDOWED_FUNC",
    value: function visitRANKING_WINDOWED_FUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#AGGREGATE_WINDOWED_FUNC.
  }, {
    key: "visitAGGREGATE_WINDOWED_FUNC",
    value: function visitAGGREGATE_WINDOWED_FUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ANALYTIC_WINDOWED_FUNC.
  }, {
    key: "visitANALYTIC_WINDOWED_FUNC",
    value: function visitANALYTIC_WINDOWED_FUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#BUILT_IN_FUNC.
  }, {
    key: "visitBUILT_IN_FUNC",
    value: function visitBUILT_IN_FUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SCALAR_FUNCTION.
  }, {
    key: "visitSCALAR_FUNCTION",
    value: function visitSCALAR_FUNCTION(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FREE_TEXT.
  }, {
    key: "visitFREE_TEXT",
    value: function visitFREE_TEXT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PARTITION_FUNC.
  }, {
    key: "visitPARTITION_FUNC",
    value: function visitPARTITION_FUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#HIERARCHYID_METHOD.
  }, {
    key: "visitHIERARCHYID_METHOD",
    value: function visitHIERARCHYID_METHOD(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#partition_function.
  }, {
    key: "visitPartition_function",
    value: function visitPartition_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#freetext_function.
  }, {
    key: "visitFreetext_function",
    value: function visitFreetext_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#freetext_predicate.
  }, {
    key: "visitFreetext_predicate",
    value: function visitFreetext_predicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#json_key_value.
  }, {
    key: "visitJson_key_value",
    value: function visitJson_key_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#json_null_clause.
  }, {
    key: "visitJson_null_clause",
    value: function visitJson_null_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#APP_NAME.
  }, {
    key: "visitAPP_NAME",
    value: function visitAPP_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#APPLOCK_MODE.
  }, {
    key: "visitAPPLOCK_MODE",
    value: function visitAPPLOCK_MODE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#APPLOCK_TEST.
  }, {
    key: "visitAPPLOCK_TEST",
    value: function visitAPPLOCK_TEST(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ASSEMBLYPROPERTY.
  }, {
    key: "visitASSEMBLYPROPERTY",
    value: function visitASSEMBLYPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COL_LENGTH.
  }, {
    key: "visitCOL_LENGTH",
    value: function visitCOL_LENGTH(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COL_NAME.
  }, {
    key: "visitCOL_NAME",
    value: function visitCOL_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COLUMNPROPERTY.
  }, {
    key: "visitCOLUMNPROPERTY",
    value: function visitCOLUMNPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATABASEPROPERTYEX.
  }, {
    key: "visitDATABASEPROPERTYEX",
    value: function visitDATABASEPROPERTYEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DB_ID.
  }, {
    key: "visitDB_ID",
    value: function visitDB_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DB_NAME.
  }, {
    key: "visitDB_NAME",
    value: function visitDB_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILE_ID.
  }, {
    key: "visitFILE_ID",
    value: function visitFILE_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILE_IDEX.
  }, {
    key: "visitFILE_IDEX",
    value: function visitFILE_IDEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILE_NAME.
  }, {
    key: "visitFILE_NAME",
    value: function visitFILE_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILEGROUP_ID.
  }, {
    key: "visitFILEGROUP_ID",
    value: function visitFILEGROUP_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILEGROUP_NAME.
  }, {
    key: "visitFILEGROUP_NAME",
    value: function visitFILEGROUP_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILEGROUPPROPERTY.
  }, {
    key: "visitFILEGROUPPROPERTY",
    value: function visitFILEGROUPPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILEPROPERTY.
  }, {
    key: "visitFILEPROPERTY",
    value: function visitFILEPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FILEPROPERTYEX.
  }, {
    key: "visitFILEPROPERTYEX",
    value: function visitFILEPROPERTYEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FULLTEXTCATALOGPROPERTY.
  }, {
    key: "visitFULLTEXTCATALOGPROPERTY",
    value: function visitFULLTEXTCATALOGPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FULLTEXTSERVICEPROPERTY.
  }, {
    key: "visitFULLTEXTSERVICEPROPERTY",
    value: function visitFULLTEXTSERVICEPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#INDEX_COL.
  }, {
    key: "visitINDEX_COL",
    value: function visitINDEX_COL(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#INDEXKEY_PROPERTY.
  }, {
    key: "visitINDEXKEY_PROPERTY",
    value: function visitINDEXKEY_PROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#INDEXPROPERTY.
  }, {
    key: "visitINDEXPROPERTY",
    value: function visitINDEXPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#NEXT_VALUE_FOR.
  }, {
    key: "visitNEXT_VALUE_FOR",
    value: function visitNEXT_VALUE_FOR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#OBJECT_DEFINITION.
  }, {
    key: "visitOBJECT_DEFINITION",
    value: function visitOBJECT_DEFINITION(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#OBJECT_ID.
  }, {
    key: "visitOBJECT_ID",
    value: function visitOBJECT_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#OBJECT_NAME.
  }, {
    key: "visitOBJECT_NAME",
    value: function visitOBJECT_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#OBJECT_SCHEMA_NAME.
  }, {
    key: "visitOBJECT_SCHEMA_NAME",
    value: function visitOBJECT_SCHEMA_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#OBJECTPROPERTY.
  }, {
    key: "visitOBJECTPROPERTY",
    value: function visitOBJECTPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#OBJECTPROPERTYEX.
  }, {
    key: "visitOBJECTPROPERTYEX",
    value: function visitOBJECTPROPERTYEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ORIGINAL_DB_NAME.
  }, {
    key: "visitORIGINAL_DB_NAME",
    value: function visitORIGINAL_DB_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PARSENAME.
  }, {
    key: "visitPARSENAME",
    value: function visitPARSENAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SCHEMA_ID.
  }, {
    key: "visitSCHEMA_ID",
    value: function visitSCHEMA_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SCHEMA_NAME.
  }, {
    key: "visitSCHEMA_NAME",
    value: function visitSCHEMA_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SCOPE_IDENTITY.
  }, {
    key: "visitSCOPE_IDENTITY",
    value: function visitSCOPE_IDENTITY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SERVERPROPERTY.
  }, {
    key: "visitSERVERPROPERTY",
    value: function visitSERVERPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#STATS_DATE.
  }, {
    key: "visitSTATS_DATE",
    value: function visitSTATS_DATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TYPE_ID.
  }, {
    key: "visitTYPE_ID",
    value: function visitTYPE_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TYPE_NAME.
  }, {
    key: "visitTYPE_NAME",
    value: function visitTYPE_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TYPEPROPERTY.
  }, {
    key: "visitTYPEPROPERTY",
    value: function visitTYPEPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ASCII.
  }, {
    key: "visitASCII",
    value: function visitASCII(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CHAR.
  }, {
    key: "visitCHAR",
    value: function visitCHAR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CHARINDEX.
  }, {
    key: "visitCHARINDEX",
    value: function visitCHARINDEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CONCAT.
  }, {
    key: "visitCONCAT",
    value: function visitCONCAT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CONCAT_WS.
  }, {
    key: "visitCONCAT_WS",
    value: function visitCONCAT_WS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DIFFERENCE.
  }, {
    key: "visitDIFFERENCE",
    value: function visitDIFFERENCE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FORMAT.
  }, {
    key: "visitFORMAT",
    value: function visitFORMAT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LEFT.
  }, {
    key: "visitLEFT",
    value: function visitLEFT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LEN.
  }, {
    key: "visitLEN",
    value: function visitLEN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LOWER.
  }, {
    key: "visitLOWER",
    value: function visitLOWER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LTRIM.
  }, {
    key: "visitLTRIM",
    value: function visitLTRIM(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#NCHAR.
  }, {
    key: "visitNCHAR",
    value: function visitNCHAR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PATINDEX.
  }, {
    key: "visitPATINDEX",
    value: function visitPATINDEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#QUOTENAME.
  }, {
    key: "visitQUOTENAME",
    value: function visitQUOTENAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#REPLACE.
  }, {
    key: "visitREPLACE",
    value: function visitREPLACE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#REPLICATE.
  }, {
    key: "visitREPLICATE",
    value: function visitREPLICATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#REVERSE.
  }, {
    key: "visitREVERSE",
    value: function visitREVERSE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#RIGHT.
  }, {
    key: "visitRIGHT",
    value: function visitRIGHT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#RTRIM.
  }, {
    key: "visitRTRIM",
    value: function visitRTRIM(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SOUNDEX.
  }, {
    key: "visitSOUNDEX",
    value: function visitSOUNDEX(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SPACE.
  }, {
    key: "visitSPACE",
    value: function visitSPACE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#STR.
  }, {
    key: "visitSTR",
    value: function visitSTR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#STRINGAGG.
  }, {
    key: "visitSTRINGAGG",
    value: function visitSTRINGAGG(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#STRING_ESCAPE.
  }, {
    key: "visitSTRING_ESCAPE",
    value: function visitSTRING_ESCAPE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#STUFF.
  }, {
    key: "visitSTUFF",
    value: function visitSTUFF(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SUBSTRING.
  }, {
    key: "visitSUBSTRING",
    value: function visitSUBSTRING(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TRANSLATE.
  }, {
    key: "visitTRANSLATE",
    value: function visitTRANSLATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TRIM.
  }, {
    key: "visitTRIM",
    value: function visitTRIM(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#UNICODE.
  }, {
    key: "visitUNICODE",
    value: function visitUNICODE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#UPPER.
  }, {
    key: "visitUPPER",
    value: function visitUPPER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#BINARY_CHECKSUM.
  }, {
    key: "visitBINARY_CHECKSUM",
    value: function visitBINARY_CHECKSUM(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CHECKSUM.
  }, {
    key: "visitCHECKSUM",
    value: function visitCHECKSUM(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COMPRESS.
  }, {
    key: "visitCOMPRESS",
    value: function visitCOMPRESS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CONNECTIONPROPERTY.
  }, {
    key: "visitCONNECTIONPROPERTY",
    value: function visitCONNECTIONPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CONTEXT_INFO.
  }, {
    key: "visitCONTEXT_INFO",
    value: function visitCONTEXT_INFO(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_REQUEST_ID.
  }, {
    key: "visitCURRENT_REQUEST_ID",
    value: function visitCURRENT_REQUEST_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_TRANSACTION_ID.
  }, {
    key: "visitCURRENT_TRANSACTION_ID",
    value: function visitCURRENT_TRANSACTION_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DECOMPRESS.
  }, {
    key: "visitDECOMPRESS",
    value: function visitDECOMPRESS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ERROR_LINE.
  }, {
    key: "visitERROR_LINE",
    value: function visitERROR_LINE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ERROR_MESSAGE.
  }, {
    key: "visitERROR_MESSAGE",
    value: function visitERROR_MESSAGE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ERROR_NUMBER.
  }, {
    key: "visitERROR_NUMBER",
    value: function visitERROR_NUMBER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ERROR_PROCEDURE.
  }, {
    key: "visitERROR_PROCEDURE",
    value: function visitERROR_PROCEDURE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ERROR_SEVERITY.
  }, {
    key: "visitERROR_SEVERITY",
    value: function visitERROR_SEVERITY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ERROR_STATE.
  }, {
    key: "visitERROR_STATE",
    value: function visitERROR_STATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FORMATMESSAGE.
  }, {
    key: "visitFORMATMESSAGE",
    value: function visitFORMATMESSAGE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#GET_FILESTREAM_TRANSACTION_CONTEXT.
  }, {
    key: "visitGET_FILESTREAM_TRANSACTION_CONTEXT",
    value: function visitGET_FILESTREAM_TRANSACTION_CONTEXT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#GETANSINULL.
  }, {
    key: "visitGETANSINULL",
    value: function visitGETANSINULL(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#HOST_ID.
  }, {
    key: "visitHOST_ID",
    value: function visitHOST_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#HOST_NAME.
  }, {
    key: "visitHOST_NAME",
    value: function visitHOST_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ISNULL.
  }, {
    key: "visitISNULL",
    value: function visitISNULL(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ISNUMERIC.
  }, {
    key: "visitISNUMERIC",
    value: function visitISNUMERIC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#MIN_ACTIVE_ROWVERSION.
  }, {
    key: "visitMIN_ACTIVE_ROWVERSION",
    value: function visitMIN_ACTIVE_ROWVERSION(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#NEWID.
  }, {
    key: "visitNEWID",
    value: function visitNEWID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#NEWSEQUENTIALID.
  }, {
    key: "visitNEWSEQUENTIALID",
    value: function visitNEWSEQUENTIALID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ROWCOUNT_BIG.
  }, {
    key: "visitROWCOUNT_BIG",
    value: function visitROWCOUNT_BIG(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SESSION_CONTEXT.
  }, {
    key: "visitSESSION_CONTEXT",
    value: function visitSESSION_CONTEXT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#XACT_STATE.
  }, {
    key: "visitXACT_STATE",
    value: function visitXACT_STATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CAST.
  }, {
    key: "visitCAST",
    value: function visitCAST(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TRY_CAST.
  }, {
    key: "visitTRY_CAST",
    value: function visitTRY_CAST(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CONVERT.
  }, {
    key: "visitCONVERT",
    value: function visitCONVERT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COALESCE.
  }, {
    key: "visitCOALESCE",
    value: function visitCOALESCE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURSOR_ROWS.
  }, {
    key: "visitCURSOR_ROWS",
    value: function visitCURSOR_ROWS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FETCH_STATUS.
  }, {
    key: "visitFETCH_STATUS",
    value: function visitFETCH_STATUS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURSOR_STATUS.
  }, {
    key: "visitCURSOR_STATUS",
    value: function visitCURSOR_STATUS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CERT_ID.
  }, {
    key: "visitCERT_ID",
    value: function visitCERT_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATALENGTH.
  }, {
    key: "visitDATALENGTH",
    value: function visitDATALENGTH(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IDENT_CURRENT.
  }, {
    key: "visitIDENT_CURRENT",
    value: function visitIDENT_CURRENT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IDENT_INCR.
  }, {
    key: "visitIDENT_INCR",
    value: function visitIDENT_INCR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IDENT_SEED.
  }, {
    key: "visitIDENT_SEED",
    value: function visitIDENT_SEED(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IDENTITY.
  }, {
    key: "visitIDENTITY",
    value: function visitIDENTITY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SQL_VARIANT_PROPERTY.
  }, {
    key: "visitSQL_VARIANT_PROPERTY",
    value: function visitSQL_VARIANT_PROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_DATE.
  }, {
    key: "visitCURRENT_DATE",
    value: function visitCURRENT_DATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_TIMESTAMP.
  }, {
    key: "visitCURRENT_TIMESTAMP",
    value: function visitCURRENT_TIMESTAMP(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_TIMEZONE.
  }, {
    key: "visitCURRENT_TIMEZONE",
    value: function visitCURRENT_TIMEZONE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_TIMEZONE_ID.
  }, {
    key: "visitCURRENT_TIMEZONE_ID",
    value: function visitCURRENT_TIMEZONE_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATE_BUCKET.
  }, {
    key: "visitDATE_BUCKET",
    value: function visitDATE_BUCKET(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATEADD.
  }, {
    key: "visitDATEADD",
    value: function visitDATEADD(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATEDIFF.
  }, {
    key: "visitDATEDIFF",
    value: function visitDATEDIFF(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATEDIFF_BIG.
  }, {
    key: "visitDATEDIFF_BIG",
    value: function visitDATEDIFF_BIG(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATEFROMPARTS.
  }, {
    key: "visitDATEFROMPARTS",
    value: function visitDATEFROMPARTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATENAME.
  }, {
    key: "visitDATENAME",
    value: function visitDATENAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATEPART.
  }, {
    key: "visitDATEPART",
    value: function visitDATEPART(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATETIME2FROMPARTS.
  }, {
    key: "visitDATETIME2FROMPARTS",
    value: function visitDATETIME2FROMPARTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATETIMEFROMPARTS.
  }, {
    key: "visitDATETIMEFROMPARTS",
    value: function visitDATETIMEFROMPARTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATETIMEOFFSETFROMPARTS.
  }, {
    key: "visitDATETIMEOFFSETFROMPARTS",
    value: function visitDATETIMEOFFSETFROMPARTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATETRUNC.
  }, {
    key: "visitDATETRUNC",
    value: function visitDATETRUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DAY.
  }, {
    key: "visitDAY",
    value: function visitDAY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#EOMONTH.
  }, {
    key: "visitEOMONTH",
    value: function visitEOMONTH(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#GETDATE.
  }, {
    key: "visitGETDATE",
    value: function visitGETDATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#GETUTCDATE.
  }, {
    key: "visitGETUTCDATE",
    value: function visitGETUTCDATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ISDATE.
  }, {
    key: "visitISDATE",
    value: function visitISDATE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#MONTH.
  }, {
    key: "visitMONTH",
    value: function visitMONTH(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SMALLDATETIMEFROMPARTS.
  }, {
    key: "visitSMALLDATETIMEFROMPARTS",
    value: function visitSMALLDATETIMEFROMPARTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SWITCHOFFSET.
  }, {
    key: "visitSWITCHOFFSET",
    value: function visitSWITCHOFFSET(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SYSDATETIME.
  }, {
    key: "visitSYSDATETIME",
    value: function visitSYSDATETIME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SYSDATETIMEOFFSET.
  }, {
    key: "visitSYSDATETIMEOFFSET",
    value: function visitSYSDATETIMEOFFSET(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SYSUTCDATETIME.
  }, {
    key: "visitSYSUTCDATETIME",
    value: function visitSYSUTCDATETIME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TIMEFROMPARTS.
  }, {
    key: "visitTIMEFROMPARTS",
    value: function visitTIMEFROMPARTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TODATETIMEOFFSET.
  }, {
    key: "visitTODATETIMEOFFSET",
    value: function visitTODATETIMEOFFSET(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#YEAR.
  }, {
    key: "visitYEAR",
    value: function visitYEAR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#NULLIF.
  }, {
    key: "visitNULLIF",
    value: function visitNULLIF(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PARSE.
  }, {
    key: "visitPARSE",
    value: function visitPARSE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#XML_DATA_TYPE_FUNC.
  }, {
    key: "visitXML_DATA_TYPE_FUNC",
    value: function visitXML_DATA_TYPE_FUNC(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IIF.
  }, {
    key: "visitIIF",
    value: function visitIIF(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ISJSON.
  }, {
    key: "visitISJSON",
    value: function visitISJSON(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#JSON_OBJECT.
  }, {
    key: "visitJSON_OBJECT",
    value: function visitJSON_OBJECT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#JSON_ARRAY.
  }, {
    key: "visitJSON_ARRAY",
    value: function visitJSON_ARRAY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#JSON_VALUE.
  }, {
    key: "visitJSON_VALUE",
    value: function visitJSON_VALUE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#JSON_QUERY.
  }, {
    key: "visitJSON_QUERY",
    value: function visitJSON_QUERY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#JSON_MODIFY.
  }, {
    key: "visitJSON_MODIFY",
    value: function visitJSON_MODIFY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#JSON_PATH_EXISTS.
  }, {
    key: "visitJSON_PATH_EXISTS",
    value: function visitJSON_PATH_EXISTS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ABS.
  }, {
    key: "visitABS",
    value: function visitABS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ACOS.
  }, {
    key: "visitACOS",
    value: function visitACOS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ASIN.
  }, {
    key: "visitASIN",
    value: function visitASIN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ATAN.
  }, {
    key: "visitATAN",
    value: function visitATAN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ATN2.
  }, {
    key: "visitATN2",
    value: function visitATN2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CEILING.
  }, {
    key: "visitCEILING",
    value: function visitCEILING(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COS.
  }, {
    key: "visitCOS",
    value: function visitCOS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#COT.
  }, {
    key: "visitCOT",
    value: function visitCOT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DEGREES.
  }, {
    key: "visitDEGREES",
    value: function visitDEGREES(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#EXP.
  }, {
    key: "visitEXP",
    value: function visitEXP(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#FLOOR.
  }, {
    key: "visitFLOOR",
    value: function visitFLOOR(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LOG.
  }, {
    key: "visitLOG",
    value: function visitLOG(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LOG10.
  }, {
    key: "visitLOG10",
    value: function visitLOG10(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PI.
  }, {
    key: "visitPI",
    value: function visitPI(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#POWER.
  }, {
    key: "visitPOWER",
    value: function visitPOWER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#RADIANS.
  }, {
    key: "visitRADIANS",
    value: function visitRADIANS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#RAND.
  }, {
    key: "visitRAND",
    value: function visitRAND(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ROUND.
  }, {
    key: "visitROUND",
    value: function visitROUND(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#MATH_SIGN.
  }, {
    key: "visitMATH_SIGN",
    value: function visitMATH_SIGN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SIN.
  }, {
    key: "visitSIN",
    value: function visitSIN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SQRT.
  }, {
    key: "visitSQRT",
    value: function visitSQRT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SQUARE.
  }, {
    key: "visitSQUARE",
    value: function visitSQUARE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#TAN.
  }, {
    key: "visitTAN",
    value: function visitTAN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#GREATEST.
  }, {
    key: "visitGREATEST",
    value: function visitGREATEST(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LEAST.
  }, {
    key: "visitLEAST",
    value: function visitLEAST(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CERTENCODED.
  }, {
    key: "visitCERTENCODED",
    value: function visitCERTENCODED(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CERTPRIVATEKEY.
  }, {
    key: "visitCERTPRIVATEKEY",
    value: function visitCERTPRIVATEKEY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#CURRENT_USER.
  }, {
    key: "visitCURRENT_USER",
    value: function visitCURRENT_USER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#DATABASE_PRINCIPAL_ID.
  }, {
    key: "visitDATABASE_PRINCIPAL_ID",
    value: function visitDATABASE_PRINCIPAL_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#HAS_DBACCESS.
  }, {
    key: "visitHAS_DBACCESS",
    value: function visitHAS_DBACCESS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#HAS_PERMS_BY_NAME.
  }, {
    key: "visitHAS_PERMS_BY_NAME",
    value: function visitHAS_PERMS_BY_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IS_MEMBER.
  }, {
    key: "visitIS_MEMBER",
    value: function visitIS_MEMBER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IS_ROLEMEMBER.
  }, {
    key: "visitIS_ROLEMEMBER",
    value: function visitIS_ROLEMEMBER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#IS_SRVROLEMEMBER.
  }, {
    key: "visitIS_SRVROLEMEMBER",
    value: function visitIS_SRVROLEMEMBER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#LOGINPROPERTY.
  }, {
    key: "visitLOGINPROPERTY",
    value: function visitLOGINPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ORIGINAL_LOGIN.
  }, {
    key: "visitORIGINAL_LOGIN",
    value: function visitORIGINAL_LOGIN(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PERMISSIONS.
  }, {
    key: "visitPERMISSIONS",
    value: function visitPERMISSIONS(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PWDENCRYPT.
  }, {
    key: "visitPWDENCRYPT",
    value: function visitPWDENCRYPT(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#PWDCOMPARE.
  }, {
    key: "visitPWDCOMPARE",
    value: function visitPWDCOMPARE(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SESSION_USER.
  }, {
    key: "visitSESSION_USER",
    value: function visitSESSION_USER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SESSIONPROPERTY.
  }, {
    key: "visitSESSIONPROPERTY",
    value: function visitSESSIONPROPERTY(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SUSER_ID.
  }, {
    key: "visitSUSER_ID",
    value: function visitSUSER_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SUSER_SNAME.
  }, {
    key: "visitSUSER_SNAME",
    value: function visitSUSER_SNAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SUSER_SID.
  }, {
    key: "visitSUSER_SID",
    value: function visitSUSER_SID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#SYSTEM_USER.
  }, {
    key: "visitSYSTEM_USER",
    value: function visitSYSTEM_USER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#USER.
  }, {
    key: "visitUSER",
    value: function visitUSER(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#USER_ID.
  }, {
    key: "visitUSER_ID",
    value: function visitUSER_ID(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#USER_NAME.
  }, {
    key: "visitUSER_NAME",
    value: function visitUSER_NAME(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#xml_data_type_methods.
  }, {
    key: "visitXml_data_type_methods",
    value: function visitXml_data_type_methods(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dateparts_9.
  }, {
    key: "visitDateparts_9",
    value: function visitDateparts_9(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dateparts_12.
  }, {
    key: "visitDateparts_12",
    value: function visitDateparts_12(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dateparts_15.
  }, {
    key: "visitDateparts_15",
    value: function visitDateparts_15(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#dateparts_datetrunc.
  }, {
    key: "visitDateparts_datetrunc",
    value: function visitDateparts_datetrunc(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#value_method.
  }, {
    key: "visitValue_method",
    value: function visitValue_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#value_call.
  }, {
    key: "visitValue_call",
    value: function visitValue_call(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#query_method.
  }, {
    key: "visitQuery_method",
    value: function visitQuery_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#query_call.
  }, {
    key: "visitQuery_call",
    value: function visitQuery_call(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#exist_method.
  }, {
    key: "visitExist_method",
    value: function visitExist_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#exist_call.
  }, {
    key: "visitExist_call",
    value: function visitExist_call(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#modify_method.
  }, {
    key: "visitModify_method",
    value: function visitModify_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#modify_call.
  }, {
    key: "visitModify_call",
    value: function visitModify_call(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#hierarchyid_call.
  }, {
    key: "visitHierarchyid_call",
    value: function visitHierarchyid_call(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#hierarchyid_static_method.
  }, {
    key: "visitHierarchyid_static_method",
    value: function visitHierarchyid_static_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#nodes_method.
  }, {
    key: "visitNodes_method",
    value: function visitNodes_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#switch_section.
  }, {
    key: "visitSwitch_section",
    value: function visitSwitch_section(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#switch_search_condition_section.
  }, {
    key: "visitSwitch_search_condition_section",
    value: function visitSwitch_search_condition_section(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#as_column_alias.
  }, {
    key: "visitAs_column_alias",
    value: function visitAs_column_alias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#as_table_alias.
  }, {
    key: "visitAs_table_alias",
    value: function visitAs_table_alias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_alias.
  }, {
    key: "visitTable_alias",
    value: function visitTable_alias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#with_table_hints.
  }, {
    key: "visitWith_table_hints",
    value: function visitWith_table_hints(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#deprecated_table_hint.
  }, {
    key: "visitDeprecated_table_hint",
    value: function visitDeprecated_table_hint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#sybase_legacy_hints.
  }, {
    key: "visitSybase_legacy_hints",
    value: function visitSybase_legacy_hints(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#sybase_legacy_hint.
  }, {
    key: "visitSybase_legacy_hint",
    value: function visitSybase_legacy_hint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_hint.
  }, {
    key: "visitTable_hint",
    value: function visitTable_hint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#index_value.
  }, {
    key: "visitIndex_value",
    value: function visitIndex_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_alias_list.
  }, {
    key: "visitColumn_alias_list",
    value: function visitColumn_alias_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_alias.
  }, {
    key: "visitColumn_alias",
    value: function visitColumn_alias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_value_constructor.
  }, {
    key: "visitTable_value_constructor",
    value: function visitTable_value_constructor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#expression_list_.
  }, {
    key: "visitExpression_list_",
    value: function visitExpression_list_(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ranking_windowed_function.
  }, {
    key: "visitRanking_windowed_function",
    value: function visitRanking_windowed_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#aggregate_windowed_function.
  }, {
    key: "visitAggregate_windowed_function",
    value: function visitAggregate_windowed_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#analytic_windowed_function.
  }, {
    key: "visitAnalytic_windowed_function",
    value: function visitAnalytic_windowed_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#all_distinct_expression.
  }, {
    key: "visitAll_distinct_expression",
    value: function visitAll_distinct_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#over_clause.
  }, {
    key: "visitOver_clause",
    value: function visitOver_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#row_or_range_clause.
  }, {
    key: "visitRow_or_range_clause",
    value: function visitRow_or_range_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#window_frame_extent.
  }, {
    key: "visitWindow_frame_extent",
    value: function visitWindow_frame_extent(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#window_frame_bound.
  }, {
    key: "visitWindow_frame_bound",
    value: function visitWindow_frame_bound(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#window_frame_preceding.
  }, {
    key: "visitWindow_frame_preceding",
    value: function visitWindow_frame_preceding(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#window_frame_following.
  }, {
    key: "visitWindow_frame_following",
    value: function visitWindow_frame_following(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#create_database_option.
  }, {
    key: "visitCreate_database_option",
    value: function visitCreate_database_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#database_filestream_option.
  }, {
    key: "visitDatabase_filestream_option",
    value: function visitDatabase_filestream_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#database_file_spec.
  }, {
    key: "visitDatabase_file_spec",
    value: function visitDatabase_file_spec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#file_group.
  }, {
    key: "visitFile_group",
    value: function visitFile_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#file_spec.
  }, {
    key: "visitFile_spec",
    value: function visitFile_spec(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#entity_name.
  }, {
    key: "visitEntity_name",
    value: function visitEntity_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#entity_name_for_azure_dw.
  }, {
    key: "visitEntity_name_for_azure_dw",
    value: function visitEntity_name_for_azure_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#entity_name_for_parallel_dw.
  }, {
    key: "visitEntity_name_for_parallel_dw",
    value: function visitEntity_name_for_parallel_dw(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#full_table_name.
  }, {
    key: "visitFull_table_name",
    value: function visitFull_table_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#table_name.
  }, {
    key: "visitTable_name",
    value: function visitTable_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#simple_name.
  }, {
    key: "visitSimple_name",
    value: function visitSimple_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#func_proc_name_schema.
  }, {
    key: "visitFunc_proc_name_schema",
    value: function visitFunc_proc_name_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#func_proc_name_database_schema.
  }, {
    key: "visitFunc_proc_name_database_schema",
    value: function visitFunc_proc_name_database_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#func_proc_name_server_database_schema.
  }, {
    key: "visitFunc_proc_name_server_database_schema",
    value: function visitFunc_proc_name_server_database_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#ddl_object.
  }, {
    key: "visitDdl_object",
    value: function visitDdl_object(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#full_column_name.
  }, {
    key: "visitFull_column_name",
    value: function visitFull_column_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_name_list_with_order.
  }, {
    key: "visitColumn_name_list_with_order",
    value: function visitColumn_name_list_with_order(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#insert_column_name_list.
  }, {
    key: "visitInsert_column_name_list",
    value: function visitInsert_column_name_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#insert_column_id.
  }, {
    key: "visitInsert_column_id",
    value: function visitInsert_column_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#column_name_list.
  }, {
    key: "visitColumn_name_list",
    value: function visitColumn_name_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#cursor_name.
  }, {
    key: "visitCursor_name",
    value: function visitCursor_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#on_off.
  }, {
    key: "visitOn_off",
    value: function visitOn_off(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#clustered.
  }, {
    key: "visitClustered",
    value: function visitClustered(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#null_notnull.
  }, {
    key: "visitNull_notnull",
    value: function visitNull_notnull(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#scalar_function_name.
  }, {
    key: "visitScalar_function_name",
    value: function visitScalar_function_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#begin_conversation_timer.
  }, {
    key: "visitBegin_conversation_timer",
    value: function visitBegin_conversation_timer(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#begin_conversation_dialog.
  }, {
    key: "visitBegin_conversation_dialog",
    value: function visitBegin_conversation_dialog(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#contract_name.
  }, {
    key: "visitContract_name",
    value: function visitContract_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#service_name.
  }, {
    key: "visitService_name",
    value: function visitService_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#end_conversation.
  }, {
    key: "visitEnd_conversation",
    value: function visitEnd_conversation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#waitfor_conversation.
  }, {
    key: "visitWaitfor_conversation",
    value: function visitWaitfor_conversation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#get_conversation.
  }, {
    key: "visitGet_conversation",
    value: function visitGet_conversation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#queue_id.
  }, {
    key: "visitQueue_id",
    value: function visitQueue_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#send_conversation.
  }, {
    key: "visitSend_conversation",
    value: function visitSend_conversation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#data_type.
  }, {
    key: "visitData_type",
    value: function visitData_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#constant.
  }, {
    key: "visitConstant",
    value: function visitConstant(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#primitive_constant.
  }, {
    key: "visitPrimitive_constant",
    value: function visitPrimitive_constant(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#keyword.
  }, {
    key: "visitKeyword",
    value: function visitKeyword(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#id_.
  }, {
    key: "visitId_",
    value: function visitId_(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#simple_id.
  }, {
    key: "visitSimple_id",
    value: function visitSimple_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#id_or_string.
  }, {
    key: "visitId_or_string",
    value: function visitId_or_string(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#comparison_operator.
  }, {
    key: "visitComparison_operator",
    value: function visitComparison_operator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#assignment_operator.
  }, {
    key: "visitAssignment_operator",
    value: function visitAssignment_operator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by TSqlParser#file_size.
  }, {
    key: "visitFile_size",
    value: function visitFile_size(ctx) {
      return this.visitChildren(ctx);
    }
  }]);
}(_antlr["default"].tree.ParseTreeVisitor);