import { AuthMessage } from "@/components/auth/auth-message";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      description="Create an account to start organizing notes, tasks, habits, and everything else in one place."
      eyebrow="Get started"
      title="Create your PersonalLife account"
    >
      <div className="space-y-6">
        <AuthMessage error={params.error} message={params.message} />
        <SignupForm />
      </div>
    </AuthShell>
  );
}
