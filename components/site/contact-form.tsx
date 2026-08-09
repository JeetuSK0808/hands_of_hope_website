"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldKey = "name" | "email" | "school" | "subject" | "message";

const SUBJECTS = [
  "Start a chapter",
  "Volunteer with us",
  "Partner with Hands of Hope",
  "Press / media",
  "Just saying hello",
];

const CONTACT_EMAIL = "info@handsofhopeoutreach.org";

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  textarea,
}: {
  id: FieldKey;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  textarea?: boolean;
}) {
  const Component = textarea ? "textarea" : "input";

  return (
    <div>
      <label
        htmlFor={id}
        className="editorial-eyebrow text-muted-foreground"
      >
        {label}
        {required && <span className="ml-1">*</span>}
      </label>
      <Component
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? 5 : undefined}
        required={required}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(e.target.value)}
        className={cn(
          "mt-3 w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition-colors",
          "focus:border-foreground placeholder:text-muted-foreground",
          textarea && "min-h-[7rem] resize-y"
        )}
      />
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = React.useState<Record<FieldKey, string>>({
    name: "",
    email: "",
    school: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [honeypot, setHoneypot] = React.useState("");
  const resetRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (resetRef.current) window.clearTimeout(resetRef.current);
    },
    [],
  );

  const update = (k: FieldKey) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  /** Pre-filled fallback so a failed send never costs the visitor their message. */
  const mailtoHref = React.useMemo(() => {
    const body = [
      `Name: ${form.name}`,
      `School / organization: ${form.school || "—"}`,
      "",
      form.message,
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      form.subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: honeypot }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("done");
      resetRef.current = window.setTimeout(() => {
        setStatus("idle");
        setForm({
          name: "",
          email: "",
          school: "",
          subject: SUBJECTS[0],
          message: "",
        });
      }, 4000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-10">
      <div className="grid gap-10 md:grid-cols-2">
        <Field
          id="name"
          label="Your name"
          required
          value={form.name}
          onChange={update("name")}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
        />
        <Field
          id="school"
          label="School / organization"
          value={form.school}
          onChange={update("school")}
        />
        <div>
          <label
            htmlFor="subject"
            className="editorial-eyebrow text-muted-foreground"
          >
            I&apos;d like to
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={(e) => update("subject")(e.target.value)}
            className="mt-3 w-full appearance-none border-b border-border bg-transparent py-3 text-base text-foreground outline-none focus:border-foreground"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Field
        id="message"
        label="Tell us a little more"
        required
        value={form.message}
        onChange={update("message")}
        textarea
      />

      {/* Honeypot — hidden from humans and assistive tech, tempting to bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="border border-border bg-card px-5 py-4 text-sm leading-relaxed"
        >
          <div className="font-medium text-foreground">
            That didn&apos;t send.
          </div>
          <p className="mt-1 text-muted-foreground">
            Something went wrong on our end — your message was not delivered.{" "}
            <a
              href={mailtoHref}
              className="underline underline-offset-4 decoration-dotted text-foreground"
            >
              Send it by email instead
            </a>
            , with everything you typed already filled in.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          We respond within 48 hours. Or email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-4 decoration-dotted text-foreground"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={status === "submitting" || status === "done"}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium transition-opacity",
            "bg-foreground text-background hover:opacity-80",
            (status === "submitting" || status === "done") &&
              "cursor-not-allowed"
          )}
          style={{ borderRadius: "1px" }}
        >
          {(status === "idle" || status === "error") && <>Send message</>}
          {status === "submitting" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              Sending
            </>
          )}
          {status === "done" && (
            <>
              <Check className="h-4 w-4" strokeWidth={1.5} />
              Message sent
            </>
          )}
        </button>
      </div>
    </form>
  );
}
