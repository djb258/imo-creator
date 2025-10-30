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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // Generated from C:/Users/rikim/Desktop/Holistics/dbx/dbml/packages/dbml-core/src/parse/ANTLR/parsers/snowflake/SnowflakeParser.g4 by ANTLR 4.13.1
// jshint ignore: start
// This class defines a complete generic visitor for a parse tree produced by SnowflakeParser.
var SnowflakeParserVisitor = exports["default"] = /*#__PURE__*/function (_antlr4$tree$ParseTre) {
  function SnowflakeParserVisitor() {
    _classCallCheck(this, SnowflakeParserVisitor);
    return _callSuper(this, SnowflakeParserVisitor, arguments);
  }
  _inherits(SnowflakeParserVisitor, _antlr4$tree$ParseTre);
  return _createClass(SnowflakeParserVisitor, [{
    key: "visitSnowflake_file",
    value:
    // Visit a parse tree produced by SnowflakeParser#snowflake_file.
    function visitSnowflake_file(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#batch.
  }, {
    key: "visitBatch",
    value: function visitBatch(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#sql_command.
  }, {
    key: "visitSql_command",
    value: function visitSql_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#ddl_command.
  }, {
    key: "visitDdl_command",
    value: function visitDdl_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#dml_command.
  }, {
    key: "visitDml_command",
    value: function visitDml_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#insert_statement.
  }, {
    key: "visitInsert_statement",
    value: function visitInsert_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#insert_multi_table_statement.
  }, {
    key: "visitInsert_multi_table_statement",
    value: function visitInsert_multi_table_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#into_clause2.
  }, {
    key: "visitInto_clause2",
    value: function visitInto_clause2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#values_list.
  }, {
    key: "visitValues_list",
    value: function visitValues_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#value_item.
  }, {
    key: "visitValue_item",
    value: function visitValue_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#merge_statement.
  }, {
    key: "visitMerge_statement",
    value: function visitMerge_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#merge_matches.
  }, {
    key: "visitMerge_matches",
    value: function visitMerge_matches(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#merge_cond.
  }, {
    key: "visitMerge_cond",
    value: function visitMerge_cond(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#merge_update_delete.
  }, {
    key: "visitMerge_update_delete",
    value: function visitMerge_update_delete(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#merge_insert.
  }, {
    key: "visitMerge_insert",
    value: function visitMerge_insert(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#update_statement.
  }, {
    key: "visitUpdate_statement",
    value: function visitUpdate_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_or_query.
  }, {
    key: "visitTable_or_query",
    value: function visitTable_or_query(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#delete_statement.
  }, {
    key: "visitDelete_statement",
    value: function visitDelete_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#values_builder.
  }, {
    key: "visitValues_builder",
    value: function visitValues_builder(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#other_command.
  }, {
    key: "visitOther_command",
    value: function visitOther_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#begin_txn.
  }, {
    key: "visitBegin_txn",
    value: function visitBegin_txn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#copy_into_table.
  }, {
    key: "visitCopy_into_table",
    value: function visitCopy_into_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#external_location.
  }, {
    key: "visitExternal_location",
    value: function visitExternal_location(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#files.
  }, {
    key: "visitFiles",
    value: function visitFiles(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#file_format.
  }, {
    key: "visitFile_format",
    value: function visitFile_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#format_name.
  }, {
    key: "visitFormat_name",
    value: function visitFormat_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#format_type.
  }, {
    key: "visitFormat_type",
    value: function visitFormat_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_file_format.
  }, {
    key: "visitStage_file_format",
    value: function visitStage_file_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#copy_into_location.
  }, {
    key: "visitCopy_into_location",
    value: function visitCopy_into_location(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#comment.
  }, {
    key: "visitComment",
    value: function visitComment(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#function_signature.
  }, {
    key: "visitFunction_signature",
    value: function visitFunction_signature(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#commit.
  }, {
    key: "visitCommit",
    value: function visitCommit(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#execute_immediate.
  }, {
    key: "visitExecute_immediate",
    value: function visitExecute_immediate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#execute_task.
  }, {
    key: "visitExecute_task",
    value: function visitExecute_task(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#explain.
  }, {
    key: "visitExplain",
    value: function visitExplain(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#parallel.
  }, {
    key: "visitParallel",
    value: function visitParallel(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#get_dml.
  }, {
    key: "visitGet_dml",
    value: function visitGet_dml(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#grant_ownership.
  }, {
    key: "visitGrant_ownership",
    value: function visitGrant_ownership(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#grant_to_role.
  }, {
    key: "visitGrant_to_role",
    value: function visitGrant_to_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#global_privileges.
  }, {
    key: "visitGlobal_privileges",
    value: function visitGlobal_privileges(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#global_privilege.
  }, {
    key: "visitGlobal_privilege",
    value: function visitGlobal_privilege(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#account_object_privileges.
  }, {
    key: "visitAccount_object_privileges",
    value: function visitAccount_object_privileges(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#account_object_privilege.
  }, {
    key: "visitAccount_object_privilege",
    value: function visitAccount_object_privilege(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#schema_privileges.
  }, {
    key: "visitSchema_privileges",
    value: function visitSchema_privileges(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#schema_privilege.
  }, {
    key: "visitSchema_privilege",
    value: function visitSchema_privilege(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#schema_object_privileges.
  }, {
    key: "visitSchema_object_privileges",
    value: function visitSchema_object_privileges(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#schema_object_privilege.
  }, {
    key: "visitSchema_object_privilege",
    value: function visitSchema_object_privilege(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#grant_to_share.
  }, {
    key: "visitGrant_to_share",
    value: function visitGrant_to_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_privilege.
  }, {
    key: "visitObject_privilege",
    value: function visitObject_privilege(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#grant_role.
  }, {
    key: "visitGrant_role",
    value: function visitGrant_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#role_name.
  }, {
    key: "visitRole_name",
    value: function visitRole_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#system_defined_role.
  }, {
    key: "visitSystem_defined_role",
    value: function visitSystem_defined_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#list.
  }, {
    key: "visitList",
    value: function visitList(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#user_stage.
  }, {
    key: "visitUser_stage",
    value: function visitUser_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_stage.
  }, {
    key: "visitTable_stage",
    value: function visitTable_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#named_stage.
  }, {
    key: "visitNamed_stage",
    value: function visitNamed_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_path.
  }, {
    key: "visitStage_path",
    value: function visitStage_path(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#put.
  }, {
    key: "visitPut",
    value: function visitPut(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#remove.
  }, {
    key: "visitRemove",
    value: function visitRemove(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#revoke_from_role.
  }, {
    key: "visitRevoke_from_role",
    value: function visitRevoke_from_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#revoke_from_share.
  }, {
    key: "visitRevoke_from_share",
    value: function visitRevoke_from_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#revoke_role.
  }, {
    key: "visitRevoke_role",
    value: function visitRevoke_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#rollback.
  }, {
    key: "visitRollback",
    value: function visitRollback(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#set.
  }, {
    key: "visitSet",
    value: function visitSet(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#truncate_materialized_view.
  }, {
    key: "visitTruncate_materialized_view",
    value: function visitTruncate_materialized_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#truncate_table.
  }, {
    key: "visitTruncate_table",
    value: function visitTruncate_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#unset.
  }, {
    key: "visitUnset",
    value: function visitUnset(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_command.
  }, {
    key: "visitAlter_command",
    value: function visitAlter_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#account_params.
  }, {
    key: "visitAccount_params",
    value: function visitAccount_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_params.
  }, {
    key: "visitObject_params",
    value: function visitObject_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#default_ddl_collation.
  }, {
    key: "visitDefault_ddl_collation",
    value: function visitDefault_ddl_collation(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_properties.
  }, {
    key: "visitObject_properties",
    value: function visitObject_properties(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#session_params.
  }, {
    key: "visitSession_params",
    value: function visitSession_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_account.
  }, {
    key: "visitAlter_account",
    value: function visitAlter_account(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#enabled_true_false.
  }, {
    key: "visitEnabled_true_false",
    value: function visitEnabled_true_false(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_alert.
  }, {
    key: "visitAlter_alert",
    value: function visitAlter_alert(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#resume_suspend.
  }, {
    key: "visitResume_suspend",
    value: function visitResume_suspend(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alert_set_clause.
  }, {
    key: "visitAlert_set_clause",
    value: function visitAlert_set_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alert_unset_clause.
  }, {
    key: "visitAlert_unset_clause",
    value: function visitAlert_unset_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_api_integration.
  }, {
    key: "visitAlter_api_integration",
    value: function visitAlter_api_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#api_integration_property.
  }, {
    key: "visitApi_integration_property",
    value: function visitApi_integration_property(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_connection.
  }, {
    key: "visitAlter_connection",
    value: function visitAlter_connection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_database.
  }, {
    key: "visitAlter_database",
    value: function visitAlter_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#database_property.
  }, {
    key: "visitDatabase_property",
    value: function visitDatabase_property(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#account_id_list.
  }, {
    key: "visitAccount_id_list",
    value: function visitAccount_id_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_dynamic_table.
  }, {
    key: "visitAlter_dynamic_table",
    value: function visitAlter_dynamic_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_external_table.
  }, {
    key: "visitAlter_external_table",
    value: function visitAlter_external_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#ignore_edition_check.
  }, {
    key: "visitIgnore_edition_check",
    value: function visitIgnore_edition_check(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#replication_schedule.
  }, {
    key: "visitReplication_schedule",
    value: function visitReplication_schedule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#db_name_list.
  }, {
    key: "visitDb_name_list",
    value: function visitDb_name_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#share_name_list.
  }, {
    key: "visitShare_name_list",
    value: function visitShare_name_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#full_acct_list.
  }, {
    key: "visitFull_acct_list",
    value: function visitFull_acct_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_failover_group.
  }, {
    key: "visitAlter_failover_group",
    value: function visitAlter_failover_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_file_format.
  }, {
    key: "visitAlter_file_format",
    value: function visitAlter_file_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_function.
  }, {
    key: "visitAlter_function",
    value: function visitAlter_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_function_signature.
  }, {
    key: "visitAlter_function_signature",
    value: function visitAlter_function_signature(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#data_type_list.
  }, {
    key: "visitData_type_list",
    value: function visitData_type_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_masking_policy.
  }, {
    key: "visitAlter_masking_policy",
    value: function visitAlter_masking_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_materialized_view.
  }, {
    key: "visitAlter_materialized_view",
    value: function visitAlter_materialized_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_network_policy.
  }, {
    key: "visitAlter_network_policy",
    value: function visitAlter_network_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_notification_integration.
  }, {
    key: "visitAlter_notification_integration",
    value: function visitAlter_notification_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_pipe.
  }, {
    key: "visitAlter_pipe",
    value: function visitAlter_pipe(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_procedure.
  }, {
    key: "visitAlter_procedure",
    value: function visitAlter_procedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_replication_group.
  }, {
    key: "visitAlter_replication_group",
    value: function visitAlter_replication_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#credit_quota.
  }, {
    key: "visitCredit_quota",
    value: function visitCredit_quota(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#frequency.
  }, {
    key: "visitFrequency",
    value: function visitFrequency(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#notify_users.
  }, {
    key: "visitNotify_users",
    value: function visitNotify_users(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#triggerDefinition.
  }, {
    key: "visitTriggerDefinition",
    value: function visitTriggerDefinition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_resource_monitor.
  }, {
    key: "visitAlter_resource_monitor",
    value: function visitAlter_resource_monitor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_role.
  }, {
    key: "visitAlter_role",
    value: function visitAlter_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_row_access_policy.
  }, {
    key: "visitAlter_row_access_policy",
    value: function visitAlter_row_access_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_schema.
  }, {
    key: "visitAlter_schema",
    value: function visitAlter_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#schema_property.
  }, {
    key: "visitSchema_property",
    value: function visitSchema_property(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_sequence.
  }, {
    key: "visitAlter_sequence",
    value: function visitAlter_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_security_integration_external_oauth.
  }, {
    key: "visitAlter_security_integration_external_oauth",
    value: function visitAlter_security_integration_external_oauth(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#security_integration_external_oauth_property.
  }, {
    key: "visitSecurity_integration_external_oauth_property",
    value: function visitSecurity_integration_external_oauth_property(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_security_integration_snowflake_oauth.
  }, {
    key: "visitAlter_security_integration_snowflake_oauth",
    value: function visitAlter_security_integration_snowflake_oauth(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#security_integration_snowflake_oauth_property.
  }, {
    key: "visitSecurity_integration_snowflake_oauth_property",
    value: function visitSecurity_integration_snowflake_oauth_property(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_security_integration_saml2.
  }, {
    key: "visitAlter_security_integration_saml2",
    value: function visitAlter_security_integration_saml2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_security_integration_scim.
  }, {
    key: "visitAlter_security_integration_scim",
    value: function visitAlter_security_integration_scim(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#security_integration_scim_property.
  }, {
    key: "visitSecurity_integration_scim_property",
    value: function visitSecurity_integration_scim_property(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_session.
  }, {
    key: "visitAlter_session",
    value: function visitAlter_session(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_session_policy.
  }, {
    key: "visitAlter_session_policy",
    value: function visitAlter_session_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_password_policy.
  }, {
    key: "visitAlter_password_policy",
    value: function visitAlter_password_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_share.
  }, {
    key: "visitAlter_share",
    value: function visitAlter_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_storage_integration.
  }, {
    key: "visitAlter_storage_integration",
    value: function visitAlter_storage_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_stream.
  }, {
    key: "visitAlter_stream",
    value: function visitAlter_stream(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_table.
  }, {
    key: "visitAlter_table",
    value: function visitAlter_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#clustering_action.
  }, {
    key: "visitClustering_action",
    value: function visitClustering_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_column_action.
  }, {
    key: "visitTable_column_action",
    value: function visitTable_column_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_column_clause.
  }, {
    key: "visitAlter_column_clause",
    value: function visitAlter_column_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#inline_constraint.
  }, {
    key: "visitInline_constraint",
    value: function visitInline_constraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#enforced_not_enforced.
  }, {
    key: "visitEnforced_not_enforced",
    value: function visitEnforced_not_enforced(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#deferrable_not_deferrable.
  }, {
    key: "visitDeferrable_not_deferrable",
    value: function visitDeferrable_not_deferrable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#initially_deferred_or_immediate.
  }, {
    key: "visitInitially_deferred_or_immediate",
    value: function visitInitially_deferred_or_immediate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#common_constraint_properties.
  }, {
    key: "visitCommon_constraint_properties",
    value: function visitCommon_constraint_properties(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#on_update.
  }, {
    key: "visitOn_update",
    value: function visitOn_update(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#on_delete.
  }, {
    key: "visitOn_delete",
    value: function visitOn_delete(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#foreign_key_match.
  }, {
    key: "visitForeign_key_match",
    value: function visitForeign_key_match(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#on_action.
  }, {
    key: "visitOn_action",
    value: function visitOn_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#constraint_properties.
  }, {
    key: "visitConstraint_properties",
    value: function visitConstraint_properties(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#ext_table_column_action.
  }, {
    key: "visitExt_table_column_action",
    value: function visitExt_table_column_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#constraint_action.
  }, {
    key: "visitConstraint_action",
    value: function visitConstraint_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#search_optimization_action.
  }, {
    key: "visitSearch_optimization_action",
    value: function visitSearch_optimization_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#search_method_with_target.
  }, {
    key: "visitSearch_method_with_target",
    value: function visitSearch_method_with_target(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_table_alter_column.
  }, {
    key: "visitAlter_table_alter_column",
    value: function visitAlter_table_alter_column(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_column_decl_list.
  }, {
    key: "visitAlter_column_decl_list",
    value: function visitAlter_column_decl_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_column_decl.
  }, {
    key: "visitAlter_column_decl",
    value: function visitAlter_column_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_column_opts.
  }, {
    key: "visitAlter_column_opts",
    value: function visitAlter_column_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_set_tags.
  }, {
    key: "visitColumn_set_tags",
    value: function visitColumn_set_tags(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_unset_tags.
  }, {
    key: "visitColumn_unset_tags",
    value: function visitColumn_unset_tags(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_tag.
  }, {
    key: "visitAlter_tag",
    value: function visitAlter_tag(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_task.
  }, {
    key: "visitAlter_task",
    value: function visitAlter_task(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_user.
  }, {
    key: "visitAlter_user",
    value: function visitAlter_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_view.
  }, {
    key: "visitAlter_view",
    value: function visitAlter_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_modify.
  }, {
    key: "visitAlter_modify",
    value: function visitAlter_modify(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_warehouse.
  }, {
    key: "visitAlter_warehouse",
    value: function visitAlter_warehouse(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_connection_opts.
  }, {
    key: "visitAlter_connection_opts",
    value: function visitAlter_connection_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_user_opts.
  }, {
    key: "visitAlter_user_opts",
    value: function visitAlter_user_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_tag_opts.
  }, {
    key: "visitAlter_tag_opts",
    value: function visitAlter_tag_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_network_policy_opts.
  }, {
    key: "visitAlter_network_policy_opts",
    value: function visitAlter_network_policy_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_warehouse_opts.
  }, {
    key: "visitAlter_warehouse_opts",
    value: function visitAlter_warehouse_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_account_opts.
  }, {
    key: "visitAlter_account_opts",
    value: function visitAlter_account_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#set_tags.
  }, {
    key: "visitSet_tags",
    value: function visitSet_tags(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#tag_decl_list.
  }, {
    key: "visitTag_decl_list",
    value: function visitTag_decl_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#unset_tags.
  }, {
    key: "visitUnset_tags",
    value: function visitUnset_tags(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_command.
  }, {
    key: "visitCreate_command",
    value: function visitCreate_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_account.
  }, {
    key: "visitCreate_account",
    value: function visitCreate_account(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_alert.
  }, {
    key: "visitCreate_alert",
    value: function visitCreate_alert(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alert_condition.
  }, {
    key: "visitAlert_condition",
    value: function visitAlert_condition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alert_action.
  }, {
    key: "visitAlert_action",
    value: function visitAlert_action(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_api_integration.
  }, {
    key: "visitCreate_api_integration",
    value: function visitCreate_api_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_object_clone.
  }, {
    key: "visitCreate_object_clone",
    value: function visitCreate_object_clone(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_connection.
  }, {
    key: "visitCreate_connection",
    value: function visitCreate_connection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_database.
  }, {
    key: "visitCreate_database",
    value: function visitCreate_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#clone_at_before.
  }, {
    key: "visitClone_at_before",
    value: function visitClone_at_before(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#at_before1.
  }, {
    key: "visitAt_before1",
    value: function visitAt_before1(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#header_decl.
  }, {
    key: "visitHeader_decl",
    value: function visitHeader_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#compression_type.
  }, {
    key: "visitCompression_type",
    value: function visitCompression_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#compression.
  }, {
    key: "visitCompression",
    value: function visitCompression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_dynamic_table.
  }, {
    key: "visitCreate_dynamic_table",
    value: function visitCreate_dynamic_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_event_table.
  }, {
    key: "visitCreate_event_table",
    value: function visitCreate_event_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_external_function.
  }, {
    key: "visitCreate_external_function",
    value: function visitCreate_external_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_external_table.
  }, {
    key: "visitCreate_external_table",
    value: function visitCreate_external_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#external_table_column_decl.
  }, {
    key: "visitExternal_table_column_decl",
    value: function visitExternal_table_column_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#external_table_column_decl_list.
  }, {
    key: "visitExternal_table_column_decl_list",
    value: function visitExternal_table_column_decl_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#full_acct.
  }, {
    key: "visitFull_acct",
    value: function visitFull_acct(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#integration_type_name.
  }, {
    key: "visitIntegration_type_name",
    value: function visitIntegration_type_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_failover_group.
  }, {
    key: "visitCreate_failover_group",
    value: function visitCreate_failover_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#type_fileformat.
  }, {
    key: "visitType_fileformat",
    value: function visitType_fileformat(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_file_format.
  }, {
    key: "visitCreate_file_format",
    value: function visitCreate_file_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#arg_decl.
  }, {
    key: "visitArg_decl",
    value: function visitArg_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#arg_default_value_clause.
  }, {
    key: "visitArg_default_value_clause",
    value: function visitArg_default_value_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#col_decl.
  }, {
    key: "visitCol_decl",
    value: function visitCol_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#virtual_column_decl.
  }, {
    key: "visitVirtual_column_decl",
    value: function visitVirtual_column_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#function_definition.
  }, {
    key: "visitFunction_definition",
    value: function visitFunction_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_function.
  }, {
    key: "visitCreate_function",
    value: function visitCreate_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_managed_account.
  }, {
    key: "visitCreate_managed_account",
    value: function visitCreate_managed_account(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_masking_policy.
  }, {
    key: "visitCreate_masking_policy",
    value: function visitCreate_masking_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#tag_decl.
  }, {
    key: "visitTag_decl",
    value: function visitTag_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_list_in_parentheses.
  }, {
    key: "visitColumn_list_in_parentheses",
    value: function visitColumn_list_in_parentheses(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_materialized_view.
  }, {
    key: "visitCreate_materialized_view",
    value: function visitCreate_materialized_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_network_policy.
  }, {
    key: "visitCreate_network_policy",
    value: function visitCreate_network_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cloud_provider_params_auto.
  }, {
    key: "visitCloud_provider_params_auto",
    value: function visitCloud_provider_params_auto(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cloud_provider_params_push.
  }, {
    key: "visitCloud_provider_params_push",
    value: function visitCloud_provider_params_push(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_notification_integration.
  }, {
    key: "visitCreate_notification_integration",
    value: function visitCreate_notification_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_pipe.
  }, {
    key: "visitCreate_pipe",
    value: function visitCreate_pipe(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#caller_owner.
  }, {
    key: "visitCaller_owner",
    value: function visitCaller_owner(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#executa_as.
  }, {
    key: "visitExecuta_as",
    value: function visitExecuta_as(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#procedure_definition.
  }, {
    key: "visitProcedure_definition",
    value: function visitProcedure_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#not_null.
  }, {
    key: "visitNot_null",
    value: function visitNot_null(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_procedure.
  }, {
    key: "visitCreate_procedure",
    value: function visitCreate_procedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_replication_group.
  }, {
    key: "visitCreate_replication_group",
    value: function visitCreate_replication_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_resource_monitor.
  }, {
    key: "visitCreate_resource_monitor",
    value: function visitCreate_resource_monitor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_role.
  }, {
    key: "visitCreate_role",
    value: function visitCreate_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_row_access_policy.
  }, {
    key: "visitCreate_row_access_policy",
    value: function visitCreate_row_access_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_schema.
  }, {
    key: "visitCreate_schema",
    value: function visitCreate_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_security_integration_external_oauth.
  }, {
    key: "visitCreate_security_integration_external_oauth",
    value: function visitCreate_security_integration_external_oauth(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#implicit_none.
  }, {
    key: "visitImplicit_none",
    value: function visitImplicit_none(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_security_integration_snowflake_oauth.
  }, {
    key: "visitCreate_security_integration_snowflake_oauth",
    value: function visitCreate_security_integration_snowflake_oauth(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_security_integration_saml2.
  }, {
    key: "visitCreate_security_integration_saml2",
    value: function visitCreate_security_integration_saml2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_security_integration_scim.
  }, {
    key: "visitCreate_security_integration_scim",
    value: function visitCreate_security_integration_scim(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#network_policy.
  }, {
    key: "visitNetwork_policy",
    value: function visitNetwork_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#partner_application.
  }, {
    key: "visitPartner_application",
    value: function visitPartner_application(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#start_with.
  }, {
    key: "visitStart_with",
    value: function visitStart_with(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#increment_by.
  }, {
    key: "visitIncrement_by",
    value: function visitIncrement_by(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_sequence.
  }, {
    key: "visitCreate_sequence",
    value: function visitCreate_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_session_policy.
  }, {
    key: "visitCreate_session_policy",
    value: function visitCreate_session_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#session_policy_params.
  }, {
    key: "visitSession_policy_params",
    value: function visitSession_policy_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#session_policy_param_name.
  }, {
    key: "visitSession_policy_param_name",
    value: function visitSession_policy_param_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_password_policy.
  }, {
    key: "visitCreate_password_policy",
    value: function visitCreate_password_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#password_policy_params.
  }, {
    key: "visitPassword_policy_params",
    value: function visitPassword_policy_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#password_policy_param_name.
  }, {
    key: "visitPassword_policy_param_name",
    value: function visitPassword_policy_param_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_share.
  }, {
    key: "visitCreate_share",
    value: function visitCreate_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#character.
  }, {
    key: "visitCharacter",
    value: function visitCharacter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#format_type_options.
  }, {
    key: "visitFormat_type_options",
    value: function visitFormat_type_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#copy_options.
  }, {
    key: "visitCopy_options",
    value: function visitCopy_options(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_encryption_opts_internal.
  }, {
    key: "visitStage_encryption_opts_internal",
    value: function visitStage_encryption_opts_internal(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_type.
  }, {
    key: "visitStage_type",
    value: function visitStage_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_master_key.
  }, {
    key: "visitStage_master_key",
    value: function visitStage_master_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_kms_key.
  }, {
    key: "visitStage_kms_key",
    value: function visitStage_kms_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_encryption_opts_aws.
  }, {
    key: "visitStage_encryption_opts_aws",
    value: function visitStage_encryption_opts_aws(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#aws_token.
  }, {
    key: "visitAws_token",
    value: function visitAws_token(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#aws_key_id.
  }, {
    key: "visitAws_key_id",
    value: function visitAws_key_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#aws_secret_key.
  }, {
    key: "visitAws_secret_key",
    value: function visitAws_secret_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#aws_role.
  }, {
    key: "visitAws_role",
    value: function visitAws_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#azure_encryption_value.
  }, {
    key: "visitAzure_encryption_value",
    value: function visitAzure_encryption_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_encryption_opts_az.
  }, {
    key: "visitStage_encryption_opts_az",
    value: function visitStage_encryption_opts_az(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#storage_integration_eq_id.
  }, {
    key: "visitStorage_integration_eq_id",
    value: function visitStorage_integration_eq_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#az_credential_or_storage_integration.
  }, {
    key: "visitAz_credential_or_storage_integration",
    value: function visitAz_credential_or_storage_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#gcp_encryption_value.
  }, {
    key: "visitGcp_encryption_value",
    value: function visitGcp_encryption_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stage_encryption_opts_gcp.
  }, {
    key: "visitStage_encryption_opts_gcp",
    value: function visitStage_encryption_opts_gcp(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#aws_credential_or_storage_integration.
  }, {
    key: "visitAws_credential_or_storage_integration",
    value: function visitAws_credential_or_storage_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#external_stage_params.
  }, {
    key: "visitExternal_stage_params",
    value: function visitExternal_stage_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#true_false.
  }, {
    key: "visitTrue_false",
    value: function visitTrue_false(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#enable.
  }, {
    key: "visitEnable",
    value: function visitEnable(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#refresh_on_create.
  }, {
    key: "visitRefresh_on_create",
    value: function visitRefresh_on_create(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#auto_refresh.
  }, {
    key: "visitAuto_refresh",
    value: function visitAuto_refresh(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#notification_integration.
  }, {
    key: "visitNotification_integration",
    value: function visitNotification_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#directory_table_internal_params.
  }, {
    key: "visitDirectory_table_internal_params",
    value: function visitDirectory_table_internal_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#directory_table_external_params.
  }, {
    key: "visitDirectory_table_external_params",
    value: function visitDirectory_table_external_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_stage.
  }, {
    key: "visitCreate_stage",
    value: function visitCreate_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alter_stage.
  }, {
    key: "visitAlter_stage",
    value: function visitAlter_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_stage.
  }, {
    key: "visitDrop_stage",
    value: function visitDrop_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_stage.
  }, {
    key: "visitDescribe_stage",
    value: function visitDescribe_stage(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_stages.
  }, {
    key: "visitShow_stages",
    value: function visitShow_stages(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cloud_provider_params.
  }, {
    key: "visitCloud_provider_params",
    value: function visitCloud_provider_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cloud_provider_params2.
  }, {
    key: "visitCloud_provider_params2",
    value: function visitCloud_provider_params2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cloud_provider_params3.
  }, {
    key: "visitCloud_provider_params3",
    value: function visitCloud_provider_params3(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_storage_integration.
  }, {
    key: "visitCreate_storage_integration",
    value: function visitCreate_storage_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#copy_grants.
  }, {
    key: "visitCopy_grants",
    value: function visitCopy_grants(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#append_only.
  }, {
    key: "visitAppend_only",
    value: function visitAppend_only(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#insert_only.
  }, {
    key: "visitInsert_only",
    value: function visitInsert_only(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_initial_rows.
  }, {
    key: "visitShow_initial_rows",
    value: function visitShow_initial_rows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#stream_time.
  }, {
    key: "visitStream_time",
    value: function visitStream_time(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_stream.
  }, {
    key: "visitCreate_stream",
    value: function visitCreate_stream(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#temporary.
  }, {
    key: "visitTemporary",
    value: function visitTemporary(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_type.
  }, {
    key: "visitTable_type",
    value: function visitTable_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#with_tags.
  }, {
    key: "visitWith_tags",
    value: function visitWith_tags(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#with_row_access_policy.
  }, {
    key: "visitWith_row_access_policy",
    value: function visitWith_row_access_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cluster_by.
  }, {
    key: "visitCluster_by",
    value: function visitCluster_by(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#change_tracking.
  }, {
    key: "visitChange_tracking",
    value: function visitChange_tracking(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#with_masking_policy.
  }, {
    key: "visitWith_masking_policy",
    value: function visitWith_masking_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#collate.
  }, {
    key: "visitCollate",
    value: function visitCollate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#order_noorder.
  }, {
    key: "visitOrder_noorder",
    value: function visitOrder_noorder(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#default_value.
  }, {
    key: "visitDefault_value",
    value: function visitDefault_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#foreign_key.
  }, {
    key: "visitForeign_key",
    value: function visitForeign_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#primary_key.
  }, {
    key: "visitPrimary_key",
    value: function visitPrimary_key(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#out_of_line_constraint.
  }, {
    key: "visitOut_of_line_constraint",
    value: function visitOut_of_line_constraint(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#full_col_decl.
  }, {
    key: "visitFull_col_decl",
    value: function visitFull_col_decl(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_decl_item.
  }, {
    key: "visitColumn_decl_item",
    value: function visitColumn_decl_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_decl_item_list.
  }, {
    key: "visitColumn_decl_item_list",
    value: function visitColumn_decl_item_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_table.
  }, {
    key: "visitCreate_table",
    value: function visitCreate_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_decl_item_list_paren.
  }, {
    key: "visitColumn_decl_item_list_paren",
    value: function visitColumn_decl_item_list_paren(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_table_clause.
  }, {
    key: "visitCreate_table_clause",
    value: function visitCreate_table_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_table_as_select.
  }, {
    key: "visitCreate_table_as_select",
    value: function visitCreate_table_as_select(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_table_like.
  }, {
    key: "visitCreate_table_like",
    value: function visitCreate_table_like(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_tag.
  }, {
    key: "visitCreate_tag",
    value: function visitCreate_tag(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#tag_allowed_values.
  }, {
    key: "visitTag_allowed_values",
    value: function visitTag_allowed_values(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#session_parameter.
  }, {
    key: "visitSession_parameter",
    value: function visitSession_parameter(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#session_parameter_list.
  }, {
    key: "visitSession_parameter_list",
    value: function visitSession_parameter_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#session_params_list.
  }, {
    key: "visitSession_params_list",
    value: function visitSession_params_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_task.
  }, {
    key: "visitCreate_task",
    value: function visitCreate_task(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_parameters.
  }, {
    key: "visitTask_parameters",
    value: function visitTask_parameters(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_compute.
  }, {
    key: "visitTask_compute",
    value: function visitTask_compute(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_schedule.
  }, {
    key: "visitTask_schedule",
    value: function visitTask_schedule(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_timeout.
  }, {
    key: "visitTask_timeout",
    value: function visitTask_timeout(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_suspend_after_failure_number.
  }, {
    key: "visitTask_suspend_after_failure_number",
    value: function visitTask_suspend_after_failure_number(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_error_integration.
  }, {
    key: "visitTask_error_integration",
    value: function visitTask_error_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#task_overlap.
  }, {
    key: "visitTask_overlap",
    value: function visitTask_overlap(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#sql.
  }, {
    key: "visitSql",
    value: function visitSql(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#call.
  }, {
    key: "visitCall",
    value: function visitCall(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_user.
  }, {
    key: "visitCreate_user",
    value: function visitCreate_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#view_col.
  }, {
    key: "visitView_col",
    value: function visitView_col(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_view.
  }, {
    key: "visitCreate_view",
    value: function visitCreate_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#create_warehouse.
  }, {
    key: "visitCreate_warehouse",
    value: function visitCreate_warehouse(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#wh_common_size.
  }, {
    key: "visitWh_common_size",
    value: function visitWh_common_size(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#wh_extra_size.
  }, {
    key: "visitWh_extra_size",
    value: function visitWh_extra_size(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#wh_properties.
  }, {
    key: "visitWh_properties",
    value: function visitWh_properties(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#wh_params.
  }, {
    key: "visitWh_params",
    value: function visitWh_params(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#trigger_definition.
  }, {
    key: "visitTrigger_definition",
    value: function visitTrigger_definition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_type_name.
  }, {
    key: "visitObject_type_name",
    value: function visitObject_type_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_type_plural.
  }, {
    key: "visitObject_type_plural",
    value: function visitObject_type_plural(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_command.
  }, {
    key: "visitDrop_command",
    value: function visitDrop_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_object.
  }, {
    key: "visitDrop_object",
    value: function visitDrop_object(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_alert.
  }, {
    key: "visitDrop_alert",
    value: function visitDrop_alert(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_connection.
  }, {
    key: "visitDrop_connection",
    value: function visitDrop_connection(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_database.
  }, {
    key: "visitDrop_database",
    value: function visitDrop_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_dynamic_table.
  }, {
    key: "visitDrop_dynamic_table",
    value: function visitDrop_dynamic_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_external_table.
  }, {
    key: "visitDrop_external_table",
    value: function visitDrop_external_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_failover_group.
  }, {
    key: "visitDrop_failover_group",
    value: function visitDrop_failover_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_file_format.
  }, {
    key: "visitDrop_file_format",
    value: function visitDrop_file_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_function.
  }, {
    key: "visitDrop_function",
    value: function visitDrop_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_integration.
  }, {
    key: "visitDrop_integration",
    value: function visitDrop_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_managed_account.
  }, {
    key: "visitDrop_managed_account",
    value: function visitDrop_managed_account(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_masking_policy.
  }, {
    key: "visitDrop_masking_policy",
    value: function visitDrop_masking_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_materialized_view.
  }, {
    key: "visitDrop_materialized_view",
    value: function visitDrop_materialized_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_network_policy.
  }, {
    key: "visitDrop_network_policy",
    value: function visitDrop_network_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_pipe.
  }, {
    key: "visitDrop_pipe",
    value: function visitDrop_pipe(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_procedure.
  }, {
    key: "visitDrop_procedure",
    value: function visitDrop_procedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_replication_group.
  }, {
    key: "visitDrop_replication_group",
    value: function visitDrop_replication_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_resource_monitor.
  }, {
    key: "visitDrop_resource_monitor",
    value: function visitDrop_resource_monitor(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_role.
  }, {
    key: "visitDrop_role",
    value: function visitDrop_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_row_access_policy.
  }, {
    key: "visitDrop_row_access_policy",
    value: function visitDrop_row_access_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_schema.
  }, {
    key: "visitDrop_schema",
    value: function visitDrop_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_sequence.
  }, {
    key: "visitDrop_sequence",
    value: function visitDrop_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_session_policy.
  }, {
    key: "visitDrop_session_policy",
    value: function visitDrop_session_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_password_policy.
  }, {
    key: "visitDrop_password_policy",
    value: function visitDrop_password_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_share.
  }, {
    key: "visitDrop_share",
    value: function visitDrop_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_stream.
  }, {
    key: "visitDrop_stream",
    value: function visitDrop_stream(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_table.
  }, {
    key: "visitDrop_table",
    value: function visitDrop_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_tag.
  }, {
    key: "visitDrop_tag",
    value: function visitDrop_tag(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_task.
  }, {
    key: "visitDrop_task",
    value: function visitDrop_task(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_user.
  }, {
    key: "visitDrop_user",
    value: function visitDrop_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_view.
  }, {
    key: "visitDrop_view",
    value: function visitDrop_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#drop_warehouse.
  }, {
    key: "visitDrop_warehouse",
    value: function visitDrop_warehouse(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cascade_restrict.
  }, {
    key: "visitCascade_restrict",
    value: function visitCascade_restrict(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#arg_types.
  }, {
    key: "visitArg_types",
    value: function visitArg_types(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#undrop_command.
  }, {
    key: "visitUndrop_command",
    value: function visitUndrop_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#undrop_database.
  }, {
    key: "visitUndrop_database",
    value: function visitUndrop_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#undrop_schema.
  }, {
    key: "visitUndrop_schema",
    value: function visitUndrop_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#undrop_table.
  }, {
    key: "visitUndrop_table",
    value: function visitUndrop_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#undrop_tag.
  }, {
    key: "visitUndrop_tag",
    value: function visitUndrop_tag(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#use_command.
  }, {
    key: "visitUse_command",
    value: function visitUse_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#use_database.
  }, {
    key: "visitUse_database",
    value: function visitUse_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#use_role.
  }, {
    key: "visitUse_role",
    value: function visitUse_role(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#use_schema.
  }, {
    key: "visitUse_schema",
    value: function visitUse_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#use_secondary_roles.
  }, {
    key: "visitUse_secondary_roles",
    value: function visitUse_secondary_roles(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#use_warehouse.
  }, {
    key: "visitUse_warehouse",
    value: function visitUse_warehouse(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#comment_clause.
  }, {
    key: "visitComment_clause",
    value: function visitComment_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#if_suspended.
  }, {
    key: "visitIf_suspended",
    value: function visitIf_suspended(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#if_exists.
  }, {
    key: "visitIf_exists",
    value: function visitIf_exists(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#if_not_exists.
  }, {
    key: "visitIf_not_exists",
    value: function visitIf_not_exists(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#or_replace.
  }, {
    key: "visitOr_replace",
    value: function visitOr_replace(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe.
  }, {
    key: "visitDescribe",
    value: function visitDescribe(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_command.
  }, {
    key: "visitDescribe_command",
    value: function visitDescribe_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_alert.
  }, {
    key: "visitDescribe_alert",
    value: function visitDescribe_alert(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_database.
  }, {
    key: "visitDescribe_database",
    value: function visitDescribe_database(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_dynamic_table.
  }, {
    key: "visitDescribe_dynamic_table",
    value: function visitDescribe_dynamic_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_event_table.
  }, {
    key: "visitDescribe_event_table",
    value: function visitDescribe_event_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_external_table.
  }, {
    key: "visitDescribe_external_table",
    value: function visitDescribe_external_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_file_format.
  }, {
    key: "visitDescribe_file_format",
    value: function visitDescribe_file_format(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_function.
  }, {
    key: "visitDescribe_function",
    value: function visitDescribe_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_integration.
  }, {
    key: "visitDescribe_integration",
    value: function visitDescribe_integration(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_masking_policy.
  }, {
    key: "visitDescribe_masking_policy",
    value: function visitDescribe_masking_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_materialized_view.
  }, {
    key: "visitDescribe_materialized_view",
    value: function visitDescribe_materialized_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_network_policy.
  }, {
    key: "visitDescribe_network_policy",
    value: function visitDescribe_network_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_pipe.
  }, {
    key: "visitDescribe_pipe",
    value: function visitDescribe_pipe(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_procedure.
  }, {
    key: "visitDescribe_procedure",
    value: function visitDescribe_procedure(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_result.
  }, {
    key: "visitDescribe_result",
    value: function visitDescribe_result(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_row_access_policy.
  }, {
    key: "visitDescribe_row_access_policy",
    value: function visitDescribe_row_access_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_schema.
  }, {
    key: "visitDescribe_schema",
    value: function visitDescribe_schema(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_search_optimization.
  }, {
    key: "visitDescribe_search_optimization",
    value: function visitDescribe_search_optimization(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_sequence.
  }, {
    key: "visitDescribe_sequence",
    value: function visitDescribe_sequence(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_session_policy.
  }, {
    key: "visitDescribe_session_policy",
    value: function visitDescribe_session_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_password_policy.
  }, {
    key: "visitDescribe_password_policy",
    value: function visitDescribe_password_policy(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_share.
  }, {
    key: "visitDescribe_share",
    value: function visitDescribe_share(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_stream.
  }, {
    key: "visitDescribe_stream",
    value: function visitDescribe_stream(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_table.
  }, {
    key: "visitDescribe_table",
    value: function visitDescribe_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_task.
  }, {
    key: "visitDescribe_task",
    value: function visitDescribe_task(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_transaction.
  }, {
    key: "visitDescribe_transaction",
    value: function visitDescribe_transaction(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_user.
  }, {
    key: "visitDescribe_user",
    value: function visitDescribe_user(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_view.
  }, {
    key: "visitDescribe_view",
    value: function visitDescribe_view(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#describe_warehouse.
  }, {
    key: "visitDescribe_warehouse",
    value: function visitDescribe_warehouse(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_command.
  }, {
    key: "visitShow_command",
    value: function visitShow_command(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_alerts.
  }, {
    key: "visitShow_alerts",
    value: function visitShow_alerts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_channels.
  }, {
    key: "visitShow_channels",
    value: function visitShow_channels(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_columns.
  }, {
    key: "visitShow_columns",
    value: function visitShow_columns(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_connections.
  }, {
    key: "visitShow_connections",
    value: function visitShow_connections(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#starts_with.
  }, {
    key: "visitStarts_with",
    value: function visitStarts_with(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#limit_rows.
  }, {
    key: "visitLimit_rows",
    value: function visitLimit_rows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_databases.
  }, {
    key: "visitShow_databases",
    value: function visitShow_databases(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_databases_in_failover_group.
  }, {
    key: "visitShow_databases_in_failover_group",
    value: function visitShow_databases_in_failover_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_databases_in_replication_group.
  }, {
    key: "visitShow_databases_in_replication_group",
    value: function visitShow_databases_in_replication_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_delegated_authorizations.
  }, {
    key: "visitShow_delegated_authorizations",
    value: function visitShow_delegated_authorizations(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_dynamic_tables.
  }, {
    key: "visitShow_dynamic_tables",
    value: function visitShow_dynamic_tables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_event_tables.
  }, {
    key: "visitShow_event_tables",
    value: function visitShow_event_tables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_external_functions.
  }, {
    key: "visitShow_external_functions",
    value: function visitShow_external_functions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_external_tables.
  }, {
    key: "visitShow_external_tables",
    value: function visitShow_external_tables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_failover_groups.
  }, {
    key: "visitShow_failover_groups",
    value: function visitShow_failover_groups(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_file_formats.
  }, {
    key: "visitShow_file_formats",
    value: function visitShow_file_formats(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_functions.
  }, {
    key: "visitShow_functions",
    value: function visitShow_functions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_global_accounts.
  }, {
    key: "visitShow_global_accounts",
    value: function visitShow_global_accounts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_grants.
  }, {
    key: "visitShow_grants",
    value: function visitShow_grants(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_grants_opts.
  }, {
    key: "visitShow_grants_opts",
    value: function visitShow_grants_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_integrations.
  }, {
    key: "visitShow_integrations",
    value: function visitShow_integrations(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_locks.
  }, {
    key: "visitShow_locks",
    value: function visitShow_locks(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_managed_accounts.
  }, {
    key: "visitShow_managed_accounts",
    value: function visitShow_managed_accounts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_masking_policies.
  }, {
    key: "visitShow_masking_policies",
    value: function visitShow_masking_policies(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#in_obj.
  }, {
    key: "visitIn_obj",
    value: function visitIn_obj(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#in_obj_2.
  }, {
    key: "visitIn_obj_2",
    value: function visitIn_obj_2(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_materialized_views.
  }, {
    key: "visitShow_materialized_views",
    value: function visitShow_materialized_views(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_network_policies.
  }, {
    key: "visitShow_network_policies",
    value: function visitShow_network_policies(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_objects.
  }, {
    key: "visitShow_objects",
    value: function visitShow_objects(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_organization_accounts.
  }, {
    key: "visitShow_organization_accounts",
    value: function visitShow_organization_accounts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#in_for.
  }, {
    key: "visitIn_for",
    value: function visitIn_for(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_parameters.
  }, {
    key: "visitShow_parameters",
    value: function visitShow_parameters(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_pipes.
  }, {
    key: "visitShow_pipes",
    value: function visitShow_pipes(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_primary_keys.
  }, {
    key: "visitShow_primary_keys",
    value: function visitShow_primary_keys(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_procedures.
  }, {
    key: "visitShow_procedures",
    value: function visitShow_procedures(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_regions.
  }, {
    key: "visitShow_regions",
    value: function visitShow_regions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_replication_accounts.
  }, {
    key: "visitShow_replication_accounts",
    value: function visitShow_replication_accounts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_replication_databases.
  }, {
    key: "visitShow_replication_databases",
    value: function visitShow_replication_databases(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_replication_groups.
  }, {
    key: "visitShow_replication_groups",
    value: function visitShow_replication_groups(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_resource_monitors.
  }, {
    key: "visitShow_resource_monitors",
    value: function visitShow_resource_monitors(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_roles.
  }, {
    key: "visitShow_roles",
    value: function visitShow_roles(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_row_access_policies.
  }, {
    key: "visitShow_row_access_policies",
    value: function visitShow_row_access_policies(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_schemas.
  }, {
    key: "visitShow_schemas",
    value: function visitShow_schemas(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_sequences.
  }, {
    key: "visitShow_sequences",
    value: function visitShow_sequences(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_session_policies.
  }, {
    key: "visitShow_session_policies",
    value: function visitShow_session_policies(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_password_policies.
  }, {
    key: "visitShow_password_policies",
    value: function visitShow_password_policies(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_shares.
  }, {
    key: "visitShow_shares",
    value: function visitShow_shares(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_shares_in_failover_group.
  }, {
    key: "visitShow_shares_in_failover_group",
    value: function visitShow_shares_in_failover_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_shares_in_replication_group.
  }, {
    key: "visitShow_shares_in_replication_group",
    value: function visitShow_shares_in_replication_group(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_streams.
  }, {
    key: "visitShow_streams",
    value: function visitShow_streams(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_tables.
  }, {
    key: "visitShow_tables",
    value: function visitShow_tables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_tags.
  }, {
    key: "visitShow_tags",
    value: function visitShow_tags(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_tasks.
  }, {
    key: "visitShow_tasks",
    value: function visitShow_tasks(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_transactions.
  }, {
    key: "visitShow_transactions",
    value: function visitShow_transactions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_user_functions.
  }, {
    key: "visitShow_user_functions",
    value: function visitShow_user_functions(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_users.
  }, {
    key: "visitShow_users",
    value: function visitShow_users(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_variables.
  }, {
    key: "visitShow_variables",
    value: function visitShow_variables(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_views.
  }, {
    key: "visitShow_views",
    value: function visitShow_views(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#show_warehouses.
  }, {
    key: "visitShow_warehouses",
    value: function visitShow_warehouses(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#like_pattern.
  }, {
    key: "visitLike_pattern",
    value: function visitLike_pattern(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#account_identifier.
  }, {
    key: "visitAccount_identifier",
    value: function visitAccount_identifier(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#schema_name.
  }, {
    key: "visitSchema_name",
    value: function visitSchema_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_type.
  }, {
    key: "visitObject_type",
    value: function visitObject_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_type_list.
  }, {
    key: "visitObject_type_list",
    value: function visitObject_type_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#tag_value.
  }, {
    key: "visitTag_value",
    value: function visitTag_value(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#arg_data_type.
  }, {
    key: "visitArg_data_type",
    value: function visitArg_data_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#arg_name.
  }, {
    key: "visitArg_name",
    value: function visitArg_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#param_name.
  }, {
    key: "visitParam_name",
    value: function visitParam_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#region_group_id.
  }, {
    key: "visitRegion_group_id",
    value: function visitRegion_group_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#snowflake_region_id.
  }, {
    key: "visitSnowflake_region_id",
    value: function visitSnowflake_region_id(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#string.
  }, {
    key: "visitString",
    value: function visitString(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#string_list.
  }, {
    key: "visitString_list",
    value: function visitString_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#id_fn.
  }, {
    key: "visitId_fn",
    value: function visitId_fn(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#id_.
  }, {
    key: "visitId_",
    value: function visitId_(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#keyword.
  }, {
    key: "visitKeyword",
    value: function visitKeyword(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#non_reserved_words.
  }, {
    key: "visitNon_reserved_words",
    value: function visitNon_reserved_words(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#builtin_function.
  }, {
    key: "visitBuiltin_function",
    value: function visitBuiltin_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#unary_or_binary_builtin_function.
  }, {
    key: "visitUnary_or_binary_builtin_function",
    value: function visitUnary_or_binary_builtin_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#binary_builtin_function.
  }, {
    key: "visitBinary_builtin_function",
    value: function visitBinary_builtin_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#binary_or_ternary_builtin_function.
  }, {
    key: "visitBinary_or_ternary_builtin_function",
    value: function visitBinary_or_ternary_builtin_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#ternary_builtin_function.
  }, {
    key: "visitTernary_builtin_function",
    value: function visitTernary_builtin_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#list_function.
  }, {
    key: "visitList_function",
    value: function visitList_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#pattern.
  }, {
    key: "visitPattern",
    value: function visitPattern(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_name.
  }, {
    key: "visitColumn_name",
    value: function visitColumn_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_list.
  }, {
    key: "visitColumn_list",
    value: function visitColumn_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_list_with_comment.
  }, {
    key: "visitColumn_list_with_comment",
    value: function visitColumn_list_with_comment(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_name.
  }, {
    key: "visitObject_name",
    value: function visitObject_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_name_or_identifier.
  }, {
    key: "visitObject_name_or_identifier",
    value: function visitObject_name_or_identifier(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#num.
  }, {
    key: "visitNum",
    value: function visitNum(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#expr_list.
  }, {
    key: "visitExpr_list",
    value: function visitExpr_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#expr_list_sorted.
  }, {
    key: "visitExpr_list_sorted",
    value: function visitExpr_list_sorted(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#expr.
  }, {
    key: "visitExpr",
    value: function visitExpr(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#iff_expr.
  }, {
    key: "visitIff_expr",
    value: function visitIff_expr(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#trim_expression.
  }, {
    key: "visitTrim_expression",
    value: function visitTrim_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#try_cast_expr.
  }, {
    key: "visitTry_cast_expr",
    value: function visitTry_cast_expr(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#cast_expr.
  }, {
    key: "visitCast_expr",
    value: function visitCast_expr(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#json_literal.
  }, {
    key: "visitJson_literal",
    value: function visitJson_literal(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#kv_pair.
  }, {
    key: "visitKv_pair",
    value: function visitKv_pair(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#value.
  }, {
    key: "visitValue",
    value: function visitValue(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#arr_literal.
  }, {
    key: "visitArr_literal",
    value: function visitArr_literal(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#data_type_size.
  }, {
    key: "visitData_type_size",
    value: function visitData_type_size(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#data_type.
  }, {
    key: "visitData_type",
    value: function visitData_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#primitive_expression.
  }, {
    key: "visitPrimitive_expression",
    value: function visitPrimitive_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#order_by_expr.
  }, {
    key: "visitOrder_by_expr",
    value: function visitOrder_by_expr(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#asc_desc.
  }, {
    key: "visitAsc_desc",
    value: function visitAsc_desc(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#over_clause.
  }, {
    key: "visitOver_clause",
    value: function visitOver_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#function_call.
  }, {
    key: "visitFunction_call",
    value: function visitFunction_call(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#param_assoc_list.
  }, {
    key: "visitParam_assoc_list",
    value: function visitParam_assoc_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#param_assoc.
  }, {
    key: "visitParam_assoc",
    value: function visitParam_assoc(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#ignore_or_repect_nulls.
  }, {
    key: "visitIgnore_or_repect_nulls",
    value: function visitIgnore_or_repect_nulls(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#ranking_windowed_function.
  }, {
    key: "visitRanking_windowed_function",
    value: function visitRanking_windowed_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#aggregate_function.
  }, {
    key: "visitAggregate_function",
    value: function visitAggregate_function(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#literal.
  }, {
    key: "visitLiteral",
    value: function visitLiteral(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#sign.
  }, {
    key: "visitSign",
    value: function visitSign(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#full_column_name.
  }, {
    key: "visitFull_column_name",
    value: function visitFull_column_name(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#bracket_expression.
  }, {
    key: "visitBracket_expression",
    value: function visitBracket_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#case_expression.
  }, {
    key: "visitCase_expression",
    value: function visitCase_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#switch_search_condition_section.
  }, {
    key: "visitSwitch_search_condition_section",
    value: function visitSwitch_search_condition_section(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#switch_section.
  }, {
    key: "visitSwitch_section",
    value: function visitSwitch_section(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#query_statement.
  }, {
    key: "visitQuery_statement",
    value: function visitQuery_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#with_expression.
  }, {
    key: "visitWith_expression",
    value: function visitWith_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#common_table_expression.
  }, {
    key: "visitCommon_table_expression",
    value: function visitCommon_table_expression(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_statement.
  }, {
    key: "visitSelect_statement",
    value: function visitSelect_statement(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#set_operators.
  }, {
    key: "visitSet_operators",
    value: function visitSet_operators(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_optional_clauses.
  }, {
    key: "visitSelect_optional_clauses",
    value: function visitSelect_optional_clauses(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_clause.
  }, {
    key: "visitSelect_clause",
    value: function visitSelect_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_top_clause.
  }, {
    key: "visitSelect_top_clause",
    value: function visitSelect_top_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_list_no_top.
  }, {
    key: "visitSelect_list_no_top",
    value: function visitSelect_list_no_top(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_list_top.
  }, {
    key: "visitSelect_list_top",
    value: function visitSelect_list_top(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_list.
  }, {
    key: "visitSelect_list",
    value: function visitSelect_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#select_list_elem.
  }, {
    key: "visitSelect_list_elem",
    value: function visitSelect_list_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_elem_star.
  }, {
    key: "visitColumn_elem_star",
    value: function visitColumn_elem_star(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_elem.
  }, {
    key: "visitColumn_elem",
    value: function visitColumn_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_name_or_alias.
  }, {
    key: "visitObject_name_or_alias",
    value: function visitObject_name_or_alias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#as_alias.
  }, {
    key: "visitAs_alias",
    value: function visitAs_alias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#expression_elem.
  }, {
    key: "visitExpression_elem",
    value: function visitExpression_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_position.
  }, {
    key: "visitColumn_position",
    value: function visitColumn_position(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#all_distinct.
  }, {
    key: "visitAll_distinct",
    value: function visitAll_distinct(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#top_clause.
  }, {
    key: "visitTop_clause",
    value: function visitTop_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#into_clause.
  }, {
    key: "visitInto_clause",
    value: function visitInto_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#var_list.
  }, {
    key: "visitVar_list",
    value: function visitVar_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#var.
  }, {
    key: "visitVar",
    value: function visitVar(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#from_clause.
  }, {
    key: "visitFrom_clause",
    value: function visitFrom_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_sources.
  }, {
    key: "visitTable_sources",
    value: function visitTable_sources(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_source.
  }, {
    key: "visitTable_source",
    value: function visitTable_source(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#table_source_item_joined.
  }, {
    key: "visitTable_source_item_joined",
    value: function visitTable_source_item_joined(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#object_ref.
  }, {
    key: "visitObject_ref",
    value: function visitObject_ref(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#flatten_table_option.
  }, {
    key: "visitFlatten_table_option",
    value: function visitFlatten_table_option(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#flatten_table.
  }, {
    key: "visitFlatten_table",
    value: function visitFlatten_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#splited_table.
  }, {
    key: "visitSplited_table",
    value: function visitSplited_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#prior_list.
  }, {
    key: "visitPrior_list",
    value: function visitPrior_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#prior_item.
  }, {
    key: "visitPrior_item",
    value: function visitPrior_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#outer_join.
  }, {
    key: "visitOuter_join",
    value: function visitOuter_join(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#join_type.
  }, {
    key: "visitJoin_type",
    value: function visitJoin_type(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#join_clause.
  }, {
    key: "visitJoin_clause",
    value: function visitJoin_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#at_before.
  }, {
    key: "visitAt_before",
    value: function visitAt_before(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#end.
  }, {
    key: "visitEnd",
    value: function visitEnd(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#changes.
  }, {
    key: "visitChanges",
    value: function visitChanges(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#default_append_only.
  }, {
    key: "visitDefault_append_only",
    value: function visitDefault_append_only(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#partition_by.
  }, {
    key: "visitPartition_by",
    value: function visitPartition_by(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#alias.
  }, {
    key: "visitAlias",
    value: function visitAlias(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#expr_alias_list.
  }, {
    key: "visitExpr_alias_list",
    value: function visitExpr_alias_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#measures.
  }, {
    key: "visitMeasures",
    value: function visitMeasures(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#match_opts.
  }, {
    key: "visitMatch_opts",
    value: function visitMatch_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#row_match.
  }, {
    key: "visitRow_match",
    value: function visitRow_match(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#first_last.
  }, {
    key: "visitFirst_last",
    value: function visitFirst_last(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#symbol.
  }, {
    key: "visitSymbol",
    value: function visitSymbol(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#after_match.
  }, {
    key: "visitAfter_match",
    value: function visitAfter_match(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#symbol_list.
  }, {
    key: "visitSymbol_list",
    value: function visitSymbol_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#define.
  }, {
    key: "visitDefine",
    value: function visitDefine(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#match_recognize.
  }, {
    key: "visitMatch_recognize",
    value: function visitMatch_recognize(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#pivot_unpivot.
  }, {
    key: "visitPivot_unpivot",
    value: function visitPivot_unpivot(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#column_alias_list_in_brackets.
  }, {
    key: "visitColumn_alias_list_in_brackets",
    value: function visitColumn_alias_list_in_brackets(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#expr_list_in_parentheses.
  }, {
    key: "visitExpr_list_in_parentheses",
    value: function visitExpr_list_in_parentheses(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#values_table.
  }, {
    key: "visitValues_table",
    value: function visitValues_table(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#values_table_body.
  }, {
    key: "visitValues_table_body",
    value: function visitValues_table_body(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#sample_method.
  }, {
    key: "visitSample_method",
    value: function visitSample_method(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#repeatable_seed.
  }, {
    key: "visitRepeatable_seed",
    value: function visitRepeatable_seed(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#sample_opts.
  }, {
    key: "visitSample_opts",
    value: function visitSample_opts(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#sample.
  }, {
    key: "visitSample",
    value: function visitSample(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#search_condition.
  }, {
    key: "visitSearch_condition",
    value: function visitSearch_condition(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#comparison_operator.
  }, {
    key: "visitComparison_operator",
    value: function visitComparison_operator(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#null_not_null.
  }, {
    key: "visitNull_not_null",
    value: function visitNull_not_null(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#subquery.
  }, {
    key: "visitSubquery",
    value: function visitSubquery(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#predicate.
  }, {
    key: "visitPredicate",
    value: function visitPredicate(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#where_clause.
  }, {
    key: "visitWhere_clause",
    value: function visitWhere_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#group_by_elem.
  }, {
    key: "visitGroup_by_elem",
    value: function visitGroup_by_elem(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#group_by_list.
  }, {
    key: "visitGroup_by_list",
    value: function visitGroup_by_list(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#group_by_clause.
  }, {
    key: "visitGroup_by_clause",
    value: function visitGroup_by_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#having_clause.
  }, {
    key: "visitHaving_clause",
    value: function visitHaving_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#qualify_clause.
  }, {
    key: "visitQualify_clause",
    value: function visitQualify_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#order_item.
  }, {
    key: "visitOrder_item",
    value: function visitOrder_item(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#order_by_clause.
  }, {
    key: "visitOrder_by_clause",
    value: function visitOrder_by_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#row_rows.
  }, {
    key: "visitRow_rows",
    value: function visitRow_rows(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#first_next.
  }, {
    key: "visitFirst_next",
    value: function visitFirst_next(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#limit_clause.
  }, {
    key: "visitLimit_clause",
    value: function visitLimit_clause(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#round_mode.
  }, {
    key: "visitRound_mode",
    value: function visitRound_mode(ctx) {
      return this.visitChildren(ctx);
    }

    // Visit a parse tree produced by SnowflakeParser#round_expr.
  }, {
    key: "visitRound_expr",
    value: function visitRound_expr(ctx) {
      return this.visitChildren(ctx);
    }
  }]);
}(_antlr["default"].tree.ParseTreeVisitor);