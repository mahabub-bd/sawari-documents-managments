import { Bike, FileCheck2, FolderLock, ShieldCheck } from "lucide-react";
import { PropsWithChildren } from "react";
import Image from "next/image";

import { Logo } from "@/public";

const FEATURES = [
  {
    icon: FolderLock,
    title: "Secure document vault",
    description: "NID, license, and registration papers stored safely.",
  },
  {
    icon: Bike,
    title: "Bike & seller records",
    description: "Full purchase, witness, and transaction history.",
  },
  {
    icon: FileCheck2,
    title: "One-click PDF handouts",
    description: "Generate printable deal documents instantly.",
  },
];

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden w-[45%] max-w-xl flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-10 text-emerald-50 lg:flex">
        {/* Decorative shapes */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-teal-300/10 blur-2xl"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 items-center justify-center rounded-xl bg-white px-3.5">
            <Image
              src={Logo}
              alt="SawariBD logo"
              priority
              className="h-6 w-auto"
            />
          </span>
          <span className="text-lg font-semibold tracking-tight">SawariBD</span>
        </div>

        <div className="relative space-y-8">
          <h2 className="max-w-sm text-3xl font-bold leading-snug tracking-tight">
            Every bike deal,
            <br />
            documented with confidence.
          </h2>

          <ul className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-emerald-200/80">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-1.5 text-xs text-emerald-200/70">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Role-based access · Encrypted sessions · Activity auditing
        </p>
      </aside>

      {/* Form side */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
