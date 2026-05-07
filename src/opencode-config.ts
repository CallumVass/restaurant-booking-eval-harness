// pattern: Functional Core

import {
  criticModelForVariant,
  reviewModelForVariant,
  securityReviewModelForVariant,
  sliceModelForVariant,
  usesWeaveAgents,
  type ModelVariant,
  type PhaseModel
} from "./pipeline.js";

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

export function makeWeaveConfig(variant: ModelVariant) {
  if (!usesWeaveAgents(variant)) return null;

  const review = reviewModelForVariant(variant) ?? variant.plan;
  const securityReview = securityReviewModelForVariant(variant) ?? review;
  const latticeWorkerHint =
    "When invoked by a Lattice pipeline, the Lattice stage prompt is the task contract. Follow it directly and use lattice_signal exactly as requested by that stage.";

  return {
    agents: {
      thread: weaveAgentOverride(variant.plan, {
        prompt_append: latticeWorkerHint
      }),
      spindle: weaveAgentOverride(variant.plan, {
        prompt_append: latticeWorkerHint
      }),
      pattern: weaveAgentOverride(variant.plan, {
        prompt_append: latticeWorkerHint
      }),
      shuttle: weaveAgentOverride(variant.build, {
        prompt_append: [
          latticeWorkerHint,
          "You may be invoked directly by Lattice rather than Tapestry. Execute the stage prompt completely; do not wait for a Tapestry-style delegation wrapper."
        ].join("\n")
      }),
      weft: weaveAgentOverride(review, {
        prompt_append: [
          latticeWorkerHint,
          "For Lattice review stages, translate APPROVE to lattice_signal(status: \"pass\"), REJECT to lattice_signal(status: \"fail\"), and unavailable evidence to lattice_signal(status: \"blocked\")."
        ].join("\n")
      }),
      warp: weaveAgentOverride(securityReview, {
        prompt_append: [
          latticeWorkerHint,
          "For Lattice security review stages, translate APPROVE to lattice_signal(status: \"pass\"), REJECT to lattice_signal(status: \"fail\"), and unavailable evidence to lattice_signal(status: \"blocked\")."
        ].join("\n")
      })
    }
  };
}

function weaveAgentOverride(phase: PhaseModel, extra: Record<string, unknown> = {}) {
  return {
    model: phase.model,
    ...(phase.agentOptions ? { modelOptions: phase.agentOptions } : {}),
    ...extra
  };
}
