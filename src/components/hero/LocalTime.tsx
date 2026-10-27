"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/content/site";

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: profile.timeZone,
  hour: "numeric",
  minute: "2-digit",
});

// Minute-resolution clock shared via useSyncExternalStore (no hydration mismatch:
// the server snapshot is an empty string).
let snapshot = "";
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    const update = () => {
      snapshot = fmt.format(new Date());
      listeners.forEach((l) => l());
    };
    update();
    timer = setInterval(update, 15_000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function LocalTime() {
  const time = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => "",
  );
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time || "—"}
    </span>
  );
}
