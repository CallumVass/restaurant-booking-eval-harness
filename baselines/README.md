# Baselines

Put sanitized source snapshots here for brownfield scenarios.

For Scenario 2, prefer creating `baselines/scenario-2/` from the selected Scenario 1 archive. Include project source and configuration only; exclude `.opencode/`, `.agents/`, `.lattice/`, `result.json`, dependency folders, build outputs, and coverage artifacts.

Run a seeded scenario with:

```bash
npm start -- --scenario 2 --base ./baselines/scenario-2
```
