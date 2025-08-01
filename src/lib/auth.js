// lib/auth.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function getUserIdFromSession(req) {
  const supabase = createRouteHandlerClient({ cookies: () => req.cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id;
}