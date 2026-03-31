"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProduct } from "@/lib/api/content";

interface ProductRedirectProps {
  productSlug: string;
}

/**
 * /[product] redirects to /[product]/[defaultLocale].
 * Ensures every product page has a locale in the URL.
 */
export default function ProductRedirect({ productSlug }: ProductRedirectProps) {
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getProduct(productSlug).then((product) => {
      if (!product) {
        setNotFound(true);
        return;
      }
      router.replace(`/${productSlug}/${product.defaultLocale}`);
    });
  }, [productSlug, router]);

  if (notFound) {
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-center">
      <p className="text-sm text-[#6B6B6B]">Loading...</p>
    </div>
  );
}
