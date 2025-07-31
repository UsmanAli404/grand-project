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
      <Label className="text-2xl sm:text-3xl font-semibold mb-20 sm:mb-15">
        Login via Magic Link ✨
      </Label>

      <div className="w-full max-w-sm border rounded-md p-6 space-y-4 shadow-md">
        <div className="space-y-1">
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleMagicLink} disabled={loading} className="w-full flex items-center justify-center gap-2">
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          A login link will be sent to your email.
        </p>
      </div>
    </div>
  )
}