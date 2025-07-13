import { join, resolve, relative } from "path";
import { existsSync } from "fs";

export const routes = {
    "/public/*": (req: Request) => {
        const url = new URL(req.url);
        const requestedPath = url.pathname.slice("/public/".length);

        // Security check: prevent path traversal attacks
        if (requestedPath.includes("..") || requestedPath.includes("//")) {
            return new Response("Forbidden", { status: 403 });
        }

        // Resolve the full path and ensure it's within the public directory
        const publicDir = resolve("public");
        const fullPath = resolve(join(publicDir, requestedPath));

        // Double-check that the resolved path is still within public directory
        const relativePath = relative(publicDir, fullPath);
        if (relativePath.startsWith("..") || relativePath.includes("..")) {
            return new Response("Forbidden", { status: 403 });
        }

        // Check if file exists
        if (existsSync(fullPath)) {
            return new Response(Bun.file(fullPath));
        } else {
            return new Response("Not Found", { status: 404 });
        }
    }
}