---
name: strict
description: Launch the strict agent to review code for FP and type-safety violations in the background
disable-model-invocation: true
allowed-tools: Task
---

Launch the **strict** agent in the background using the Task tool with `subagent_type: "strict"` and `run_in_background: true`. Do not send any other text or messages besides this tool call.
