export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-gradient-to-t from-blue-100/50 to-transparent">
      {children}
    </div>
  );
}
