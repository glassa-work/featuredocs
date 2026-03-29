import { notFound, redirect } from "next/navigation";
import { getProduct } from "@/lib/content";

interface FeaturePageProps {
  params: Promise<{ product: string; feature: string }>;
}

export default async function FeatureLatestPage({ params }: FeaturePageProps) {
  const { product: productSlug, feature: featureSlug } = await params;
  const product = getProduct(productSlug);

  if (!product) {
    notFound();
  }

  redirect(`/${productSlug}/${featureSlug}/${product.latest}`);
}
