export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the default nav and container from the root layout
  // The inventory canvas needs full viewport access
  return <>{children}</>;
}
