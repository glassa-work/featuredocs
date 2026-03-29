import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import type { Product, VersionManifest, Feature } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getAllProducts(): Product[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const products: Product[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const product = getProduct(entry.name);
    if (product) {
      products.push(product);
    }
  }

  return products;
}

export function getProduct(slug: string): Product | null {
  const productJsonPath = path.join(CONTENT_DIR, slug, "product.json");
  if (!fs.existsSync(productJsonPath)) {
    return null;
  }

  const raw = fs.readFileSync(productJsonPath, "utf-8");
  const data = JSON.parse(raw) as Omit<Product, "slug">;
  return { slug, ...data };
}

export function getVersionManifest(
  productSlug: string,
  version: string
): VersionManifest | null {
  const featuresJsonPath = path.join(
    CONTENT_DIR,
    productSlug,
    `v${version}`,
    "features.json"
  );
  if (!fs.existsSync(featuresJsonPath)) {
    return null;
  }

  const raw = fs.readFileSync(featuresJsonPath, "utf-8");
  return JSON.parse(raw) as VersionManifest;
}

export function getFeatureFromManifest(
  productSlug: string,
  version: string,
  featureSlug: string
): Feature | null {
  const manifest = getVersionManifest(productSlug, version);
  if (!manifest) return null;

  return manifest.features.find((f) => f.slug === featureSlug) ?? null;
}

function transformVideoDirectives(markdown: string): string {
  return markdown.replace(
    /::video\[([^\]]+)\](?:\{title="([^"]+)"\})?/g,
    (_match, filename: string, title?: string) => {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<div class="video-embed" data-video="${filename}"${titleAttr}></div>`;
    }
  );
}

export async function renderMarkdown(
  productSlug: string,
  version: string,
  featureSlug: string
): Promise<string | null> {
  const markdownPath = path.join(
    CONTENT_DIR,
    productSlug,
    `v${version}`,
    `${featureSlug}.md`
  );

  if (!fs.existsSync(markdownPath)) {
    return null;
  }

  const raw = fs.readFileSync(markdownPath, "utf-8");
  const transformed = transformVideoDirectives(raw);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(transformed);

  return String(result);
}

export function getVideoPath(
  productSlug: string,
  version: string,
  filename: string
): string {
  return `/api/content/${productSlug}/v${version}/${filename}`;
}

export function resolveVideoFilePath(
  productSlug: string,
  version: string,
  filename: string
): string | null {
  const videoPath = path.join(
    CONTENT_DIR,
    productSlug,
    `v${version}`,
    filename
  );
  if (!fs.existsSync(videoPath)) {
    return null;
  }
  return videoPath;
}
