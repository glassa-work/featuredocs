"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getProduct,
  getDocument,
  listFeatures,
} from "@/lib/api/content";
import type { ProductResponse, FeatureResponse } from "@/lib/api/content";
import VersionSelector from "@/components/VersionSelector";
import FeedbackButton from "@/components/FeedbackButton";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import InlineEditor from "@/components/InlineEditor";
import DraftBanner from "@/components/DraftBanner";

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

interface FeatureVersionPageProps {
  productSlug: string;
  locale: string;
  featureSlug: string;
  version: string;
}

export default function FeatureVersionPage({
  productSlug,
  locale,
  featureSlug,
  version,
}: FeatureVersionPageProps) {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [feature, setFeature] = useState<FeatureResponse | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState<string>("");
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  const [versionStatus, setVersionStatus] = useState<string>("published");
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

      if (!productData.locales.includes(locale)) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setProduct(productData);

      // Get version status
      const featuresData = await listFeatures(productSlug, version, true);
      setVersionStatus(featuresData.versionStatus);

      // Get the document
      const doc = await getDocument(productSlug, version, locale, featureSlug);
      if (!doc || !doc.feature) {
        setFeature(null);
        setIsLoading(false);
        return;
      }

      setFeature(doc.feature);
      setRawMarkdown(doc.content);
      setRenderedHtml(doc.renderedHtml);
      setIsLoading(false);
    }

    loadData();
  }, [productSlug, locale, featureSlug, version]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="py-12 text-center text-sm text-[#6B6B6B]">
          Loading...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
          Not found
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          The page you are looking for does not exist.
        </p>
      </div>
    );
  }

  if (!product) return null;

  // Feature does not exist in this version
  if (!feature) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-2">
          <Link
            href={`/${productSlug}/${locale}`}
            className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            &larr; {product.name}
          </Link>
        </div>
        <div className="mt-8 rounded-lg border border-[#E8E6E1] bg-white p-12 text-center">
          <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">
            Not available in this version
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            This feature does not exist in v{version}. Try switching to a
            different version.
          </p>
          <div className="mt-6 flex justify-center">
            <VersionSelector
              productSlug={productSlug}
              locale={locale}
              featureSlug={featureSlug}
              currentVersion={version}
              versions={product.versions}
              latestVersion={product.latest}
            />
          </div>
        </div>
      </div>
    );
  }

  const featureTitle = getLocalizedValue(
    feature.title,
    locale,
    product.defaultLocale,
  );
  const isLatest = version === product.latest;
  const isDraft = versionStatus === "draft";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-2">
        <Link
          href={`/${productSlug}/${locale}`}
          className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          &larr; {product.name}
        </Link>
      </div>

      {isDraft && (
        <DraftBanner
          showPublishButton
          product={productSlug}
          version={version}
        />
      )}

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            {featureTitle}
          </h1>
          {!isLatest && (
            <p className="mt-1 text-xs text-[#E65100]">
              You are viewing an older version (v{version}). The latest is v
              {product.latest}.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher
            locales={product.locales}
            currentLocale={locale}
          />
          <FeedbackButton
            product={productSlug}
            feature={featureSlug}
            version={version}
            locale={locale}
          />
          <VersionSelector
            productSlug={productSlug}
            locale={locale}
            featureSlug={featureSlug}
            currentVersion={version}
            versions={product.versions}
            latestVersion={product.latest}
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#E8E6E1] bg-white p-8">
        <InlineEditor
          product={productSlug}
          version={version}
          locale={locale}
          slug={featureSlug}
          initialMarkdown={rawMarkdown}
          renderedHtml={renderedHtml}
        />
      </div>
    </div>
  );
}
