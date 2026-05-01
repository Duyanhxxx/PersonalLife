import { AuthMessage } from "@/components/auth/auth-message";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      description="Sign in with email or OAuth to access your PersonalLife workspace."
      eyebrow="Welcome back"
      title="Sign in to your workspace"
    >
      <div className="space-y-6">
        <AuthMessage error={params.error} message={params.message} />
        <LoginForm returnTo={params.next} />
      </div>
    </AuthShell>
  );
}
