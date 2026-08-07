/**
 * Multi-Modal Token Counter
 * Counts tokens across text, images, audio, and video modalities
 */
export interface MultiModalTokenCount {
    textTokens: number;
    imageTokens: number;
    audioTokens: number;
    videoTokens: number;
    totalTokens: number;
    breakdown: {
        text: {
            tokens: number;
            costUSD: number;
        };
        images: {
            count: number;
            tokens: number;
            costUSD: number;
        };
        audio: {
            count: number;
            tokens: number;
            costUSD: number;
        };
        video: {
            count: number;
            tokens: number;
            costUSD: number;
        };
    };
}
export interface MediaInput {
    type: 'text' | 'image' | 'audio' | 'video';
    content?: string;
    url?: string;
    sizeBytes?: number;
    durationSeconds?: number;
    width?: number;
    height?: number;
}
export declare class MultiModalTokenizer {
    private providerRates;
    constructor(provider?: 'anthropic' | 'openai' | 'gemini');
    count(inputs: MediaInput[], provider?: 'anthropic' | 'openai' | 'gemini'): MultiModalTokenCount;
    private countTextTokens;
    private countImageTokens;
    private countAudioTokens;
    private countVideoTokens;
}
//# sourceMappingURL=index.d.ts.map