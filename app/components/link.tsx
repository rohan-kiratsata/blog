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
      className="text-neutral-500 hover:text-neutral-900 transition-colors"
    >
      {children}
    </Link>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`underline text-neutral-500 ${className || ""}`}
    >
      {children}
    </Link>
  );
}
