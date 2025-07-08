"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function AuthModal({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
    const [open, setOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccess("Check your email to confirm your account.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                setSuccess("Signed in successfully!");
                setOpen(false);
                // Wait for session to be available before redirecting
                let session = null;
                for (let i = 0; i < 10; i++) { // try for up to 1s
                    const { data } = await supabase.auth.getSession();
                    session = data.session;
                    if (session) break;
                    await new Promise(res => setTimeout(res, 100));
                }
                console.log("Supabase session after login:", session);
                if (onAuthSuccess) {
                    onAuthSuccess();
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Sign In</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAuth} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete={isSignUp ? "new-password" : "current-password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                    <DialogFooter className="flex flex-col gap-2 items-stretch">
                        <Button type="submit" disabled={loading}>
                            {loading ? (isSignUp ? "Signing up..." : "Signing in...") : (isSignUp ? "Sign Up" : "Sign In")}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsSignUp(s => !s)}
                            disabled={loading}
                        >
                            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 