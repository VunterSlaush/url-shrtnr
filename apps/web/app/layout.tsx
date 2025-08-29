import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleButton } from "./components/googleButton";
import Image from "next/image";
import { getUser, isLoggedIn } from "./user";
import { UserMenu } from "@repo/ui";
import { logout } from "./actions";


export const metadata: Metadata = {
  title: "SHRTNR!",
  description: "Generate short urls with ease!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const loggedIn = await isLoggedIn();
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <Toaster />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <main className="flex flex-col items-center justify-between min-h-screen relative">
            <div className="absolute top-8 right-8">
              {loggedIn ? <UserMenu userName={user.user ?? '👤'} avatarUrl={user.avatar ?? ''} onLogout={logout} /> : <GoogleButton />}
            </div>
            {children}
          </main>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
