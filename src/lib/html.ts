import { type JSX } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function html(node: JSX.Element): Response {
    return new Response(
        renderToStaticMarkup(node),
        { headers: { "content-type": "text/html; charset=utf-8" } },
    );
}