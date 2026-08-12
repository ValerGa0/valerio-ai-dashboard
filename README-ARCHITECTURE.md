# VALÉRIO AI — Agent Architecture

The runtime uses the OpenAI Agents SDK for TypeScript. The AI Manager is the router/orchestrator and six specialist agents handle focused work. The Developer Agent is the only specialist currently equipped with GitHub write tools.

## Runtime
- Frontend: Vite + React
- Agent runtime: `@openai/agents`
- API server: Express
- GitHub: Octokit
- Secrets: `OPENAI_API_KEY` and `GITHUB_TOKEN` in deployment/local secret storage only

## Safety boundaries
1. Browser never receives API keys.
2. GitHub writes are server-side only.
3. Developer Agent must inspect repository context before edits.
4. GitHub write tools are scoped to the configured repository.
5. Production should add approval gates for destructive operations, PR creation, branch deletion, and secrets/config changes.

## Agent flow
User -> AI Manager -> specialist/handoff -> tools -> result -> Manager summary -> Dashboard activity.

OpenAI's current Agents SDK supports agents, handoffs, tools, sessions and tracing; this project uses the manager/handoff pattern as the initial orchestration layer.
