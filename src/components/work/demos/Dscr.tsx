"use client";

import { useId, useState } from "react";

type Field = { key: keyof Inputs; label: string; prefix?: string; suffix?: string; step: number };
type Inputs = { income: number; expenses: number; loan: number; rate: number; years: number };

const property: Field[] = [
  { key: "income", label: "Gross rental income / yr", prefix: "$", step: 1000 },
  { key: "expenses", label: "Operating expenses / yr", prefix: "$", step: 500 },
];
const loanFields: Field[] = [
  { key: "loan", label: "Loan amount", prefix: "$", step: 5000 },
  { key: "rate", label: "Interest rate", suffix: "%", step: 0.125 },
  { key: "years", label: "Amortization", suffix: "yrs", step: 1 },
];

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function annualDebtService({ loan, rate, years }: Inputs) {
  const n = years * 12;
  if (loan <= 0 || n <= 0) return 0;
  const r = rate / 100 / 12;
  const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  return monthly * 12;
}

const SCALE_MAX = 2;

/** DSCR = net operating income ÷ annual debt service. */
export function Dscr() {
  const uid = useId();
  const [v, setV] = useState<Inputs>({ income: 60000, expenses: 18000, loan: 400000, rate: 7.5, years: 30 });

  const noi = v.income - v.expenses;
  const ds = annualDebtService(v);
  const dscr = ds > 0 ? noi / ds : null;
  const pct = dscr === null ? 0 : Math.min(1, Math.max(0, dscr / SCALE_MAX)) * 100;
  const covers = dscr !== null && dscr >= 1;

  const input = (f: Field) => (
    <div key={f.key}>
      <label htmlFor={`${uid}-${f.key}`} className="label block !text-[10px]">
        {f.label}
      </label>
      <div className="mt-2 flex h-11 items-center rounded-md border border-line-2 bg-ink-1 px-3 focus-within:border-signal">
        {f.prefix ? <span className="mr-1 font-mono text-sm text-fg-3">{f.prefix}</span> : null}
        <input
          id={`${uid}-${f.key}`}
          type="number"
          inputMode="decimal"
          min={0}
          step={f.step}
          value={Number.isFinite(v[f.key]) ? v[f.key] : ""}
          onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value === "" ? 0 : Number(e.target.value) }))}
          className="w-full min-w-0 bg-transparent font-mono text-sm tabular-nums text-fg outline-none"
        />
        {f.suffix ? <span className="ml-1 font-mono text-xs text-fg-3">{f.suffix}</span> : null}
      </div>
    </div>
  );

  return (
    <div className="frame">
      <div className="frame__bar">
        <span className="frame__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="font-mono text-[11px] text-fg-3">DSCR calculator — interactive recreation</span>
      </div>

      <div className="grid gap-px bg-line md:grid-cols-[1fr_1fr]">
        <div className="space-y-6 bg-ink-2 p-5 md:p-7">
          <fieldset>
            <legend className="mb-4 text-sm text-fg">Property figures</legend>
            <div className="grid gap-4">{property.map(input)}</div>
          </fieldset>
          <fieldset>
            <legend className="mb-4 text-sm text-fg">Loan details</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">{input(loanFields[0])}</div>
              {loanFields.slice(1).map(input)}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col bg-ink-2 p-5 md:p-7">
          <p className="label">Debt service coverage ratio</p>
          <p className="mt-3 font-display text-[clamp(4rem,8vw,6.5rem)] font-extrabold leading-none tabular-nums tracking-tight" aria-live="polite">
            {dscr === null ? "—" : dscr.toFixed(2)}
            <span className="sr-only"> DSCR</span>
          </p>
          <p className={`mt-2 text-sm ${covers ? "text-signal" : "text-fg-2"}`}>
            {dscr === null
              ? "Enter loan figures to calculate."
              : covers
                ? "Income covers the loan payments."
                : "Income does not cover the loan payments."}
          </p>

          <div className="mt-8" aria-hidden>
            <div className="relative h-1.5 rounded-full bg-ink-3">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-[var(--ease-out)] ${covers ? "bg-signal" : "bg-fg-3"}`}
                style={{ width: `${pct}%` }}
              />
              <span className="absolute -top-1.5 left-1/2 h-[18px] w-px bg-fg-2" />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-fg-3">
              <span>0.00</span>
              <span>1.00 break-even</span>
              <span>2.00+</span>
            </div>
          </div>

          <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm max-md:mt-8">
            <div>
              <dt className="label !text-[10px]">Net operating income</dt>
              <dd className="mt-1 font-mono tabular-nums">{usd.format(noi)}</dd>
            </div>
            <div>
              <dt className="label !text-[10px]">Annual debt service</dt>
              <dd className="mt-1 font-mono tabular-nums">{usd.format(ds)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3 text-xs text-fg-3 md:px-7">
        Example figures. This recreation uses the standard formula (net operating income ÷ annual debt service); the
        original is a Jotform form built with calculated fields.
      </p>
    </div>
  );
}
