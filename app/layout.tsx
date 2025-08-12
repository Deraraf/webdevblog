import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
export const metadata: Metadata = {
  title: "Webdev.blog",
  description: "A blog about web development",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <EdgeStoreProvider>
      <SessionProvider session={session}>
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(
              "antialiased flex flex-col min-h-screen text-black dark:text-white dark:bg-gray-950 bg-white"
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Toaster
                position="top-right"
                containerStyle={{
                  top: 200,
                  right: 200,
                }}
                toastOptions={{
                  style: {
                    padding: 0,
                    background: "transparent",
                    boxShadow: "none",
                  },
                }}
              />
              <footer>...</footer>
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </EdgeStoreProvider>
  );
}
