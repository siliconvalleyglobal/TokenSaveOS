/**
 * Tool Payload & JSON Output Stripper
 * Compresses and minimizes bulky tool responses (SQL dumps, API payloads, directories).
 */

export interface ToolStripOptions {
  maxJsonDepth?: number;
  maxArrayItems?: number;
  removeNullsAndEmpty?: boolean;
  truncateLongStringsLength?: number;
  whitelistedKeys?: string[];
}

export class ToolPayloadStripper {
  private options: Required<ToolStripOptions>;

  constructor(options: ToolStripOptions = {}) {
    this.options = {
      maxJsonDepth: options.maxJsonDepth ?? 4,
      maxArrayItems: options.maxArrayItems ?? 20,
      removeNullsAndEmpty: options.removeNullsAndEmpty ?? true,
      truncateLongStringsLength: options.truncateLongStringsLength ?? 500,
      whitelistedKeys: options.whitelistedKeys ?? [],
    };
  }

  /**
   * Cleans and strips bulky payload object or JSON string
   */
  public stripPayload(input: unknown): unknown {
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        const stripped = this.stripObject(parsed, 0);
        return JSON.stringify(stripped);
      } catch {
        return this.stripString(input);
      }
    }

    return this.stripObject(input, 0);
  }

  private stripObject(obj: unknown, depth: number): unknown {
    if (depth > this.options.maxJsonDepth) {
      return '[TRUNCATED_DEPTH]';
    }

    if (obj === null || obj === undefined) {
      return this.options.removeNullsAndEmpty ? undefined : obj;
    }

    if (typeof obj === 'string') {
      return this.stripString(obj);
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      const items = obj.slice(0, this.options.maxArrayItems).map((item) => this.stripObject(item, depth + 1));
      if (obj.length > this.options.maxArrayItems) {
        items.push(`... [${obj.length - this.options.maxArrayItems} more items omitted]`);
      }
      return items;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (this.options.whitelistedKeys.length > 0 && !this.options.whitelistedKeys.includes(key)) {
        continue;
      }

      const strippedVal = this.stripObject(value, depth + 1);
      if (this.options.removeNullsAndEmpty && (strippedVal === undefined || strippedVal === '' || strippedVal === null)) {
        continue;
      }
      result[key] = strippedVal;
    }

    return result;
  }

  private stripString(str: string): string {
    if (str.length > this.options.truncateLongStringsLength) {
      const keep = Math.floor(this.options.truncateLongStringsLength / 2);
      return `${str.slice(0, keep)}... [${str.length - this.options.truncateLongStringsLength} chars truncated] ...${str.slice(-keep)}`;
    }
    return str;
  }
}
