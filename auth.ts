/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password'},
      },
      async authorize(credentials){
        if(credentials == null) return null

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string
          }
        })

        if(user && user.password){
          const isMatches = compareSync(credentials.password as string, user.password)
          if(isMatches) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        } 

        return null
      }
    })
  ],
  callbacks: {
    async session({session, user, token, trigger}: any) {
      session.user.id = token.sub
      session.user.role = token.role
      session.user.name = token.name

      if(trigger === 'update'){
        session.user.name = user.name
      }
      return session
    },
    async jwt({token, user, trigger}: any){
      if(user){
        token.role = user.role
        token.id = user.id
        if(user.name === "NO_NAME"){
          token.name = user.email!.split('@')[0]
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              name: token.name
            }
          })
        }
        if(trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get('sessionCartId')?.value

          if(sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {
                sessionCartId
              }
            })

            if(sessionCart){
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id
                }
              })
              await prisma.cart.update({
                where: {
                  id: sessionCart.id
                },
                data: {
                  userId: user.id
                }
              })
            }
          }
        }
      }
      return token
    },
    authorized({request, auth}){
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const {pathname} = request.nextUrl;

      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        return false;
      }
      if(!request.cookies.get('sessionCartId')){
        const sessionCartId = crypto.randomUUID()
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        })
        response.cookies.set('sessionCartId', sessionCartId)
        return response
      } else {
        return true
      }
    }
  },
} satisfies NextAuthConfig

export const {handlers, auth, signIn, signOut} = NextAuth(config)