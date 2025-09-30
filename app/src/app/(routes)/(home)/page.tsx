"use client";

import FrameExtractor from "@/components/FrameExtractor";
import { useSession } from "@/lib/auth/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SignOutButton from "../(auth)/components/button-signout";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">YouTube Frame Extractor</h1>
          <p className="text-lg text-gray-600">Extract high-quality frames from YouTube videos instantly</p>
        </header>

        {session ? (
          <div className="text-center mb-8">
            <p className="text-gray-700">Welcome back, {session.user?.name}!</p>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <p className="text-gray-700 mb-4">Sign in to access UHD quality frames</p>
            <Link href="/signin" className={cn(buttonVariants({ variant: "default" }))}>
              Sign In
            </Link>
          </div>
        )}

        <FrameExtractor />
      </div>
    </div>
  );
}
