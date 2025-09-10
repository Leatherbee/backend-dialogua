# Reusable Conversation System

This document explains how to implement new conversation scenarios using the reusable conversation system.

## Architecture Overview

The conversation system is built with the following components:

1. **GenericAIService** - A generic AI service that can work with any OpenAI-compatible model
2. **BaseConversationService** - A base class that provides common conversation functionality
3. **Interfaces** - TypeScript interfaces that define the structure for conversation steps and scenarios
4. **ConversationServiceFactory** - A factory service that returns the appropriate conversation service based on scenario type

## Creating a New Conversation Scenario

To create a new conversation scenario, follow these steps:

### 1. Create a New Service File

Create a new file in `src/services/` with a name like `your-scenario-conversation.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { BaseConversationService } from './base-conversation.service';
import { GenericAIService } from './generic-ai.service';
import {
  ConversationStep,
  ScenarioContext,
  SystemPromptBuilder,
} from '../interfaces/conversation.interface';

// Your scenario specific prompt builder
export class YourScenarioPromptBuilder implements SystemPromptBuilder {
  buildPrompt(
    stepContext: ConversationStep,
    scenarioContext: ScenarioContext,
  ): string {
    // Build your custom system prompt here
    return `
    ${scenarioContext.persona}
    
    Tujuan: ${scenarioContext.scenario_title}.
    
    [SCENARIO CONTEXT]
    Scenario Code: ${scenarioContext.scenario_code}
    Scenario Title: ${scenarioContext.scenario_title}
    Current Step: ${stepContext.step_id}
    Step Goal: ${stepContext.step_goal}
    
    [RECENT DIALOG]
    ${stepContext.recent_dialog ?? ''}
    
    [USER INPUT]`;
  }
}

// Define your conversation steps
export const YOUR_SCENARIO_STEPS: ConversationStep[] = [
  {
    step_id: 'step1',
    step_goal: 'Your first step goal',
    target_vocab: ['word1', 'word2'],
    hints: ['Hint for this step'],
    recent_dialog: '',
  },
  // Add more steps as needed
];

// Define your scenario context
export const YOUR_SCENARIO_CONTEXT: ScenarioContext = {
  scenario_code: 'your_scenario_code',
  scenario_title: 'Your Scenario Title',
  persona: 'Description of the AI persona',
  style_guidelines: ['Guideline 1', 'Guideline 2'],
};

@Injectable()
export class YourScenarioConversationService extends BaseConversationService {
  constructor(protected readonly aiService: GenericAIService) {
    super(aiService);
    // Initialize with your specific configuration
    this.initializeConversation(
      YOUR_SCENARIO_STEPS,
      YOUR_SCENARIO_CONTEXT,
      new YourScenarioPromptBuilder(),
    );
  }
}
```

### 2. Register the Service

Add your new service to `src/app.module.ts`:

```typescript
import { YourScenarioConversationService } from './services/your-scenario-conversation.service';

@Module({
  // ... other imports
  providers: [
    // ... other services
    YourScenarioConversationService,
  ],
})
export class AppModule {}
```

### 3. Update the Factory Service

Update `src/services/conversation-service.factory.ts` to include your new scenario:

```typescript
import { YourScenarioConversationService } from './your-scenario-conversation.service';

export type ConversationScenario =
  | 'local-buddy'
  | 'classroom'
  | 'your-scenario'
  | string;

@Injectable()
export class ConversationServiceFactory {
  constructor(
    // ... other services
    private readonly yourScenarioService: YourScenarioConversationService,
  ) {}

  getService(scenario: ConversationScenario): BaseConversationService {
    switch (scenario) {
      case 'local-buddy':
        return this.localBuddyService;
      case 'classroom':
        return this.classroomService;
      case 'your-scenario':
        return this.yourScenarioService;
      default:
        return this.localBuddyService;
    }
  }

  getAvailableScenarios(): ConversationScenario[] {
    return ['local-buddy', 'classroom', 'your-scenario'];
  }
}
```

### 4. Use Your New Scenario

Your new scenario can now be used by specifying the scenario name in API requests:

```bash
POST /conversation
{
  "message": "Your message here",
  "scenario": "your-scenario"
}
```

## Key Benefits of This Architecture

1. **Reusability** - Common functionality is implemented in base classes
2. **Extensibility** - New scenarios can be added without modifying existing code
3. **Maintainability** - Each scenario is self-contained in its own service
4. **Flexibility** - Different scenarios can have different prompts, steps, and behaviors
5. **Type Safety** - TypeScript interfaces ensure consistency across scenarios

## Example Implementation

See `src/services/classroom-conversation.service.ts` for a complete example of how to implement a new conversation scenario.
