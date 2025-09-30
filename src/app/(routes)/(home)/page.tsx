"use client";"use client";import { buttonVariants } from "@/components/ui/button";



import FrameExtractor from "@/components/FrameExtractor";import { cn } from "@/lib/utils";

import { useSession } from "@/lib/auth/client";

import { Button } from "@/components/ui/button";import FrameExtractor from "@/components/FrameExtractor";import Image from "next/image";

import { cn } from "@/lib/utils";

import Link from "next/link";import { useSession } from "@/lib/auth/client";import Link from "next/link";

import SignOutButton from "../(auth)/components/button-signout";

import { Button } from "@/components/ui/button";import SignOutButton from "../(auth)/components/button-signout";

export default function Home() {

  const { data: session } = useSession();import { cn } from "@/lib/utils";import { getMe } from "@/actions/user";



  return (import Link from "next/link";

    <div className="min-h-screen bg-gray-50 py-12">

      <div className="max-w-4xl mx-auto px-4">import SignOutButton from "../(auth)/components/button-signout";export default async function Home() {

        <header className="text-center mb-8">

          <h1 className="text-4xl font-bold text-gray-900 mb-2">YouTube Frame Extractor</h1>  const me = await getMe();

          <p className="text-lg text-gray-600">

            Extract high-quality frames from YouTube videos instantlyexport default function Home() {

          </p>

        </header>  const { data: session } = useSession();  return (



        {session ? (    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">

          <div className="text-center mb-8">

            <p className="text-gray-700">Welcome back, {session.user?.name}!</p>  return (      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">

            <div className="mt-4">

              <SignOutButton />    <div className="min-h-screen bg-gray-50 py-12">        <Image

            </div>

          </div>      <div className="max-w-4xl mx-auto px-4">          className="dark:invert"

        ) : (

          <div className="text-center mb-8">        <header className="text-center mb-8">          src="/next.svg"

            <p className="text-gray-700 mb-4">Sign in to access UHD quality frames</p>

            <Link          <h1 className="text-4xl font-bold text-gray-900 mb-2">YouTube Frame Extractor</h1>          alt="Next.js logo"

              href="/signin"

              className={cn(Button({ variant: "default" }))}          <p className="text-lg text-gray-600">          width={180}

            >

              Sign In            Extract high-quality frames from YouTube videos instantly          height={38}

            </Link>

          </div>          </p>          priority

        )}

        </header>        />

        <FrameExtractor />

      </div>        <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">

    </div>

  );        {session ? (          <li className="mb-2">

}
          <div className="text-center mb-8">            Get started by editing{" "}

            <p className="text-gray-700">Welcome back, {session.user?.name}!</p>            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">

            <div className="mt-4">              src/app/page.tsx

              <SignOutButton />            </code>

            </div>            .

          </div>          </li>

        ) : (          <li>Save and see your changes instantly.</li>

          <div className="text-center mb-8">        </ol>

            <p className="text-gray-700 mb-4">Sign in to access UHD quality frames</p>

            <Link        <div className="flex flex-col items-center gap-4 sm:flex-row">

              href="/signin"          <a

              className={cn(Button({ variant: "default" }))}            className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"

            >            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"

              Sign In            target="_blank"

            </Link>            rel="noopener noreferrer"

          </div>          >

        )}            <Image

              className="dark:invert"

        <FrameExtractor />              src="/vercel.svg"

      </div>              alt="Vercel logomark"

    </div>              width={20}

  );              height={20}

}            />
            Deploy now
          </a>
          <a
            className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        {me ? (
          <div className="flex w-full flex-col gap-5">
            <h2>Hi, {me.name}</h2>
            <p>{me.email}</p>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href={"/signin"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Sign In
          </Link>
        )}
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
