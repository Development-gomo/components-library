import { WP_BASE, WP_CF7_NAMESPACE } from "@/config";

// GET — fetch CF7 form schema (fields, labels, hidden inputs) from WordPress
export async function GET(_request, { params }) {
  const { formId } = await params;
  const res = await fetch(`${WP_BASE}/${WP_CF7_NAMESPACE}/cf7-form/${formId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return Response.json({ error: `WP returned ${res.status}`, detail }, { status: res.status });
  }
  return Response.json(await res.json());
}

// POST — merge hidden + values into FormData and forward to CF7's feedback endpoint
export async function POST(request, { params }) {
  const { formId } = await params;
  const { hidden = {}, values = {} } = await request.json().catch(() => ({}));

  const fd = new FormData();
  Object.entries({ ...hidden, ...values }).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((vv) => fd.append(k, String(vv)));
    else fd.append(k, String(v));
  });

  const res = await fetch(
    `${WP_BASE}/contact-form-7/v1/contact-forms/${formId}/feedback`,
    { method: "POST", body: fd }
  );
  return Response.json(await res.json().catch(() => ({})), {
    status: res.ok ? 200 : res.status,
  });
}
