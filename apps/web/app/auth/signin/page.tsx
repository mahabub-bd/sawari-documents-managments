import { ArrowRight, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SignInform from "@/components/auth/signin-form";
import { Logo } from "@/public";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src={Logo}
            alt="SawariBD logo"
            priority
            className="h-9 w-auto"
          />
        </div>

        <div className="mb-6 border-t border-border/60 pt-6 text-center">
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:text-sky-400">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account.
          </p>
        </div>

        <SignInform />

        <p className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          Trouble signing in?
          <Link
            href="/"
            className="inline-flex items-center gap-0.5 font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Contact support
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}
