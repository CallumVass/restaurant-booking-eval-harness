// pattern: Functional Core

import { reviewModelForVariant, sliceModelForVariant, type ModelVariant } from "./pipeline.js";

export function makeOpenCodeConfig(variant: ModelVariant) {
  const review = reviewModelForVariant(variant);
  const slice = sliceModelForVariant(variant);
  return {
    $schema: "https://opencode.ai/config.json",
    model: variant.build.model,
    agent: {
      plan: {
        model: variant.plan.model,
        ...variant.plan.agentOptions
      },
      "eval-planner": {
        model: variant.plan.model,
        mode: "subagent",
        description: "Writes a concise implementation plan for the restaurant booking eval before build.",
        permission: {
          read: "allow",
          edit: "allow",
          glob: "allow",
          grep: "allow",
          list: "allow",
          bash: "deny",
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          },
          webfetch: "allow",
          skill: "allow"
        },
        ...variant.plan.agentOptions
      },
      "eval-slicer": {
        model: slice.model,
        mode: "subagent",
        description: "Converts an implementation plan into a bounded slice manifest and slice work packages.",
        permission: {
          read: "allow",
          edit: "allow",
          glob: "allow",
          grep: "allow",
          list: "allow",
          bash: "deny",
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          },
          webfetch: "allow",
          skill: "allow"
        },
        ...slice.agentOptions
      },
      "plan-reviewer": {
        model: review?.model ?? variant.plan.model,
        mode: "subagent",
        description: "Reviews whether the implementation followed the saved plan and scenario requirements.",
        permission: {
          read: "allow",
          edit: "deny",
          glob: "allow",
          grep: "allow",
          list: "allow",
          bash: "allow",
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          },
          webfetch: "allow",
          skill: "allow"
        },
        ...(review?.agentOptions ?? variant.plan.agentOptions)
      },
      build: {
        model: variant.build.model,
        permission: {
          external_directory: {
            "/tmp/*": "allow",
            "*": "deny"
          }
        },
        ...variant.build.agentOptions
      }
    },
    permission: {
      edit: "allow",
      bash: "allow",
      external_directory: {
        "/tmp/*": "allow",
        "*": "deny"
      },
      webfetch: "allow"
    },
    snapshot: false
  };
}
