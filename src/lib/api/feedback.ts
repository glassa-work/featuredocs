/**
 * Typed client for FeedbackService (Go Connect API).
 *
 * Uses plain fetch with Connect JSON protocol rather than generated stubs,
 * so we avoid a build-time buf dependency.
 */

import { API_BASE } from "./client";

/* ─── Enum mappings (match proto FeedbackType / FeedbackStatus) ─── */

const FEEDBACK_TYPE_MAP: Record<string, number> = {
  text: 1, // FEEDBACK_TYPE_TEXT
  video: 2, // FEEDBACK_TYPE_VIDEO
  general: 3, // FEEDBACK_TYPE_GENERAL
};

const FEEDBACK_STATUS_MAP: Record<string, number> = {
  open: 1,
  acknowledged: 2,
  fixed: 3,
  dismissed: 4,
};

const FEEDBACK_STATUS_REVERSE: Record<number, string> = {
  0: "open",
  1: "open",
  2: "acknowledged",
  3: "fixed",
  4: "dismissed",
};

const FEEDBACK_TYPE_REVERSE: Record<number, string> = {
  0: "general",
  1: "text",
  2: "video",
  3: "general",
};

/* ─── Public types ───────────────────────────────────────────────── */

export interface SubmitFeedbackInput {
  product: string;
  feature: string;
  version: string;
  locale: string;
  type: "text" | "video" | "general";
  selectedText?: string;
  videoReference?: string;
  comment: string;
  email?: string;
  turnstileToken: string;
  /** Honeypot field — non-empty means bot */
  website?: string;
}

export interface SubmitFeedbackResult {
  success: boolean;
  message: string;
  githubIssueUrl?: string;
}

export interface FeedbackItemResponse {
  id: number;
  product: string;
  feature: string;
  version: string;
  locale: string;
  type: string;
  selectedText: string | null;
  videoReference: string | null;
  comment: string;
  email: string | null;
  status: string;
  githubIssueUrl: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

/* ─── Submit feedback ────────────────────────────────────────────── */

export async function submitFeedback(
  input: SubmitFeedbackInput,
): Promise<SubmitFeedbackResult> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.FeedbackService/SubmitFeedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: input.product,
        feature: input.feature,
        version: input.version,
        locale: input.locale,
        type: FEEDBACK_TYPE_MAP[input.type] ?? 0,
        selectedText: input.selectedText ?? "",
        videoReference: input.videoReference ?? "",
        comment: input.comment,
        email: input.email ?? "",
        turnstileToken: input.turnstileToken,
      }),
    },
  );

  if (response.status === 429) {
    return { success: false, message: "Too many submissions. Try again later." };
  }

  if (!response.ok) {
    const errorBody = await response.text();
    return { success: false, message: errorBody || "Failed to submit feedback" };
  }

  const data = await response.json();
  return {
    success: data.success ?? false,
    message: data.message ?? "",
    githubIssueUrl: data.githubIssueUrl || undefined,
  };
}

/* ─── List feedback (admin) ──────────────────────────────────────── */

export async function listFeedback(filters?: {
  product?: string;
  status?: string;
  type?: string;
}): Promise<FeedbackItemResponse[]> {
  const body: Record<string, unknown> = {};

  if (filters?.product) {
    body.product = filters.product;
  }
  if (filters?.status) {
    body.status = FEEDBACK_STATUS_MAP[filters.status] ?? 0;
  }

  const response = await fetch(
    `${API_BASE}/featuredocs.v1.FeedbackService/ListFeedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const items = data.items ?? [];

  return items.map(mapFeedbackItem);
}

/* ─── Update feedback status (admin) ─────────────────────────────── */

export async function updateFeedbackStatus(
  id: number,
  status: string,
): Promise<FeedbackItemResponse | null> {
  const response = await fetch(
    `${API_BASE}/featuredocs.v1.FeedbackService/UpdateFeedbackStatus`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: FEEDBACK_STATUS_MAP[status] ?? 0,
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data.item) return null;

  return mapFeedbackItem(data.item);
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function mapFeedbackItem(raw: Record<string, unknown>): FeedbackItemResponse {
  return {
    id: Number(raw.id ?? 0),
    product: String(raw.product ?? ""),
    feature: String(raw.feature ?? ""),
    version: String(raw.version ?? ""),
    locale: String(raw.locale ?? "en"),
    type: FEEDBACK_TYPE_REVERSE[Number(raw.type ?? 0)] ?? "general",
    selectedText: raw.selectedText ? String(raw.selectedText) : null,
    videoReference: raw.videoReference ? String(raw.videoReference) : null,
    comment: String(raw.comment ?? ""),
    email: raw.email ? String(raw.email) : null,
    status: FEEDBACK_STATUS_REVERSE[Number(raw.status ?? 0)] ?? "open",
    githubIssueUrl: raw.githubIssueUrl ? String(raw.githubIssueUrl) : null,
    createdAt: String(raw.createdAt ?? ""),
    resolvedAt: raw.resolvedAt ? String(raw.resolvedAt) : null,
  };
}
