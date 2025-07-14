import { NextAuthProvider } from "@/components/providers/provider_session";
import "./globals.css";
import ProvidersQuery from "@/components/providers/query_provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body
        className={`antialiased`}
      >   <ProvidersQuery> <NextAuthProvider>
  
        {children}</NextAuthProvider></ProvidersQuery>
      </body>
    </html>
  );
}
