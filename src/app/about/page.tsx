import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { StarBackdrop } from "@/components/ui/StarBackdrop";
import { EXPERIENCE_DATA } from "@/data/experience";
import { PROFILE } from "@/data/profile";
import { CONTACT } from "@/lib/contact";

export const metadata = { title: "About | Space Portfolio" };

interface ContactItem {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  external: boolean;
}

/** Items with no configured value (e.g. missing env var) are left out. */
function buildContactItems(): ContactItem[] {
  const items: (ContactItem | null)[] = [
    { label: "GitHub", value: "chameleon54", href: PROFILE.github, icon: Github, external: true },
    {
      label: "LinkedIn",
      value: "chairulkhuldan",
      href: PROFILE.linkedin,
      icon: Linkedin,
      external: true,
    },
    {
      label: "Instagram",
      value: "@chairulkhuldan",
      href: PROFILE.instagram,
      icon: Instagram,
      external: true,
    },
    CONTACT.email && CONTACT.emailHref
      ? { label: "Email", value: CONTACT.email, href: CONTACT.emailHref, icon: Mail, external: false }
      : null,
    CONTACT.phone && CONTACT.whatsappHref
      ? {
          label: "WhatsApp",
          value: CONTACT.phone,
          href: CONTACT.whatsappHref,
          icon: MessageCircle,
          external: true,
        }
      : null,
  ];
  return items.filter((item): item is ContactItem => item !== null);
}

export default function AboutPage() {
  const contacts = buildContactItems();

  return (
    <main className="space-bg relative isolate min-h-[100svh] px-4 py-6 sm:px-8">
      <StarBackdrop />
      <AudioToggle className="fixed right-4 top-4 z-30 sm:right-8" />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm"
        >
          <ArrowLeft size={16} /> Back to the journey
        </Link>

        <header className="mt-6 text-center">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">{PROFILE.name}</h1>
          <p className="mt-1 text-sm uppercase tracking-[0.25em] text-ember">{PROFILE.role}</p>

          {/* Framed portrait: gradient border, inner mat, soft glow */}
          <div className="relative mx-auto mt-6 w-fit">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-nebula/50 via-transparent to-aurora/40 opacity-70 blur-xl"
            />
            <div className="relative rounded-3xl bg-gradient-to-br from-nebula via-white/40 to-aurora p-[3px] shadow-[0_0_40px_rgba(124,92,255,0.35)]">
              <div className="rounded-[1.4rem] bg-void p-2">
                <Image
                  src={PROFILE.aboutPhoto}
                  alt={`Portrait of ${PROFILE.name}`}
                  width={160}
                  height={160}
                  priority
                  className="h-40 w-40 rounded-2xl object-cover sm:h-44 sm:w-44"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 space-y-3 text-sm leading-relaxed text-white/80 sm:text-base">
          {PROFILE.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h2 className="mt-8 font-display text-2xl font-bold">Get in touch</h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contacts.map(({ label, value, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={`${label}: ${value}`}
                className="glass flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nebula"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-aurora">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-white/55">{label}</span>
                  <span className="block break-all text-sm font-medium">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-2xl font-bold">Work Experience</h2>
        <ol className="mt-4 space-y-4 border-l border-white/15 pl-5">
          {EXPERIENCE_DATA.map((item) => (
            <li key={`${item.period}-${item.role}`} className="relative">
              <span className="absolute -left-[1.62rem] top-1.5 h-2.5 w-2.5 rounded-full bg-aurora" />
              <p className="text-xs text-white/60">{item.period}</p>
              <h3 className="font-display text-lg font-semibold">{item.role}</h3>
              <p className="text-sm text-aurora">{item.company}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/75">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
