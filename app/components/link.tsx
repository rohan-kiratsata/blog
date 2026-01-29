import Link from "next/link";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
    >
      {children}
    </Link>
  );
}
