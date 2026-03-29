import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProduct,
  getFeatureFromManifest,
  renderMarkdown,
} from "@/lib/content";
import VersionSelector from "@/components/VersionSelector";
import FeedbackButton from "@/components/FeedbackButton";
import FeaturePageClient from "@/components/FeaturePageClient";

interface FeatureVersionPageProps {
  params: Promise<{ product: string; feature: string; version: string }>;
}

export default async function FeatureVersionPage({
  params,
}: FeatureVersionPageProps) {
  const {
    product: productSlug,
    feature: featureSlug,
    version,
  } = await params;
  const product = getProduct(productSlug);

  if (!product) {
    notFound();
  }

  const feature = getFeatureFromManifest(productSlug, version, featureSlug);

  if (!feature) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-2">
          <Link
            href={`/${productSlug}`}
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

  const html = await renderMarkdown(productSlug, version, featureSlug);

  if (!html) {
    notFound();
  }

  const isLatest = version === product.latest;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-2">
        <Link
          href={`/${productSlug}`}
          className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          &larr; {product.name}
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              {feature.title}
            </h1>
            {feature.isNew && (
              <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-2 py-0.5 text-xs font-medium text-[#2E7D32]">
                New
              </span>
            )}
          </div>
          {!isLatest && (
            <p className="mt-1 text-xs text-[#E65100]">
              You are viewing an older version (v{version}). The latest is v
              {product.latest}.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <FeedbackButton
            product={productSlug}
            feature={featureSlug}
            version={version}
          />
          <VersionSelector
            productSlug={productSlug}
            featureSlug={featureSlug}
            currentVersion={version}
            versions={product.versions}
            latestVersion={product.latest}
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#E8E6E1] bg-white p-8">
        <FeaturePageClient
          html={html}
          productSlug={productSlug}
          featureSlug={featureSlug}
          version={version}
        />
      </div>
    </div>
  );
}
