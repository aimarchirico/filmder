import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
  
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    )
  }

/* retrieved from
 https://supabase.com/docs/guides/auth/server-side/nextjs?fbclid=IwZXh0bgNhZW0CMTEAAR0Zv0WiYg8IXLAD03uJUNDVVC2HnlTrTEfnfhUO1m2bna5gW90uNPnvGhc_aem_CerYh_DAczRtHY5Migqm-w&queryGroups=router&router=app
*/