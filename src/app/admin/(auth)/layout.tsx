export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Monde
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-accent">
            &nbsp;Phone Store
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
