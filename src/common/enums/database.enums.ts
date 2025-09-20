// Database enums corresponding to PostgreSQL ENUM types

export enum LevelContentType {
  QUIZ = 'quiz',
  ROLEPLAY = 'roleplay',
}

export enum QuizType {
  MULTIPLE_CHOICE = 'multiple_choice',
  MATCHING_ITEM = 'matching_item',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum RoleplaySpeaker {
  SYSTEM = 'system',
  USER = 'user',
}
