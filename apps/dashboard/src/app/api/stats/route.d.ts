import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    stats: {
        totalTokensSaved: number;
        totalCostSavedUSD: number;
        cacheHits: number;
        cacheMisses: number;
        hitRatio: number;
        savingsRate: number;
        history: never[];
    };
    memory: Record<string, string>;
}> | NextResponse<{
    success: boolean;
    error: any;
}>>;
