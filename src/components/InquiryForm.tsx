"use client";

import { useState } from "react";
import type { Destination } from "@/lib/destinations";
import { TRAVEL_STYLES, type Inquiry } from "@/lib/inquiries";

type InquiryFormProps = {
  destinations: Destination[];
};

type FormState = {
  name: string;
  email: string;
  destination: string;
  travelers: string;
  travelStyle: string;
  notes: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  destination: "",
  travelers: "2",
  travelStyle: TRAVEL_STYLES[0],
  notes: "",
};

export default function InquiryForm({ destinations }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [confirmation, setConfirmation] = useState<Inquiry | null>(null);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, travelers: Number(form.travelers) }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Something went wrong." });
        return;
      }

      setConfirmation(data.inquiry as Inquiry);
      setForm(INITIAL_STATE);
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setStatus("idle");
    }
  }

  if (confirmation) {
    return (
      <div
        className="rounded-2xl border border-emerald-200/60 bg-white/70 p-8 shadow-xl backdrop-blur"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
          Request received
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-stone-900">
          Thank you, {confirmation.name.split(" ")[0]}.
        </h3>
        <p className="mt-3 text-stone-600">
          A private travel designer will craft your{" "}
          <strong>{confirmation.destinationName}</strong> journey for{" "}
          {confirmation.travelers}{" "}
          {confirmation.travelers === 1 ? "traveler" : "travelers"} and reach out
          at <strong>{confirmation.email}</strong> within 24 hours.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-amber-50">
          Reference
          <span className="font-mono tracking-wider text-amber-300">
            {confirmation.reference}
          </span>
        </p>
        <div>
          <button
            type="button"
            onClick={() => setConfirmation(null)}
            className="mt-6 block text-sm font-medium text-emerald-700 underline underline-offset-4 hover:text-emerald-900"
          >
            Plan another journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white/80 p-8 shadow-xl backdrop-blur"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Ada Lovelace"
            className={inputClass}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="ada@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Destination" error={errors.destination}>
          <select
            value={form.destination}
            onChange={(event) => update("destination", event.target.value)}
            className={inputClass}
          >
            <option value="">Select a destination…</option>
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {destination.name}, {destination.country}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Travelers" error={errors.travelers}>
          <input
            type="number"
            min={1}
            max={20}
            value={form.travelers}
            onChange={(event) => update("travelers", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Travel style" error={errors.travelStyle}>
          <select
            value={form.travelStyle}
            onChange={(event) => update("travelStyle", event.target.value)}
            className={inputClass}
          >
            {TRAVEL_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Anything we should know?" error={errors.notes}>
          <textarea
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
            rows={3}
            placeholder="Anniversary trip, dietary needs, dream experiences…"
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {errors.form ? (
        <p className="mt-4 text-sm font-medium text-rose-600">{errors.form}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-amber-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request my journey"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-5 block first:mt-0 sm:mt-0">
      <span className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-rose-600">{error}</span>
      ) : null}
    </label>
  );
}
