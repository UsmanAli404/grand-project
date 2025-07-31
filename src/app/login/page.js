'use client'

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Email is empty!", {
        descriptionClassName: "text-black",
        position: 'top-center'
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Something went wrong")

      toast.success("Magic link sent!", {
        description: "Check your inbox to log in.",
        descriptionClassName: "text-black",
        position: 'top-center',
      })
    } catch (err) {
      toast.error("Login failed", {
        description: err.message,
        descriptionClassName: "text-black",
        position: 'top-center',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <Label className="text-2xl sm:text-3xl font-semibold mb-20 sm:mb-15">Login via Magic Link</Label>

      <div className="w-full max-w-sm border rounded-md p-6 space-y-4 shadow-md">
        <div className="space-y-1">
          <Label htmlFor="email" className={"mb-2"}>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleMagicLink} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          A login link will be sent to your email.
        </p>
      </div>
    </div>
  )
}