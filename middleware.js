import { NextResponse } from "next/server";

export default function middleware(req) {

  let verify = req.cookies.get('loggedIn');
  let url = req.url

  // if (req.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.rewrite(new URL('/about-2', req.url))
  // }

  // if (req.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.rewrite(new URL('/dashboard/user', req.url))
  // }

  console.log('yeah its very simple')
  // if(!verify && url.includes('/dashboard')) {
  //   return NextResponse.redirect('http://localhost:3000/')
  // }

  // if(!verify && url === 'http://localhost:3000/signup') {
  //   return NextResponse.redirect('http://localhost:3000/')
  // }

}