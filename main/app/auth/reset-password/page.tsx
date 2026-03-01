"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramToken = searchParams?.get("token");

  const [step, setStep] = useState<"request" | "sent" | "reset" | "done">(
    paramToken ? "reset" : "request"
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(paramToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (paramToken) {
      setToken(paramToken);
      setStep("reset");
    }
  }, [paramToken]);

  async function handleRequestReset() {
    if (!email) return toast.error("Please enter an email");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, redirectTo: "/auth/reset-password" }),
      });

      if (!res.ok) {
        const ctx = await res.json().catch(() => ({}));
        throw new Error(ctx?.error?.message || "Request failed");
      }

      setStep("sent");
      toast.success("Password reset link sent. Check your email.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Unable to request password reset");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!token) return toast.error("Missing token. Paste it or use the emailed link.");
    if (!newPassword) return toast.error("Please enter a new password");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, token }),
      });

      if (!res.ok) {
        const ctx = await res.json().catch(() => ({}));
        throw new Error(ctx?.error?.message || "Reset failed");
      }

      setStep("done");
      toast.success("Password changed. You can now sign in.");
      setTimeout(() => router.push("/auth/sign-in"), 1200);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full -mt-32">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Reset your password by requesting a link or using a token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "request" && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <Button className="w-full" disabled={loading} onClick={handleRequestReset}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Send reset link"}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep("reset")}
                className="w-full"
              >
                I have a token
              </Button>

              <div className="text-sm text-muted-foreground">
                Remembered? <Link href="/auth/sign-in" className="underline">Sign in</Link>
              </div>
            </div>
          )}

          {step === "sent" && (
            <div className="grid gap-4">
              <p>Check your email for a password reset link. It will redirect back to this page with a token parameter.</p>
              <Button className="w-full" onClick={() => setStep("request")}>
                Send again
              </Button>
              <Button variant="ghost" onClick={() => setStep("reset")} className="w-full">
                I have a token
              </Button>
            </div>
          )}

          {step === "reset" && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="token">Token (from email)</Label>
                <Input
                  id="token"
                  placeholder="paste token here or use link"
                  value={token ?? ""}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="New password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                />
              </div>

              <Button className="w-full" disabled={loading} onClick={handleResetPassword}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Reset password"}
              </Button>

              <div className="text-sm">
                Or <Link href="/auth/sign-in" className="underline">Sign in</Link>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="grid gap-4">
              <p>Your password has been updated. Redirecting to sign-in...</p>
              <Button className="w-full" onClick={() => router.push("/auth/sign-in")}>
                Go to sign-in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
