'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      console.log(session);

      if (session) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6" />
    </div>
  )
}