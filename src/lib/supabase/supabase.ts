import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name?: string;
};

export type FeedbackMessage = {
  id: string;
  name: string;
  message: string;
  type: 'quick_feedback' | 'contact_form';
  email?: string;
  page_url?: string;
  created_at: string;
  read: boolean;
  replied: boolean;
};


export type Thought = {
  id: string;
  content: string;
  images?: string[];
  created_at: string;
  is_public: boolean;
  likes_count: number;
  comments_count: number;
};

export type ThoughtLike = {
  id: string;
  thought_id: string;
  user_ip?: string;
  created_at: string;
};

export type ThoughtComment = {
  id: string;
  thought_id: string;
  name: string;
  content: string;
  created_at: string;
};

export type NowItem = {
  id: string;
  project_name: string;
  github_url: string;
  tasks: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};
