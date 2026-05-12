export async function fetchCaseStudiesClient() {
  try {
    const res = await fetch("/api/case-studies");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchCaseStudiesClient error:", err);
    return [];
  }
}
