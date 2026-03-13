import type { LocaleCode } from "lingo.dev/spec";

export interface LanguageOption {
  code: LocaleCode;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "zh", label: "Chinese" },
  { code: "hi", label: "Hindi" },
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "es", label: "Spanish" },
  { code: "ru", label: "Russian" },
];

export const DEFAULT_LANGUAGE: LocaleCode = "en";
