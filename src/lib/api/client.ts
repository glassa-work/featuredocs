/**
 * Connect transport setup for the Go API.
 *
 * NEXT_PUBLIC_API_URL is baked in at build time — set it before running
 * `npm run build` for production. Defaults to localhost for local dev.
 */
import { createConnectTransport } from "@connectrpc/connect-web";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const transport = createConnectTransport({
  baseUrl: API_BASE,
});
