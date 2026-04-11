import { createClient } from '@supabase/supabase-js';

// Vite 환경변수는 기본적으로 string | undefined 일 수 있으므로 as string으로 단언
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://pvxsayxhgpdngslrzxph.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '서버_토큰값';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);