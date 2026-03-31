import CatchAllPageClient from "./CatchAllPageClient";

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  // Return a dummy entry to satisfy static export requirement.
  // Firebase Hosting serves index.html as SPA fallback for all paths.
  return [{ slug: ["_placeholder"] }];
}

export default function CatchAllPage() {
  return <CatchAllPageClient />;
}
