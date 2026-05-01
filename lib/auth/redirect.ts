import { redirect } from "next/navigation";

export function encodedRedirect(
  type: "error" | "message",
  path: string,
  message: string,
) {
  const searchParams = new URLSearchParams({
    [type]: message,
  });

  redirect(`${path}?${searchParams.toString()}`);
}
