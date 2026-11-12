"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getAccessToken } from "@/api/client";

export default function AuthResetGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const isCheckedRef = useRef(false);

  useEffect(() => {
    if (isCheckedRef.current) {
      return;
    }

    isCheckedRef.current = true;

    if (pathname !== "/" && !getAccessToken()) {
      router.replace("/");
    }
  }, [pathname, router]);

  return null;
}
