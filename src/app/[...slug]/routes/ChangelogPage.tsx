"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProduct, listFeatures } from "@/lib/api/content";
import type { ProductResponse, FeatureResponse } from "@/lib/api/content";

/** Resolve a localized value with fallback to default locale, then first available. */
function getLocalizedValue(
  localizedMap: Record<string, string>,
  locale: string,
  defaultLocale: string,
): string {
  return (
    localizedMap[locale] ??
    localizedMap[defaultLocale] ??
    Object.values(localizedMap)[0] ??
    ""
  );
}

interface VersionEntry {
  version: string;
  features: FeatureResponse[];
  versionStatus: string;
}

interface ChangelogPageProps {
  productSlug: string;
}

export default function ChangelogPage({ productSlug }: ChangelogPageProps) {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [versionEntries, setVersionEntries] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      const productData = await getProduct(productSlug);
      if (!productData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setProduct(productData);

      const entries = await Promise.all(
        productData.versions.map(async (version) => {
          const data = await listFeatures(productSlug, version, true);
          return {
            version,
            features: data.features,
            versionStatus: data.versionStatus,
          };
        }),
      );

      setVersionEntries(entries);
      setIsLoading(false);
    }

    loadData();
  }, [productSlug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="py-12 text-center text-sm text-[#6B6B6B]">
          Loading...
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          The product you are looking for does not exist.
        </p>
      </div>
    );
  }

  const defaultLocale = product.defaultLocale;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-2">
        <Link
          href={`/${productSlug}/${defaultLocale}`}
          className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          &larr; {product.name}
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
          Changelog
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Version history for {product.name}.
        </p>
      </div>

      <div className="space-y-8">
        {versionEntries.map((entry) => {
          const isLatest = entry.version === product.latest;

          return (
            <div
              key={entry.version}
              className="rounded-lg border border-[#E8E6E1] bg-white p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">
                  v{entry.version}
                </h2>
                {isLatest && (
                  <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-xs font-medium text-[#2E7D32]">
                    Latest
                  </span>
                )}
              </div>

              <ul className="space-y-2">
                {entry.features.map((feature) => {
                  const title = getLocalizedValue(
                    feature.title,
                    defaultLocale,
                    defaultLocale,
                  );
                  const summary = getLocalizedValue(
                    feature.summary,
                    defaultLocale,
                    defaultLocale,
                  );

                  return (
                    <li
                      key={feature.slug}
                      className="flex items-start gap-2"
                    >
                      <span className="mt-0.5 text-xs text-[#6B6B6B]">
                        <span className="inline-block rounded bg-[#F5F5F0] px-1.5 py-0.5 text-[10px] font-medium text-[#6B6B6B]">
                          FEAT
                        </span>
                      </span>
                      <div>
                        <Link
                          href={`/${productSlug}/${defaultLocale}/${feature.slug}/${entry.version}`}
                          className="text-sm font-medium text-[#1A1A1A] underline underline-offset-2 hover:opacity-70"
                        >
                          {title}
                        </Link>
                        <p className="text-xs text-[#6B6B6B]">{summary}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
