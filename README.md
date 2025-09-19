# Dialogua Backend API Documentation

A comprehensive language learning platform backend built with NestJS, TypeORM, and PostgreSQL.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication-endpoints)
  - [User Management](#user-management)
  - [Programs & Units](#programs--units)
  - [Levels & Content](#levels--content)
  - [Quizzes & Questions](#quizzes--questions)
  - [Roleplay & Conversations](#roleplay--conversations)
  - [Progress Tracking](#progress-tracking)
  - [Media Assets](#media-assets)
- [Error Responses](#error-responses)
- [Data Models](#data-models)

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:9000`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow
1. Register a new user or login with existing credentials
2. Receive JWT access token and refresh token
3. Use access token for authenticated requests
4. Refresh token when access token expires

## API Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1758247798822
}
```

---

## Authentication Endpoints

### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### POST /api/v1/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:** Same as register response.

### POST /api/v1/auth/login/apple
Login with Apple ID token.

**Request Body:**
```json
{
  "token": "apple-id-token"
}
```

**Response:** Same as register response.

### POST /api/v1/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** Same as login response with new tokens.

### GET /auth/apple
Initiate Apple OAuth authentication flow.

### GET /auth/apple/callback
Handle Apple OAuth callback.

---

## User Management

### GET /user
Get all users.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /user/:id
Get user by ID.

**Parameters:**
- `id` (UUID): User ID

**Response:** Single user object.

### POST /user
Create a new user.

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "password": "password123"
}
```

### PATCH /user/:id
Update user information.

**Parameters:**
- `id` (UUID): User ID

**Request Body:** Partial user object with fields to update.

### DELETE /user/:id
Delete a user.

**Parameters:**
- `id` (UUID): User ID

---

## Programs & Units

### GET /programs
Get all learning programs.

**Response:**
```json
[
  {
    "id": "program-id",
    "name": "BIPA Level 1",
    "description": "Beginner Indonesian language program",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /programs/:id
Get program by ID.

### POST /programs
Create a new program.

### PATCH /programs/:id
Update a program.

### DELETE /programs/:id
Delete a program.

### GET /units
Get all units or filter by program.

**Query Parameters:**
- `programId` (optional): Filter units by program ID

### GET /units/:id
Get unit by ID.

### POST /units
Create a new unit.

### PATCH /units/:id
Update a unit.

### DELETE /units/:id
Delete a unit.

---

## Levels & Content

### GET /levels
Get all levels.

**Response:**
```json
[
  {
    "id": "level-id",
    "title": "Greetings and Introductions",
    "description": "Learn basic greetings",
    "banner_url": "https://example.com/banner.jpg",
    "level_type": "beginner"
  }
]
```

### GET /levels/:id
Get level by ID.

### POST /levels
Create a new level with optional banner upload.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title`: Level title
- `description`: Level description
- `level_type`: Level difficulty
- `banner` (file, optional): Banner image

### PATCH /levels/:id
Update a level.

### DELETE /levels/:id
Delete a level.

### GET /unit-level
Get all unit levels or filter by unit.

**Query Parameters:**
- `unitId` (optional): Filter by unit ID

### GET /unit-level/:id
Get unit level by ID.

### GET /unit-level/unit/:unitId
Get all levels for a specific unit.

### POST /unit-level
Create a new unit level.

### PATCH /unit-level/:id
Update a unit level.

### DELETE /unit-level/:id
Delete a unit level.

### GET /content-items
Get all content items with optional filtering.

**Query Parameters:**
- `unitLevelId` (optional): Filter by unit level ID
- `type` (optional): Filter by content type (quiz, roleplay, form)

### GET /content-items/:id
Get content item by ID.

### POST /content-items
Create a new content item.

### PATCH /content-items/:id
Update a content item.

### DELETE /content-items/:id
Delete a content item.

---

## Quizzes & Questions

### GET /quizzes
Get all quizzes or filter by content item.

**Query Parameters:**
- `contentItemId` (optional): Filter by content item ID

### GET /quizzes/:id
Get quiz by ID.

### POST /quizzes
Create a new quiz.

### PATCH /quizzes/:id
Update a quiz.

### DELETE /quizzes/:id
Delete a quiz.

### GET /quiz-options
Get all quiz options or filter by quiz.

**Query Parameters:**
- `quizId` (optional): Filter by quiz ID

### GET /quiz-options/:id
Get quiz option by ID.

### POST /quiz-options
Create a new quiz option.

### PATCH /quiz-options/:id
Update a quiz option.

### DELETE /quiz-options/:id
Delete a quiz option.

### GET /matching-questions
Get all matching questions or filter by content item.

**Query Parameters:**
- `contentItemId` (optional): Filter by content item ID

### GET /matching-questions/:id
Get matching question by ID.

### POST /matching-questions
Create a new matching question.

### PATCH /matching-questions/:id
Update a matching question.

### DELETE /matching-questions/:id
Delete a matching question.

### GET /matching-pairs
Get all matching pairs or filter by question.

**Query Parameters:**
- `matchingQuestionId` (optional): Filter by matching question ID

### GET /matching-pairs/:id
Get matching pair by ID.

### POST /matching-pairs
Create a new matching pair.

### PATCH /matching-pairs/:id
Update a matching pair.

### DELETE /matching-pairs/:id
Delete a matching pair.

### GET /form-questions
Get all form questions or filter by content item.

**Query Parameters:**
- `contentItemId` (optional): Filter by content item ID

### GET /form-questions/:id
Get form question by ID.

### POST /form-questions
Create a new form question.

### PATCH /form-questions/:id
Update a form question.

### DELETE /form-questions/:id
Delete a form question.

### GET /form-fields
Get all form fields or filter by form question.

**Query Parameters:**
- `formQuestionId` (optional): Filter by form question ID

### GET /form-fields/:id
Get form field by ID.

### POST /form-fields
Create a new form field.

### PATCH /form-fields/:id
Update a form field.

### DELETE /form-fields/:id
Delete a form field.

---

## Roleplay & Conversations

### GET /roleplay
Get all roleplays or filter by content item.

**Query Parameters:**
- `contentItemId` (optional): Filter by content item ID

### GET /roleplay/:id
Get roleplay by ID.

### POST /roleplay
Create a new roleplay scenario.

### PATCH /roleplay/:id
Update a roleplay scenario.

### DELETE /roleplay/:id
Delete a roleplay scenario.

### GET /roleplay-turn
Get all roleplay turns or filter by roleplay.

**Query Parameters:**
- `roleplayId` (optional): Filter by roleplay ID

### GET /roleplay-turn/:id
Get roleplay turn by ID.

### POST /roleplay-turn
Create a new roleplay turn.

### PATCH /roleplay-turn/:id
Update a roleplay turn.

### DELETE /roleplay-turn/:id
Delete a roleplay turn.

### GET /roleplay-attempt
Get all roleplay attempts with optional filtering.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `roleplayId` (optional): Filter by roleplay ID

### GET /roleplay-attempt/:id
Get roleplay attempt by ID.

### POST /roleplay-attempt
Create a new roleplay attempt.

### PATCH /roleplay-attempt/:id
Update a roleplay attempt.

### DELETE /roleplay-attempt/:id
Delete a roleplay attempt.

---

## AI Conversation Endpoints

### GET /api/v1
Check if AI services are running.

**Response:**
```
"AI Services are running!"
```

### POST /api/v1/transcribe
Transcribe audio to text.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `audio` (file): Audio file to transcribe
- `details` (boolean, optional): Include detailed transcription data

**Response:**
```json
{
  "success": true,
  "transcription": "Hello, how are you today?"
}
```

### POST /api/v1/tts
Convert text to speech.

**Request Body:**
```json
{
  "text": "Hello, how are you?",
  "model": "tts-1",
  "voice": "alloy",
  "format": "mp3",
  "speed": 1.0
}
```

**Response:** Audio file or base64 encoded audio.

### POST /api/v1/chat
Chat with AI assistant.

**Request Body:**
```json
{
  "message": "Hello, I want to practice Indonesian",
  "scenario": "local-buddy",
  "sessionId": "user-session-123",
  "action": "start"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "ai_response": "Halo! Senang bertemu dengan Anda. Bagaimana kabar Anda hari ini?",
    "meta": {
      "expected_vocab_matched": ["halo", "kabar"],
      "hints_used": false,
      "expressions": [
        {
          "sentence": 1,
          "label": "greeting"
        }
      ]
    }
  }
}
```

### POST /api/v1/chat/initial
Get initial AI message for a scenario.

**Request Body:**
```json
{
  "scenario": "local-buddy",
  "sessionId": "user-session-123"
}
```

### GET /api/v1/scenarios
Get available chat scenarios.

### GET /api/v1/voices
Get available TTS voices.

### GET /api/v1/models
Get available AI models.

### POST /api/v1/tts/stream
Stream text-to-speech audio.

### POST /api/v1/chat/stream
Chat with streaming TTS response.

### POST /api/v1/chat/audio
Chat with audio response.

---

## Progress Tracking

### GET /user-level-progress
Get all user progress or filter by user/level.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `levelId` (optional): Filter by level ID

**Response:**
```json
[
  {
    "id": 1,
    "user_id": "uuid-string",
    "level_id": 1,
    "progress_percentage": 75,
    "completed": false,
    "started_at": "2024-01-01T00:00:00.000Z",
    "completed_at": null
  }
]
```

### GET /user-level-progress/:id
Get progress record by ID.

### GET /user-level-progress/user/:userId/level/:levelId
Get specific user's progress for a level.

### POST /user-level-progress
Create a new progress record.

### PATCH /user-level-progress/:id
Update progress record.

### DELETE /user-level-progress/:id
Delete progress record.

---

## Media Assets

### GET /media-assets
Get all media assets or filter by type.

**Query Parameters:**
- `type` (optional): Filter by media type (image, video, audio)

**Response:**
```json
[
  {
    "id": 1,
    "filename": "lesson1-audio.mp3",
    "original_name": "Lesson 1 Audio.mp3",
    "mime_type": "audio/mpeg",
    "size": 1024000,
    "url": "https://example.com/media/lesson1-audio.mp3",
    "type": "audio"
  }
]
```

### GET /media-assets/:id
Get media asset by ID.

### POST /media-assets
Upload a new media asset.

### PATCH /media-assets/:id
Update media asset metadata.

### DELETE /media-assets/:id
Delete a media asset.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Data Models

### User
```typescript
{
  id: string (UUID)
  first_name: string
  last_name: string
  email: string
  apple_id?: string
  created_at: Date
  updated_at: Date
}
```

### Program
```typescript
{
  id: string
  name: string
  description: string
  created_at: Date
  updated_at: Date
}
```

### Unit
```typescript
{
  id: number
  program_id: string
  title: string
  description: string
  order_index: number
  created_at: Date
  updated_at: Date
}
```

### Level
```typescript
{
  id: string
  title: string
  description: string
  banner_url?: string
  level_type: 'beginner' | 'intermediate' | 'advanced'
  created_at: Date
  updated_at: Date
}
```

### ContentItem
```typescript
{
  id: number
  unit_level_id: number
  title: string
  description: string
  content_type: 'quiz' | 'roleplay' | 'form'
  order_index: number
  created_at: Date
  updated_at: Date
}
```

### Quiz
```typescript
{
  id: number
  content_item_id: number
  question: string
  quiz_type: 'multiple_choice' | 'video_comprehension'
  created_at: Date
  updated_at: Date
}
```

### UserLevelProgress
```typescript
{
  id: number
  user_id: string
  level_id: number
  progress_percentage: number
  completed: boolean
  started_at: Date
  completed_at?: Date
}
```

---

## Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Environment Variables
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=dialogua

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Apple OAuth
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

---

## Support

For questions and support, please contact the development team or create an issue in the project repository.
