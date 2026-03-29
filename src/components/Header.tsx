import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#E8E6E1] bg-[#FAF9F6]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-[#1A1A1A] hover:opacity-80 transition-opacity"
        >
          featuredocs
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin"
            className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
