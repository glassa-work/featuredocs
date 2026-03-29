import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getVersionManifest } from "@/lib/content";

interface ChangelogPageProps {
  params: Promise<{ product: string }>;
}

export default async function ChangelogPage({ params }: ChangelogPageProps) {
  const { product: productSlug } = await params;
  const product = getProduct(productSlug);

  if (!product) {
    notFound();
  }

  const versionManifests = product.versions
    .map((version) => getVersionManifest(productSlug, version))
    .filter(Boolean);

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

      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
          Changelog
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Version history for {product.name}.
        </p>
      </div>

      <div className="space-y-8">
        {versionManifests.map((manifest) => {
          if (!manifest) return null;
          const isLatest = manifest.version === product.latest;

          return (
            <div
              key={manifest.version}
              className="rounded-lg border border-[#E8E6E1] bg-white p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">
                  v{manifest.version}
                </h2>
                {isLatest && (
                  <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-xs font-medium text-[#2E7D32]">
                    Latest
                  </span>
                )}
                <span className="text-xs text-[#6B6B6B]">
                  {manifest.releaseDate}
                </span>
              </div>

              <ul className="space-y-2">
                {manifest.features.map((feature) => (
                  <li key={feature.slug} className="flex items-start gap-2">
                    <span className="mt-0.5 text-xs text-[#6B6B6B]">
                      {feature.isNew ? (
                        <span className="inline-block rounded bg-[#E8F5E9] px-1.5 py-0.5 text-[10px] font-medium text-[#2E7D32]">
                          NEW
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-[#F5F5F0] px-1.5 py-0.5 text-[10px] font-medium text-[#6B6B6B]">
                          UPD
                        </span>
                      )}
                    </span>
                    <div>
                      <Link
                        href={`/${productSlug}/${feature.slug}/${manifest.version}`}
                        className="text-sm font-medium text-[#1A1A1A] underline underline-offset-2 hover:opacity-70"
                      >
                        {feature.title}
                      </Link>
                      <p className="text-xs text-[#6B6B6B]">
                        {feature.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
