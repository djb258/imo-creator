"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TABLE_CONSTRAINT_KIND = exports.DATA_TYPE = exports.CONSTRAINT_TYPE = exports.COLUMN_CONSTRAINT_KIND = void 0;
var TABLE_CONSTRAINT_KIND = exports.TABLE_CONSTRAINT_KIND = {
  FIELD: 'field',
  INDEX: 'index',
  FK: 'fk',
  UNIQUE: 'unique',
  PK: 'pk',
  DEFAULT: 'default'
};
var COLUMN_CONSTRAINT_KIND = exports.COLUMN_CONSTRAINT_KIND = {
  NOT_NULL: 'not_null',
  UNIQUE: 'unique',
  PK: 'pk',
  DEFAULT: 'dbdefault',
  INCREMENT: 'increment',
  INLINE_REF: 'inline_ref',
  NOTE: 'note',
  CHECK: 'check'
};
var DATA_TYPE = exports.DATA_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  EXPRESSION: 'expression'
};

// legacy - for compatibility with model_structure
var CONSTRAINT_TYPE = exports.CONSTRAINT_TYPE = {
  COLUMN: 'column',
  STRING: 'string',
  EXPRESSION: 'expression'
};