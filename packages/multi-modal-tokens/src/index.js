/**
 * Multi-Modal Token Counter
 * Counts tokens across text, images, audio, and video modalities
 */
export class MultiModalTokenizer {
    providerRates;
    constructor(provider = 'anthropic') {
        this.providerRates = {
            anthropic: { text: 0.003, image: 0.015, audio: 0.012, video: 0.05 },
            openai: { text: 0.002, image: 0.01, audio: 0.008, video: 0.04 },
            gemini: { text: 0.00125, image: 0.00625, audio: 0.005, video: 0.025 },
        };
    }
    count(inputs, provider = 'anthropic') {
        let textTokens = 0;
        let imageTokens = 0;
        let audioTokens = 0;
        let videoTokens = 0;
        let imageCount = 0;
        let audioCount = 0;
        let videoCount = 0;
        for (const input of inputs) {
            switch (input.type) {
                case 'text':
                    textTokens += this.countTextTokens(input.content || '');
                    break;
                case 'image':
                    imageTokens += this.countImageTokens(input.width || 1024, input.height || 1024, input.sizeBytes || 0);
                    imageCount++;
                    break;
                case 'audio':
                    audioTokens += this.countAudioTokens(input.durationSeconds || 60);
                    audioCount++;
                    break;
                case 'video':
                    videoTokens += this.countVideoTokens(input.durationSeconds || 60, input.width || 1920, input.height || 1080);
                    videoCount++;
                    break;
            }
        }
        const rates = this.providerRates[provider];
        const totalTokens = textTokens + imageTokens + audioTokens + videoTokens;
        return {
            textTokens,
            imageTokens,
            audioTokens,
            videoTokens,
            totalTokens,
            breakdown: {
                text: {
                    tokens: textTokens,
                    costUSD: (textTokens / 1000) * rates.text,
                },
                images: {
                    count: imageCount,
                    tokens: imageTokens,
                    costUSD: (imageTokens / 1000) * rates.image,
                },
                audio: {
                    count: audioCount,
                    tokens: audioTokens,
                    costUSD: (audioTokens / 1000) * rates.audio,
                },
                video: {
                    count: videoCount,
                    tokens: videoTokens,
                    costUSD: (videoTokens / 1000) * rates.video,
                },
            },
        };
    }
    countTextTokens(text) {
        return Math.ceil(text.length / 4);
    }
    countImageTokens(width, height, sizeBytes) {
        const baseTokens = Math.ceil((width * height) / 750);
        const sizeBonus = Math.ceil(sizeBytes / 1024 / 100);
        return baseTokens + sizeBonus;
    }
    countAudioTokens(durationSeconds) {
        return Math.ceil(durationSeconds * 100);
    }
    countVideoTokens(durationSeconds, width, height) {
        const frameCount = Math.ceil(durationSeconds * 30);
        const tokensPerFrame = Math.ceil((width * height) / 1000);
        return frameCount * tokensPerFrame;
    }
}
