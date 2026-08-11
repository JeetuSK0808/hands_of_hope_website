import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/site/contact-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SeoBreadcrumb } from "@/components/site/seo-breadcrumb";

export const metadata: Metadata = {
  title: "Contact · Start a chapter, volunteer, or partner",
  description:
    "Contact Hands of Hope Outreach to start a high school chapter, volunteer, partner with us, sponsor an event, or reach the executive team. Email info@handsofhopeoutreach.org.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "https://handsofhopeoutreach.org/contact",
    title: "Contact Hands of Hope Outreach",
    description:
      "Start a chapter, volunteer, or partner with a student-led 501(c)(3) nonprofit.",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate w-full overflow-hidden border-b border-border pt-40 pb-20 md:pb-28">
        <Image
          src="/general/good-photo.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="tint-overlay-strong" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 md:px-12 on-image">
          <div className="editorial-rule editorial-eyebrow text-white/80 animate-fade-up">
            Contact
          </div>
          <h1 className="mt-10 editorial-display text-[clamp(3rem,8vw,8rem)] max-w-[16ch] animate-fade-up text-white [animation-delay:160ms]">
            Say <span className="italic" style={{ color: "var(--brand-rose)" }}>hello.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed animate-fade-up [animation-delay:280ms]">
            Whether you&apos;re a student wanting to start a chapter, a partner
            organization, or a parent with a question, we read every message.
          </p>
        </div>
      </section>

      <section className="relative w-full px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-[88rem] gap-16 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-10">
            <div>
              <div className="editorial-eyebrow text-muted-foreground">
                Email
              </div>
              <a
                href="mailto:info@handsofhopeoutreach.org"
                className="mt-3 block text-lg text-foreground hover:opacity-70 transition-opacity"
              >
                info@handsofhopeoutreach.org
              </a>
            </div>

            <div>
              <div className="editorial-eyebrow text-muted-foreground">
                Headquarters
              </div>
              <div className="mt-3 text-lg text-foreground">
                Atlanta, Georgia
              </div>
            </div>

            <div>
              <div className="editorial-eyebrow text-muted-foreground">
                Follow
              </div>
              <div className="mt-3 flex gap-6 text-lg">
                <a
                  href="https://www.instagram.com/handsofhope_outreach/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/hands-of-hope-outreach/posts/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-70 transition-opacity"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-8 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Hands of Hope is a registered 501(c)(3) nonprofit, fiscally
              sponsored by Hack Club. Donations are tax-deductible to the
              extent permitted by law.
            </div>
          </aside>

          <div className="lg:border-l lg:border-border lg:pl-16">
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
      <SeoBreadcrumb trail={[{ name: "Contact", path: "/contact" }]} />
    </>
  );
}
