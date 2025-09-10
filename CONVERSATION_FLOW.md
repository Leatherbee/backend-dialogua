// Conversation flow demonstration
// This file shows how the conversation steps are integrated into the codebase

/\*
The conversation flow has been integrated into the codebase with the following features:

1. Defined conversation steps in the ConversationService:
   - Step 1: Menyapa di bandara (Greetings at the airport)
   - Step 2: Tukar nama dengan sopan (Exchange names politely)
   - Step 3: Menyebutkan asal negara (Mention country of origin)
   - Step 4: Membicarakan tujuan selanjutnya (Discuss next destination - campus/dormitory)
   - Step 5: Mengucapkan terima kasih (Saying thank you)

2. Each step includes:
   - step_id: Unique identifier for the step
   - step_goal: The learning objective for this step
   - target_vocab: Key vocabulary words for this step
   - hints: Guidance for users on how to respond
   - recent_dialog: Context from previous conversation turns

3. The conversation flow is managed by the ConversationService which:
   - Tracks the current step in the conversation
   - Advances to the next step when appropriate
   - Maintains conversation history
   - Resets the conversation when needed

4. The AI service uses the step context to generate appropriate responses that match the learning objectives

5. The API endpoint at POST /conversation handles the conversation flow:
   - Accepts user messages
   - Processes them with the AI service using the current step context
   - Advances the conversation to the next step
   - Returns the AI response along with conversation state information

Example usage:
POST /conversation
{
"message": "Halo, selamat siang!",
"action": "reset" // Optional: reset the conversation
}

The conversation will automatically progress through the defined steps as users interact with the system.
\*/
