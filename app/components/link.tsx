import Link from "next/link";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-[#0000FF]">
      [ {children} ]
    </Link>
  );
}
