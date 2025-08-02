"use client";

import { checkAuthStatus } from "@/lib/auth"
import { useEffect } from 'react';
import { useRouter } from "next/navigation"

export default function DashboardRedirectPage() {
  const router = useRouter()

    useEffect(() => {
    const check = async () => {
      const { isAuthenticated } = await checkAuthStatus();

      if (isAuthenticated) {
        router.push("/dashboard/upload-data")
      } else {
        router.push("/login")
      }
    }

    check()
  }, [router])
}