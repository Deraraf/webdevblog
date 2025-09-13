import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SocketContextProvider } from "@/context/SocketContext";
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
        <SocketContextProvider>
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
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      background: "rgb(51, 65, 85)",
                      color: "#fff",
                    },
                  }}
                />
                <footer>...</footer>
              </ThemeProvider>
            </body>
          </html>
        </SocketContextProvider>
      </SessionProvider>
    </EdgeStoreProvider>
  );
}
