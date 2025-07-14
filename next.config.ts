import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       // headers: [
  //       //   {
  //       //     key: 'X-Frame-Options',
  //       //     value: 'DENY',
  //       //   },
  //       //   {
  //       //     key: 'X-Content-Type-Options',
  //       //     value: 'nosniff',
  //       //   },
  //       //   {
  //       //     key: 'Referrer-Policy',
  //       //     value: 'origin-when-cross-origin',
  //       //   },
  //       //   // {
  //       //   //   key: 'X-XSS-Protection',
  //       //   //   value: '1; mode=block',
  //       //   // },
  //       //   {
  //       //     key: 'Strict-Transport-Security',
  //       //     value: 'max-age=31536000; includeSubDomains',
  //       //   },
  //       //   // {
  //       //   //   key: 'Content-Security-Policy',
  //       //   //   value: "default-src 'self'; script-src 'self'  http://localhost:4000 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://accounts.google.com; frame-src https://accounts.google.com;",
  //       //   // },
  //       // ],
  //     },
  //   ];
  // },
images: {
    domains: ['picsum.photos'],
  },


};

export default nextConfig;