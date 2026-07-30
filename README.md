# TokenSaveOS ⚡

### *An Enterprise AI Agent Optimization Platform & Context Intelligence Operating System*
***A Project by [SILICON VALLEY GLOBAL PH INC](https://svg.ph)***

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@svgph/tokensaveos.svg)](https://www.npmjs.com/package/@svgph/tokensaveos)
[![Company Website](https://img.shields.io/badge/Website-svg.ph-brightgreen.svg)](https://svg.ph)
[![Build Status](https://img.shields.io/badge/Vitest-100%25%20Passing-success.svg)](packages/)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monorepo-purple.svg)](docs/integration-matrix.md)

TokenSaveOS is an open-source AI agent optimization platform developed by **[SILICON VALLEY GLOBAL PH INC](https://svg.ph)**. It optimizes how AI coding agents consume tokens, manage context, and route requests — without replacing underlying LLM models.

---

## 🌟 Integration Feasibility Matrix

| Tool | Interception point today | What TokenSaveOS can actually do | ToS risk |
|---|---|---|---|
| **Claude Code** | Hooks + MCP servers (sanctioned) | Full: context trim, caching, memory injection, model routing via hook | Low — using documented extension points |
| **VS Code AI Agent Extensions** | MCP-capable, varies by extension | Full where MCP is supported; otherwise none | Low |
| **Cursor** | No public interception API | Standalone CLI agent or pre-flight context optimization | Avoid silent traffic interception |
| **OpenAI Codex** | Depends on version | Standalone agent mode until confirmed | Check ToS before interception |
| **Direct API use** | Full — it's your code | Full: caching, routing, memory, everything | None |

---

## 🚀 Key Framework Modules

1. **Context Intelligence Engine (`@tokensaveos/context-engine`)**: Scans repositories while redacting secrets (`.env`, `credentials.json`, `keys`), ranking 100k raw tokens down to 8k relevant context.
2. **Token Optimization Engine (`@tokensaveos/token-engine`)**: Per-provider token estimation (Anthropic, tiktoken/OpenAI, Ollama) and prompt compression with diff-based edits.
3. **Cache Manager (`@tokensaveos/cache-manager`)**: Provider-native prompt cache breakpoint manager (Anthropic `cache_control`) and semantic prompt caching.
4. **Memory Engine (`@tokensaveos/memory-engine`)**: Durable project memory (`.tokensave/memory/project.json`) with mandatory `schemaVersion: 1` and secret scrubbing.
5. **Agent Router (`@tokensaveos/agent-router`)**: Cost/complexity heuristic model router with automatic escalation fallback.
6. **Eval Harness (`@tokensaveos/eval-harness`)**: Quality safety net regression runner ensuring token compression never degrades task success.
7. **Universal Skill Manager (`@tokensaveos/skill-manager`)**: Organizes agent skills into `skills/{frontend,backend,security,database,testing,documentation}/`.
8. **MCP Server (`@tokensaveos/mcp-server`)**: MCP JSON-RPC gateway for Tier A agent integrations.

---

## 💻 Quickstart

```bash
# Install package from npm
npm install @svgph/tokensaveos

# Or clone from GitHub
git clone https://github.com/siliconvalleyglobal/TokenSaveOS.git
cd TokenSaveOS
npm install
npm run build

# Run unit test suite
npm test

# Run CLI commands
npm run tokensave init       # Initialize project & .tokensave/memory/
npm run tokensave analyze    # Scan repo & rank context efficiency
npm run tokensave optimize   # Compress prompt & calculate token savings
npm run tokensave stats      # Display token savings & prompt cache stats
npm run tokensave memory     # Inspect project memory
npm run tokensave skills     # Manage agent skills
npm run tokensave run        # Run as Tier B standalone agent runtime
npm run tokensave eval       # Run regression suite against config
```

---

## 🤝 Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and our [SECURITY.md](SECURITY.md) for vulnerability disclosure.

---

## 📄 License

TokenSaveOS is open-source software developed by **[SILICON VALLEY GLOBAL PH INC](https://svg.ph)** and licensed under the [MIT License](LICENSE).
