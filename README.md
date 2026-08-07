# TokenSaveOS

## Enterprise AI Agent Optimization Platform & Context Intelligence Operating System

**A Project by [SILICON VALLEY GLOBAL PH INC](https://svg.ph)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/badge/npm-%40svgph%2Ftokensaveos-brightgreen.svg)](https://www.npmjs.com/package/@svgph/tokensaveos)
[![GitHub stars](https://img.shields.io/github/stars/siliconvalleyglobal/TokenSaveOS?style=social)](https://github.com/siliconvalleyglobal/TokenSaveOS)
[![GitHub forks](https://img.shields.io/github/forks/siliconvalleyglobal/TokenSaveOS?style=social)](https://github.com/siliconvalleyglobal/TokenSaveOS)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)]()
[![Security](https://img.shields.io/badge/Security-Zero--Trust-brightgreen.svg)](SECURITY.md)
[![Company Website](https://img.shields.io/badge/Website-svg.ph-brightgreen.svg)](https://svg.ph)

---

## Overview

TokenSaveOS is an open-source AI agent optimization platform that reduces how AI coding agents consume tokens, manage context, and route requests — cutting total AI API costs by **up to 95%** without replacing underlying LLM models.

### Core Capabilities

| Capability | Description |
|------------|-------------|
| **Context Intelligence Engine** | 80-92% reduction in input context payload via repository-aware scanning |
| **Token Compression Engine** | 40-60% reduction in prompt text via filler pruning, comment stripping, and deduplication |
| **Provider-Native Prompt Caching** | 90% cache-read discount on Anthropic, OpenAI, and Gemini |
| **Semantic Caching** | Embedding-based similar query caching for 60-95% token savings |
| **Output Compression** | LLM output trimming, filler removal, and code block compression |
| **Cost-Aware Model Router** | 73-94% cost reduction by routing simple tasks to cheaper models |
| **Budget Circuit Breaker** | Hard budget limits with auto-trip to prevent runaway agent costs |
| **Agent Loop Detector** | Real-time loop detection and termination before costs compound |
| **Multi-Modal Token Counter** | Text, image, audio, and video token counting across providers |
| **Streaming Optimizer** | Real-time tool output, log, and stack trace compression |
| **Memory Deduplication** | Cross-session memory deduplication for 5-40x compression |
| **Batch API Router** | Non-urgent job batching for 50% cost savings |
| **Prompt Versioning & A/B Testing** | Version-controlled prompts with cost comparison |
| **Token Forecaster** | Pre-execution cost prediction and model comparison |
| **MCP Server** | Model Context Protocol gateway for tool integration |
| **Eval Harness** | Regression testing and quality safety net |

---

## Quickstart

### Prerequisites

- Node.js 20 or higher
- npm 9 or higher

### Installation

```bash
# Install globally
npm install -g @svgph/tokensaveos

# Or use directly with npx
npx @svgph/tokensaveos run "Refactor security policy"
```

### CLI Commands

```bash
# Run Standalone Agent Mode (Primary Recommended Flow)
tokensave run "Refactor security policy and optimize database queries"

# Start Zero-Code LLM API Proxy (http://localhost:8080)
tokensave proxy

# Launch Live Web Analytics Dashboard (http://localhost:3005)
tokensave dashboard

# Manage Developer Spending Budgets
tokensave budget set 100

# View Real Savings Dashboard
tokensave stats

# Pre-flight Prompt Compression
tokensave optimize "Can you please analyze this code..."

# Initialize Project & Memory
tokensave init
```

---

## How It Works

```
                        Raw Customer Request
                                  │
      ┌───────────────────────────┴───────────────────────────┐
      ▼                                                       ▼
1. Context Intelligence Engine               2. Token Optimization Engine
   (Prunes 100k → 8k tokens)                   (Prunes 50-60% prompt filler)
      │                                                       │
      └───────────────────────────┬───────────────────────────┘
                                  │
      ┌───────────────────────────┴───────────────────────────┐
      ▼                                                       ▼
3. Semantic Cache / Prompt Cache                4. Budget & Loop Guard
   (60-95% cache savings)                        (Hard limits + termination)
```

### 1. Context Intelligence Engine (`@tokensaveos/context-engine`)

- **80% to 92% Reduction in Input Context Payload**
- Scans repository import graphs and Git activity to select only relevant files
- Security filters exclude `.env`, secrets, and sensitive files

### 2. Token Compression & Filler Pruning (`@tokensaveos/token-engine`)

- **40% to 60% Reduction in Prompt Text**
- Strips conversational filler, code comments, JSON whitespace, and duplicate lines
- Provider-aware tokenization for Anthropic, OpenAI, and Gemini

### 3. Provider-Native Prompt Caching (`@tokensaveos/prompt-cache`)

- **90% Cost Discount on Cached Input Tokens**
- Supports Anthropic `cache_control`, OpenAI automatic caching, and Gemini context caching
- Tracks cache hit rates and cost savings per provider

### 4. Semantic Caching (`@tokensaveos/semantic-cache`)

- **60-95% Token Savings on Similar Queries**
- Embedding-based similarity matching for near-duplicate prompts
- Configurable similarity threshold and LRU eviction

### 5. Output Compression (`@tokensaveos/output-compressor`)

- **~65% Token Savings on LLM Outputs**
- Removes filler phrases, emojis, and compresses code blocks
- Configurable max tokens and compression ratios

### 6. Budget Circuit Breaker (`@tokensaveos/budget-circuit-breaker`)

- **Hard Budget Limits with Auto-Trip**
- Enforces daily, hourly, and per-run USD limits
- Cooldown period and listener notifications

### 7. Agent Loop Detector (`@tokensaveos/loop-detector`)

- **Real-Time Loop Detection and Termination**
- Identical and fuzzy sequence detection
- Confidence scoring with warn/terminate recommendations

### 8. Multi-Modal Token Counter (`@tokensaveos/multi-modal-tokens`)

- **Text, Image, Audio, Video Token Counting**
- Provider-specific pricing for multi-modal inputs
- Breakdown by modality with cost estimates

### 9. Streaming Optimizer (`@tokensaveos/streaming-optimizer`)

- **Real-Time Tool Output Compression**
- Compresses tool outputs, logs, and stack traces mid-stream
- Priority-based chunk handling

### 10. Memory Deduplication (`@tokensaveos/memory-dedup`)

- **Cross-Session Memory Deduplication**
- Cosine similarity-based duplicate detection
- 5-40x compression on tool-heavy workloads

### 11. Batch API Router (`@tokensaveos/batch-router`)

- **50% Cost Savings on Non-Urgent Jobs**
- Routes low-priority tasks to batch APIs
- Automatic flush when queue reaches capacity

### 12. Prompt Versioning & A/B Testing (`@tokensaveos/prompt-versioning`)

- **Version-Controlled Prompts with Cost Comparison**
- A/B testing with token and cost metrics
- Rollback support

### 13. Token Forecaster (`@tokensaveos/token-forecaster`)

- **Pre-Execution Cost Prediction**
- Estimates input/output tokens and USD cost before execution
- Model comparison and optimization recommendations

### 14. AST Code Context Trimmer (`@tokensaveos/ast-trimmer`)

- **35% to 55% Additional Code Token Reduction**
- Parses TypeScript, JavaScript, and Python ASTs
- Strips unexported helpers while keeping public interfaces

### 15. Multi-Provider Cost Matrix (`@tokensaveos/cost-matrix`)

- **Real-Time Model Price Comparison**
- Calculates exact costs across Anthropic, OpenAI, Google Gemini, and Groq

### 16. Streaming Token Sentinel (`@tokensaveos/token-sentinel`)

- **Real-Time Loop Abort & Token Cap Safeguard**
- Monitors SSE LLM output streams for infinite loops

---

## Repository Structure

```
tokensaveos/
├── packages/                        # TypeScript monorepo
│   ├── core/                        # Core types, config, budget, sync
│   ├── context-engine/              # Repository scanner & context ranker
│   ├── token-engine/                # Prompt compression & tokenization
│   ├── prompt-cache/                # Provider-native prompt caching
│   ├── semantic-cache/              # Embedding-based similar query cache
│   ├── output-compressor/           # LLM output trimming & compression
│   ├── cache-manager/               # Persistent savings vault & cache stats
│   ├── agent-router/                # Cost-aware model routing
│   ├── budget-circuit-breaker/      # Hard budget limits with auto-trip
│   ├── loop-detector/               # Real-time agent loop detection
│   ├── multi-modal-tokens/          # Text/image/audio/video token counting
│   ├── streaming-optimizer/         # Real-time tool output compression
│   ├── memory-dedup/                # Cross-session memory deduplication
│   ├── batch-router/                # Non-urgent job batching
│   ├── prompt-versioning/           # A/B testing & prompt versioning
│   ├── token-forecaster/            # Pre-execution cost prediction
│   ├── ast-trimmer/                 # AST-based code context trimmer
│   ├── cost-matrix/                 # Multi-provider cost calculator
│   ├── token-sentinel/              # Streaming token loop sentinel
│   ├── memory-engine/               # Project memory management
│   ├── skill-manager/               # Universal skill management
│   ├── eval-harness/                # Quality safety net & regression
│   └── mcp-server/                  # MCP gateway & stdio transport
├── apps/cli/                         # CLI entry point
├── skills/                           # Built-in agent skills
├── docs/                             # Technical documentation
├── CONTRIBUTING.md                   # Contribution guidelines
├── SECURITY.md                       # Security policy
└── README.md                         # This file
```

---

## Documentation

| Document | Description |
|----------|-------------|
| **[Integration Matrix](docs/integration-matrix.md)** | Complete package integration and dependency map |
| **[Claude Code Integration](docs/claude-code-integration.md)** | Claude Code setup and optimization guide |
| **[Contributing](CONTRIBUTING.md)** | Development setup and contribution guidelines |
| **[Security](SECURITY.md)** | Security policy and vulnerability disclosure |

---

## License & Attribution

TokenSaveOS is open-source software developed and maintained by **[SILICON VALLEY GLOBAL PH INC](https://svg.ph)** and licensed under the [MIT License](LICENSE).
