/**
 * TokenSaveOS MCP Gateway Server (Tier A Integrations)
 */

import { loadConfig } from '@tokensaveos/core';
import { compressPrompt } from '@tokensaveos/token-engine';
import { MemoryEngine } from '@tokensaveos/memory-engine';

export class TokenSaveMCPServer {
  private config = loadConfig();
  private memory = new MemoryEngine();

  public getToolsManifest() {
    return [
      {
        name: "tokensave_compress_prompt",
        description: "Compress prompt context to reduce token consumption and API costs.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: { type: "string" }
          },
          required: ["prompt"]
        }
      },
      {
        name: "tokensave_get_memory",
        description: "Fetch durable project memory, architecture notes, and style guidelines.",
        inputSchema: {
          type: "object",
          properties: {
            filename: { type: "string", default: "project.json" }
          }
        }
      }
    ];
  }

  public handleToolCall(name: string, args: Record<string, any>) {
    if (name === "tokensave_compress_prompt") {
      return compressPrompt(args.prompt || "");
    } else if (name === "tokensave_get_memory") {
      return this.memory.loadMemory(args.filename || "project.json");
    }
    throw new Error(`Unknown TokenSaveOS MCP tool: ${name}`);
  }
}
