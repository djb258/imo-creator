"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var P = require('parsimmon');
var KP = require('../../../keyword_parsers');
var A = require('./actions');
var _require = require('../../../utils'),
  makeNode = _require.makeNode;
var Lang = P.createLanguage({
  StartComment: function StartComment() {
    return P.seq(KP.KeywordExec, KP.KeywordSP_ADDEXTENDEDPROPERTY);
  },
  EndComment: function EndComment() {
    return P.seq(KP.Semicolon.atMost(1), KP.KeywordGo);
  },
  StartString: function StartString() {
    return P.alt(KP.SingleQuote, P.string("N'"));
  },
  ManyDoubleSingleQuote: function ManyDoubleSingleQuote() {
    return P.string("''");
  },
  NoSingleQuote: function NoSingleQuote() {
    return P.regex(/[^']/);
  },
  StringType: function StringType(r) {
    return P.alt(r.NoSingleQuote, r.ManyDoubleSingleQuote).atLeast(1).map(function (res) {
      return res.join('');
    });
  },
  NVarchar: function NVarchar(r) {
    return r.StartString.then(r.StringType).skip(KP.SingleQuote);
  },
  NameOption: function NameOption(r) {
    return KP.KeywordAtName.skip(KP.Equal).then(r.NVarchar);
  },
  ValueOption: function ValueOption(r) {
    return KP.KeywordAtValue.skip(KP.Equal).then(r.NVarchar);
  },
  Level0Type: function Level0Type(r) {
    return KP.KeywordAtLevel0Type.skip(KP.Equal).then(r.NVarchar);
  },
  Level0Name: function Level0Name(r) {
    return KP.KeywordAtLevel0Name.skip(KP.Equal).then(r.NVarchar);
  },
  Level1Type: function Level1Type(r) {
    return KP.KeywordAtLevel1Type.skip(KP.Equal).then(r.NVarchar);
  },
  Level1Name: function Level1Name(r) {
    return KP.KeywordAtLevel1Name.skip(KP.Equal).then(r.NVarchar);
  },
  Level2Type: function Level2Type(r) {
    return KP.KeywordAtLevel2Type.skip(KP.Equal).then(r.NVarchar);
  },
  Level2Name: function Level2Name(r) {
    return KP.KeywordAtLevel2Name.skip(KP.Equal).then(r.NVarchar);
  },
  Level0Stmt: function Level0Stmt(r) {
    return P.seqObj(['type', r.Level0Type], KP.Comma, ['name', r.Level0Name]);
  },
  Level1Stmt: function Level1Stmt(r) {
    return P.seqObj(['type', r.Level1Type], KP.Comma, ['name', r.Level1Name]);
  },
  Level2Stmt: function Level2Stmt(r) {
    return P.seqObj(['type', r.Level2Type], KP.Comma, ['name', r.Level2Name]);
  },
  Level0Wrapper: function Level0Wrapper(r) {
    return P.alt(P.seq(r.Level0Stmt.skip(KP.Comma), r.Level1Wrapper), r.Level0Stmt).map(function (res) {
      return Array.isArray(res) ? [res[0]].concat(_toConsumableArray(res[1])) : [res];
    }).atMost(1).map(function (res) {
      return res.length === 1 ? res[0] : res;
    });
  },
  Level1Wrapper: function Level1Wrapper(r) {
    return P.alt(P.seq(r.Level1Stmt.skip(KP.Comma), r.Level2Stmt), r.Level1Stmt).map(function (res) {
      return Array.isArray(res) ? res : [res];
    });
  },
  CommentSyntax: function CommentSyntax(r) {
    return P.seqObj(r.StartComment, ['name', r.NameOption], KP.Comma, ['note', r.ValueOption], KP.Comma, ['level', r.Level0Wrapper], r.EndComment).map(A.handleComment).thru(makeNode());
  }
});
module.exports = Lang.CommentSyntax;