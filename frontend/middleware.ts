import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

/* retrieved from
 https://supabase.com/docs/guides/auth/server-side/nextjs?fbclid=IwZXh0bgNhZW0CMTEAAR0Zv0WiYg8IXLAD03uJUNDVVC2HnlTrTEfnfhUO1m2bna5gW90uNPnvGhc_aem_CerYh_DAczRtHY5Migqm-w&queryGroups=router&router=app
*/
