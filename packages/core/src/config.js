/**
 * Configuration loader and Secret Redaction utility
 */
import * as fs from 'fs';
import * as path from 'path';
export const DEFAULT_CONFIG = {
    aiModels: {
        simple: "claude-haiku-4-5",
        medium: "claude-sonnet-4-6",
        complex: "claude-opus-4-6"
    },
    context: {
        maxTokens: 8000,
        ignorePatterns: ["*.test.ts", "dist/*", "node_modules/*", ".git/*", ".env*"]
    },
    memory: {
        autoUpdate: true,
        schemaVersion: 1
    },
    cache: {
        enabled: true,
        provider: "anthropic"
    },
    eval: {
        gateOnRegression: true,
        minSuccessRate: 0.9
    }
};
const SECRET_PATTERNS = [
    /sk-[a-zA-Z0-9]{20,}/g,
    /npm_[a-zA-Z0-9]{30,}/g,
    /ghp_[a-zA-Z0-9]{30,}/g,
    /bearer\s+[a-zA-Z0-9\-_\.=]+/gi,
    /password\s*=\s*['"][^'"]+['"]/gi,
    /api[_-]?key\s*=\s*['"][^'"]+['"]/gi
];
export function redactSecrets(text) {
    if (!text)
        return "";
    let sanitized = text;
    for (const pattern of SECRET_PATTERNS) {
        sanitized = sanitized.replace(pattern, "[REDACTED_SECRET]");
    }
    return sanitized;
}
export function loadConfig(configPath) {
    const targetPath = configPath || path.join(process.cwd(), 'tokensave.config.json');
    if (fs.existsSync(targetPath)) {
        try {
            const raw = fs.readFileSync(targetPath, 'utf-8');
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_CONFIG, ...parsed };
        }
        catch (e) {
            console.warn(`Failed to parse config at ${targetPath}, falling back to defaults.`);
        }
    }
    return DEFAULT_CONFIG;
}
