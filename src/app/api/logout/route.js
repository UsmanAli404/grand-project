import { createServerClient } from '@supabase/ssr'

export default async function handler(req, res) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: req.cookies, headers: req.headers }
  )

  await supabase.auth.signOut()

  res.setHeader(
    'Set-Cookie',
    'sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
  )

  return res.redirect('/login')
}