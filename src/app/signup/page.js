'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      })
      if (error) throw error

      toast.success("Signup successful!", {
        description: "Check your email to confirm your account.",
        descriptionClassName: "text-black",
        position: 'top-center',
      })

      // Redirect to login page
      router.push("/login")
    } catch (err) {
      toast.error("Signup failed", {
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
      <Label className="text-3xl font-semibold mb-15">Create an Account</Label>

      <div className="w-full max-w-sm border rounded-md p-6 space-y-4 shadow-md">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <Button onClick={handleSignup} disabled={loading} className="w-full">
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="p-1" onClick={() => router.push("/login")}>
            Login
          </Button>
        </p>
      </div>
    </div>
  )
}