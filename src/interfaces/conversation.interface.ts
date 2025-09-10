// Generic interfaces for reusable conversation system

export interface ConversationStep {
  step_id: string;
  step_goal: string;
  target_vocab: string[];
  hints: string[];
  recent_dialog?: string;
}

export interface ScenarioContext {
  scenario_code: string;
  scenario_title: string;
  persona: string;
  style_guidelines: string[];
  technical_requirements?: string[];
}

export interface SystemPromptBuilder {
  buildPrompt(
    stepContext: ConversationStep,
    scenarioContext: ScenarioContext,
  ): string;
}
