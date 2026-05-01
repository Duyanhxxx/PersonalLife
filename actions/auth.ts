"use server";

import { encodedRedirect } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function signInWithPassword(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const returnTo = getString(formData, "returnTo") || "/app";
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  redirect(returnTo);
}

export async function signUpWithPassword(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "fullName");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/signup", error.message);
  }

  return encodedRedirect(
    "message",
    "/login",
    "Account created. Check your email for the confirmation link if email verification is enabled.",
  );
}

export async function signInWithOAuth(formData: FormData) {
  const provider = getString(formData, "provider");
  const returnTo = getString(formData, "returnTo") || "/app";
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "github" | "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(returnTo)}`,
    },
  });

  if (error || !data.url) {
    return encodedRedirect("error", "/login", error?.message ?? "OAuth sign-in failed.");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
