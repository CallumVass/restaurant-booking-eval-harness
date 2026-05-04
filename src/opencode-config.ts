// pattern: Functional Core

import { criticModelForVariant, reviewModelForVariant, sliceModelForVariant, type ModelVariant } from "./pipeline.js";

export function makeOpenCodeConfig(variant: ModelVariant) {
  const review = reviewModelForVariant(variant);
  const critic = criticModelForVariant(variant);
  const slice = sliceModelForVariant(variant);
  const externalDirectoryPermission = {
    "*": "deny",
    "/tmp/*": "allow"
  };
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
          external_directory: externalDirectoryPermission,
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
          external_directory: externalDirectoryPermission,
          webfetch: "allow",
          skill: "allow"
        },
        ...slice.agentOptions
      },
      "plan-reviewer": {
        model: review?.model ?? critic?.model ?? variant.plan.model,
        mode: "subagent",
        description: "Reviews whether the implementation followed the saved plan and scenario requirements.",
        permission: {
          read: "allow",
          edit: "deny",
          glob: "allow",
          grep: "allow",
          list: "allow",
          bash: "allow",
          external_directory: externalDirectoryPermission,
          webfetch: "allow",
          skill: "allow"
        },
        ...(review?.agentOptions ?? variant.plan.agentOptions)
      },
      build: {
        model: variant.build.model,
        permission: {
          external_directory: externalDirectoryPermission
        },
        ...variant.build.agentOptions
      },
      "eval-builder": {
        model: variant.build.model,
        mode: "subagent",
        description: "Implements the restaurant booking eval plan and verifies the completed product.",
        permission: {
          edit: "allow",
          bash: "allow",
          read: "allow",
          glob: "allow",
          grep: "allow",
          list: "allow",
          external_directory: externalDirectoryPermission,
          webfetch: "allow",
          skill: "allow"
        },
        ...variant.build.agentOptions
      }
    },
    permission: {
      edit: "allow",
      bash: "allow",
      external_directory: externalDirectoryPermission,
      webfetch: "allow"
    },
    snapshot: false
  };
}
