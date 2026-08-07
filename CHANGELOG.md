# Changelog

All notable changes to **TokenSaveOS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-08-08

### Changed
- Upgrade to TypeScript 7.0.2
- Upgrade to Vitest 4.1.10
- Upgrade to Node.js 26 types
- Upgrade MCP SDK to 1.30.0
- Upgrade tiktoken to 1.0.22
- Update tsconfig for latest TypeScript compatibility
- Fix workspace dependencies for npm compatibility

---

## [2.0.0] - 2026-08-08

### 🎯 Major Release: Enterprise Optimization Suite

- **11 New Optimization Modules**:
  - `prompt-cache`: Provider-native caching for Anthropic/OpenAI/Gemini
  - `semantic-cache`: Embedding-based similar query caching
  - `output-compressor`: LLM output trimming and compression
  - `budget-circuit-breaker`: Hard budget limits with auto-trip
  - `loop-detector`: Real-time agent loop detection and termination
  - `multi-modal-tokens`: Text/image/audio/video token counting
  - `streaming-optimizer`: Real-time tool output compression
  - `memory-dedup`: Cross-session memory deduplication
  - `batch-router`: Non-urgent job batching for 50% cost savings
  - `prompt-versioning`: A/B testing and prompt versioning
  - `token-forecaster`: Pre-execution cost prediction

- **23 Total Packages** in modular monorepo
- **~3,000 lines** of TypeScript source code
- **22 passing tests** with Vitest
- **Professional README** with badges and feature matrix
- **Latest tech stack**: TypeScript 7+, Vitest 4, Node 26 types

---

## [1.4.0] - 2026-07-30

### 🚀 npm Publication
- Published `@svgph/tokensaveos` to npm
- Added CLI entry point (`tokensave` command)
- Added MCP server integration
- Added token sentinel for streaming loop detection
- Added AST trimmer for code context optimization
- Added cost matrix for multi-provider pricing

---

## [1.3.4] - 2026-07-30
- Initial open-source release
- Core context engine and token compression
- Cache manager with persistent savings vault
- Agent router with cost-aware model selection
- Memory engine for project context
- Skill manager for agent skills
- Eval harness for regression testing

---

## [1.0.0] - 2026-07-30
- Initial release of TokenSaveOS core framework
