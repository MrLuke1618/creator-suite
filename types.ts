export enum Tool {
  DASHBOARD = 'dashboard',
  IDEA_LAB = 'idea_lab',
  PRODUCTION_STUDIO = 'production_studio',
  CONTENT_CALENDAR = 'content_calendar',
  VIDEO_LAB = 'video_lab',
  ANALYTICS_HUB = 'analytics_hub',
}

export enum ContentStatus {
  IDEA = 'Idea',
  SCRIPTING = 'Scripting',
  FILMING = 'Filming',
  EDITING = 'Editing',
  PUBLISHED = 'Published',
}

export enum Language {
  EN = 'en',
  VI = 'vi',
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  status: ContentStatus;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'YouTube Shorts';
}

export interface Thumbnail {
  name: string;
  dataUrl: string;
  base64: string;
}

export interface BrainstormIdea {
  title: string;
  description: string;
  hook: string;
  keywords: string[];
  monetization: string;
  visualConcepts: string[];
  sfxSuggestions: string[];
}

export interface IdeaLabResult {
  ideas: BrainstormIdea[];
  targetAudience: string;
  suggestedFormats: string[];
}

export interface OptimizedContent {
    titles: string[];
    description: string;
    tags: string[];
}

export interface RephrasingSuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

export interface ScriptAnalysisFeedback {
  overallFeedback: string;
  rephrasingSuggestions: RephrasingSuggestion[];
  ctaSuggestions: string[];
  rewrittenScript: string;
}

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  deadline?: string;
}

export interface AudienceAnalysisResult {
  predictedDemographics: {
    ageRange: string;
    interests: string[];
  };
  engagementAnalysis: {
    predictedSentiment: string;
    emotionalTriggers: string[];
  };
  suggestedQuestions: string[];
  automatedCommentReplies: string[];
}

export interface ViralClipSuggestion {
  clipScript: string;
  suggestedTitle: string;
  viralityReason: string;
  suggestedHashtags: string[];
  visualIdeas: string[];
  sfxAndAnimations: string[];
}

export interface ViralClipsResult {
  clips: ViralClipSuggestion[];
  overallSummary: string;
}

export interface ImageMetadata {
  seoTags: string[];
  altText: string;
  socialMediaCaption: string;
}

export interface Chapter {
  timestamp: string; // "MM:SS"
  title: string;
}

export interface CommentAnalysis {
  overallSentiment: string;
  commonThemes: string[];
  futureVideoIdeas: string[];
}

export interface Preset {
  id: string;
  name: string;
  context: string;
}

export interface FlaggedContent {
  quote: string;
  issueType: string;
  explanation: string;
}

export interface BrandSafetyAnalysis {
  overallTone: string;
  brandSafetySummary: string;
  potentialIssues: FlaggedContent[];
}