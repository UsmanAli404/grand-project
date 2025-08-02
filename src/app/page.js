'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { checkAuthStatus } from "@/lib/auth"
import { Label } from "@/components/ui/label"

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
      <Label
        className={`text-3xl font-semibold transition-transform duration-700 ${
          loading ? "animate-scale" : ""
        }`}
      >
        NextHire
      </Label>
    </div>
  )
}
