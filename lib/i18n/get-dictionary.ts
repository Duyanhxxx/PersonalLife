import { cookies } from "next/headers";
import { dictionaries, type Locale } from "./dictionaries";

export async function getLanguage(): Promise<Locale> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value as Locale;
  return lang === "en" ? "en" : "vi"; // Default to Vietnamese if not set
}

export async function getDictionary() {
  const locale = await getLanguage();
  return dictionaries[locale];
}
