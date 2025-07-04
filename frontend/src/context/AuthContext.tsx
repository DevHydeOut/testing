"use client";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";

// Extend the Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

type AuthCtx = {
  user: User | null;
  emailLogin: (e: string, p: string) => Promise<void>;
  emailSignup: (e: string, p: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  phoneStart: (phone: string, recaptchaContainerId: string) => Promise<void>;
  phoneVerify: (code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [verification, setVerification] =
    useState<ReturnType<typeof signInWithPhoneNumber>>();

  /* -------------- track login state -------------- */
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  /* -------------- 30‑minute inactivity timer -------------- */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => signOut(auth), 30 * 60 * 1000);
    };
    ["mousemove", "keydown", "scroll"].forEach((evt) =>
      window.addEventListener(evt, reset)
    );
    reset();
    return () => {
      clearTimeout(timer);
      ["mousemove", "keydown", "scroll"].forEach((evt) =>
        window.removeEventListener(evt, reset)
      );
    };
  }, []);

  /* -------------- helper fns -------------- */
  const emailLogin = async (email: string, pass: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const emailSignup = async (email: string, pass: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // use redirect on Safari/iOS (pop‑ups often blocked)
    if (/iPhone|iPad|Safari/i.test(navigator.userAgent)) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  };

  const phoneStart = async (phone: string, containerId: string) => {
    if (!window.recaptchaVerifier) {
      // Attach/invisible reCAPTCHA
      window.recaptchaVerifier = new RecaptchaVerifier(
        containerId,
        { size: "invisible" },
        auth
      );
    }
    const result = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );
    setVerification(result); // save confirmation for next step
  };

  const phoneVerify = (code: string) =>
    (await verification)?.confirm(code) ?? Promise.reject("No verification started");

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        emailLogin,
        emailSignup,
        googleLogin,
        phoneStart,
        phoneVerify,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
