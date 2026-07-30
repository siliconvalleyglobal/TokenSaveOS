/**
 * Configuration loader and Secret Redaction utility
 */
import { TokenSaveConfig } from './types.js';
export declare const DEFAULT_CONFIG: TokenSaveConfig;
export declare function redactSecrets(text: string): string;
export declare function loadConfig(configPath?: string): TokenSaveConfig;
