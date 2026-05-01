import { signInWithOAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";

type OauthButtonsProps = {
  returnTo?: string;
};

const providers = [
  { label: "Continue with Google", value: "google" },
  { label: "Continue with GitHub", value: "github" },
] as const;

export function OauthButtons({ returnTo = "/app" }: OauthButtonsProps) {
  return (
    <div className="grid gap-3">
      {providers.map((provider) => (
        <form action={signInWithOAuth} key={provider.value}>
          <input name="provider" type="hidden" value={provider.value} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <Button className="w-full" type="submit" variant="outline">
            {provider.label}
          </Button>
        </form>
      ))}
    </div>
  );
}
