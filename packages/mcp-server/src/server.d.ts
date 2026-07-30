/**
 * TokenSaveOS MCP Gateway Server (Tier A Integrations)
 */
export declare class TokenSaveMCPServer {
    private config;
    private memory;
    getToolsManifest(): ({
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                prompt: {
                    type: string;
                };
                filename?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                filename: {
                    type: string;
                    default: string;
                };
                prompt?: undefined;
            };
            required?: undefined;
        };
    })[];
    handleToolCall(name: string, args: Record<string, any>): import("@tokensaveos/core").CompressionResult | import("@tokensaveos/memory-engine").MemoryRecord;
}
