/**
 * Typed client for ContentService (Go Connect API).
 *
 * Uses plain fetch with Connect JSON protocol rather than generated stubs,
 * so we avoid a build-time buf dependency.
 */

import { API_BASE } from "./client";

/* ─── Public types ───────────────────────────────────────────────── */

export interface SaveDocumentInput {
  product: string;
  version: string;
  locale: string;
  featureSlug: string;
  content: string;
  editMessage: string;
}

export interface SaveDocumentResult {
  success: boolean;
  message: string;
}

export interface PublishVersionResult {
  success: boolean;
  message: string;
}

export interface ProductResponse {
  slug: string;
  name: string;
  tagline: string;
  locales: string[];
  defaultLocale: string;
  versions: string[];
  latest: string;
}

export interface FeatureResponse {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  device: string;
  orientation: string;
  video: string;
  status: string;
}

export interface GetDocumentResult {
  content: string;
  renderedHtml: string;
  feature: FeatureResponse | null;
}

/* ─── Save document ──────────────────────────────────────────────── */

export async function saveDocument(
  input: SaveDocumentInput,
): Promise<SaveDocumentResult> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.ContentService/SaveDocument`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: input.product,
        version: input.version,
        locale: input.locale,
        featureSlug: input.featureSlug,
        content: input.content,
        editMessage: input.editMessage,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    return { success: false, message: errorBody || "Failed to save document" };
  }

  const data = await response.json();
  return {
    success: data.success ?? false,
    message: data.message ?? "",
  };
}

/* ─── Publish version ────────────────────────────────────────────── */

export async function publishVersion(
  product: string,
  version: string,
): Promise<PublishVersionResult> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.ContentService/PublishVersion`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, version }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    return { success: false, message: errorBody || "Failed to publish version" };
  }

  const data = await response.json();
  return {
    success: data.success ?? false,
    message: data.message ?? "",
  };
}

/* ─── List products ──────────────────────────────────────────────── */

export async function listProducts(): Promise<ProductResponse[]> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.ContentService/ListProducts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data.products ?? []).map(mapProduct);
}

/* ─── Get product ────────────────────────────────────────────────── */

export async function getProduct(
  slug: string,
): Promise<ProductResponse | null> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.ContentService/GetProduct`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data.product) return null;

  return mapProduct(data.product);
}

/* ─── List features ──────────────────────────────────────────────── */

export async function listFeatures(
  product: string,
  version: string,
  includeDrafts: boolean = false,
): Promise<{ features: FeatureResponse[]; versionStatus: string }> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.ContentService/ListFeatures`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, version, includeDrafts }),
    },
  );

  if (!response.ok) {
    return { features: [], versionStatus: "draft" };
  }

  const data = await response.json();
  return {
    features: (data.features ?? []).map(mapFeature),
    versionStatus: data.versionStatus ?? "draft",
  };
}

/* ─── Get document ───────────────────────────────────────────────── */

export async function getDocument(
  product: string,
  version: string,
  locale: string,
  featureSlug: string,
): Promise<GetDocumentResult | null> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.ContentService/GetDocument`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, version, locale, featureSlug }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    content: data.content ?? "",
    renderedHtml: data.renderedHtml ?? "",
    feature: data.feature ? mapFeature(data.feature) : null,
  };
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function mapProduct(raw: Record<string, unknown>): ProductResponse {
  return {
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    tagline: String(raw.tagline ?? ""),
    locales: Array.isArray(raw.locales) ? raw.locales.map(String) : [],
    defaultLocale: String(raw.defaultLocale ?? "en"),
    versions: Array.isArray(raw.versions) ? raw.versions.map(String) : [],
    latest: String(raw.latest ?? ""),
  };
}

function mapFeature(raw: Record<string, unknown>): FeatureResponse {
  return {
    slug: String(raw.slug ?? ""),
    title: (raw.title as Record<string, string>) ?? {},
    summary: (raw.summary as Record<string, string>) ?? {},
    device: String(raw.device ?? ""),
    orientation: String(raw.orientation ?? "portrait"),
    video: String(raw.video ?? ""),
    status: String(raw.status ?? ""),
  };
}
