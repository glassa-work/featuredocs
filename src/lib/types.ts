export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  versions: string[];
  latest: string;
}

export interface Feature {
  slug: string;
  title: string;
  summary: string;
  video: string | null;
  isNew: boolean;
}

export interface VersionManifest {
  version: string;
  releaseDate: string;
  features: Feature[];
}

export interface FeedbackItem {
  id: number;
  product: string;
  feature: string;
  version: string;
  type: "text" | "video" | "general";
  selectedText: string | null;
  videoReference: string | null;
  comment: string;
  email: string | null;
  status: "open" | "acknowledged" | "fixed" | "dismissed";
  createdAt: string;
  resolvedAt: string | null;
}

export interface FeedbackCreateInput {
  product: string;
  feature: string;
  version: string;
  type: "text" | "video" | "general";
  selectedText?: string;
  videoReference?: string;
  comment: string;
  email?: string;
}
