export type ScenarioConfig = {
  id: string;
  taskPath: string;
  baselinePath: string | null;
  judgeInstructions: string[];
};
