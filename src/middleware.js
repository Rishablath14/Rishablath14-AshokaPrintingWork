import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login'

  const token = request.cookies.get('token')?.value || ''

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  } 
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  } 
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/add',
    '/login',
    '/customers',
    '/customers/:path*'
  ]
}