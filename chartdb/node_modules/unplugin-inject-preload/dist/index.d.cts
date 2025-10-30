import { UnpluginInstance } from 'unplugin';
import { Options } from './types.cjs';
import 'vite';
import 'webpack';
import '@rspack/core';

/**
 * This entry file is for main unplugin.
 * @module
 */

/**
 * The unplugin instance.
 */
declare const unplugin: UnpluginInstance<Options, boolean>;

export = unplugin;
