// Client-safe form helpers — calls the Next.js /api/cf7 proxy, not WordPress directly.

export async function getCf7FormSchema(formId) {
  const res = await fetch(`/api/cf7/${formId}`, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to load form");
  }
  return res.json();
}

export async function submitCf7Form(formId, values) {
  const res = await fetch(`/api/cf7/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      ...json,
      message: json?.message || "Submission failed. Please try again.",
    };
  }

  return json;
}
