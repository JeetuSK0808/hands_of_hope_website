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
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">(
    "idle"
  );

  const update = (k: FieldKey) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("done");
    setTimeout(() => {
      setStatus("idle");
      setForm({
        name: "",
        email: "",
        school: "",
        subject: SUBJECTS[0],
        message: "",
      });
    }, 3500);
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

      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          We respond within 48 hours. Or email{" "}
          <a
            href="mailto:info@handsofhopeoutreach.com"
            className="underline underline-offset-4 decoration-dotted text-foreground"
          >
            info@handsofhopeoutreach.com
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={status !== "idle"}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium transition-opacity",
            status === "done"
              ? "bg-foreground text-background"
              : "bg-foreground text-background hover:opacity-80",
            status !== "idle" && "cursor-not-allowed"
          )}
          style={{ borderRadius: "1px" }}
        >
          {status === "idle" && <>Send message</>}
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
