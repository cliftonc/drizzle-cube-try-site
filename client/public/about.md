---
title: About — Drizzle Cube Try Site
description: Live, interactive demo of Drizzle Cube — an embeddable semantic layer for SaaS apps.
canonical: https://try.drizzle-cube.dev/
---

# About the Drizzle Cube Try Site

This is the public, interactive demo for [Drizzle Cube](https://github.com/cliftonc/drizzle-cube) — an open-source library that adds a Cube.js-compatible semantic layer to your own Drizzle ORM project. The demo runs the full stack: a Hono backend with the semantic layer mounted, a React frontend (Analysis Builder, Dashboards, Notebooks, Charts), an AI assistant powered by the agentic notebook, and an MCP server.

It is here so you can poke at a working installation before deciding whether to embed Drizzle Cube in your own app.

## What you can do here

- **Browse example dashboards** — pre-built dashboards backed by a seeded employee/department dataset.
- **Build queries with the Analysis Builder** — pick measures, dimensions, filters, and time grains against the live semantic layer.
- **Explore the data with the Data Browser** — drill into raw rows behind any chart.
- **Run agentic notebooks** — natural-language questions that the AI assistant turns into queries against the cubes, with the results rendered as interactive charts. (You provide your own Anthropic API key in your browser; it is not stored server-side.)
- **Connect Claude Desktop or Claude Code** — the MCP server at `/mcp` exposes the same cubes to any MCP-aware client.

## How it is built

- **Backend:** Hono on Cloudflare Workers, using `drizzle-cube/adapters/hono`. Source: [`app.ts`](https://github.com/cliftonc/drizzle-cube-try-site/blob/main/app.ts) and [`src/worker.ts`](https://github.com/cliftonc/drizzle-cube-try-site/blob/main/src/worker.ts).
- **Semantic layer:** cubes, dimensions, measures, and joins defined in [`cubes.ts`](https://github.com/cliftonc/drizzle-cube-try-site/blob/main/cubes.ts).
- **Database:** PostgreSQL via Cloudflare Hyperdrive (with KV-backed query caching).
- **Frontend:** React + Vite, using `drizzle-cube/client` components.
- **AI assistant:** Agentic notebooks driven by the Claude Agent SDK, in "bring your own API key" mode.

## Links

- [Drizzle Cube on GitHub](https://github.com/cliftonc/drizzle-cube) — library source, issues, releases
- [Documentation](https://www.drizzle-cube.dev) — full docs, guides, API reference ([llms.txt](https://www.drizzle-cube.dev/llms.txt))
- [Try site source](https://github.com/cliftonc/drizzle-cube-try-site) — the code behind this demo
- [Introducing Drizzle Cube](https://cliftonc.nl/blog/drizzle-cube-embeddable-semantic-layer.md) — author's blog post on why Drizzle Cube exists
- [Drizzle Cube + Next.js step-by-step guide](https://cliftonc.nl/blog/drizzle-cube-nextjs-step-by-step-guide.md) — integration walkthrough

## API endpoints worth knowing

- `GET /llms.txt` — this site's LLM-friendly index
- `GET /api/docs` — JSON API documentation listing available cubes, dimensions, measures
- `GET /cubejs-api/v1/meta` — Cube.js-compatible metadata endpoint
- `POST /cubejs-api/v1/load` — execute analytics queries
- `GET /mcp` — Model Context Protocol endpoint for AI clients
