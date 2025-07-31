'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      toast.success("Login successful!", {
        description: "Welcome back!",
        descriptionClassName: "text-black",
        position: 'top-center',
      })
      router.push("/dashboard")
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
      <Label className="text-3xl font-semibold mb-15">Welcome to NextHire</Label>

      <div className="w-full max-w-sm border rounded-md p-6 space-y-4 shadow-md">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button variant="link" className="p-1" onClick={() => router.push("/signup")}>
            Create one
          </Button>
        </p>
      </div>
    </div>
  )
}