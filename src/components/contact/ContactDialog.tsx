"use client";

import { useId, useImperativeHandle, useRef, useState } from "react";
import { profile } from "@/content/site";
import { ArrowRight, Check, Close } from "../ui/Icons";

// Web3Forms access key. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in Vercel → Project → Environment Variables.
// (Web3Forms keys are designed to be public; they only allow sending to the owner's inbox.)
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

export type ContactDialogHandle = { open: () => void };

export function ContactDialog({ ref: handle }: { ref: React.Ref<ContactDialogHandle> }) {
  const ref = useRef<HTMLDialogElement>(null);
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  useImperativeHandle(handle, () => ({
    open: () => {
      setStatus((s) => (s === "sent" ? "idle" : s));
      ref.current?.showModal();
    },
  }));

  const close = () => ref.current?.close();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "A sentence or two about what you need helps.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    if (data.get("botcheck")) return;
    if (!ACCESS_KEY) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio inquiry from ${name}`,
          from_name: "Portfolio contact form",
          name,
          email,
          message,
        }),
        signal: controller.signal,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error("send failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  }

  const field =
    "mt-2 w-full rounded-md border bg-ink-1 px-4 py-3 text-base text-fg placeholder:text-fg-3/70 transition-colors focus:border-signal focus:outline-none";

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${uid}-title`}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className="m-auto max-h-[94dvh] w-[min(560px,94vw)] max-w-none overflow-y-auto rounded-xl border border-line-2 bg-ink-2 p-0 text-fg"
    >
      <div className="p-6 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label text-signal">Get in touch</p>
            <h2 id={`${uid}-title`} className="mt-2 font-display text-3xl font-bold tracking-[-0.02em]">
              Send me a message
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-2"
            aria-label="Close"
          >
            <Close />
          </button>
        </div>

        {status === "sent" ? (
          <div className="py-10" role="status">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-signal text-signal">
              <Check />
            </span>
            <p className="mt-6 text-xl">Thanks — your message is on its way.</p>
            <p className="mt-2 text-fg-2">I&apos;ll reply to the email address you provided.</p>
            <button type="button" onClick={close} className="btn mt-8">
              Close
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
            <p className="text-sm text-fg-2">Tell me a little about what you need. It goes straight to my inbox.</p>
            {(
              [
                { name: "name", label: "Your name", type: "text", auto: "name", ph: "Jane Doe" },
                { name: "email", label: "Your email", type: "email", auto: "email", ph: "you@company.com" },
              ] as const
            ).map((f) => (
              <div key={f.name}>
                <label htmlFor={`${uid}-${f.name}`} className="label">
                  {f.label}
                </label>
                <input
                  id={`${uid}-${f.name}`}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.auto}
                  placeholder={f.ph}
                  maxLength={200}
                  aria-invalid={!!errors[f.name]}
                  aria-describedby={errors[f.name] ? `${uid}-${f.name}-err` : undefined}
                  className={`${field} ${errors[f.name] ? "border-[#f0a29b]" : "border-line-2"}`}
                />
                {errors[f.name] ? (
                  <p id={`${uid}-${f.name}-err`} className="mt-1.5 text-sm text-[#f0a29b]">
                    {errors[f.name]}
                  </p>
                ) : null}
              </div>
            ))}
            <div>
              <label htmlFor={`${uid}-message`} className="label">
                Message
              </label>
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={5}
                maxLength={4000}
                placeholder="What are you trying to fix, automate or connect?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${uid}-message-err` : undefined}
                className={`${field} resize-y ${errors.message ? "border-[#f0a29b]" : "border-line-2"}`}
              />
              {errors.message ? (
                <p id={`${uid}-message-err`} className="mt-1.5 text-sm text-[#f0a29b]">
                  {errors.message}
                </p>
              ) : null}
            </div>
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

            {status === "error" ? (
              <p role="alert" className="rounded-md border border-[#f0a29b]/40 px-4 py-3 text-sm text-fg-2">
                The message couldn&apos;t be sent from here. Please email me directly at{" "}
                <a href={`mailto:${profile.email}`} className="text-fg underline underline-offset-4">
                  {profile.email}
                </a>
                .
              </p>
            ) : null}

            <button type="submit" className="btn btn-primary mt-2 justify-center" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
              <ArrowRight className="arrow" />
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
