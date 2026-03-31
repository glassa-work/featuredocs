"use client";

import { useParams } from "next/navigation";
import ProductRedirect from "./routes/ProductRedirect";
import ProductLocalePage from "./routes/ProductLocalePage";
import FeatureRedirect from "./routes/FeatureRedirect";
import FeatureVersionPage from "./routes/FeatureVersionPage";
import ChangelogPage from "./routes/ChangelogPage";
import AdminPage from "./routes/AdminPage";

/**
 * Client-side router for all dynamic paths.
 *
 * Matches:
 *   /admin                               -> AdminPage
 *   /[product]                            -> redirect to /[product]/[defaultLocale]
 *   /[product]/changelog                  -> ChangelogPage
 *   /[product]/[locale]                   -> ProductLocalePage (feature list)
 *   /[product]/[locale]/[feature]         -> redirect to latest version
 *   /[product]/[locale]/[feature]/[version] -> FeatureVersionPage
 */
export default function CatchAllPageClient() {
  const params = useParams();
  const slug = params.slug as string[];

  if (!slug || slug.length === 0) {
    return <NotFoundView />;
  }

  // /admin
  if (slug[0] === "admin") {
    return <AdminPage />;
  }

  // /[product]
  if (slug.length === 1) {
    return <ProductRedirect productSlug={slug[0]} />;
  }

  // /[product]/changelog
  if (slug.length === 2 && slug[1] === "changelog") {
    return <ChangelogPage productSlug={slug[0]} />;
  }

  // /[product]/[locale]
  if (slug.length === 2) {
    return <ProductLocalePage productSlug={slug[0]} locale={slug[1]} />;
  }

  // /[product]/[locale]/[feature]
  if (slug.length === 3) {
    return (
      <FeatureRedirect
        productSlug={slug[0]}
        locale={slug[1]}
        featureSlug={slug[2]}
      />
    );
  }

  // /[product]/[locale]/[feature]/[version]
  if (slug.length === 4) {
    return (
      <FeatureVersionPage
        productSlug={slug[0]}
        locale={slug[1]}
        featureSlug={slug[2]}
        version={slug[3]}
      />
    );
  }

  return <NotFoundView />;
}

function NotFoundView() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-center">
      <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-[#6B6B6B]">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}
