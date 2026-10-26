# Definition of done

Run in order, all must pass:
1. `npm run typecheck`
2. `npm run lint`
3. `npm run build` (clean `.next` first if it errors with `/_document`)

Not covered by these (needs a browser): shader compile errors, camera framing, 320px layout, 60 FPS. State clearly when those were not checked.
After structural changes: `graphify update src`, move output to root `graphify-out/`, and confirm no import cycles or 3d<->ui imports (`mem:core` invariants).
Update `ai-docs/TASK_PLAN.md` status when scope changes.
