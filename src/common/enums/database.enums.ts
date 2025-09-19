// Database enums corresponding to PostgreSQL ENUM types

export enum ContentType {
  QUIZ = 'quiz',
  ROLEPLAY = 'roleplay',
}

export enum QuizType {
  MULTIPLE_CHOICE = 'multiple_choice',
  VIDEO_COMPREHENSION = 'video_comprehension',
  AUDIO_COMPREHENSION = 'audio_comprehension',
  FORM_FILLING = 'form_filling',
  MATCHING_ITEM = 'matching_item',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

export enum RoleplaySpeaker {
  SYSTEM = 'system',
  USER = 'user',
}

export enum MatchLeftKind {
  TEXT = 'text',
  IMAGE = 'image',
}

export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  DATE = 'date',
  SELECT = 'select',
  COUNTRY = 'country',
  PHONE = 'phone',
}
