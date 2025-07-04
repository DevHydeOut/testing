// components/AuthGuard.tsx                     ← overwrite the old version
"use client";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { setupInactivityListener } from "@/lib/authHelpers";

const PUBLIC_PATHS = ["/login", "/signup"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  /** START-UP STATE **/
  const [checked, setChecked] = useState(false);   // ← false until we know
  const [user, setUser]       = useState<null | object>(null);

  /** FIRST RUN: check auth + start inactivity timer */
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setChecked(true);                            // ⬅️  now we can render safely
      const isPublic = PUBLIC_PATHS.includes(pathname);

      if (!firebaseUser && !isPublic) router.replace("/login");
      if (firebaseUser && isPublic)   router.replace("/dashboard");
    });

    // 30‑minute idle logout
    setupInactivityListener(() => {
      signOut(auth);
      router.replace("/login");
      alert("Logged out after 30 min of inactivity");
    });

    return () => unSub();
  }, [pathname, router]);

  /** NOTHING is rendered until 'checked' flips to true */
  if (!checked) return null;                       // <- avoids the flash completely
  return <>{children}</>;
}
