import { NextRequest , NextResponse } from "next/server";
import { NextAuthOptions } from "next-auth";
export {default} from 'next-auth/middleware'
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Your middleware logic here\
  const token = await getToken({ req: request});
  const url = request.nextUrl

if(token && (
  url.pathname.startsWith('/sign-in') ||
  url.pathname.startsWith('/sign-up')  ||
  url.pathname.startsWith('/verify')  || 
  url.pathname === '/')
 )

  {
    return NextResponse.redirect(new URL('/dashboard', request.url));

}

if (!token && url.pathname.startsWith('/dashboard')) {
  return NextResponse.redirect(new URL('/sign-in', request.url));

}
}

export const config = {
    matcher: ['/' , '/sign-up' , '/sign-in' , '/dashboard/:path*'  , '/verify/:path*']

};


