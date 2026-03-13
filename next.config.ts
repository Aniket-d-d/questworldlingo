import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./",
    sourceLocale: "en",
    targetLocales: ["de", "fr", "es", "ja", "hi", "zh-TW", "ko", "ru"],
    models: "lingo.dev",
    dev: {
      usePseudotranslator: false,
    },
    buildMode: "translate",
    localePersistence: {
      type: "cookie",
      config: {
        name: "locale",
        maxAge: 60 * 60 * 24 * 365,
      },
    },
  });
}
