import {  NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

import { User } from "next-auth";
import{cookies} from "next/headers"
import { ProviderType } from "@/lib/types/providerType";
import safeJsonStringify from "safe-json-stringify";
interface ExtendedGoogleProfile extends GoogleProfile {
  sub: string;
  given_name: string;
  family_name: string;
  email: string;
}

interface Users extends User {
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const handler: NextAuthOptions = {
  
  pages: {

  },
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
    maxAge:  60 * 60*24, 
    updateAge: 15 * 60, 
  },
  providers: [
    
    GoogleProvider({
      name:"shopify",
   clientId: process.env.GOOGLE_CLIENT_ID as string,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
   

    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, _req) {

        if (process.env.NODE_ENV === 'development') {
          console.log(_req.method, "to api login");
        }
        const res = await fetch(`${process.env.BASE_URL}/users/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
            credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });
        const resp = await res.json();
        if (res.status === 201) {  
  
              
                  res.headers.getSetCookie().forEach(async str => {
    const [nameValue, ...options] = str.split(';').map(p => p.trim());
    const [name, value] = nameValue.split('=');
    const maxAgeStr = options.find(o => o.toLowerCase().startsWith('max-age='))?.split('=')[1];
    (await cookies()).set({
      name,
      value,
      maxAge: maxAgeStr !== undefined ? Number(maxAgeStr) : undefined,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });


       const user = {
            id: resp.Auth.sub,
            email: resp.Auth.email,
            firstName: resp.Auth.firstName,
            lastName: resp.Auth.lastName,
            role: resp.Auth.role,
          };
          return user as User;
          
        } else if (resp.status === 401) {
          return null; 
        } else {
          return null; 
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (process.env.NODE_ENV === 'development') {
        console.log("JWT CALLBACK", { token, user });
      }
  if (user) {
    (user as Users) = {
      id: user.id,
      email: user.email,
      firstName: (user as Users).firstName,
      lastName: (user as Users).lastName,
      role: (user as Users).role
    };
    token.user = user;
  }
  return token;

  },
    
    async session({ session, token }) {
        
      session.user = token.user as Users;

             
                 return session;
    },
    async signIn({ account,user,profile}) {
      if(account?.provider=="google"){
const googleProfile = profile as ExtendedGoogleProfile;

         const googleId =googleProfile.sub;
try{
   const res=   await fetch(`${process.env.BASE_URL}/users/google_signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: safeJsonStringify({
          providerType:ProviderType.GOOGLE,
       providerId:   googleId,
          email: googleProfile .email,
          firstName:googleProfile .given_name,
          lastName:googleProfile .family_name
        }),
      });

              const resp = await res.json();

        if (res.ok) {  
  
              
                  res.headers.getSetCookie().forEach(async str => {
    const [nameValue, ...options] = str.split(';').map(p => p.trim());
    const [name, value] = nameValue.split('=');
    const maxAgeStr = options.find(o => o.toLowerCase().startsWith('max-age='))?.split('=')[1];
    (await cookies()).set({
      name,
      value,
      maxAge: maxAgeStr !== undefined ? Number(maxAgeStr) : undefined,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

user.email = resp.Auth.email;
          (user as Users) .firstName = resp.Auth.firstName ; 
            (user as Users) .lastName = resp.Auth.lastName  ;
            (user as Users) .role = resp.Auth.role ;
    return true;
}
if (res.status === 401) {
          return false; 
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error during Google sign-in:", resp.message);
          }
          return false; 
        }

}
catch(er){
console.error("Error during Google sign-in:", er);  
  return false;
}

      }
      else{
      return true;
    }},
  },
  debug: process.env.NODE_ENV === 'development'
}