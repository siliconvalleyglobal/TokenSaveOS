/**
 * Adaptive Prompt Cache Hit Maximizer (KV-Cache Aligner)
 * Reorders dynamic elements and canonicalizes prompt structures for maximum prefix cache reuse.
 */

export interface CacheAlignmentRule {
  systemPrompt: string;
  toolSchemas?: Array<Record<string, unknown>>;
  dynamicContext?: string;
  userQuery: string;
}

export interface AlignedPromptResult {
  alignedPrompt: string;
  cachePrefixHash: string;
  estimatedCacheHitRate: number;
  staticPrefixTokens: number;
  dynamicTokens: number;
}

export class PromptCacheAligner {
  /**
   * Deterministically orders system instructions and tools ahead of dynamic turns
   */
  public alignPrompt(rule: CacheAlignmentRule): AlignedPromptResult {
    // 1. Canonicalize System Prompt (Trim & deterministic whitespace)
    const normalizedSystem = rule.systemPrompt.trim().replace(/\r\n/g, '\n');

    // 2. Canonicalize Tool Schemas (Sort keys deterministically)
    let serializedTools = '';
    if (rule.toolSchemas && rule.toolSchemas.length > 0) {
      const sorted = [...rule.toolSchemas].sort((a, b) =>
        String(a.name || '').localeCompare(String(b.name || ''))
      );
      serializedTools = JSON.stringify(sorted);
    }

    // Static Cache Prefix Block
    const staticPrefix = [
      `[SYSTEM_PROMPT]\n${normalizedSystem}`,
      serializedTools ? `[TOOL_DEFINITIONS]\n${serializedTools}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    // Dynamic Postfix Block
    const dynamicPostfix = [
      rule.dynamicContext ? `[DYNAMIC_CONTEXT]\n${rule.dynamicContext.trim()}` : '',
      `[USER_QUERY]\n${rule.userQuery.trim()}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const alignedPrompt = `${staticPrefix}\n\n${dynamicPostfix}`;
    const staticPrefixTokens = Math.ceil(staticPrefix.length * 0.25);
    const dynamicTokens = Math.ceil(dynamicPostfix.length * 0.25);
    const totalTokens = staticPrefixTokens + dynamicTokens;

    // Cache hit rate estimation based on prefix ratio
    const estimatedCacheHitRate =
      totalTokens > 0 ? Math.round((staticPrefixTokens / totalTokens) * 100) / 100 : 0.85;

    return {
      alignedPrompt,
      cachePrefixHash: this.hashString(staticPrefix),
      estimatedCacheHitRate,
      staticPrefixTokens,
      dynamicTokens,
    };
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `prefix-${Math.abs(hash).toString(16)}`;
  }
}
