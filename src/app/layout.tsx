import type { Metadata } from "next";
import { Rajdhani, Share_Tech_Mono } from "next/font/google";
import { ModeThemeController } from "@/components/mode-theme-controller";
import { TopBar } from "@/components/top-bar";
import { AuthProvider } from "@/context/auth-context";
import { ModeProvider } from "@/context/mode-context";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Share_Tech_Mono({
  variable: "--font-hud",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "C\u00edrculo de Fogo",
  description: "Jaegers, Kaijus e a guerra que nunca terminou.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${rajdhani.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ModeProvider>
          <AuthProvider>
            <ModeThemeController />
            <div className="fixed inset-0 -z-10 bg-[#02050d]" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.14),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,1))]" />
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
            <TopBar />
            {children}
          </AuthProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
