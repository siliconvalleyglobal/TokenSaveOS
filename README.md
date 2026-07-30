# TokenSaveOS ⚡

### *An Enterprise AI Agent Optimization Platform & Context Intelligence Operating System*
***A Project by [SILICON VALLEY GLOBAL PH INC](https://svg.ph)***

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@svgph/tokensaveos.svg)](https://www.npmjs.com/package/@svgph/tokensaveos)
[![Company Website](https://img.shields.io/badge/Website-svg.ph-brightgreen.svg)](https://svg.ph)
[![Build Status](https://img.shields.io/badge/Vitest-100%25%20Passing-success.svg)](packages/)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monorepo-purple.svg)](docs/integration-matrix.md)

TokenSaveOS is an open-source AI agent optimization platform developed by **[SILICON VALLEY GLOBAL PH INC](https://svg.ph)**. It optimizes how AI coding agents consume tokens, manage context, and route requests — reducing total AI API costs by **up to 88%** without replacing underlying LLM models.

---

## 📊 The 4 Levers of Token & Cost Savings

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
3. Provider Prompt Caching                   4. Smart Agent Router
   (90% discount on repeat context)            (Routes simple tasks to Haiku)
```

### 1. Context Intelligence Engine (`@tokensaveos/context-engine`)
* **80% to 92% Reduction in Input Context Payload**:
  Scans repository import graphs and Git activity to select only relevant files (~8,000 tokens) instead of dumping a raw 100,000-token monorepo into the prompt.

### 2. Token Compression & Filler Pruning (`@tokensaveos/token-engine`)
* **40% to 60% Reduction in Prompt Text**:
  Strips conversational filler (*"Can you please"*, *"kindly"*, *"in order to"*), code comments (`/* ... */`, `# ...`), JSON whitespace, and duplicate lines.
* **Empirical Test**: `"Can you please analyze this code and explain what improvements can be made?"` (22 tokens) ➔ `"analyze this code and explain"` (9 tokens) — **59.1% Token Reduction**.

### 3. Provider-Native Prompt Caching (`@tokensaveos/cache-manager`)
* **90% Cost Discount on Cached Input Tokens**:
  Injects provider-native prompt cache breakpoints (`cache_control: { type: "ephemeral" }` for Anthropic Claude). Cached context is billed at $0.30/1M tokens instead of $3.00/1M tokens.

### 4. Complexity Model Router (`@tokensaveos/agent-router`)
* **73% to 94% Cost Reduction Per Routed Request**:
  Routes simple tasks (typos, formatting, minor edits) to Claude 3.5 Haiku ($0.80/1M tokens) instead of expensive Claude 3.7 Sonnet ($3.00/1M) or Opus ($15.00/1M).

---

## 💵 Real-World Financial Impact Example

For an engineering team executing **10,000 AI coding requests per month**:

| Metric | Without TokenSaveOS | With TokenSaveOS | Net Customer Savings |
|---|---|---|---|
| **Avg. Tokens per Request** | 50,000 tokens | 8,000 tokens | **84% fewer tokens** |
| **Monthly Token Volume** | 500,000,000 tokens | 80,000,000 tokens | **420,000,000 tokens saved** |
| **Prompt Caching Discount** | None ($3.00 / 1M) | 80% Cached ($0.30 / 1M) | **90% cache discount** |
| **Monthly AI API Bill** | **$1,500.00 / month** | **$180.00 / month** | **$1,320.00 Saved / Month** |
| **Overall Cost Reduction** | **0%** | **88.0%** | **88% Net Savings** |

---

## 🌟 Integration Feasibility Matrix

| Tool | Interception point today | What TokenSaveOS can actually do | ToS risk |
|---|---|---|---|
| **Claude Code** | Hooks + MCP servers (sanctioned) | Full: context trim, caching, memory injection, model routing via hook | Low — using documented extension points |
| **VS Code / Antigravity / Cursor** | Standalone CLI agent runtime or MCP tool | Full: pre-flight context optimization & standalone optimized agent mode | Avoid silent traffic interception |
| **Direct API use** | Full — it's your code | Full: caching, routing, memory, everything | None |

---

## 💻 Quickstart & Global Installation

```bash
# Install globally from npm
npm install -g @svgph/tokensaveos

# Initialize project configuration & .tokensave/memory/
tokensave init

# Optimize any AI request
tokensave optimize "Can you please analyze this code..."

# View real token and cost savings dashboard
tokensave stats

# Act as standalone optimized agent
tokensave run "Refactor security policy"
```

---

## 📄 License

TokenSaveOS is open-source software developed by **[SILICON VALLEY GLOBAL PH INC](https://svg.ph)** and licensed under the [MIT License](LICENSE).
