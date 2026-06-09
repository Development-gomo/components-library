import { readFile } from "fs/promises";
import path from "path";
import { getAllowedComponentSourcePaths } from "@/lib/componentCatalog";

function normalizeSourcePath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

export async function GET(request) {
  const requestedPath = normalizeSourcePath(new URL(request.url).searchParams.get("path"));
  const allowedSourcePaths = await getAllowedComponentSourcePaths();

  if (!allowedSourcePaths.has(requestedPath)) {
    return Response.json(
      { error: "This source file is not available in the component catalog." },
      { status: 404 }
    );
  }

  const absolutePath = path.join(process.cwd(), requestedPath);
  const code = await readFile(absolutePath, "utf8");

  return Response.json({
    path: requestedPath,
    code,
  });
}
