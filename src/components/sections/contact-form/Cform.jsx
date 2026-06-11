"use client";

import { useEffect, useMemo, useState } from "react";

function Field({ field, value, onChange, error }) {
  const label = field.label || field.key;
  const wrapClass = `cf7-field-line pb-2 ${error ? "field-error" : ""}`;
  const inputClass =
    "w-full bg-transparent pt-1 pb-0.5 text-[15px] outline-none text-(--color-dark) placeholder:text-black/25";

  const labelEl = (
    <span className="block text-[10px] font-medium tracking-widest uppercase text-black/40 mb-1">
      {label}
      {field.required ? " *" : ""}
    </span>
  );

  if (field.type === "textarea") {
    return (
      <div>
        {labelEl}
        <div className={wrapClass}>
          <textarea
            rows={4}
            className={inputClass + " resize-none"}
            value={value || ""}
            placeholder={field.placeholder || ""}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        {labelEl}
        <div className={wrapClass + " relative"}>
          <select
            className={inputClass + " appearance-none pr-6 cursor-pointer"}
            value={value || ""}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <svg
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  const inputType = ["email", "tel", "url"].includes(field.type) ? field.type : "text";
  return (
    <div>
      {labelEl}
      <div className={wrapClass}>
        <input
          className={inputClass}
          type={inputType}
          value={value || ""}
          placeholder={field.placeholder || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function CForm({ formId, submitLabel = "Send Message" }) {
  const [schema, setSchema]         = useState(null);
  const [values, setValues]         = useState({});
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus]         = useState({ ok: null, msg: "" });

  const fields = useMemo(() => schema?.fields || [], [schema]);

  useEffect(() => {
    if (!formId) {
      setFetchError("No form ID provided.");
      setLoading(false);
      return;
    }
    let alive = true;

    fetch(`/api/cf7/${formId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        if (!data?.fields) throw new Error("Invalid schema response");
        setSchema(data);
        setValues(Object.fromEntries(data.fields.map((f) => [f.key, ""])));
      })
      .catch((err) => alive && setFetchError(err.message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [formId]);

  function handleChange(key, val) {
    setValues((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate() {
    const next = {};
    for (const f of fields) {
      if (f.required && !(values[f.key] || "").toString().trim()) {
        next[f.key] = "This field is required";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus({ ok: null, msg: "" });

    try {
      const res = await fetch(`/api/cf7/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hidden: schema?.hidden || {},
          values: Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, (v || "").toString().trim()])
          ),
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (json.status === "mail_sent") {
        setStatus({
          ok: true,
          msg: json.message || schema?.settings?.successMessage || "Message sent successfully.",
        });
        setValues(Object.fromEntries(fields.map((f) => [f.key, ""])));
      } else {
        if (Array.isArray(json.invalid_fields)) {
          setErrors(
            Object.fromEntries(
              json.invalid_fields
                .filter((f) => f.field)
                .map(({ field, message }) => [field, message || "Invalid"])
            )
          );
        }
        setStatus({ ok: false, msg: json.message || "Failed to send. Please try again." });
      }
    } catch {
      setStatus({ ok: false, msg: "Failed to send. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 text-sm text-black/30">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/10 border-t-(--color-accent)" />
        Loading form…
      </div>
    );
  }

  /* ── Error loading form ── */
  if (fetchError) {
    return (
      <p className="py-6 text-sm text-red-500 border-l-2 border-red-400 pl-4">
        Could not load form — {fetchError}
      </p>
    );
  }

  /* ── Success state ── */
  if (status.ok) {
    return (
      <div className="py-12 flex flex-col items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-(--color-accent)">
          <svg className="w-5 h-5 text-(--color-dark)" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-(--color-dark)">{status.msg}</p>
        <button
          onClick={() => setStatus({ ok: null, msg: "" })}
          className="text-xs tracking-widest uppercase text-black/40 hover:text-(--color-dark) transition-colors underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">

      {fields.map((f) => (
        <Field
          key={f.key}
          field={f}
          value={values[f.key]}
          onChange={handleChange}
          error={errors[f.key]}
        />
      ))}

      {/* Divider */}
      <div className="h-px w-full bg-black/8" />

      {/* Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <button
          type="submit"
          disabled={submitting}
          className="group relative inline-flex items-center gap-4 rounded-sm bg-(--color-dark) px-8 py-4 text-sm font-medium text-white overflow-hidden transition-all duration-300 hover:bg-(--color-brand) disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {/* Accent fill on hover */}
          <span className="absolute inset-0 w-0 bg-(--color-accent) transition-all duration-500 ease-out group-hover:w-full" />

          <span className="relative z-10 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent) group-hover:bg-(--color-dark) transition-colors duration-300" />
            <span className="text-[15px] leading-none tracking-wide text-white group-hover:text-(--color-dark) transition-colors duration-300 whitespace-nowrap">
              {submitting ? "Sending…" : submitLabel}
            </span>
            <svg
              className="w-4 h-4 text-white group-hover:text-(--color-dark) transition-all duration-300 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>

        {status.msg && !status.ok && (
          <p className="text-sm text-red-500">{status.msg}</p>
        )}
      </div>

    </form>
  );
}
