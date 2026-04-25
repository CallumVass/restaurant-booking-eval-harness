# Baselines

Put sanitized source snapshots here for brownfield scenarios.

For Scenario 3, prefer creating `baselines/scenario-3/` from the selected Scenario 2 archive. Include project source and configuration only; exclude `.opencode/`, `.agents/`, `.lattice/`, `result.json`, dependency folders, build outputs, and coverage artifacts.

Run a seeded scenario with:

```bash
npm start -- --scenario 3 --base ./baselines/scenario-3
```
