# Commands (Windows, PowerShell/Git Bash)

- `npm run dev` (Next dev server; use `-p 3100` to pick the port), `npm run build` (static export to `out/`), `npm run lint`, `npm run typecheck`.
- Stale `.next` after switching dev/build or changing `output` causes `PageNotFoundError: /_document`; fix with `rm -rf .next out` then rebuild.
- Graphify graph: `graphify update src` writes to `src/graphify-out`; move it to the repo-root `graphify-out/` (gitignored). Query with `graphify query "..."`, `graphify god-nodes`, `graphify path "A" "B"`.
- `claude mcp add ... -- cmd --flag` breaks in PowerShell (`--` swallowed); configure servers in `.mcp.json` instead.
- Serena executable is `%USERPROFILE%\.local\bin\serena.exe` (not on PATH).
