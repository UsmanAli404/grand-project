'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { checkAuthStatus } from "@/lib/auth"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { isAuthenticated } = await checkAuthStatus();

      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    check()
  }, [router])

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6" />
    </div>
  )
}
