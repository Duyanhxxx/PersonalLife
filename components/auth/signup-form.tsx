"use client";

import Link from "next/link";
import { signUpWithPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  return (
    <form
      action={signUpWithPassword}
      className="space-y-4"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const password = (form.elements.namedItem("password") as HTMLInputElement | null)?.value;
        const confirm = (form.elements.namedItem("confirmPassword") as HTMLInputElement | null)?.value;

        if (password !== confirm) {
          event.preventDefault();
          (form.elements.namedItem("confirmPassword") as HTMLInputElement | null)?.setCustomValidity(
            "Passwords do not match.",
          );
          form.reportValidity();
          return;
        }

        (form.elements.namedItem("confirmPassword") as HTMLInputElement | null)?.setCustomValidity("");
      }}
    >
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
      <PasswordInput
        label="Password"
        minLength={6}
        name="password"
        placeholder="At least 6 characters"
        required
      />
      <PasswordInput
        label="Confirm password"
        minLength={6}
        name="confirmPassword"
        placeholder="Repeat your password"
        required
      />
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
