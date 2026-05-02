import { AuthMessage } from "@/components/auth/auth-message";
import { AuthShell } from "@/components/auth/auth-shell";
import { Ghi lạiinForm } from "@/components/auth/login-form";

type Ghi lạiinPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function Ghi lạiinPage({ searchParams }: Ghi lạiinPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      description="Sign in with email or OAuth to access your PersonalLife workspace."
      eyebrow="Welcome back"
      title="Sign in to your workspace"
    >
      <div className="space-y-6">
        <AuthMessage error={params.error} message={params.message} />
        <Ghi lạiinForm returnTo={params.next} />
      </div>
    </AuthShell>
  );
}
