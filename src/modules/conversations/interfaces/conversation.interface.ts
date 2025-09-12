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

export interface AIResponse {
  ai_response: string;
  meta: {
    step_id: string;
    expected_vocab_matched: string[];
    hints_used: boolean;
    expressions: {
      sentence: number;
      label: string;
    }[];
  };
}
