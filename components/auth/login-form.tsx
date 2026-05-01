import Link from "next/link";
import { signInWithPassword } from "@/actions/auth";
import { OauthButtons } from "@/components/auth/oauth-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  returnTo?: string;
};

export function LoginForm({ returnTo = "/app" }: LoginFormProps) {
  return (
    <div className="space-y-6">
      <OauthButtons returnTo={returnTo} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form action={signInWithPassword} className="space-y-4">
        <input name="returnTo" type="hidden" value={returnTo} />
        <label className="grid gap-2">
          <span className="text-sm font-medium">Email</span>
          <input
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition focus:border-foreground"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Your password"
          required
        />
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link className="font-medium text-foreground" href="/signup">
          Create one
        </Link>
      </p>
    </div>
  );
}
