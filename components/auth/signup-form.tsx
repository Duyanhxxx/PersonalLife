import Link from "next/link";
import { signUpWithPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  return (
    <form action={signUpWithPassword} className="space-y-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium">Full name</span>
        <input
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground"
          name="fullName"
          placeholder="Your name"
          type="text"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Email</span>
        <input
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Password</span>
        <input
          className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground"
          minLength={6}
          name="password"
          placeholder="At least 6 characters"
          required
          type="password"
        />
      </label>
      <Button className="w-full" type="submit">
        Create account
      </Button>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
