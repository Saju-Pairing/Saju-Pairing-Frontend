import { supabase } from './supabase'

// 카카오 로그인 (프론트엔드에서 호출)
export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 현재 세션 가져오기
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// 현재 유저 프로필 가져오기
export async function getProfile() {
  const session = await getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) throw error
  return data
}
