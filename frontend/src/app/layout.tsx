// app/layout.tsx   (⚠️ root layouts are server components by default)
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: "CRM App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⬇️  We wrap *all* pages in the client‑side AuthGuard
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
