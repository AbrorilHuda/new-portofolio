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

