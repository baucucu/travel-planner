"use client";
import Image from "next/image";
import { AuthModal } from "@/components/AuthModal";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current route:", pathname);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="Logo" width={40} height={40} className="dark:invert" />
        </div>
        <div className="flex gap-2">
          <a
            href="#get-started"
            className="rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-2 font-medium text-sm shadow hover:opacity-90 transition"
          >
            Get Started
          </a>
          <AuthModal onAuthSuccess={() => router.replace("/dashboard")} />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">AI Travel Planner</h1>
      </main>
    </div>
  );
}
