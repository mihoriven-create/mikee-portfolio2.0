"use client";

import { useId, useState, useSyncExternalStore } from "react";

const DAY = 86_400_000;
// Local calendar date as YYYY-MM-DD (both sides are then parsed the same way).
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// "Today" is read on the client only, so server and client markup agree.
const noop = () => () => {};
const useToday = () =>
  useSyncExternalStore(
    noop,
    () => iso(new Date()),
    () => "",
  );

const flow = [
  { label: "Contact created", note: "Date from each CRM record" },
  { label: "Google Sheets", note: "=TODAY() − Created" },
  { label: "Bulk import", note: "Historical records" },
  { label: "GoHighLevel", note: "Lead Age field" },
];

/** A working version of the Lead Age calculation: days between a contact's creation date and today. */
export function LeadAge() {
  const id = useId();
  const today = useToday();
  const [created, setCreated] = useState("2025-07-01");

  const days =
    today && created ? Math.max(0, Math.floor((Date.parse(today) - Date.parse(created)) / DAY)) : null;

  return (
    <div className="frame">
      <div className="frame__bar">
        <span className="frame__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="font-mono text-[11px] text-fg-3">Lead Age — working demo of the calculation</span>
      </div>

      <div className="grid gap-px bg-line md:grid-cols-2">
        <div className="bg-ink-2 p-5 md:p-7">
          <label htmlFor={id} className="label block">
            Contact created
          </label>
          <input
            id={id}
            type="date"
            value={created}
            max={today || undefined}
            onChange={(e) => setCreated(e.target.value)}
            className="mt-3 h-12 w-full rounded-md border border-line-2 bg-ink-1 px-3 font-mono text-sm text-fg [color-scheme:dark] focus:border-signal focus:outline-none"
          />
          <div className="mt-6 flex items-center gap-3 font-mono text-[12px] text-fg-3">
            <span className="text-signal">fx</span>
            <span>=TODAY() − Created</span>
          </div>
        </div>
        <div className="flex flex-col justify-between bg-ink-2 p-5 md:p-7">
          <p className="label">Lead Age</p>
          <p className="mt-3" aria-live="polite">
            <span className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-extrabold leading-none tabular-nums tracking-tight">
              {days ?? "—"}
            </span>
            <span className="ml-3 text-fg-2">{days === 1 ? "day" : "days"}</span>
          </p>
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-px border-t border-line bg-line md:grid-cols-4" aria-label="How the values reached the CRM">
        {flow.map((f, i) => (
          <li key={f.label} className="bg-ink-1 px-4 py-4">
            <span className="font-mono text-[10px] text-fg-3">0{i + 1}</span>
            <span className="mt-1 block text-sm text-fg">{f.label}</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">{f.note}</span>
          </li>
        ))}
      </ol>
      <p className="border-t border-line px-5 py-3 text-xs text-fg-3 md:px-7">
        In production the values were calculated in Google Sheets and bulk-imported; ongoing automation uses Apps Script,
        webhooks and Zapier.
      </p>
    </div>
  );
}
