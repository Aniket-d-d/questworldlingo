import type { LocaleCode } from "lingo.dev/spec";

export interface LanguageOption {
  code: LocaleCode;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "ja", label: "Japanese" },
  { code: "hi", label: "Hindi" },
  { code: "zh-TW", label: "Chinese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
];

export const DEFAULT_LANGUAGE: LocaleCode = "en";
