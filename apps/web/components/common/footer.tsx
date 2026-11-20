import { Bike, FileText, Github, LifeBuoy, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/public";

const HIGHLIGHTS = [
  {
    icon: Bike,
    title: "Bike inventory",
    description: "Manage your fleet efficiently",
  },
  {
    icon: FileText,
    title: "Document management",
    description: "All paperwork in one vault",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    description: "Get help when you need it",
  },
];

const SOCIALS = [
  {
    href: "https://github.com/mahabub-bd",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/mahabubhossainbd/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:contact@mahabub.me",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Highlights */}
        <section
          aria-labelledby="footer-features"
          className="grid grid-cols-1 gap-3 border-b py-8 sm:grid-cols-3"
        >
          <h2 id="footer-features" className="sr-only">
            Key features
          </h2>
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Brand + socials */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <Link
            href="/"
            className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Image
              src={Logo}
              alt="SawariBD home"
              className="h-7 w-auto"
              priority
            />
          </Link>

          <nav
            aria-label="Social links"
            className="flex items-center gap-1.5"
          >
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <section
          aria-labelledby="footer-legal"
          className="flex flex-col items-center justify-between gap-2 border-t py-5 text-center sm:flex-row sm:text-left"
        >
          <h2 id="footer-legal" className="sr-only">
            Legal information
          </h2>
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Sawari. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            A bike inventory &amp; document management platform · Developed by{" "}
            <Link
              href="https://mahabub.me"
              className="font-medium text-foreground/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mahabub Hossain
            </Link>
          </p>
        </section>
      </div>
    </footer>
  );
}
