"use client";

import { useEffect, useMemo, useState } from "react";

function Field({ field, value, onChange, error }) {
  const baseClass =
    "w-full border px-4 py-3 text-sm outline-none transition-colors " +
    (error ? "border-red-500" : "border-black/15 focus:border-black/40");

  const label = field.label || field.key;
  const labelEl = (
    <label className="block text-sm font-medium">
      {label}
      {field.required ? " *" : ""}
    </label>
  );
  const errorEl = error ? <p className="text-xs text-red-600">{error}</p> : null;

  if (field.type === "textarea") {
    return (
      <div className="space-y-1">
        {labelEl}
        <textarea
          className={baseClass + " min-h-35"}
          value={value || ""}
          placeholder={field.placeholder || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
        {errorEl}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1">
        {labelEl}
        <select
          className={baseClass}
          value={value || ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">{field.placeholder || "Select…"}</option>
          {(field.options || []).map((opt, i) => (
            <option key={i} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
        {errorEl}
      </div>
    );
  }

  const inputType = ["email", "tel", "url"].includes(field.type) ? field.type : "text";
  return (
    <div className="space-y-1">
      {labelEl}
      <input
        className={baseClass}
        type={inputType}
        value={value || ""}
        placeholder={field.placeholder || ""}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {errorEl}
    </div>
  );
}

export default function CForm({ formId, submitLabel = "Send Message" }) {
  const [schema, setSchema] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ ok: null, msg: "" });

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
        const msg = json.message || schema?.settings?.successMessage || "Message sent successfully.";
        setStatus({ ok: true, msg });
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

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-10 text-sm text-gray-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-(--color-brand)" />
        Loading form…
      </div>
    );
  }

  if (fetchError) {
    return <p className="text-sm text-red-600">Could not load form. ({fetchError})</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {fields.map((f) => (
        <Field
          key={f.key}
          field={f}
          value={values[f.key]}
          onChange={handleChange}
          error={errors[f.key]}
        />
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer group relative inline-flex items-center gap-3 rounded-sm bg-(--color-brand) px-6 py-4 text-white transition-all duration-300 w-42.5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative w-2 h-2 flex items-center justify-center">
          <span className="absolute h-2 w-2 rounded-full bg-(--color-accent) transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-x-1" />
        </span>
        <span className="flex-1 text-base leading-none transition-all duration-300 ease-out group-hover:-translate-x-4 whitespace-nowrap">
          {submitting ? "Sending…" : submitLabel}
        </span>
        <span className="relative w-4 flex items-center justify-center">
          <span className="absolute opacity-0 -translate-x-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:-translate-x-2">
            →
          </span>
        </span>
      </button>

      {status.msg && (
        <p className={`text-sm ${status.ok ? "text-green-700" : "text-red-700"}`}>
          {status.msg}
        </p>
      )}
    </form>
  );
}
