// =============================================================================
// `web` 스키마 타입 (수기 작성 — 0001_web_schema_auth_rls.sql 과 1:1 대응).
// ⚠️ `web` 스키마가 Supabase API의 "Exposed schemas"에 추가된 뒤에는
//    `mcp__supabase__generate_typescript_types` 결과로 교체해 검증할 수 있습니다.
//    (현재 generate 결과는 public(esamath) 스키마만 포함됨)
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Row에서 Insert 타입 파생: Required 키만 필수, 나머지는 선택. */
type InsertOf<Row, Required extends keyof Row> = Partial<Row> &
  Pick<Row, Required>;

export type AppRole = "admin" | "parent" | "student";
export type PostStatus = "draft" | "published" | "archived";
export type MemberAudience = "parent" | "student" | "all";
export type MemberPostType = "notice" | "guide" | "resource" | "assignment";
export type GameType = "embed" | "internal";
export type GameVisibility = "public" | "student" | "member";
export type ConsultationStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";
export type AttachmentEntity = "post" | "member_post" | "consultation";

type ProfileRow = {
  id: string;
  email: string | null;
  nickname: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

type UserRoleRow = {
  id: number;
  user_id: string;
  role: AppRole;
  granted_by: string | null;
  created_at: string;
}

type PostCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  content_format: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  status: PostStatus;
  author_id: string | null;
  required_tier: string | null;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

type MemberPostRow = {
  id: string;
  title: string;
  content: string;
  content_format: string;
  audience: MemberAudience;
  post_type: MemberPostType;
  status: PostStatus;
  approval_status: string;
  pinned: boolean;
  due_at: string | null;
  author_id: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

type ParentQuestionRow = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  answer: string | null;
  answered_at: string | null;
  answered_by: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

type GameRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  game_type: GameType;
  embed_url: string | null;
  open_in: string;
  internal_key: string | null;
  visibility: GameVisibility;
  status: PostStatus;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

type GameResultRow = {
  id: string;
  game_id: string | null;
  internal_key: string | null;
  user_id: string;
  result: Json;
  created_at: string;
}

type ConsultationRow = {
  id: string;
  requester_user_id: string | null;
  student_name: string;
  parent_name: string | null;
  phone: string;
  email: string | null;
  grade: string | null;
  preferred_subject: string | null;
  preferred_at_1: string | null;
  preferred_at_2: string | null;
  channel: string | null;
  message: string | null;
  status: ConsultationStatus;
  privacy_consent: boolean;
  assigned_admin: string | null;
  admin_note: string | null;
  handled_at: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

type NewsletterSubscriberRow = {
  id: string;
  email: string;
  name: string | null;
  user_id: string | null;
  status: string;
  consent: boolean;
  created_at: string;
  unsubscribed_at: string | null;
}

type AttachmentRow = {
  id: string;
  entity_type: AttachmentEntity;
  entity_id: string;
  bucket: string;
  path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_by: string | null;
  created_at: string;
}

type SiteSettingRow = {
  key: string;
  value: Json;
  updated_by: string | null;
  updated_at: string;
}

export type Database = {
  // supabase-js 타입 헬퍼가 참조하는 내부 필드(생성 타입과 동일 형태).
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  web: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: InsertOf<ProfileRow, "id">;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: InsertOf<UserRoleRow, "user_id" | "role">;
        Update: Partial<UserRoleRow>;
        Relationships: [];
      };
      post_categories: {
        Row: PostCategoryRow;
        Insert: InsertOf<PostCategoryRow, "slug" | "name">;
        Update: Partial<PostCategoryRow>;
        Relationships: [];
      };
      posts: {
        Row: PostRow;
        Insert: InsertOf<PostRow, "slug" | "title">;
        Update: Partial<PostRow>;
        Relationships: [];
      };
      member_posts: {
        Row: MemberPostRow;
        Insert: InsertOf<MemberPostRow, "title" | "audience">;
        Update: Partial<MemberPostRow>;
        Relationships: [];
      };
      parent_questions: {
        Row: ParentQuestionRow;
        Insert: InsertOf<ParentQuestionRow, "author_id" | "title" | "content">;
        Update: Partial<ParentQuestionRow>;
        Relationships: [];
      };
      games: {
        Row: GameRow;
        Insert: InsertOf<GameRow, "slug" | "title" | "game_type">;
        Update: Partial<GameRow>;
        Relationships: [];
      };
      game_results: {
        Row: GameResultRow;
        Insert: InsertOf<GameResultRow, "user_id" | "result">;
        Update: Partial<GameResultRow>;
        Relationships: [];
      };
      consultations: {
        Row: ConsultationRow;
        Insert: InsertOf<
          ConsultationRow,
          "student_name" | "phone" | "privacy_consent"
        >;
        Update: Partial<ConsultationRow>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: InsertOf<NewsletterSubscriberRow, "email">;
        Update: Partial<NewsletterSubscriberRow>;
        Relationships: [];
      };
      attachments: {
        Row: AttachmentRow;
        Insert: InsertOf<
          AttachmentRow,
          "entity_type" | "entity_id" | "bucket" | "path" | "file_name"
        >;
        Update: Partial<AttachmentRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: InsertOf<SiteSettingRow, "key" | "value">;
        Update: Partial<SiteSettingRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      app_role: AppRole;
      post_status: PostStatus;
      member_audience: MemberAudience;
      member_post_type: MemberPostType;
      game_type: GameType;
      game_visibility: GameVisibility;
      consultation_status: ConsultationStatus;
      attachment_entity: AttachmentEntity;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

/** 편의 타입: 테이블 Row */
export type Tables<T extends keyof Database["web"]["Tables"]> =
  Database["web"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["web"]["Tables"]> =
  Database["web"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["web"]["Tables"]> =
  Database["web"]["Tables"][T]["Update"];
